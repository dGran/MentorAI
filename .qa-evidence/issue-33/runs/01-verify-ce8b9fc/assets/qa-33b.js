const { abrir } = require("./cdp.js");
const [BASE] = process.argv.slice(2);
(async () => { const b = await abrir(9475); await b.ancho(1280, 900, false);
  for (const p of ["tipos-de-test", "tdd-ciclo", "test-doubles"]) { await b.ir(`${BASE}/tutorials/${p}.html`, 1500);
    console.log(p, await b.evaluar(`(() => { const n = document.querySelectorAll(".tutorial-nav"); return n.length + " navs · " + [...document.querySelectorAll(".tutorial-nav a, .lesson-nav a, a.next")].map(a => a.getAttribute("href") + "«" + a.textContent.trim().replace(/\\s+/g, " ") + "»").join(" | "); })()`)); }
  b.cerrar(); })();
