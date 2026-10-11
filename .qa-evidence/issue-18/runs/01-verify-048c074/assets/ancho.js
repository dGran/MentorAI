const { abrir } = require("./cdp.js");
const [BASE, ...slugs] = process.argv.slice(2);
(async () => { const b = await abrir(9429); await b.ancho(1280, 900, false);
for (const s of slugs) { await b.ir(`${BASE}/tutorials/${s}.html`, 1000); console.log(s, await b.evaluar(`(() => { const W = document.documentElement.clientWidth; const r = [...document.querySelectorAll("article *")].map(e => [e, e.getBoundingClientRect().right]).filter(([, x]) => x > W).sort((a, b) => b[1] - a[1])[0]; return "exceso=" + (document.documentElement.scrollWidth - W) + (r ? " " + r[0].tagName + " " + r[0].textContent.slice(0, 60) : ""); })()`)); }
b.cerrar(); })();
