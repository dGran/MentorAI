const { abrir } = require("./cdp.js");
const [BASE, PAG, OUT, SEL] = process.argv.slice(2);
(async () => { const b = await abrir(9486); await b.ancho(1280, 900, false); await b.ir(`${BASE}/tutorials/${PAG}.html`, 1800);
  await b.evaluar("document.documentElement.style.scrollBehavior='auto'; 1"); await b.evaluar(`(() => { const e = document.querySelector('${SEL}'); const y = e.getBoundingClientRect().top + scrollY - 90; window.scrollTo(0, y); return y; })()`); await b.sleep(1200);
  await b.captura(OUT); b.cerrar(); })();
