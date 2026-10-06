"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const PERFIL_SOURCE = fs.readFileSync(
  path.join(__dirname, "..", "..", "assets", "js", "modules", "perfil.js"),
  "utf8"
);

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

function loadPerfil(localEntries) {
  const localStorage = createMemoryStorage(localEntries);
  const sandbox = { localStorage, document: {}, console };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(PERFIL_SOURCE, sandbox);

  return { perfil: sandbox.MentorAI.Perfil, localStorage };
}

function importInto(localEntries, remoteEntries) {
  const { perfil, localStorage } = loadPerfil(localEntries);

  perfil.importar(JSON.stringify({ version: 1, datos: remoteEntries }));

  return localStorage;
}

const PASSED_QUIZ = { passed: true, bestScore: 90, attempts: 1 };
const FAILED_QUIZ = { passed: false, bestScore: 40, attempts: 3 };
const PASSED_PATH_EXAM = { attempts: 1, best: 18, total: 20, passed: true };
const FAILED_PATH_EXAM = { attempts: 2, best: 9, total: 20, passed: false };

test("a course exam passed locally stays passed after importing a failed one", () => {
  const storage = importInto({ "academia-quiz-git": PASSED_QUIZ }, { "academia-quiz-git": FAILED_QUIZ });

  assert.deepEqual(storage.read("academia-quiz-git"), { passed: true, bestScore: 90, attempts: 3 });
});

test("a course exam passed remotely is adopted over a local failure", () => {
  const storage = importInto({ "academia-quiz-git": FAILED_QUIZ }, { "academia-quiz-git": PASSED_QUIZ });

  assert.deepEqual(storage.read("academia-quiz-git"), { passed: true, bestScore: 90, attempts: 3 });
});

test("a path exam keeps the best score and the pass in both directions", () => {
  const forward = importInto(
    { "academia-examen-ruta-backend": PASSED_PATH_EXAM },
    { "academia-examen-ruta-backend": FAILED_PATH_EXAM }
  );
  const backward = importInto(
    { "academia-examen-ruta-backend": FAILED_PATH_EXAM },
    { "academia-examen-ruta-backend": PASSED_PATH_EXAM }
  );
  const expected = { attempts: 2, best: 18, total: 20, passed: true };

  assert.deepEqual(forward.read("academia-examen-ruta-backend"), expected);
  assert.deepEqual(backward.read("academia-examen-ruta-backend"), expected);
});

test("challenges done on either device survive the import", () => {
  const storage = importInto(
    { "academia-practica": { git: { 0: true }, docker: { 1: true } } },
    { "academia-practica": { git: { 2: true }, sql: { 0: true } } }
  );

  assert.deepEqual(storage.read("academia-practica"), {
    git: { 0: true, 2: true },
    docker: { 1: true },
    sql: { 0: true },
  });
});

test("a key without its own rule keeps the local value when there is one", () => {
  const storage = importInto({ "academia-unknown": { local: true } }, { "academia-unknown": { remote: true } });

  assert.deepEqual(storage.read("academia-unknown"), { local: true });
});

test("a key without its own rule adopts the remote value when there is no local one", () => {
  const storage = importInto({}, { "academia-quiz-sql": PASSED_QUIZ });

  assert.deepEqual(storage.read("academia-quiz-sql"), PASSED_QUIZ);
});
