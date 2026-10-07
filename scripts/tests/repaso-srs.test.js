"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MODULES = path.join(__dirname, "..", "..", "assets", "js", "modules");
const STORAGE_SOURCE = fs.readFileSync(path.join(MODULES, "storage.js"), "utf8");
const REPASO_SOURCE = fs.readFileSync(path.join(MODULES, "repaso.js"), "utf8");

const REPASO_KEY = "academia-repaso";
const DAY = 24 * 60 * 60 * 1000;
const INTERVAL_DAYS = [1, 3, 7, 16, 35, 70];
const QUESTION_ID = "c:regex:c-uno";

const CHECKS = {
  regex: [
    { id: "c-uno", q: "Primera" },
    { id: "c-dos", q: "Segunda" },
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

function loadRepaso(localEntries = {}) {
  const localStorage = createMemoryStorage(localEntries);
  const document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
  const sandbox = { localStorage, document, console, MENTORAI_CHECKS: CHECKS, MENTORAI_QUIZZES: {} };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(STORAGE_SOURCE, sandbox);
  vm.runInContext(REPASO_SOURCE, sandbox);

  return { repaso: sandbox.MentorAI.Repaso, localStorage };
}

function startOfToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function answer(repaso, results) {
  results.forEach((wasCorrect) => repaso.record(QUESTION_ID, wasCorrect));
}

test("each correct answer moves the question to the next interval", () => {
  const { repaso, localStorage } = loadRepaso();

  INTERVAL_DAYS.forEach((days, step) => {
    repaso.record(QUESTION_ID, true);

    const entry = localStorage.read(REPASO_KEY)[QUESTION_ID];
    const expectedStep = Math.min(step + 1, INTERVAL_DAYS.length - 1);

    assert.equal(entry.s, expectedStep);
    assert.equal(entry.d, startOfToday() + INTERVAL_DAYS[expectedStep] * DAY);
  });
});

test("the interval stops growing at the last step", () => {
  const { repaso, localStorage } = loadRepaso();

  answer(repaso, Array(INTERVAL_DAYS.length + 3).fill(true));

  const entry = localStorage.read(REPASO_KEY)[QUESTION_ID];

  assert.equal(entry.s, INTERVAL_DAYS.length - 1);
  assert.equal(entry.d, startOfToday() + INTERVAL_DAYS.at(-1) * DAY);
});

test("a wrong answer sends the question back to the first interval and counts the failure", () => {
  const { repaso, localStorage } = loadRepaso();

  answer(repaso, [true, true, true, false]);

  const entry = localStorage.read(REPASO_KEY)[QUESTION_ID];

  assert.equal(entry.s, 0);
  assert.equal(entry.d, startOfToday() + INTERVAL_DAYS[0] * DAY);
  assert.equal(entry.f, 1);
});

test("failures accumulate across answers", () => {
  const { repaso, localStorage } = loadRepaso();

  answer(repaso, [false, true, false]);

  assert.equal(localStorage.read(REPASO_KEY)[QUESTION_ID].f, 2);
});

test("only questions due by the end of today are counted and served", () => {
  const today = startOfToday();
  const { repaso } = loadRepaso({
    [REPASO_KEY]: {
      "c:regex:c-uno": { s: 1, d: today, f: 0 },
      "c:regex:c-dos": { s: 2, d: today + 2 * DAY, f: 0 },
    },
  });

  assert.equal(repaso.stats().due, 1);
  assert.deepEqual(
    [...repaso.dueQuestions()].map((entry) => entry.id),
    ["c:regex:c-uno"]
  );
});

test("a question is mastered once it reaches the last step", () => {
  const today = startOfToday();
  const lastStep = INTERVAL_DAYS.length - 1;
  const { repaso } = loadRepaso({
    [REPASO_KEY]: {
      "c:regex:c-uno": { s: lastStep, d: today + 70 * DAY, f: 0 },
      "c:regex:c-dos": { s: lastStep - 1, d: today + 35 * DAY, f: 1 },
    },
  });

  assert.deepEqual({ ...repaso.stats() }, { total: 2, due: 0, dominadas: 1 });
});

test("due questions whose source no longer exists are not served", () => {
  const { repaso } = loadRepaso({
    [REPASO_KEY]: { "c:regex:c-borrada": { s: 0, d: startOfToday(), f: 0 } },
  });

  assert.equal(repaso.stats().due, 1);
  assert.deepEqual([...repaso.dueQuestions()], []);
});
