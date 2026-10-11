const { abrir } = require("./cdp.js");
const [BASE, ...slugs] = process.argv.slice(2);
const MEDIR = `(() => { const r = {}; for (const [k, sel] of [["p", "article.prose > p"], ["li", "article.prose > ul > li"], ["callout", ".callout__body p"]]) { const vals = []; for (const e of document.querySelectorAll(sel)) { const lh = parseFloat(getComputedStyle(e).lineHeight); const n = Math.round(e.getBoundingClientRect().height / lh); if (n < 3) continue; vals.push(e.textContent.replace(/\\s+/g, " ").trim().length / (n - 0.5)); } r[k] = vals.length ? Math.round(Math.max(...vals)) : "-"; } return r; })()`;
(async () => { const b = await abrir(9455); await b.ancho(1280, 900, false);
 for (const s of slugs) { await b.ir(`${BASE}/tutorials/${s}.html`, 900); console.log(s, "máx car/línea", JSON.stringify(await b.evaluar(MEDIR))); }
 b.cerrar(); })();
