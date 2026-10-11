"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const reglas = require("../reglas-del-catalogo");

const TODAY = "2026-10-11";
const lesson = (reviewed, date = "2026-08-22") => ({ slug: "ia-streaming", date, reviewed });

test("a lesson without reviewed has no review problems", () => {
  assert.deepEqual(reglas.problemasDeRevision({ slug: "regex", date: "2026-08-22" }, TODAY), []);
});

test("a real date between publication and today is accepted", () => {
  assert.deepEqual(reglas.problemasDeRevision(lesson("2026-09-01"), TODAY), []);
  assert.deepEqual(reglas.problemasDeRevision(lesson(TODAY), TODAY), []);
});

test("reviewed must be a YYYY-MM-DD string", () => {
  for (const invalid of ["27/06/2026", "2026-6-27", 20260627, null]) {
    const problems = reglas.problemasDeRevision(lesson(invalid), TODAY);

    assert.equal(problems.length, 1, String(invalid));
    assert.match(problems[0], /no es una fecha AAAA-MM-DD/);
  }
});

test("impossible calendar days are rejected", () => {
  for (const impossible of ["2026-06-31", "2026-02-30", "2026-13-01"]) {
    assert.match(reglas.problemasDeRevision(lesson(impossible), TODAY)[0], /no es una fecha/, impossible);
  }
});

test("reviewed before the publication date is rejected", () => {
  assert.match(reglas.problemasDeRevision(lesson("2026-01-01"), TODAY)[0], /anterior a su date 2026-08-22/);
});

test("reviewed after today is rejected", () => {
  assert.match(reglas.problemasDeRevision(lesson("2026-10-12"), TODAY)[0], /en el futuro/);
});

test("today is the local calendar day, not the UTC one", () => {
  assert.equal(reglas.diaLocal(new Date(2026, 9, 11, 1, 30)), "2026-10-11");
  assert.equal(reglas.diaLocal(new Date(2026, 0, 5, 23, 59)), "2026-01-05");
});

test("a static nav drawer is detected in any of its written forms", () => {
  for (const html of [
    '<div class="nav-drawer"></div>',
    '<div class="nav-drawer-backdrop"></div>',
    '<div class="nav-drawer is-open"></div>',
    "<div class='nav-drawer'></div>",
    '<div class="x nav-drawer"></div>',
  ]) {
    assert.equal(reglas.tieneDrawerEscrito(html), true, html);
  }
});

test("drawer child classes alone are not a static drawer", () => {
  for (const html of ['<span class="nav-drawer__title">MentorAI</span>', '<a class="nav-drawer__link is-active">', '<nav class="nav">']) {
    assert.equal(reglas.tieneDrawerEscrito(html), false, html);
  }
});

test("only tables outside a table-wrap are counted", () => {
  const wrapped = '<div class="table-wrap">\n  <table><tr><td>a</td></tr></table>\n</div>';
  const bare = "<table><tr><td>b</td></tr></table>";

  assert.equal(reglas.tablasSinEnvolver(wrapped), 0);
  assert.equal(reglas.tablasSinEnvolver(bare), 1);
  assert.equal(reglas.tablasSinEnvolver(wrapped + bare + "<TABLE></TABLE>"), 2);
});

test("an escaped table inside text is not a table", () => {
  assert.equal(reglas.tablasSinEnvolver("<p>Usa &lt;table&gt; solo para datos.</p>"), 0);
});
