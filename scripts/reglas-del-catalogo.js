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

const PUESTO_DE_LA_MAS_LARGA = 1;

function puestoDominanteTrasLaMasLarga(preguntas) {
  const veces = new Map();

  for (const pregunta of preguntas) {
    const puesto = puestoPorLongitud(pregunta);

    if (puesto === PUESTO_DE_LA_MAS_LARGA) continue;

    veces.set(puesto, (veces.get(puesto) ?? 0) + 1);
  }

  const [puesto, cuantas] = [...veces.entries()].sort((primero, segundo) => segundo[1] - primero[1])[0] ?? [0, 0];

  return { puesto, porcentaje: preguntas.length ? (cuantas / preguntas.length) * 100 : 0 };
}

const SEPARADOR_DE_PALABRAS = /[\s:,;]+/;
const CODIGO_EN_LINEA = /`[^`]*`/g;
const ARRANQUES_DE_SI_O_NO = new Set(["sí", "si", "no"]);
const CONECTORES_DE_CAUSA_O_FIN = new Set(["porque", "para", "por"]);
const ARRANQUE_DE_CAUSA_O_FIN = "porque/para/por";

const sinCodigo = (texto) => String(texto).replace(CODIGO_EN_LINEA, "");

function arranqueDe(texto) {
  const palabra = sinCodigo(texto).trim().split(SEPARADOR_DE_PALABRAS)[0].toLowerCase();

  return CONECTORES_DE_CAUSA_O_FIN.has(palabra) ? ARRANQUE_DE_CAUSA_O_FIN : palabra;
}

function pistasDeForma(pregunta) {
  const correcta = sinCodigo(pregunta.o[pregunta.a]);
  const distractores = pregunta.o.filter((opcion, indice) => indice !== pregunta.a).map(sinCodigo);
  const arranques = distractores.map(arranqueDe);
  const arranqueDeLaCorrecta = arranqueDe(correcta);
  const esDeSiONo = [...arranques, arranqueDeLaCorrecta].every((arranque) => ARRANQUES_DE_SI_O_NO.has(arranque));
  const pistas = [];

  if (correcta.includes(";") && !distractores.some((opcion) => opcion.includes(";"))) pistas.push("solo la correcta lleva «;»");

  if (correcta.includes(":") && !distractores.some((opcion) => opcion.includes(":"))) pistas.push("solo la correcta lleva «:»");

  if (!esDeSiONo && arranques.every((arranque) => arranque === arranques[0]) && arranqueDeLaCorrecta !== arranques[0]) {
    pistas.push(`los distractores empiezan por «${arranques[0]}» y la correcta no`);
  }

  return pistas;
}

const BLOQUE_DE_CODIGO = /<div class="code-block">[\s\S]*?<\/pre>\s*<\/div>/g;
const SECCION_CON_ID = /<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
const APERTURA_DE_CALLOUT = /<div class="callout callout--\w+[^"]*"[^>]*>/g;
const CALLOUT_CON_CUERPO = /^<div class="callout callout--\w+[^"]*"[^>]*>\s*<svg(?:(?!<\/svg>)[\s\S])*<\/svg>\s*<div class="callout__body">/;
const ESTRUCTURA_ANTIGUA = [
  [/class="toc__title">En este tutorial/, "el índice se titula «En este tutorial» y no «En esta página»"],
  [/class="tutorial-hero container"/, "el hero no tiene un .container dentro (las acciones del tutorial no se inyectan)"],
  [/class="tutorial-actions"/, "lleva .tutorial-actions escritas a mano (sus botones no los escucha ningún JS)"],
  [/class="toc__toggle"/, "lleva el botón del índice escrito a mano (el JS añade otro)"],
  [/<ul class="keypoints"/, "los puntos clave van en <ul class=\"keypoints\"> y no en el bloque de la plantilla"],
];

const tieneSuAncla = (id, contenido) => contenido.includes(`href="#${id}" class="anchor"`);

function problemasDeEstructura(html) {
  const problemas = ESTRUCTURA_ANTIGUA.filter(([patron]) => patron.test(html)).map(([, problema]) => problema);

  if (/<pre[\s>]/.test(html.replace(BLOQUE_DE_CODIGO, ""))) problemas.push("tiene <pre> fuera de un .code-block");

  const calloutsSinCuerpo = [...html.matchAll(APERTURA_DE_CALLOUT)].filter((apertura) => !CALLOUT_CON_CUERPO.test(html.slice(apertura.index)));

  if (calloutsSinCuerpo.length > 0) problemas.push(`${calloutsSinCuerpo.length} callout(s) sin .callout__body`);

  const seccionesSinAncla = [...html.matchAll(SECCION_CON_ID)].filter(([, id, contenido]) => !tieneSuAncla(id, contenido)).map(([, id]) => id);

  if (seccionesSinAncla.length > 0) problemas.push(`h2 sin ancla de plantilla: ${seccionesSinAncla.map((id) => `#${id}`).join(", ")}`);

  return problemas;
}

const nivelDeCurso = (nivelesDeLecciones) => nivelesDeLecciones[0];

function problemasDeCargaDeDatos(fichero, html, paginasConDatosCompletos) {
  const problemas = DATOS_SIEMPRE.filter((script) => !html.includes(script)).map((script) => `${fichero}: no carga ${script}`);

  if (paginasConDatosCompletos.includes(fichero)) return problemas;

  const cargadosDeMas = DATOS_BAJO_DEMANDA.filter((nombre) => new RegExp(`tutorials/${nombre}\\.js`).test(html));

  return [...problemas, ...cargadosDeMas.map((nombre) => `${fichero}: carga ${nombre}.js, que se inyecta bajo demanda`)];
}

const NAVEGACION_DEL_PIE = /<nav class="tutorial-nav">[\s\S]*?<\/nav>/g;
const ENLACE_A_LECCION = /href="(?:\.\/)?([a-z0-9-]+)\.html(?:#[^"]*)?"/g;

function destinosEnlazados(slugDeOrigen, html) {
  const cuerpo = html.replace(NAVEGACION_DEL_PIE, "");
  const destinos = [...cuerpo.matchAll(ENLACE_A_LECCION)].map(([, slug]) => slug);

  return new Set(destinos.filter((slug) => slug !== slugDeOrigen));
}

function leccionesSinEnlacesDeEntrada(htmlPorSlug, excepciones) {
  const conEntrada = new Set();

  for (const [slug, html] of Object.entries(htmlPorSlug)) {
    for (const destino of destinosEnlazados(slug, html)) conEntrada.add(destino);
  }

  const sinEntrada = Object.keys(htmlPorSlug).filter((slug) => !conEntrada.has(slug));

  return {
    huerfanas: sinEntrada.filter((slug) => !excepciones.has(slug)),
    excepcionesSobrantes: [...excepciones].filter((slug) => conEntrada.has(slug) || !(slug in htmlPorSlug)),
  };
}

function leccionesSinPreguntaDeExamen(leccionesPorCurso, preguntasPorCurso, excepciones) {
  const sinPregunta = Object.entries(leccionesPorCurso).flatMap(([curso, lecciones]) => {
    const cubiertas = new Set((preguntasPorCurso[curso] ?? []).map((pregunta) => pregunta.lesson));

    return lecciones.filter((leccion) => !cubiertas.has(leccion));
  });

  return {
    sinPregunta: sinPregunta.filter((leccion) => !excepciones.has(leccion)),
    excepcionesSobrantes: [...excepciones].filter((leccion) => !sinPregunta.includes(leccion)),
  };
}

module.exports = { esFechaReal, diaLocal, problemasDeRevision, tieneDrawerEscrito, tablasSinEnvolver, tieneUnSoloMain, problemasDeCargaDeDatos, nivelDeCurso, puestoPorLongitud, puestoDominanteTrasLaMasLarga, pistasDeForma, problemasDeEstructura, leccionesSinEnlacesDeEntrada, leccionesSinPreguntaDeExamen };
