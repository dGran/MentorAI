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
const PROGRESS_KEY = "academia-progress";
const READING_KEY = "academia-reading";

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

  const setNow = (milliseconds) => vm.runInContext(`Date.now = () => ${milliseconds};`, sandbox);

  return { MentorAI: sandbox.MentorAI, localStorage, setNow };
}

const plain = (value) => JSON.parse(JSON.stringify(value));

const RESET_AT = 5000;
const SCROLL_AT = 7000;
const UNDO_AT = 9000;
const COURSE_LESSONS = ["git-intro", "git-ramas"];
const PROGRESS_BEFORE = ["sql-joins", "git-intro", "regex", "git-ramas"];
const READING_BEFORE = {
  "git-intro": { percent: 100, updatedAt: 1000 },
  "git-ramas": { percent: 40, updatedAt: 2000 },
  regex: { percent: 70, updatedAt: 3000 },
};

function resetCourse(device) {
  const progressBefore = device.MentorAI.Progress.list();
  const readingBefore = device.MentorAI.Reading.all();

  device.MentorAI.Progress.remove(COURSE_LESSONS);
  device.MentorAI.Reading.clear(COURSE_LESSONS);

  return () => {
    device.MentorAI.Progress.restore(progressBefore);
    device.MentorAI.Reading.restore(readingBefore);
  };
}

test("undoing a course reset restores progress and reading exactly as they were", () => {
  const device = loadDevice({ [PROGRESS_KEY]: PROGRESS_BEFORE, [READING_KEY]: READING_BEFORE });
  const undo = resetCourse(device);

  assert.deepEqual(device.localStorage.read(PROGRESS_KEY), ["sql-joins", "regex"]);

  undo();

  assert.deepEqual(device.localStorage.read(PROGRESS_KEY), PROGRESS_BEFORE);
  assert.deepEqual(device.localStorage.read(READING_KEY), READING_BEFORE);
});

test("undoing records the restored lessons as added, not deleted", () => {
  const device = loadDevice({ [PROGRESS_KEY]: PROGRESS_BEFORE, [READING_KEY]: READING_BEFORE });

  resetCourse(device)();

  const changes = device.localStorage.read(CHANGES_KEY);

  for (const key of [PROGRESS_KEY, READING_KEY]) {
    for (const slug of COURSE_LESSONS) {
      assert.equal(changes[key][slug].deleted, false, `${key} ${slug}`);
    }
  }
});

test("a remote copy carrying the reset does not delete what was undone", () => {
  const remote = loadDevice({ [PROGRESS_KEY]: PROGRESS_BEFORE, [READING_KEY]: READING_BEFORE });

  remote.setNow(RESET_AT);
  resetCourse(remote);

  const remoteAfterReset = {
    [PROGRESS_KEY]: remote.localStorage.read(PROGRESS_KEY),
    [READING_KEY]: remote.localStorage.read(READING_KEY),
    [CHANGES_KEY]: remote.localStorage.read(CHANGES_KEY),
  };
  const device = loadDevice({ [PROGRESS_KEY]: PROGRESS_BEFORE, [READING_KEY]: READING_BEFORE });

  device.setNow(RESET_AT);
  const undo = resetCourse(device);

  device.setNow(UNDO_AT);
  undo();
  device.MentorAI.Perfil.importar(JSON.stringify({ version: 2, datos: plain(remoteAfterReset) }));

  assert.deepEqual([...device.localStorage.read(PROGRESS_KEY)].sort(), [...PROGRESS_BEFORE].sort());
  assert.deepEqual(Object.keys(device.localStorage.read(READING_KEY)).sort(), Object.keys(READING_BEFORE).sort());
});

test("reading saved between the reset and the undo does not let the reset win the next sync", () => {
  const remote = loadDevice({ [PROGRESS_KEY]: PROGRESS_BEFORE, [READING_KEY]: READING_BEFORE });

  remote.setNow(RESET_AT);
  resetCourse(remote);

  const remoteAfterReset = {
    [READING_KEY]: remote.localStorage.read(READING_KEY),
    [CHANGES_KEY]: remote.localStorage.read(CHANGES_KEY),
  };
  const device = loadDevice({ [PROGRESS_KEY]: PROGRESS_BEFORE, [READING_KEY]: READING_BEFORE });

  device.setNow(RESET_AT);
  const undo = resetCourse(device);

  device.setNow(SCROLL_AT);
  device.MentorAI.Reading.save("git-ramas", 20);
  device.setNow(UNDO_AT);
  undo();
  device.MentorAI.Perfil.importar(JSON.stringify({ version: 2, datos: plain(remoteAfterReset) }));

  assert.deepEqual(device.localStorage.read(READING_KEY)["git-ramas"], READING_BEFORE["git-ramas"]);
});

test("restoring when nothing was removed records no change", () => {
  const device = loadDevice({ [PROGRESS_KEY]: PROGRESS_BEFORE, [READING_KEY]: READING_BEFORE });

  device.MentorAI.Progress.restore(device.MentorAI.Progress.list());
  device.MentorAI.Reading.restore(device.MentorAI.Reading.all());

  assert.equal(device.localStorage.read(CHANGES_KEY), null);
});
