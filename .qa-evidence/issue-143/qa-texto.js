const path = require("path"), fs = require("fs");
const { abrir } = require("./cdp.js");
const [, , salida, base, ...casos] = process.argv;
(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const b = await abrir(9418);
  const medidas = [];
  try {
    for (const caso of casos) {
      const [leccion, esperado, prohibido = ""] = caso.split("|");
      await b.ancho(1280, 900, false);
      await b.ir(`${base}/tutorials/${leccion}.html`, 1500);
      const medida = await b.evaluar(`(() => {
        const texto = document.body.innerText;
        const nodo = [...document.querySelectorAll("p, li, pre, td")].find((n) => n.innerText.includes(${JSON.stringify(esperado)}));
        if (nodo) nodo.scrollIntoView({ block: "center", behavior: "instant" });
        const caja = nodo?.getBoundingClientRect();
        return { leccion: ${JSON.stringify(leccion)}, h1: document.querySelector("h1")?.textContent.trim(), tieneEsperado: texto.includes(${JSON.stringify(esperado)}), tieneProhibido: ${JSON.stringify(prohibido)} !== "" && texto.includes(${JSON.stringify(prohibido)}), resaltado: document.querySelectorAll("code[data-lang]").length === 0 || document.querySelectorAll("code[data-lang] span").length > 0, caja: caja && { x: 0, y: Math.max(0, caja.top + scrollY - 40), width: 1280, height: Math.min(600, caja.height + 80) } };
      })()`);
      if (medida.caja) await b.captura(path.join(salida, `${leccion}-cambio.png`), medida.caja);
      await b.ancho(320, 800, true);
      await b.ir(`${base}/tutorials/${leccion}.html`, 1200);
      medida.movil320 = await b.evaluar(`({ ancho: document.documentElement.scrollWidth, viewport: innerWidth })`);
      delete medida.caja;
      medidas.push(medida);
    }
  } finally {
    await b.cerrar();
  }
  const fallos = medidas.flatMap((m) => [!m.tieneEsperado && `${m.leccion}: falta el texto nuevo`, m.tieneProhibido && `${m.leccion}: sigue el texto viejo`, !m.resaltado && `${m.leccion}: sin resaltado`, m.movil320.ancho > m.movil320.viewport && `${m.leccion}: desborde 320`].filter(Boolean));
  if (b.consola.length) fallos.push(`consola: ${b.consola.length}`);
  fs.writeFileSync(path.join(salida, "medidas.json"), JSON.stringify({ base, medidas, erroresConsola: b.consola }, null, 2));
  console.log(fallos.length ? `FALLOS: ${fallos.join("; ")}` : "verificado", "—", medidas.map((m) => `${m.leccion} ✓nuevo ${m.tieneEsperado} ✗viejo ${m.tieneProhibido} 320=${m.movil320.ancho}`).join(" · "));
})();
