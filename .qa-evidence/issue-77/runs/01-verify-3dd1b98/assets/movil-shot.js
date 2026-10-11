const { abrir } = require("./cdp.js");
const fs = require("fs");
const [URL, SELECTOR, OUT, ANCHO] = process.argv.slice(2);
(async () => { const b = await abrir(9418); const w = +ANCHO || 375; await b.ancho(w); await b.ir(URL, 800);
const r = await b.evaluar(`(() => { const r = document.querySelector(${JSON.stringify(SELECTOR)}).getBoundingClientRect(); return { y: r.top + scrollY - 16, h: Math.min(r.height + 32, 900) }; })()`);
const s = await b.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: r.y, width: w, height: r.h, scale: 1 } });
fs.writeFileSync(OUT, Buffer.from(s.result.data, "base64")); b.cerrar(); })();
