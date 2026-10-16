"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const reglas = require("../reglas-del-catalogo");

const SIN_EXCEPCIONES = new Set();
const pregunta = (lesson) => ({ id: `q-${lesson}`, lesson });

test("a course lesson that no exam question points to is reported", () => {
  const resultado = reglas.leccionesSinPreguntaDeExamen({ go: ["go-que-es", "go-http"] }, { go: [pregunta("go-http")] }, SIN_EXCEPCIONES);

  assert.deepEqual(resultado.sinPregunta, ["go-que-es"]);
});

test("a lesson covered by its own course exam is not reported", () => {
  const resultado = reglas.leccionesSinPreguntaDeExamen({ go: ["go-http"] }, { go: [pregunta("go-http")] }, SIN_EXCEPCIONES);

  assert.deepEqual(resultado, { sinPregunta: [], excepcionesSobrantes: [] });
});

test("a question from another course exam does not cover the lesson", () => {
  const resultado = reglas.leccionesSinPreguntaDeExamen({ go: ["go-http"], rust: [] }, { rust: [pregunta("go-http")] }, SIN_EXCEPCIONES);

  assert.deepEqual(resultado.sinPregunta, ["go-http"]);
});

test("a course without exam reports all its lessons", () => {
  const resultado = reglas.leccionesSinPreguntaDeExamen({ nuevo: ["uno", "dos"] }, {}, SIN_EXCEPCIONES);

  assert.deepEqual(resultado.sinPregunta, ["uno", "dos"]);
});

test("a justified exception is not reported, and becomes surplus once covered", () => {
  const excepciones = new Set(["go-que-es"]);

  assert.deepEqual(reglas.leccionesSinPreguntaDeExamen({ go: ["go-que-es"] }, { go: [] }, excepciones), { sinPregunta: [], excepcionesSobrantes: [] });
  assert.deepEqual(reglas.leccionesSinPreguntaDeExamen({ go: ["go-que-es"] }, { go: [pregunta("go-que-es")] }, excepciones).excepcionesSobrantes, ["go-que-es"]);
});

test("an exception that is not a lesson of any course is surplus", () => {
  assert.deepEqual(reglas.leccionesSinPreguntaDeExamen({ go: [] }, {}, new Set(["articulo-suelto"])).excepcionesSobrantes, ["articulo-suelto"]);
});
