#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ESTILOS = path.join(__dirname, "..", "assets", "css", "styles.css");
const TEXTO = 4.5;
const NO_TEXTO = 3;
const UMBRAL_LINEAL = 0.03928;
const DIVISOR_LINEAL = 12.92;
const DESPLAZAMIENTO_GAMMA = 0.055;
const ESCALA_GAMMA = 1.055;
const EXPONENTE_GAMMA = 2.4;
const PESO_ROJO = 0.2126;
const PESO_VERDE = 0.7152;
const PESO_AZUL = 0.0722;
const DESPLAZAMIENTO_LUMINANCIA = 0.05;
const MAXIMO_CANAL = 255;

const PARES = [
  { texto: "--text-muted", fondos: ["--bg", "--surface", "--surface-2", "--surface-3", "--brand-soft"], minimo: TEXTO },
  { texto: "--text-soft", fondos: ["--bg", "--surface", "--surface-2", "--surface-3"], minimo: TEXTO },
  { texto: "--on-brand", fondos: ["--brand-fill", "--brand-fill-2"], minimo: TEXTO },
  { texto: "--brand-text", fondos: ["--bg", "--surface", "--brand-soft"], minimo: TEXTO },
  { texto: "--link-hover", fondos: ["--bg", "--surface", "--surface-2"], minimo: TEXTO },
  { texto: "--focus-ring", fondos: ["--bg", "--surface", "--surface-2", "--surface-3", "--brand-soft"], minimo: NO_TEXTO },
  { texto: "--focus-ring-on-code", fondos: ["--code-bg"], minimo: NO_TEXTO },
];

const BLOQUES_DE_TEMA = {
  claro: /:root,\s*\[data-theme="light"\]\s*\{([\s\S]*?)\n\}/,
  oscuro: /\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/,
};

function tokensDe(bloque) {
  const tokens = {};

  for (const [, nombre, valor] of bloque.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) {
    tokens[nombre] = valor.trim();
  }

  return tokens;
}

function resolver(tokens, nombre, visitados = new Set()) {
  const valor = tokens[nombre];

  if (!valor || visitados.has(nombre)) return null;

  const referencia = valor.match(/^var\((--[a-z0-9-]+)\)$/);

  if (!referencia) return valor;

  visitados.add(nombre);

  return resolver(tokens, referencia[1], visitados);
}

function canalLineal(valor) {
  const fraccion = valor / MAXIMO_CANAL;

  if (fraccion <= UMBRAL_LINEAL) return fraccion / DIVISOR_LINEAL;

  return ((fraccion + DESPLAZAMIENTO_GAMMA) / ESCALA_GAMMA) ** EXPONENTE_GAMMA;
}

function luminancia(hex) {
  const numero = parseInt(hex.slice(1), 16);
  const rojo = canalLineal(numero >> 16);
  const verde = canalLineal((numero >> 8) & MAXIMO_CANAL);
  const azul = canalLineal(numero & MAXIMO_CANAL);

  return PESO_ROJO * rojo + PESO_VERDE * verde + PESO_AZUL * azul;
}

function ratioDeContraste(primero, segundo) {
  const [masClara, masOscura] = [luminancia(primero), luminancia(segundo)].sort((mayor, menor) => menor - mayor);

  return (masClara + DESPLAZAMIENTO_LUMINANCIA) / (masOscura + DESPLAZAMIENTO_LUMINANCIA);
}

function esHexCompleto(valor) {
  return /^#[0-9a-f]{6}$/i.test(valor ?? "");
}

function matrizDeContraste(css) {
  const filas = [];

  for (const [tema, patron] of Object.entries(BLOQUES_DE_TEMA)) {
    const bloque = css.match(patron);
    const tokens = { ...tokensDe(css.match(BLOQUES_DE_TEMA.claro)?.[1] ?? ""), ...tokensDe(bloque?.[1] ?? "") };

    for (const { texto, fondos, minimo } of PARES) {
      for (const fondo of fondos) {
        const colorDeTexto = resolver(tokens, texto);
        const colorDeFondo = resolver(tokens, fondo);
        const isMedible = esHexCompleto(colorDeTexto) && esHexCompleto(colorDeFondo);
        const ratio = isMedible ? ratioDeContraste(colorDeTexto, colorDeFondo) : 0;

        filas.push({ tema, texto, fondo, minimo, ratio, isMedible, isValida: isMedible && ratio >= minimo });
      }
    }
  }

  return filas;
}

module.exports = { matrizDeContraste, ratioDeContraste };

if (require.main === module) {
  const filas = matrizDeContraste(fs.readFileSync(ESTILOS, "utf8"));

  for (const fila of filas) {
    const ratio = fila.isMedible ? fila.ratio.toFixed(2) : "sin valor";

    console.log(`  ${fila.isValida ? "✓" : "✗"} ${fila.tema.padEnd(7)} ${fila.texto.padEnd(13)} sobre ${fila.fondo.padEnd(13)} ${ratio} (mínimo ${fila.minimo})`);
  }

  process.exit(filas.every((fila) => fila.isValida) ? 0 : 1);
}
