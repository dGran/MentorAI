#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const ORIGEN = path.join(ROOT, "tutorials", "quizzes.js");
const DESTINO = path.join(ROOT, "tutorials", "quiz-summary.js");
const MODO_COMPROBAR = "--comprobar";

function resumen() {
  const datos = { window: {} };

  vm.runInNewContext(fs.readFileSync(ORIGEN, "utf8"), datos);

  const examenes = datos.window.MENTORAI_QUIZZES ?? {};
  const porCurso = Object.fromEntries(
    Object.entries(examenes)
      .filter(([, examen]) => examen.questions?.length)
      .map(([curso, examen]) => [curso, { total: examen.questions.length, passingScore: examen.passingScore ?? null }])
  );

  return porCurso;
}

const porCurso = resumen();
const contenido = `window.MENTORAI_QUIZ_SUMMARY = ${JSON.stringify(porCurso, null, 2)};\n`;

if (process.argv.includes(MODO_COMPROBAR)) {
  const actual = fs.existsSync(DESTINO) ? fs.readFileSync(DESTINO, "utf8") : "";

  process.exit(actual === contenido ? 0 : 1);
}

fs.writeFileSync(DESTINO, contenido);
console.log(`Resumen de exámenes: ${Object.keys(porCurso).length} cursos → ${path.relative(ROOT, DESTINO)}`);
