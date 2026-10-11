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

test("the dominant rank after the longest is found even when the longest is more frequent", () => {
  const second = question(["aaaa", "bbb", "c"], 1);
  const third = question(["aaaa", "bbb", "c"], 2);
  const longest = question(["aaaa", "bbb", "c"], 0);

  assert.deepEqual(reglas.puestoDominanteTrasLaMasLarga([longest, longest, longest, second, second, third]), { puesto: 2, porcentaje: (2 / 6) * 100 });
  assert.deepEqual(reglas.puestoDominanteTrasLaMasLarga([longest]), { puesto: 0, porcentaje: 0 });
  assert.deepEqual(reglas.puestoDominanteTrasLaMasLarga([]), { puesto: 0, porcentaje: 0 });
});

test("a share just over the limit is not rounded down", () => {
  const second = question(["aaaa", "bbb", "c"], 1);
  const third = question(["aaaa", "bbb", "c"], 2);
  const share = reglas.puestoDominanteTrasLaMasLarga([...Array(5).fill(second), ...Array(6).fill(third)]).porcentaje;

  assert.ok(share > 54 && share < 55);
});

test("a correct option with a different shape from the distractors is a form cue", () => {
  assert.deepEqual(reglas.pistasDeForma(question(["Porque a", "Porque b", "C; d"], 2)), ["solo la correcta lleva «;»", "los distractores empiezan por «porque/para/por» y la correcta no"]);
  assert.deepEqual(reglas.pistasDeForma(question(["Porque a", "Con b: c", "Porque d"], 1)), ["solo la correcta lleva «:»", "los distractores empiezan por «porque/para/por» y la correcta no"]);
});

test("options sharing their shape carry no form cue", () => {
  assert.deepEqual(reglas.pistasDeForma(question(["Porque a", "Porque b", "Porque c"], 1)), []);
  assert.deepEqual(reglas.pistasDeForma(question(["Sí: a", "No: b", "Sí: c"], 1)), []);
  assert.deepEqual(reglas.pistasDeForma(question(["Uno", "Dos", "Tres"], 0)), []);
});

test("causal and purpose connectors count as the same opening", () => {
  assert.deepEqual(reglas.pistasDeForma(question(["Porque a", "Para b", "C sin conector"], 2)), ["los distractores empiezan por «porque/para/por» y la correcta no"]);
  assert.deepEqual(reglas.pistasDeForma(question(["Porque a", "Para b", "Porque c"], 2)), []);
});

test("punctuation inside inline code is not a form cue", () => {
  assert.deepEqual(reglas.pistasDeForma(question(["Con `a := 1`", "Con b", "Con c"], 0)), []);
});

const CURRENT_STRUCTURE = '<section class="tutorial-hero"><div class="container"></div></section><p class="toc__title">En esta página</p><div class="code-block"><div class="code-block__head"></div><pre><code data-lang="go">x</code></pre></div><div class="callout callout--tip"><svg></svg><div class="callout__body"><p>a</p></div></div><div class="keypoints"></div>';

test("a lesson with the current template has no structure problems", () => {
  assert.deepEqual(reglas.problemasDeEstructura(CURRENT_STRUCTURE), []);
});

test("each piece of the old template is reported", () => {
  const old = '<section class="tutorial-hero container"><div class="tutorial-actions"></div></section><p class="toc__title">En este tutorial</p><button class="toc__toggle"></button><pre><code>x</code></pre><div class="callout callout--warning">texto suelto</div><ul class="keypoints"><li>a</li></ul>';
  const problems = reglas.problemasDeEstructura(old);

  assert.equal(problems.length, 7);

  for (const piece of ["En este tutorial", ".container", ".tutorial-actions", "índice", "keypoints", "<pre>", "callout"]) {
    assert.ok(problems.some((problem) => problem.includes(piece)), piece);
  }
});

test("a callout without body is caught even when a correct one follows it", () => {
  const html = '<div class="callout callout--tip"><p>x</p></div><div class="callout callout--info"><svg></svg><div class="callout__body"><p>y</p></div></div>';

  assert.deepEqual(reglas.problemasDeEstructura(html), ["1 callout(s) sin .callout__body"]);
});

test("a callout with an icon but no body is caught even when a correct one follows it", () => {
  const html = '<div class="callout callout--tip"><svg></svg><p>x</p></div><div class="callout callout--info"><svg></svg><div class="callout__body"><p>y</p></div></div>';

  assert.deepEqual(reglas.problemasDeEstructura(html), ["1 callout(s) sin .callout__body"]);
});

test("a callout with extra classes or attributes is still checked", () => {
  assert.deepEqual(reglas.problemasDeEstructura('<div class="callout callout--tip extra" id="a"><p>x</p></div>'), ["1 callout(s) sin .callout__body"]);
});
