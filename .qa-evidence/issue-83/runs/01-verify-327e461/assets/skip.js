const { abrir } = require("./cdp.js");
const [BASE] = process.argv.slice(2);
(async () => { const b = await abrir(9456); await b.ancho(1280, 900, false); const out = [];
 for (const s of ["sql-joins", "python-decoradores", "goroutines"]) { await b.ir(`${BASE}/tutorials/${s}.html`, 900); await b.evaluar("document.body.focus(); 1"); await b.tecla("Tab", "Tab", 9); const primero = await b.evaluar("document.activeElement.textContent.trim()"); await b.tecla("Enter", "Enter", 13); await b.sleep(200); out.push(`${s}: primer Tab «${primero}» → foco ${await b.evaluar("document.activeElement.tagName + '#' + document.activeElement.id")} · mains ${await b.evaluar("document.querySelectorAll('main').length")}`); }
 console.log(out.join("\n")); b.cerrar(); })();
