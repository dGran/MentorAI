const { abrir } = require("./cdp.js");
const [BASE, OUT] = process.argv.slice(2);
(async () => { const b = await abrir(9423); await b.ancho(320); const lineas = [];
for (const slug of ["go-tipos-y-variables", "python-docker", "active-record-vs-data-mapper"]) {
  await b.ir(`${BASE}/tutorials/${slug}.html`, 300);
  for (let i = 0; i < 50 && !(await b.evaluar(`document.readyState === "complete" && !!document.querySelector(".table-wrap")`)); i++) await b.sleep(100);
  const r = await b.evaluar(`(() => { const w = document.querySelector(".table-wrap"); const r = w.getBoundingClientRect(); window.scrollTo(0, r.top + scrollY - 40); return { pagina: document.documentElement.scrollWidth - document.documentElement.clientWidth, wrapScroll: w.scrollWidth, wrapClient: w.clientWidth, overflowX: getComputedStyle(w).overflowX }; })()`);
  await b.sleep(300); if (OUT) await b.captura(`${OUT}/c3-${slug}-320-tabla.png`);
  lineas.push(`${slug}: desborde de página=${r.pagina}px · .table-wrap scrollWidth=${r.wrapScroll} clientWidth=${r.wrapClient} overflow-x=${r.overflowX}`);
}
console.log(lineas.join("\n")); b.cerrar(); })();
