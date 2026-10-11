const { abrir } = require("./cdp.js");
const fs = require("fs");
const [ROOT] = process.argv.slice(2);
(async () => { const b = await abrir(9437); await b.ancho(1280, 900, false); const out = [];
 for (const f of fs.readdirSync(ROOT + "/tutorials").filter(f => f.endsWith(".html") && !f.startsWith("_"))) { await b.ir(`file://${ROOT}/tutorials/${f}`, 250); let e = null; for (let i = 0; i < 20 && e === null; i++) { e = await b.evaluar("document.documentElement ? document.documentElement.scrollWidth - document.documentElement.clientWidth : null"); if (e === null) await b.sleep(100); } if (e > 0) out.push(f.slice(0, -5) + "+" + e); }
 console.log("1280 desbordan:", out.length, out.join(" ")); b.cerrar(); })();
