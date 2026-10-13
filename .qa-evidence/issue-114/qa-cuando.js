const path = require("path"), fs = require("fs");
const { abrir } = require("./cdp.js");
const [, , salida, base, ...lecciones] = process.argv;
(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const b = await abrir(9416);
  const resultados = [];
  try {
    await b.ancho(1280, 900, false);
    for (const leccion of lecciones) {
      await b.ir(`${base}/tutorials/${leccion}.html#cuando`, 1200);
      await b.evaluar(`document.getElementById("cuando").scrollIntoView({ block: "start", behavior: "instant" })`);
      await b.sleep(300);
      resultados.push(await b.evaluar(`(() => {
        const h = document.getElementById("cuando");
        const toc = [...document.querySelectorAll('a[href="#cuando"]')].filter((a) => !a.classList.contains("anchor"));
        const siguiente = h.nextElementSibling;
        const caja = siguiente?.getBoundingClientRect();
        const orden = [...document.querySelectorAll(".prose h2[id]")].map((x) => x.id);
        return { leccion: ${JSON.stringify("")} || location.pathname.split("/").pop(), anclaPropia: !!h.querySelector('a.anchor[href="#cuando"]'), entradaEnIndice: toc.length > 0, compareVisible: !!siguiente?.classList.contains("compare") && caja.height > 0, justoAntesDelResumen: orden[orden.indexOf("cuando") + 1] === "resumen" };
      })()`));
      if (resultados.length <= 3) await b.captura(path.join(salida, `cuando-${leccion}.png`));
    }
  } finally {
    await b.cerrar();
  }
  fs.writeFileSync(path.join(salida, "medidas.json"), JSON.stringify({ base, resultados, erroresConsola: b.consola }, null, 2));
  const fallos = resultados.filter((r) => !(r.anclaPropia && r.entradaEnIndice && r.compareVisible && r.justoAntesDelResumen));
  console.log(`${resultados.length} lecciones, ${fallos.length} fallos, ${b.consola.length} errores de consola`, fallos.length ? JSON.stringify(fallos) : "");
})();
