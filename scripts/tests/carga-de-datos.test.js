"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const LOADER_SOURCE = fs.readFileSync(path.join(__dirname, "..", "..", "assets", "js", "modules", "data-loader.js"), "utf8");
const DATA_GLOBALS = { "tutorials/quizzes.js": "MENTORAI_QUIZZES", "tutorials/checks.js": "MENTORAI_CHECKS" };

function loadLoader({ failuresBySrc = {}, preloaded = {} } = {}) {
  const injected = [];
  const sandbox = { console, MentorAI: { basePath: () => "" }, ...preloaded };
  sandbox.window = sandbox;
  sandbox.document = {
    createElement: () => ({ remove() {} }),
    head: {
      appendChild(tag) {
        injected.push(tag.src);
        setImmediate(() => {
          if ((failuresBySrc[tag.src] ?? 0) > 0) {
            failuresBySrc[tag.src] -= 1;
            tag.onerror();
            return;
          }

          sandbox[DATA_GLOBALS[tag.src]] = { loaded: true };
          tag.onload();
        });
      },
    },
  };

  vm.createContext(sandbox);
  vm.runInContext(LOADER_SOURCE, sandbox);

  return { MentorAI: sandbox.MentorAI, injected, sandbox };
}

test("each data file is injected once even when requested several times", async () => {
  const { MentorAI, injected } = loadLoader();

  await Promise.all([MentorAI.loadData(["checks"]), MentorAI.loadData(["checks", "quizzes"]), MentorAI.loadData(["quizzes"])]);

  assert.deepEqual([...injected].sort(), ["tutorials/checks.js", "tutorials/quizzes.js"]);
});

test("data already present in the page is not injected again", async () => {
  const { MentorAI, injected } = loadLoader({ preloaded: { MENTORAI_CHECKS: {} } });

  await MentorAI.loadData(["checks"]);

  assert.deepEqual(injected, []);
});

test("a failed injection can be retried", async () => {
  const { MentorAI, injected } = loadLoader({ failuresBySrc: { "tutorials/checks.js": 1 } });

  await assert.rejects(MentorAI.loadData(["checks"]));
  await MentorAI.loadData(["checks"]);

  assert.deepEqual(injected, ["tutorials/checks.js", "tutorials/checks.js"]);
});

test("exam totals come from the loaded quizzes and otherwise from the summary", () => {
  const withQuizzes = loadLoader({
    preloaded: { MENTORAI_QUIZZES: { git: { questions: [{}, {}, {}], passingScore: 2 } }, MENTORAI_QUIZ_SUMMARY: { git: { total: 9, passingScore: null } } },
  });
  const withSummaryOnly = loadLoader({ preloaded: { MENTORAI_QUIZ_SUMMARY: { git: { total: 9, passingScore: null } } } });

  assert.deepEqual({ ...withQuizzes.MentorAI.examSummary("git") }, { total: 3, passingScore: 2 });
  assert.deepEqual({ ...withSummaryOnly.MentorAI.examSummary("git") }, { total: 9, passingScore: null });
  assert.equal(withSummaryOnly.MentorAI.examSummary("rust"), null);
});
