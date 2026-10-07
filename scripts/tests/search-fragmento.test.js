"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MODULES = path.join(__dirname, "..", "..", "assets", "js", "modules");
const UI_TEXT_SOURCE = fs.readFileSync(path.join(MODULES, "ui-text.js"), "utf8");
const SEARCH_SOURCE = fs.readFileSync(path.join(MODULES, "search.js"), "utf8");

const CONTEXT_CHARACTERS = 70;
const FILLER_WORD = "relleno ";

function loadSearch(index) {
  const sandbox = { console, document: {}, location: { pathname: "/index.html" } };
  sandbox.window = sandbox;

  if (index) sandbox.MENTORAI_SEARCH = index;

  vm.createContext(sandbox);
  vm.runInContext(UI_TEXT_SOURCE, sandbox);
  vm.runInContext(SEARCH_SOURCE, sandbox);

  return sandbox.MentorAI.Search;
}

const filler = (words) => FILLER_WORD.repeat(words).trim();

test("without an index there is no fragment", () => {
  assert.equal(loadSearch(null).fragmento("opcache", "precarga"), "");
});

test("a slug without indexed text has no fragment", () => {
  assert.equal(loadSearch({ otro: "texto" }).fragmento("opcache", "precarga"), "");
});

test("a query that does not appear has no fragment", () => {
  assert.equal(loadSearch({ opcache: "la cache de opcodes" }).fragmento("opcache", "precarga"), "");
});

test("a short text is shown whole with the match marked and no ellipsis", () => {
  const search = loadSearch({ opcache: "activa la precarga en produccion" });

  assert.equal(
    search.fragmento("opcache", "precarga"),
    "activa la <mark>precarga</mark> en produccion"
  );
});

test("a match deep inside a long text is cut at spaces with ellipsis on both sides", () => {
  const body = `${filler(30)} activa la precarga en produccion ${filler(30)}`;
  const fragment = loadSearch({ opcache: body }).fragmento("opcache", "precarga");

  assert.ok(fragment.startsWith("…relleno"), fragment);
  assert.ok(fragment.endsWith("relleno…"), fragment);
  assert.ok(fragment.includes("activa la <mark>precarga</mark> en produccion"), fragment);
  assert.ok(fragment.length < body.length);
});

test("a match at the start has no leading ellipsis", () => {
  const body = `precarga al arrancar ${filler(30)}`;
  const fragment = loadSearch({ opcache: body }).fragmento("opcache", "precarga");

  assert.ok(fragment.startsWith("<mark>precarga</mark>"), fragment);
  assert.ok(fragment.endsWith("…"), fragment);
});

test("the fragment keeps no more than the context around the match", () => {
  const body = `${filler(30)} precarga ${filler(30)}`;
  const fragment = loadSearch({ opcache: body }).fragmento("opcache", "precarga");
  const visibleText = fragment.replace(/<\/?mark>/g, "").replace(/…/g, "");

  assert.ok(visibleText.length <= 2 * CONTEXT_CHARACTERS + "precarga".length, visibleText);
});

test("indexed text is escaped as HTML around the mark", () => {
  const search = loadSearch({ php: "usa <?php y la precarga & mas" });

  assert.equal(
    search.fragmento("php", "precarga"),
    "usa &lt;?php y la <mark>precarga</mark> &amp; mas"
  );
});
