#!/usr/bin/env node
/* ============================================================
   MentorAI — Generador del índice de búsqueda full-text
   ------------------------------------------------------------
   Extrae el texto del cuerpo de cada tutorial y escribe
   tutorials/search-index.js, que asigna window.MENTORAI_SEARCH.

     node scripts/generar-indice.js            regenera el índice
     node scripts/generar-indice.js --comprobar   sale con 1 si está desfasado

   El índice NO se edita a mano: se regenera al tocar cualquier
   tutorial. `scripts/validar.js` comprueba que esté al día.

   Se indexa también el contenido de los bloques de código: buscar
   `hash_equals` o `X-Accel-Buffering` es justo lo que se hace cuando
   te topas con el problema en el trabajo.
   ============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DESTINO = path.join(ROOT, "tutorials", "search-index.js");

const CABECERA = `/* ============================================================
   Índice de búsqueda full-text — GENERADO, no editar a mano
   ------------------------------------------------------------
   Se regenera con: node scripts/generar-indice.js
   Cada clave es el slug de un tutorial; el valor, el texto de su
   cuerpo normalizado (minúsculas, sin acentos, espacios colapsados).
   Mismo patrón file:// que el resto: un .js que asigna a un global.
   ============================================================ */

window.MENTORAI_SEARCH = `;

/* La misma normalización que MentorAI.normalize en el front, para que
   lo que se indexa y lo que se busca hablen el mismo idioma. */
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function textoDelCuerpo(html) {
  const inicio = html.indexOf('<article class="prose">');
  const fin = html.indexOf("</article>", inicio);

  if (inicio === -1 || fin === -1) return "";

  return normalizar(
    html
      .slice(inicio, fin)
      .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
      .replace(/<svg[\s\S]*?<\/svg>/g, " ")
      .replace(/<nav class="tutorial-nav"[\s\S]*?<\/nav>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/&[a-z]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function construir() {
  const indice = {};

  const ficheros = fs
    .readdirSync(path.join(ROOT, "tutorials"))
    .filter((f) => f.endsWith(".html") && !f.startsWith("_"))
    .sort();

  for (const fichero of ficheros) {
    const slug = fichero.replace(/\.html$/, "");
    const texto = textoDelCuerpo(fs.readFileSync(path.join(ROOT, "tutorials", fichero), "utf8"));

    if (texto === "") {
      console.warn(`  aviso: ${fichero} no tiene <article class="prose">, se queda fuera`);
      continue;
    }

    indice[slug] = texto;
  }

  return CABECERA + JSON.stringify(indice) + ";\n";
}

/* ---------- Ejecución ---------- */

const contenido = construir();
const comprobar = process.argv.includes("--comprobar");
const actual = fs.existsSync(DESTINO) ? fs.readFileSync(DESTINO, "utf8") : "";

if (comprobar) {
  if (actual === contenido) {
    console.log("El índice de búsqueda está al día.");
    process.exit(0);
  }

  console.error("El índice de búsqueda está desfasado. Ejecuta: node scripts/generar-indice.js");
  process.exit(1);
}

fs.writeFileSync(DESTINO, contenido);

const entradas = Object.keys(JSON.parse(contenido.slice(CABECERA.length, -2))).length;
const tamano = (Buffer.byteLength(contenido) / 1024).toFixed(0);

console.log(`Índice escrito: ${entradas} tutoriales, ${tamano} KB en tutorials/search-index.js`);
