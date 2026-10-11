"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const reglas = require("../reglas-del-catalogo");

process.env.TZ = "Europe/Madrid";

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

test("reviewed on its publication day is accepted", () => {
  assert.deepEqual(reglas.problemasDeRevision(lesson("2026-08-22"), TODAY), []);
});

test("a date both before publication and in the future reports both problems", () => {
  const problems = reglas.problemasDeRevision(lesson("2026-12-01", "2027-01-01"), TODAY);

  assert.equal(problems.length, 2);
  assert.match(problems[0], /anterior a su date/);
  assert.match(problems[1], /en el futuro/);
});

test("reviewed after today is rejected", () => {
  assert.match(reglas.problemasDeRevision(lesson("2026-10-12"), TODAY)[0], /en el futuro/);
});

test("today is the local calendar day, not the UTC one", () => {
  assert.equal(reglas.diaLocal(new Date("2026-10-10T23:30:00Z")), "2026-10-11");
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

test("a tutorial needs exactly one main element", () => {
  assert.equal(reglas.tieneUnSoloMain("<header></header><main><article></article></main><footer></footer>"), true);
  assert.equal(reglas.tieneUnSoloMain("<header></header><article></article><footer></footer>"), false);
  assert.equal(reglas.tieneUnSoloMain("<main></main><main></main>"), false);
  assert.equal(reglas.tieneUnSoloMain("<main><article></article>"), false);
});

const FULL_DATA_PAGES = ["curso.html"];
const ALWAYS_LOADED = '<script src="../tutorials/quiz-summary.js"></script><script src="../assets/js/modules/data-loader.js"></script>';

test("a lesson loading the summary and the loader has no data problems", () => {
  assert.deepEqual(reglas.problemasDeCargaDeDatos("tutorials/x.html", `${ALWAYS_LOADED}<script src="../assets/js/modules/checks.js"></script>`, FULL_DATA_PAGES), []);
});

test("a page without the exam summary or the loader is reported", () => {
  const problems = reglas.problemasDeCargaDeDatos("index.html", "<script src=\"assets/js/modules/init.js\"></script>", FULL_DATA_PAGES);

  assert.equal(problems.length, 2);
  assert.match(problems[0], /quiz-summary\.js/);
  assert.match(problems[1], /data-loader\.js/);
});

test("on-demand data loaded eagerly is reported except on full data pages", () => {
  const eager = `${ALWAYS_LOADED}<script src="tutorials/quizzes.js"></script><script src="tutorials/practica.js"></script>`;

  assert.equal(reglas.problemasDeCargaDeDatos("index.html", eager, FULL_DATA_PAGES).length, 2);
  assert.deepEqual(reglas.problemasDeCargaDeDatos("curso.html", eager, FULL_DATA_PAGES), []);
});

test("a course takes the level of the lesson it starts with", () => {
  assert.equal(reglas.nivelDeCurso(["Principiante", "Intermedio", "Intermedio"]), "Principiante");
  assert.equal(reglas.nivelDeCurso(["Intermedio", "Avanzado", "Avanzado"]), "Intermedio");
  assert.equal(reglas.nivelDeCurso(["Avanzado"]), "Avanzado");
});

const question = (options, answer) => ({ o: options, a: answer });

test("the length rank counts the options strictly longer than the correct one", () => {
  assert.equal(reglas.puestoPorLongitud(question(["aaaa", "bb", "c"], 0)), 1);
  assert.equal(reglas.puestoPorLongitud(question(["aaaa", "bb", "c"], 1)), 2);
  assert.equal(reglas.puestoPorLongitud(question(["aa", "bb", "c"], 1)), 1);
  assert.equal(reglas.puestoPorLongitud(question(["aaaa", "bbb", "cc", "d"], 3)), 4);
});

test("the dominant length rank and its share are reported", () => {
  const second = question(["aaaa", "bbb", "c"], 1);
  const longest = question(["aaaa", "bbb", "c"], 0);

  assert.deepEqual(reglas.puestoDominante([second, second, second, longest]), { puesto: 2, porcentaje: 75 });
  assert.deepEqual(reglas.puestoDominante([]), { puesto: 0, porcentaje: 0 });
});
