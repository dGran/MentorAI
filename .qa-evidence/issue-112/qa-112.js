const path = require("path"), fs = require("fs");
const { abrir } = require("./cdp.js");
const [, , salida, base = "http://localhost:8000"] = process.argv;
const LECCIONES = ["big-o", "sql-joins", "transacciones-acid"];
(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const b = await abrir(9413);
  const resultados = [];
  try {
    await b.ancho(1280, 800, false);
    for (const leccion of LECCIONES) {
      await b.ir(`${base}/tutorials/${leccion}.html`, 1200);
      await b.evaluar(`document.getElementById("cuando").scrollIntoView({block:"center", behavior:"instant"})`);
      await b.sleep(400);
      const caja = await b.evaluar(`(() => { const h = document.getElementById("cuando").getBoundingClientRect(); return { x: h.left, y: h.top, w: h.width, h: h.height, scroll: scrollY }; })()`);
      const ancla = `document.querySelector('#cuando a.anchor')`;
      const antes = await b.evaluar(`getComputedStyle(${ancla}).opacity`);
      await b.raton(caja.x + 20, caja.y + caja.h / 2);
      const durante = await b.evaluar(`getComputedStyle(${ancla}).opacity`);
      await b.captura(path.join(salida, `criterio-05-${leccion}-hover.png`), { x: 0, y: Math.max(0, caja.scroll + caja.y - 40), width: 1280, height: caja.h + 80 });
      const enlace = await b.evaluar(`${ancla}.getAttribute("href")`);
      const r = await b.evaluar(`(() => { const a = ${ancla}.getBoundingClientRect(); return { x: a.left + a.width / 2, y: a.top + a.height / 2 }; })()`);
      await b.clic(r.x, r.y);
      const hash = await b.evaluar("location.hash");
      const textoTitulo = await b.evaluar(`document.getElementById("cuando").textContent.replace(/\\s+/g, " ").trim()`);
      const tocApunta = await b.evaluar(`!!document.querySelector('.toc a[href="#cuando"]')`);
      resultados.push({ leccion, opacidadSinHover: antes, opacidadConHover: durante, href: enlace, hashTrasClic: hash, textoTitulo, tocApunta });
    }
  } finally {
    await b.cerrar();
  }
  const consola = b.consola;
  fs.writeFileSync(path.join(salida, "criterio-05-medidas.json"), JSON.stringify({ base, resultados, erroresConsola: consola }, null, 2));
  console.log(JSON.stringify({ resultados, erroresConsola: consola }, null, 2));
})();
