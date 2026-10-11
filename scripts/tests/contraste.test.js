"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { matrizDeContraste, ratioDeContraste } = require("../contraste");

const STYLES = fs.readFileSync(path.join(__dirname, "..", "..", "assets", "css", "styles.css"), "utf8");

test("contrast ratio matches the WCAG formula", () => {
  assert.equal(ratioDeContraste("#000000", "#ffffff").toFixed(1), "21.0");
  assert.equal(ratioDeContraste("#ffffff", "#ffffff").toFixed(1), "1.0");
});

test("every token pair in both themes reaches its minimum contrast", () => {
  const failing = matrizDeContraste(STYLES).filter((row) => !row.isValida);

  assert.deepEqual(
    failing.map((row) => `${row.tema} ${row.texto}/${row.fondo} ${row.ratio.toFixed(2)} < ${row.minimo}`),
    []
  );
});

test("a token that falls below its minimum is reported", () => {
  const faded = STYLES.replace(/--text-muted:\s*#[0-9a-f]{6};/i, "--text-muted: #9aa1b2;");

  assert.ok(matrizDeContraste(faded).some((row) => !row.isValida && row.texto === "--text-muted"));
});
