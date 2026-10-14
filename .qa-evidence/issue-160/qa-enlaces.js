const path = require("path"), fs = require("fs");
const { abrir } = require("./cdp.js");
const [, , salida, base, ...casos] = process.argv;
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const navegador = await abrir(9419);
  const medidas = [];
  try {
    for (const caso of casos) {
      const [origen, destinoConAncla] = caso.split("|");
      const [destino, ancla = ""] = destinoConAncla.split("#");
      await navegador.ancho(1280, 900, false);
      await navegador.ir(`${base}/tutorials/${origen}.html`, 1500);
      const medida = await navegador.evaluar(`(() => {
        const enlaces = [...document.querySelectorAll("main a[href], article a[href]")].filter((a) => !a.closest(".tutorial-nav, .toc, pre"));
        const candidato = enlaces.find((a) => new URL(a.href).pathname.endsWith("/" + ${JSON.stringify(destino)} + ".html") && new URL(a.href).hash === ${JSON.stringify(ancla ? "#" + ancla : "")});
        if (!candidato) return { origen: ${JSON.stringify(origen)}, destino: ${JSON.stringify(destinoConAncla)}, encontrado: false };
        candidato.scrollIntoView({ block: "center", behavior: "instant" });
        const caja = candidato.closest("p, li, td, div")?.getBoundingClientRect() ?? candidato.getBoundingClientRect();
        candidato.setAttribute("data-qa-enlace", "");
        return { origen: ${JSON.stringify(origen)}, destino: ${JSON.stringify(destinoConAncla)}, encontrado: true, frase: candidato.closest("p, li, td")?.innerText.slice(0, 240) ?? candidato.innerText, caja: { x: 0, y: Math.max(0, caja.top + scrollY - 40), width: 1280, height: Math.min(500, caja.height + 80) } };
      })()`);

      if (!medida.encontrado) {
        medidas.push(medida);
        continue;
      }

      await navegador.captura(path.join(salida, `${origen}--${destino}.png`), medida.caja);
      delete medida.caja;
      await navegador.evaluar(`document.querySelector("[data-qa-enlace]").click()`);
      await esperar(1500);
      medida.llegada = await navegador.evaluar(`({ ruta: location.pathname, hash: location.hash, h1: document.querySelector("h1")?.textContent.trim() ?? "", anclaExiste: ${JSON.stringify(ancla)} === "" || Boolean(document.getElementById(${JSON.stringify(ancla)})) })`);
      medida.llega = medida.llegada.ruta.endsWith(`/${destino}.html`) && medida.llegada.h1 !== "" && medida.llegada.anclaExiste;
      await navegador.ancho(320, 800, true);
      await navegador.ir(`${base}/tutorials/${origen}.html`, 1200);
      medida.movil320 = await navegador.evaluar(`({ ancho: document.documentElement.scrollWidth, viewport: innerWidth })`);
      medidas.push(medida);
    }
  } finally {
    await navegador.cerrar();
  }
  const fallos = medidas.flatMap((m) => [!m.encontrado && `${m.origen}→${m.destino}: enlace no encontrado en el cuerpo`, m.encontrado && !m.llega && `${m.origen}→${m.destino}: el clic no llega`, m.movil320 && m.movil320.ancho > m.movil320.viewport && `${m.origen}: desborde 320`].filter(Boolean));

  if (navegador.consola.length) fallos.push(`consola: ${navegador.consola.length}`);

  fs.writeFileSync(path.join(salida, "medidas.json"), JSON.stringify({ base, medidas, erroresConsola: navegador.consola }, null, 2));
  console.log(fallos.length ? `FALLOS: ${fallos.join("; ")}` : "verificado", "—", medidas.map((m) => `${m.origen}→${m.destino} ${m.llega ? "✓" : "✗"}`).join(" · "));
})();
