const { abrir } = require("./cdp.js");
const [BASE, OUT] = process.argv.slice(2);
const LECCIONES = ["python-async-await", "rust-ownership", "sql-joins", "opcache", "procesos-hilos", "cap-consistencia", "k8s-objetos", "ia-llamar-a-un-llm", "go-testing"];
(async () => { const b = await abrir(9428); await b.ancho(1280, 900, false); const out = [];
  for (const slug of LECCIONES) {
    const antes = b.consola.length;
    await b.ir(`${BASE}/tutorials/${slug}.html`, 1200);
    const r = await b.evaluar(`(() => { const toc = [...document.querySelectorAll(".toc a[href^='#']")].map(a => a.getAttribute("href").slice(1)); const ids = [...document.querySelectorAll("article h2[id]")].map(h => h.id); return { h1: document.querySelector("h1").textContent.trim().slice(0, 50), tocSinAncla: toc.filter(t => !ids.includes(t)).length, bloques: document.querySelectorAll("pre code").length, resaltados: [...document.querySelectorAll("pre code")].filter(c => c.querySelector("[class^=tok-]")).length, checks: document.querySelectorAll(".check__item, .check__question").length }; })()`);
    out.push(`${slug}: ${JSON.stringify(r)} errores=${b.consola.length - antes}`);
  }
  await b.ir(`${BASE}/tutorials/k8s-objetos.html`, 1200);
  out.push("check c6b01a7 pintado: " + await b.evaluar(`[...document.querySelectorAll(".check__option")].some(o => o.textContent.includes("IP nueva en cada reemplazo"))`));
  await b.ir(`${BASE}/tutorials/ia-llamar-a-un-llm.html`, 1200);
  out.push("check cdb7fae pintado: " + await b.evaluar(`[...document.querySelectorAll(".check__option")].some(o => o.textContent.includes("y validar la salida"))`));
  await b.evaluar(`(() => { const p = [...document.querySelectorAll("pre code")].find(c => c.textContent.includes("APIConnectionException")); p.scrollIntoView(); window.scrollBy(0, -80); return 1; })()`); await b.sleep(300);
  if (OUT) await b.captura(`${OUT}/ia-llamar-a-un-llm-errores.png`);
  await b.ir(`${BASE}/tutorials/sql-joins.html`, 1200);
  await b.evaluar(`(() => { const p = [...document.querySelectorAll("pre code")].find(c => c.textContent.includes("UNION ALL")); p.scrollIntoView(); window.scrollBy(0, -200); return 1; })()`); await b.sleep(300);
  if (OUT) await b.captura(`${OUT}/sql-joins-full-outer.png`);
  console.log(out.join("\n")); b.cerrar(); })();
