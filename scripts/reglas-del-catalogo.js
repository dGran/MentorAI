"use strict";

const FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;
const DRAWER_ESCRITO = /class=["'][^"']*\bnav-drawer(-backdrop)?\b(?!__)/;
const TABLA = /<table\b/gi;
const TABLA_ENVUELTA = /<div class="table-wrap">\s*<table\b/gi;
const APERTURA_DE_MAIN = /<main\b/gi;
const CIERRE_DE_MAIN = /<\/main>/gi;
const DATOS_BAJO_DEMANDA = ["quizzes", "checks", "practica"];
const DATOS_SIEMPRE = ["tutorials/quiz-summary.js", "modules/data-loader.js"];

const esFechaReal = (texto) =>
  FECHA_ISO.test(texto) && !Number.isNaN(Date.parse(texto)) && new Date(texto).toISOString().slice(0, 10) === texto;

function diaLocal(fecha = new Date()) {
  return [fecha.getFullYear(), fecha.getMonth() + 1, fecha.getDate()].map((n) => String(n).padStart(2, "0")).join("-");
}

function problemasDeRevision(tutorial, hoy) {
  if (tutorial.reviewed === undefined) return [];

  if (typeof tutorial.reviewed !== "string" || !esFechaReal(tutorial.reviewed)) {
    return [`manifest: «${tutorial.slug}» tiene reviewed «${tutorial.reviewed}», que no es una fecha AAAA-MM-DD`];
  }

  const problemas = [];

  if (tutorial.date && tutorial.reviewed < tutorial.date) {
    problemas.push(`manifest: «${tutorial.slug}» tiene reviewed ${tutorial.reviewed}, anterior a su date ${tutorial.date}`);
  }

  if (tutorial.reviewed > hoy) {
    problemas.push(`manifest: «${tutorial.slug}» tiene reviewed ${tutorial.reviewed}, en el futuro`);
  }

  return problemas;
}

const tieneDrawerEscrito = (html) => DRAWER_ESCRITO.test(html);

const tablasSinEnvolver = (html) => (html.match(TABLA) ?? []).length - (html.match(TABLA_ENVUELTA) ?? []).length;

const tieneUnSoloMain = (html) =>
  (html.match(APERTURA_DE_MAIN) ?? []).length === 1 && (html.match(CIERRE_DE_MAIN) ?? []).length === 1;

function puestoPorLongitud(pregunta) {
  const longitudes = pregunta.o.map((opcion) => String(opcion).length);
  const correcta = longitudes[pregunta.a];

  return 1 + longitudes.filter((longitud) => longitud > correcta).length;
}

function puestoDominante(preguntas) {
  const veces = new Map();

  for (const pregunta of preguntas) {
    const puesto = puestoPorLongitud(pregunta);

    veces.set(puesto, (veces.get(puesto) ?? 0) + 1);
  }

  const [puesto, cuantas] = [...veces.entries()].sort((primero, segundo) => segundo[1] - primero[1])[0] ?? [0, 0];

  return { puesto, porcentaje: preguntas.length ? Math.round((cuantas / preguntas.length) * 100) : 0 };
}

const nivelDeCurso = (nivelesDeLecciones) => nivelesDeLecciones[0];

function problemasDeCargaDeDatos(fichero, html, paginasConDatosCompletos) {
  const problemas = DATOS_SIEMPRE.filter((script) => !html.includes(script)).map((script) => `${fichero}: no carga ${script}`);

  if (paginasConDatosCompletos.includes(fichero)) return problemas;

  const cargadosDeMas = DATOS_BAJO_DEMANDA.filter((nombre) => new RegExp(`tutorials/${nombre}\\.js`).test(html));

  return [...problemas, ...cargadosDeMas.map((nombre) => `${fichero}: carga ${nombre}.js, que se inyecta bajo demanda`)];
}

module.exports = { esFechaReal, diaLocal, problemasDeRevision, tieneDrawerEscrito, tablasSinEnvolver, tieneUnSoloMain, problemasDeCargaDeDatos, nivelDeCurso, puestoPorLongitud, puestoDominante };
