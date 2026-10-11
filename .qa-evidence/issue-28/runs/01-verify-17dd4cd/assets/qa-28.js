const { abrir } = require("./cdp.js");
const [BASE, OUT] = process.argv.slice(2);
const PARES = [["idempotencia","sd-garantias-de-entrega"],["sd-garantias-de-entrega","idempotencia"],["cap-consistencia","sd-replicacion"],["sd-replicacion","cap-consistencia"],["procesos-hilos","maq-scheduler"],["maq-scheduler","procesos-hilos"],["inf-orquestacion","k8s-objetos"],["k8s-objetos","inf-orquestacion"],["flujo-con-agentes","cc-agente-por-dentro"],["cc-agente-por-dentro","flujo-con-agentes"],["bits-y-bytes","numeros-flotantes"],["ia-llamar-a-un-llm","cc-mcp"]];
(async () => { const b = await abrir(9431); await b.ancho(1280, 900, false); const out = [];
  for (const [desde, hacia] of PARES) {
    await b.ir(`${BASE}/tutorials/${desde}.html`, 900);
    const texto = await b.evaluar(`(() => { const a = [...document.querySelectorAll("article.prose a")].find(a => a.getAttribute("href").startsWith(${JSON.stringify(hacia + ".html")}) && !a.closest(".tutorial-nav")); if (!a) return null; const t = a.textContent.trim().replace(/\\s+/g, " "); a.click(); return t; })()`);
    await b.sleep(900);
    const destino = await b.evaluar(`location.pathname.split("/").pop() + location.hash + " · h1=" + (document.querySelector("h1") || {}).textContent?.trim()`);
    out.push(`${desde} → «${texto}» → ${destino}`);
  }
  out.push("errores de consola: " + (b.consola.length ? JSON.stringify(b.consola) : 0));
  console.log(out.join("\n")); b.cerrar(); })();
