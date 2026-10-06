"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MODULES = path.join(__dirname, "..", "..", "assets", "js", "modules");
const STORAGE_SOURCE = fs.readFileSync(path.join(MODULES, "storage.js"), "utf8");
const PERFIL_SOURCE = fs.readFileSync(path.join(MODULES, "perfil.js"), "utf8");
const CHANGES_KEY = "academia-cambios";

function createMemoryStorage(initialEntries) {
  const entries = new Map(Object.entries(initialEntries).map(([key, value]) => [key, JSON.stringify(value)]));

  return {
    getItem: (key) => (entries.has(key) ? entries.get(key) : null),
    setItem: (key, value) => entries.set(key, String(value)),
    removeItem: (key) => entries.delete(key),
    key: (index) => [...entries.keys()][index] ?? null,
    get length() {
      return entries.size;
    },
    read: (key) => JSON.parse(entries.get(key) ?? "null"),
  };
}

function loadDevice(localEntries) {
  const localStorage = createMemoryStorage(localEntries);
  const sandbox = { localStorage, document: {}, console };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(STORAGE_SOURCE, sandbox);
  vm.runInContext(PERFIL_SOURCE, sandbox);

  return { MentorAI: sandbox.MentorAI, localStorage };
}

function syncInto(device, remoteEntries, version = 2) {
  device.MentorAI.Perfil.importar(JSON.stringify({ version, datos: remoteEntries }));
}

const NOW = Date.now();
const at = (offset) => NOW - 1000 + offset;
const deleted = (offset) => ({ at: at(offset), deleted: true });
const added = (offset) => ({ at: at(offset), deleted: false });
const expired = () => ({ at: 1, deleted: true });

test("a bookmark removed locally does not come back after syncing twice", () => {
  const device = loadDevice({
    "academia-bookmarks": [],
    [CHANGES_KEY]: { "academia-bookmarks": { regex: deleted(200) } },
  });
  const staleRemote = { "academia-bookmarks": ["regex"], [CHANGES_KEY]: {} };

  syncInto(device, staleRemote);
  syncInto(device, staleRemote);

  assert.deepEqual(device.localStorage.read("academia-bookmarks"), []);
});

test("a lesson unmarked as completed stays unmarked", () => {
  const device = loadDevice({
    "academia-progress": ["git-ramas"],
    [CHANGES_KEY]: { "academia-progress": { "git-intro": deleted(300) } },
  });

  syncInto(device, { "academia-progress": ["git-intro", "git-ramas"] });

  assert.deepEqual(device.localStorage.read("academia-progress"), ["git-ramas"]);
});

test("a highlight removed locally does not come back", () => {
  const kept = { seccion: "idea", texto: "uno", nth: 0 };
  const removed = { seccion: "idea", texto: "dos", nth: 0 };
  const device = loadDevice({
    "academia-highlights:regex": [kept],
    "academia-highlights-index": ["regex"],
    [CHANGES_KEY]: { "academia-highlights:regex": { "idea|dos|0": deleted(300) } },
  });

  syncInto(device, { "academia-highlights:regex": [kept, removed], "academia-highlights-index": ["regex"] });

  assert.deepEqual(device.localStorage.read("academia-highlights:regex"), [kept]);
});

test("removing the last highlight of a lesson drops it from the index", () => {
  const removed = { seccion: "idea", texto: "dos", nth: 0 };
  const device = loadDevice({
    "academia-highlights:regex": [],
    "academia-highlights-index": [],
    [CHANGES_KEY]: { "academia-highlights:regex": { "idea|dos|0": deleted(300) } },
  });

  syncInto(device, { "academia-highlights:regex": [removed], "academia-highlights-index": ["regex"] });

  assert.deepEqual(device.localStorage.read("academia-highlights-index"), []);
});

test("cleared reading progress is not restored by an older remote entry", () => {
  const device = loadDevice({
    "academia-reading": {},
    [CHANGES_KEY]: { "academia-reading": { regex: deleted(300) } },
  });

  syncInto(device, { "academia-reading": { regex: { percent: 80, updatedAt: at(100) } } });

  assert.deepEqual(device.localStorage.read("academia-reading"), {});
});

test("reading progress newer than the clear survives", () => {
  const device = loadDevice({
    "academia-reading": {},
    [CHANGES_KEY]: { "academia-reading": { regex: deleted(300) } },
  });

  syncInto(device, { "academia-reading": { regex: { percent: 40, updatedAt: at(400) } } });

  assert.deepEqual(device.localStorage.read("academia-reading"), { regex: { percent: 40, updatedAt: at(400) } });
});

test("adding on one device after the other removed wins", () => {
  const device = loadDevice({
    "academia-bookmarks": [],
    [CHANGES_KEY]: { "academia-bookmarks": { regex: deleted(200) } },
  });

  syncInto(device, {
    "academia-bookmarks": ["regex"],
    [CHANGES_KEY]: { "academia-bookmarks": { regex: added(300) } },
  });

  assert.deepEqual(device.localStorage.read("academia-bookmarks"), ["regex"]);
});

test("a removal on the remote device propagates to this one", () => {
  const device = loadDevice({ "academia-bookmarks": ["regex", "git"] });

  syncInto(device, {
    "academia-bookmarks": ["git"],
    [CHANGES_KEY]: { "academia-bookmarks": { regex: deleted(500) } },
  });

  assert.deepEqual(device.localStorage.read("academia-bookmarks"), ["git"]);
});

test("an export from the previous version is still imported", () => {
  const device = loadDevice({ "academia-bookmarks": ["git"] });

  syncInto(device, { "academia-bookmarks": ["regex"] }, 1);

  assert.deepEqual(device.localStorage.read("academia-bookmarks"), ["git", "regex"]);
});

test("local removals also apply to an export from the previous version", () => {
  const device = loadDevice({
    "academia-bookmarks": ["git"],
    [CHANGES_KEY]: { "academia-bookmarks": { regex: deleted(500) } },
  });

  syncInto(device, { "academia-bookmarks": ["git", "regex"] }, 1);

  assert.deepEqual(device.localStorage.read("academia-bookmarks"), ["git"]);
});

test("reading reset and read again does not get the old percentage back", () => {
  const device = loadDevice({
    "academia-reading": { regex: { percent: 10, updatedAt: at(400) } },
    [CHANGES_KEY]: { "academia-reading": { regex: deleted(300) } },
  });

  syncInto(device, { "academia-reading": { regex: { percent: 80, updatedAt: at(100) } } });

  assert.deepEqual(device.localStorage.read("academia-reading"), { regex: { percent: 10, updatedAt: at(400) } });
});

test("a removal and an addition at the same instant converge on the removal", () => {
  const first = loadDevice({ "academia-bookmarks": [], [CHANGES_KEY]: { "academia-bookmarks": { x: deleted(500) } } });
  const second = loadDevice({ "academia-bookmarks": ["x"], [CHANGES_KEY]: { "academia-bookmarks": { x: added(500) } } });

  syncInto(first, { "academia-bookmarks": ["x"], [CHANGES_KEY]: { "academia-bookmarks": { x: added(500) } } });
  syncInto(second, { "academia-bookmarks": [], [CHANGES_KEY]: { "academia-bookmarks": { x: deleted(500) } } });

  assert.deepEqual(first.localStorage.read("academia-bookmarks"), []);
  assert.deepEqual(second.localStorage.read("academia-bookmarks"), []);
});

test("expired changes are purged when merging too", () => {
  const device = loadDevice({ [CHANGES_KEY]: { "academia-bookmarks": { viejo: expired() } } });

  syncInto(device, { [CHANGES_KEY]: { "academia-bookmarks": { otro: expired() } } });

  assert.deepEqual(device.localStorage.read(CHANGES_KEY), { "academia-bookmarks": {} });
});

test("the highlights index keeps its order after an import", () => {
  const one = { seccion: "a", texto: "uno", nth: 0 };
  const device = loadDevice({
    "academia-highlights:zeta": [one],
    "academia-highlights:alfa": [one],
    "academia-highlights-index": ["zeta", "alfa"],
  });

  syncInto(device, { "academia-highlights:beta": [one] });

  assert.deepEqual(device.localStorage.read("academia-highlights-index"), ["zeta", "alfa", "beta"]);
});

test("toggling a bookmark off records the removal", () => {
  const device = loadDevice({ "academia-bookmarks": ["regex"] });

  device.MentorAI.Bookmarks.toggle("regex");

  const change = device.localStorage.read(CHANGES_KEY)["academia-bookmarks"].regex;

  assert.equal(change.deleted, true);
  assert.equal(typeof change.at, "number");
});

test("toggling a bookmark back on records the addition", () => {
  const device = loadDevice({ "academia-bookmarks": [] });

  device.MentorAI.Bookmarks.toggle("regex");

  assert.equal(device.localStorage.read(CHANGES_KEY)["academia-bookmarks"].regex.deleted, false);
});

test("resetting progress, clearing reading and removing highlights record their removals", () => {
  const highlight = { seccion: "idea", texto: "uno", nth: 0 };
  const device = loadDevice({
    "academia-progress": ["regex"],
    "academia-reading": { regex: { percent: 50, updatedAt: at(1) } },
    "academia-highlights:regex": [highlight],
    "academia-highlights-index": ["regex"],
  });

  device.MentorAI.Progress.remove(["regex"]);
  device.MentorAI.Reading.clear(["regex"]);
  device.MentorAI.Highlights.remove("regex", highlight);

  const changes = device.localStorage.read(CHANGES_KEY);

  assert.equal(changes["academia-progress"].regex.deleted, true);
  assert.equal(changes["academia-reading"].regex.deleted, true);
  assert.equal(changes["academia-highlights:regex"]["idea|uno|0"].deleted, true);
});

test("changes older than the retention window are purged when recording", () => {
  const device = loadDevice({
    "academia-bookmarks": ["regex"],
    [CHANGES_KEY]: { "academia-bookmarks": { viejo: expired() } },
  });

  device.MentorAI.Bookmarks.toggle("regex");

  assert.equal(device.localStorage.read(CHANGES_KEY)["academia-bookmarks"].viejo, undefined);
});
