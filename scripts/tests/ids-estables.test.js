"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MODULES = path.join(__dirname, "..", "..", "assets", "js", "modules");
const REPASO_SOURCE = fs.readFileSync(path.join(MODULES, "repaso.js"), "utf8");
const PRACTICA_SOURCE = fs.readFileSync(path.join(MODULES, "practica.js"), "utf8");

const CHECKS = {
  regex: [
    { id: "c-uno", q: "Primera" },
    { id: "c-dos", q: "Segunda" },
  ],
};
const QUIZZES = {
  git: {
    questions: [
      { id: "q-uno", q: "Primera" },
      { id: "q-dos", q: "Segunda" },
    ],
  },
};
const PRACTICE = {
  git: [
    { id: "r-uno", title: "Primero" },
    { id: "r-dos", title: "Segundo" },
  ],
};

function createMemoryStorage(initialEntries) {
  const entries = new Map(Object.entries(initialEntries).map(([key, value]) => [key, JSON.stringify(value)]));

  return {
    getItem: (key) => (entries.has(key) ? entries.get(key) : null),
    setItem: (key, value) => entries.set(key, String(value)),
    removeItem: (key) => entries.delete(key),
    read: (key) => JSON.parse(entries.get(key) ?? "null"),
  };
}

function loadModules(localEntries, data) {
  const localStorage = createMemoryStorage(localEntries);
  const document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
  const sandbox = {
    localStorage,
    document,
    console,
    MENTORAI_CHECKS: data.checks,
    MENTORAI_QUIZZES: data.quizzes,
    MENTORAI_PRACTICE: data.practice,
  };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(REPASO_SOURCE, sandbox);
  vm.runInContext(PRACTICA_SOURCE, sandbox);

  return { MentorAI: sandbox.MentorAI, localStorage };
}

const DATA = { checks: CHECKS, quizzes: QUIZZES, practice: PRACTICE };
const reversed = {
  checks: { regex: [...CHECKS.regex].reverse() },
  quizzes: { git: { questions: [...QUIZZES.git.questions].reverse() } },
  practice: { git: [...PRACTICE.git].reverse() },
};

test("positional review keys are migrated to stable ids", () => {
  const { MentorAI, localStorage } = loadModules(
    { "academia-repaso": { "c:regex:1": { s: 3, d: 1, f: 0 }, "q:git:0": { s: 1, d: 1, f: 2 } } },
    DATA
  );

  MentorAI.Repaso.record("c:regex:c-uno", true);

  const state = localStorage.read("academia-repaso");

  assert.deepEqual(state["c:regex:c-dos"], { s: 3, d: 1, f: 0 });
  assert.deepEqual(state["q:git:q-uno"], { s: 1, d: 1, f: 2 });
  assert.equal(state["c:regex:1"], undefined);
  assert.equal(state["q:git:0"], undefined);
});

test("review keys that cannot be resolved are kept instead of dropped", () => {
  const { MentorAI, localStorage } = loadModules(
    { "academia-repaso": { "c:regex:9": { s: 2, d: 1, f: 0 }, "ruta:backend": { s: 1, d: 1, f: 0 } } },
    DATA
  );

  MentorAI.Repaso.record("c:regex:c-uno", true);

  const state = localStorage.read("academia-repaso");

  assert.deepEqual(state["c:regex:9"], { s: 2, d: 1, f: 0 });
  assert.deepEqual(state["ruta:backend"], { s: 1, d: 1, f: 0 });
});

test("a positional key and its stable id keep the higher step in either order", () => {
  const advanced = { s: 4, d: 9, f: 0 };
  const behind = { s: 1, d: 2, f: 3 };
  const positionalFirst = loadModules({ "academia-repaso": { "c:regex:0": advanced, "c:regex:c-uno": behind } }, DATA);
  const stableFirst = loadModules({ "academia-repaso": { "c:regex:c-uno": behind, "c:regex:0": advanced } }, DATA);

  positionalFirst.MentorAI.Repaso.record("c:regex:c-dos", true);
  stableFirst.MentorAI.Repaso.record("c:regex:c-dos", true);

  assert.deepEqual(positionalFirst.localStorage.read("academia-repaso")["c:regex:c-uno"], advanced);
  assert.deepEqual(stableFirst.localStorage.read("academia-repaso")["c:regex:c-uno"], advanced);
});

test("reordering questions does not move their review history", () => {
  const history = { "academia-repaso": { "c:regex:c-dos": { s: 4, d: 1, f: 0 } } };
  const { MentorAI, localStorage } = loadModules(history, reversed);

  MentorAI.Repaso.record("c:regex:c-uno", false);

  assert.deepEqual(localStorage.read("academia-repaso")["c:regex:c-dos"], { s: 4, d: 1, f: 0 });
});

test("positional practice progress is migrated to stable ids", () => {
  const { MentorAI, localStorage } = loadModules({ "academia-practica": { git: { 1: true } } }, DATA);

  assert.equal(MentorAI.Practica.doneCountOf("git"), 1);
  assert.deepEqual(localStorage.read("academia-practica"), { git: { "r-dos": true } });
});

test("reordering challenges does not move which one is done", () => {
  const { MentorAI } = loadModules({ "academia-practica": { git: { "r-dos": true } } }, reversed);

  assert.equal(MentorAI.Practica.isDone("git", 0), true);
  assert.equal(MentorAI.Practica.isDone("git", 1), false);
});
