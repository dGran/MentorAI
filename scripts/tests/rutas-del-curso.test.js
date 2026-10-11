"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const COURSES_SOURCE = fs.readFileSync(path.join(__dirname, "..", "..", "assets", "js", "modules", "courses.js"), "utf8");

const PATHS = [
  { slug: "grado", title: "El grado", steps: [{ type: "course", ref: "git" }, { type: "article", ref: "regex" }, { type: "course", ref: "sql" }] },
  { slug: "servicio", title: "Construir un servicio", steps: [{ type: "course", ref: "sql" }] },
];

function loadCourses(paths) {
  const sandbox = { MENTORAI_PATHS: paths, MentorAI: {} };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(COURSES_SOURCE, sandbox);

  return sandbox.MentorAI.Courses;
}

const summary = (routes) => Array.from(routes, ({ path, position, total }) => `${path.slug} ${position}/${total}`);

test("a course in one route reports its position among all steps", () => {
  assert.deepEqual(summary(loadCourses(PATHS).routesOf({ slug: "git" })), ["grado 1/3"]);
});

test("a course in several routes lists each one with its own position", () => {
  assert.deepEqual(summary(loadCourses(PATHS).routesOf({ slug: "sql" })), ["grado 3/3", "servicio 1/1"]);
});

test("an article step with the same slug is not counted as the course", () => {
  assert.deepEqual(summary(loadCourses(PATHS).routesOf({ slug: "regex" })), []);
});

test("without route data a course belongs to no route", () => {
  assert.deepEqual(summary(loadCourses(undefined).routesOf({ slug: "git" })), []);
});
