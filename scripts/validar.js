#!/usr/bin/env node
/* ============================================================
   MentorAI — Validador del catálogo
   ------------------------------------------------------------
   Formaliza los chequeos que se hacían a mano en cada sesión. Node puro,
   sin dependencias, solo lectura.

     node scripts/validar.js

   Sale con código 1 si hay errores, para poder usarlo como paso previo a
   un commit o como GitHub Action sobre los PR.
   ============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const errores = [];
const avisos = [];

const error = (mensaje) => errores.push(mensaje);
const aviso = (mensaje) => avisos.push(mensaje);

function leer(relativo) {
  return fs.readFileSync(path.join(ROOT, relativo), "utf8");
}

function existe(relativo) {
  return fs.existsSync(path.join(ROOT, relativo));
}

function htmlDelCatalogo() {
  const raiz = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
  const tutoriales = fs
    .readdirSync(path.join(ROOT, "tutorials"))
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.join("tutorials", f));

  return [...raiz, ...tutoriales];
}

/* ---------- Carga de los datos ---------- */

const datos = { window: {} };

for (const fichero of ["manifest", "courses", "paths", "quizzes", "checks"]) {
  try {
    vm.runInNewContext(leer(`tutorials/${fichero}.js`), datos);
  } catch (fallo) {
    error(`tutorials/${fichero}.js no se puede evaluar: ${fallo.message}`);
  }
}

const manifest = datos.window.ACADEMIA_TUTORIALS ?? [];
const cursos = datos.window.MENTORAI_COURSES ?? [];
const rutas = datos.window.MENTORAI_PATHS ?? [];
const examenes = datos.window.MENTORAI_QUIZZES ?? {};
const checks = datos.window.MENTORAI_CHECKS ?? {};

const slugs = new Set(manifest.map((t) => t.slug));
const slugsDeCurso = new Set(cursos.map((c) => c.slug));

function leccionesDe(curso) {
  if (Array.isArray(curso.lessons)) return curso.lessons;

  return (curso.modules ?? []).flatMap((modulo) => modulo.lessons ?? []);
}

/* ---------- 1. Sintaxis de todo el JS ---------- */

function validarSintaxis() {
  const ficheros = [
    ...fs.readdirSync(path.join(ROOT, "assets/js/modules")).map((f) => `assets/js/modules/${f}`),
    ...fs.readdirSync(path.join(ROOT, "tutorials")).filter((f) => f.endsWith(".js")).map((f) => `tutorials/${f}`),
    "sw.js",
  ];

  for (const fichero of ficheros) {
    try {
      execFileSync("node", ["--check", path.join(ROOT, fichero)], { stdio: "pipe" });
    } catch (fallo) {
      error(`${fichero}: error de sintaxis`);
    }
  }
}

/* ---------- 2. Manifiesto ---------- */

function validarManifest() {
  const vistos = new Set();

  for (const tutorial of manifest) {
    if (vistos.has(tutorial.slug)) error(`manifest: slug duplicado «${tutorial.slug}»`);
    vistos.add(tutorial.slug);

    if (tutorial.status !== "soon" && !existe(tutorial.href)) {
      error(`manifest: «${tutorial.slug}» apunta a ${tutorial.href}, que no existe`);
    }

    for (const campo of ["title", "description", "href", "categories"]) {
      if (!tutorial[campo]) error(`manifest: «${tutorial.slug}» sin ${campo}`);
    }
  }

  /* El badge "Nuevo" solo se pinta en el catálogo, y el catálogo deja fuera
     lo que ya es lección de un curso: ahí el flag no se ve nunca. */
  const enCurso = new Set(cursos.flatMap(leccionesDe));
  const destacados = manifest.filter((t) => t.featured);

  for (const tutorial of destacados) {
    if (enCurso.has(tutorial.slug)) {
      aviso(`manifest: «${tutorial.slug}» está marcado featured, pero es lección de un curso y ese badge no llega a verse`);
    }
  }

  const sueltosDestacados = destacados.filter((t) => !enCurso.has(t.slug)).length;

  if (sueltosDestacados > 1) {
    aviso(`manifest: ${sueltosDestacados} artículos sueltos marcados featured (el badge "Nuevo" pierde sentido si son varios)`);
  }

  const huerfanos = fs
    .readdirSync(path.join(ROOT, "tutorials"))
    .filter((f) => f.endsWith(".html") && !f.startsWith("_"))
    .map((f) => f.replace(/\.html$/, ""))
    .filter((slug) => !slugs.has(slug));

  for (const slug of huerfanos) {
    error(`tutorials/${slug}.html existe pero no está en el manifiesto`);
  }
}

/* ---------- 3. Cursos y rutas ---------- */

function validarCursosYRutas() {
  for (const curso of cursos) {
    const lecciones = leccionesDe(curso);

    if (lecciones.length === 0) error(`courses: «${curso.slug}» no tiene lecciones`);

    for (const slug of lecciones) {
      if (slugs.has(slug)) continue;

      aviso(`courses: «${curso.slug}» tiene «${slug}» planificada (sin escribir todavía)`);
    }
  }

  for (const ruta of rutas) {
    for (const paso of ruta.steps ?? []) {
      const conocido = paso.type === "course" ? slugsDeCurso.has(paso.ref) : slugs.has(paso.ref);

      if (!conocido) error(`paths: la ruta «${ruta.slug}» referencia ${paso.type} «${paso.ref}», que no existe`);
    }
  }
}

/* ---------- 4. Exámenes y comprobaciones ----------
   El sesgo de posición es el fallo que ya se coló tres veces: la IA tiende
   a poner la correcta siempre en el mismo sitio al generar. */

const MAXIMO_MISMA_POSICION = 45;
const MINIMO_PARA_MEDIR_GRUPO = 12;

function avisarSiHaySesgo(nombre, posiciones, total, comoError) {
  if (total === 0) return;

  const maximo = Math.max(...Object.values(posiciones));
  const porcentaje = Math.round((maximo / total) * 100);

  if (porcentaje <= MAXIMO_MISMA_POSICION) return;

  const mensaje =
    `${nombre}: la respuesta correcta cae en la misma posición un ${porcentaje}% de las veces ` +
    `sobre ${total} preguntas (${JSON.stringify(posiciones)}). ` +
    `Se aprueba sin leer: reparte las posiciones en los datos.`;

  comoError ? error(mensaje) : aviso(mensaje);
}

function validarPreguntas(nombre, entradas, contexto) {
  const posiciones = {};
  const porGrupo = {};
  let total = 0;

  for (const [clave, preguntas] of Object.entries(entradas)) {
    if (!contexto.existe(clave)) error(`${nombre}: «${clave}» no corresponde a ${contexto.que}`);

    if (!Array.isArray(preguntas) || preguntas.length === 0) {
      error(`${nombre}: «${clave}» sin preguntas`);
      continue;
    }

    const grupo = contexto.agrupaEn(clave);

    porGrupo[grupo] ??= { posiciones: {}, total: 0 };

    preguntas.forEach((pregunta, indice) => {
      const donde = `${nombre} «${clave}» #${indice}`;
      total += 1;

      if (!pregunta.q) error(`${donde}: sin enunciado`);
      if (!Array.isArray(pregunta.o) || pregunta.o.length < 2) error(`${donde}: necesita al menos 2 opciones`);
      if (!(pregunta.a >= 0 && pregunta.a < (pregunta.o ?? []).length)) error(`${donde}: índice de respuesta fuera de rango`);
      if (!pregunta.w) aviso(`${donde}: sin explicación (campo w)`);
      if (pregunta.lesson && !slugs.has(pregunta.lesson)) error(`${donde}: lesson «${pregunta.lesson}» no existe`);
      if (new Set(pregunta.o ?? []).size !== (pregunta.o ?? []).length) error(`${donde}: opciones repetidas`);

      posiciones[pregunta.a] = (posiciones[pregunta.a] ?? 0) + 1;
      porGrupo[grupo].posiciones[pregunta.a] = (porGrupo[grupo].posiciones[pregunta.a] ?? 0) + 1;
      porGrupo[grupo].total += 1;
    });
  }

  /* El sesgo de un curso concreto se diluye en el total: con 400 preguntas bien
     repartidas, un curso nuevo entero mal repartido no mueve la aguja. Y en los
     checks las preguntas van por lección, así que hay que agruparlas por curso
     para que la muestra signifique algo. */
  for (const [grupo, datosDelGrupo] of Object.entries(porGrupo)) {
    if (datosDelGrupo.total < MINIMO_PARA_MEDIR_GRUPO) continue;

    avisarSiHaySesgo(`${nombre} «${grupo}»`, datosDelGrupo.posiciones, datosDelGrupo.total, true);
  }

  avisarSiHaySesgo(nombre, posiciones, total, true);
}

/* ---------- 5. TOC, anclas y escapado en los tutoriales ---------- */

function validarTutoriales() {
  for (const fichero of htmlDelCatalogo().filter((f) => f.startsWith("tutorials/"))) {
    const html = leer(fichero);

    const ids = [...html.matchAll(/<h2[^>]*\sid="([^"]+)"/g)].map((m) => m[1]);
    const enlaces = [...html.matchAll(/class="toc__list"[\s\S]*?<\/ul>/g)]
      .flatMap((bloque) => [...bloque[0].matchAll(/href="#([^"]+)"/g)].map((m) => m[1]));

    for (const ancla of enlaces) {
      if (!ids.includes(ancla)) error(`${fichero}: el índice enlaza a #${ancla}, que no tiene <h2 id>`);
    }

    /* Solo el < rompe el renderizado (abre una etiqueta). El > literal es
       válido en HTML y aparece constantemente en ->, >> y =>, así que
       marcarlo sería ruido que acabaría haciendo ignorar al validador. */
    for (const bloque of html.matchAll(/<code[^>]*data-lang="[^"]*"[^>]*>([\s\S]*?)<\/code>/g)) {
      const crudo = bloque[1].replace(/&[a-z]+;|&#\d+;/g, "");

      if (crudo.includes("<")) {
        error(`${fichero}: hay un < sin escapar dentro de un <code data-lang>`);
        break;
      }
    }
  }
}

/* ---------- 6. Coherencia de los <script> entre páginas ---------- */

function validarScripts() {
  const modulos = (html) => [...html.matchAll(/modules\/([a-z-]+)\.js/g)].map((m) => m[1]);
  const referencia = new Set(modulos(leer("index.html")));
  const soloTutorial = new Set(["tutorial", "tutorial-audio", "tutorial-nav", "tutorial-feedback", "checks", "quiz"]);

  for (const fichero of htmlDelCatalogo()) {
    const presentes = new Set(modulos(leer(fichero)));

    if (!presentes.has("init")) error(`${fichero}: no carga init.js`);

    for (const modulo of referencia) {
      if (soloTutorial.has(modulo)) continue;
      if (!presentes.has(modulo)) error(`${fichero}: le falta el módulo ${modulo}.js`);
    }
  }
}

/* ---------- 7. Shell del service worker ---------- */

function validarShell() {
  const sw = leer("sw.js");
  const rutas = [...sw.matchAll(/^\s*"([^"]+\.(?:js|css|html|png|woff2|webmanifest))",/gm)].map((m) => m[1]);

  for (const ruta of rutas) {
    if (!existe(ruta)) error(`sw.js: el shell incluye ${ruta}, que no existe`);
  }

  const modulos = fs.readdirSync(path.join(ROOT, "assets/js/modules"));

  for (const modulo of modulos) {
    if (!rutas.includes(`assets/js/modules/${modulo}`)) {
      error(`sw.js: el módulo ${modulo} no está en el shell (no funcionaría sin conexión)`);
    }
  }
}

/* ---------- 8. CSS: llaves y tokens ---------- */

function validarCss() {
  const css = leer("assets/css/styles.css");
  const abre = (css.match(/{/g) ?? []).length;
  const cierra = (css.match(/}/g) ?? []).length;

  if (abre !== cierra) error(`styles.css: llaves descuadradas (${abre} abren, ${cierra} cierran)`);

  const usados = new Set([...css.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));
  const definidos = new Set([...css.matchAll(/^\s+(--[a-z0-9-]+):/gm)].map((m) => m[1]));

  for (const token of usados) {
    if (!definidos.has(token)) error(`styles.css: usa el token ${token}, que no está definido`);
  }
}

/* ---------- Ejecución ---------- */

/* ---------- 8. Índice de búsqueda ----------
   Se genera a partir de los .html, así que se desincroniza en cuanto se
   edita un tutorial y nadie lo regenera. Es el riesgo que anotaba el plan. */

function validarIndiceDeBusqueda() {
  if (!existe("tutorials/search-index.js")) {
    error("falta tutorials/search-index.js. Ejecuta: node scripts/generar-indice.js");
    return;
  }

  try {
    execFileSync("node", [path.join(ROOT, "scripts/generar-indice.js"), "--comprobar"], {
      stdio: "pipe",
    });
  } catch {
    error(
      "el índice de búsqueda está desfasado respecto a los tutoriales. " +
        "Ejecuta: node scripts/generar-indice.js"
    );
  }
}

validarSintaxis();
validarManifest();
validarCursosYRutas();
const examenesPlanos = Object.fromEntries(
  Object.entries(examenes).map(([curso, quiz]) => [curso, quiz.questions ?? []])
);

const cursoDeLeccion = Object.fromEntries(
  cursos.flatMap((curso) => leccionesDe(curso).map((slug) => [slug, curso.slug]))
);

validarPreguntas("quizzes", examenesPlanos, {
  existe: (c) => slugsDeCurso.has(c),
  que: "un curso",
  agrupaEn: (c) => c,
});

validarPreguntas("checks", checks, {
  existe: (s) => slugs.has(s),
  que: "un tutorial",
  agrupaEn: (s) => cursoDeLeccion[s] ?? "artículos sueltos",
});
validarTutoriales();
validarScripts();
validarShell();
validarCss();
validarIndiceDeBusqueda();

console.log(`\n  Catálogo: ${manifest.length} tutoriales · ${cursos.length} cursos · ${rutas.length} rutas`);
console.log(
  `  Preguntas: ${Object.values(examenes).reduce((n, q) => n + q.questions.length, 0)} de examen · ` +
    `${Object.values(checks).flat().length} de comprobación\n`
);

for (const mensaje of avisos) console.log(`  aviso  ${mensaje}`);
for (const mensaje of errores) console.log(`  ERROR  ${mensaje}`);

if (errores.length === 0) {
  console.log(`\n  Sin errores${avisos.length ? ` (${avisos.length} avisos)` : ""}.\n`);
  process.exit(0);
}

console.log(`\n  ${errores.length} error${errores.length === 1 ? "" : "es"}.\n`);
process.exit(1);
