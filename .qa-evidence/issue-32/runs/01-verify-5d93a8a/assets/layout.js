const { abrir } = require("./cdp.js");
const fs = require("fs");
const [A, B, ...resto] = process.argv.slice(2);
const slugs = resto[0] === "--todos" ? fs.readdirSync(B + "/tutorials").filter((f) => f.endsWith(".html") && !f.startsWith("_")).map((f) => f.slice(0, -5)) : resto;
const ANCHO = +process.env.ANCHO || 1280;
const GEOMETRIA = `[...document.querySelectorAll("main *, article *, header *, footer *")].filter((e) => !e.closest(".nav-drawer")).map((e) => { const r = e.getBoundingClientRect(); return e.tagName + "." + (typeof e.className === "string" ? e.className : "") + " " + [r.x, r.y + scrollY, r.width, r.height].map((v) => Math.round(v)).join(","); })`;
(async () => {
  const b = await abrir(9417);
  await b.ancho(ANCHO, 900, false);
  await b.send("Page.enable");
  await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "(() => { let semilla = 42; Math.random = () => ((semilla = (semilla * 16807) % 2147483647) - 1) / 2147483646; })()" });
  let iguales = 0;
  for (const slug of slugs) {
    await b.ir(`file://${A}/tutorials/${slug}.html`, 900); const x = await b.evaluar(GEOMETRIA);
    await b.ir(`file://${B}/tutorials/${slug}.html`, 900); const y = await b.evaluar(GEOMETRIA);
    const distintos = x.map((v, i) => [v, y[i]]).filter(([p, q]) => p !== q);
    if (!distintos.length && x.length === y.length) { iguales++; if (!process.env.SOLO_DISTINTAS) console.log("idéntica ", slug, x.length, "elementos"); continue; }
    console.log("DISTINTA ", slug, `${distintos.length} de ${x.length}`, "primero:", distintos[0]);
  }
  console.log(`${iguales}/${slugs.length} idénticas a ${ANCHO}px`);
  b.cerrar();
})();
