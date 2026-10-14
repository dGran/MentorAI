"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const reglas = require("../reglas-del-catalogo");

const SIN_EXCEPCIONES = new Set();
const pieHacia = (slug) => `<nav class="tutorial-nav"><a href="${slug}.html" class="next">Siguiente</a></nav>`;

test("a lesson nobody links to is an orphan", () => {
  const html = { origen: "<p>Nada que ver.</p>", huerfana: "<p>Sola.</p>" };

  assert.deepEqual(reglas.leccionesSinEnlacesDeEntrada(html, SIN_EXCEPCIONES).huerfanas, ["origen", "huerfana"]);
});

test("a link only from the footer navigation does not count", () => {
  const html = { origen: `<p>Texto.</p>${pieHacia("destino")}`, destino: `<p>Texto.</p>${pieHacia("origen")}` };

  assert.deepEqual(reglas.leccionesSinEnlacesDeEntrada(html, SIN_EXCEPCIONES).huerfanas, ["origen", "destino"]);
});

test("a link from the body of another lesson counts, with or without anchor", () => {
  const html = {
    origen: '<p>Ver <a href="destino.html#seccion">la sección</a>.</p>',
    destino: '<p>Volver al <a href="./origen.html">origen</a>.</p>',
  };

  assert.deepEqual(reglas.leccionesSinEnlacesDeEntrada(html, SIN_EXCEPCIONES).huerfanas, []);
});

test("a lesson linking to itself is still an orphan", () => {
  const html = { sola: '<p>Arriba: <a href="sola.html#inicio">inicio</a>.</p>' };

  assert.deepEqual(reglas.leccionesSinEnlacesDeEntrada(html, SIN_EXCEPCIONES).huerfanas, ["sola"]);
});

test("a justified exception is not reported, and becomes surplus once it gets a link", () => {
  const conEnlace = { justificada: "<p>Sin frase natural.</p>", otra: '<p><a href="justificada.html">x</a></p>' };

  assert.deepEqual(reglas.leccionesSinEnlacesDeEntrada({ justificada: "<p>.</p>" }, new Set(["justificada"])), { huerfanas: [], excepcionesSobrantes: [] });
  assert.deepEqual(reglas.leccionesSinEnlacesDeEntrada(conEnlace, new Set(["justificada"])).excepcionesSobrantes, ["justificada"]);
});

test("an exception that is not in the catalogue is surplus", () => {
  assert.deepEqual(reglas.leccionesSinEnlacesDeEntrada({}, new Set(["borrada"])).excepcionesSobrantes, ["borrada"]);
});
