"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MODULES = path.join(__dirname, "..", "..", "assets", "js", "modules");
const UI_TEXT_SOURCE = fs.readFileSync(path.join(MODULES, "ui-text.js"), "utf8");
const HOME_SOURCE = fs.readFileSync(path.join(MODULES, "home.js"), "utf8");

function loadHome() {
  const sandbox = { console, document: {} };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(UI_TEXT_SOURCE, sandbox);
  vm.runInContext(HOME_SOURCE, sandbox);

  return sandbox.MentorAI;
}

const slugsOf = (tutorials) => Array.from(tutorials, (tutorial) => tutorial.slug);

const TUTORIALS = [
  { slug: "webhooks", title: "Webhooks: recibir eventos de terceros", description: "Con un índice de idempotencia" },
  { slug: "indices-btree", title: "Índices y B-tree", description: "Por qué tu consulta es lenta" },
  { slug: "consultas", title: "Encontrar la consulta culpable", description: "EXPLAIN y el índice que falta" },
  { slug: "indices-compuestos", title: "Índices compuestos", description: "El orden de las columnas" },
];

test("matches in the title come before matches elsewhere", () => {
  const { Home, searchTerms } = loadHome();

  assert.deepEqual(slugsOf(Home.byRelevance(TUTORIALS, searchTerms("indice"))), [
    "indices-btree",
    "indices-compuestos",
    "webhooks",
    "consultas",
  ]);
});

test("the title match ignores accents and case", () => {
  const { Home, searchTerms } = loadHome();

  const ranked = slugsOf(Home.byRelevance(TUTORIALS, searchTerms("ÍNDICES")));

  assert.deepEqual(ranked.slice(0, 2), ["indices-btree", "indices-compuestos"]);
});

test("without any title match the original order is kept", () => {
  const { Home, searchTerms } = loadHome();

  assert.deepEqual(slugsOf(Home.byRelevance(TUTORIALS, searchTerms("explain"))), slugsOf(TUTORIALS));
});

test("the query is split into words, ignoring empty words, order, accents and case", () => {
  const { searchTerms } = loadHome();

  assert.deepEqual(Array.from(searchTerms("Programar con la IA")), ["programar", "ia"]);
  assert.deepEqual(Array.from(searchTerms("ia programar")), ["ia", "programar"]);
  assert.deepEqual(Array.from(searchTerms("de la y con")), []);
});

test("every word must start a word of the text, in any order", () => {
  const { containsAllTerms, normalize, searchTerms } = loadHome();
  const text = normalize("Programar con IA: el mapa del ecosistema");

  assert.equal(containsAllTerms(text, searchTerms("programar con la ia")), true);
  assert.equal(containsAllTerms(text, searchTerms("ia programar")), true);
  assert.equal(containsAllTerms(text, searchTerms("program")), true);
  assert.equal(containsAllTerms(normalize("Una historia de bases de datos"), searchTerms("ia")), false);
  assert.equal(containsAllTerms(text, searchTerms("programar rust")), false);
  assert.equal(containsAllTerms(text, []), false);
});

test("symbols that are part of a term still match", () => {
  const { containsAllTerms, normalize, searchTerms } = loadHome();

  assert.equal(containsAllTerms(normalize("Plantillas en C++ modernas"), searchTerms("c++")), true);
});
