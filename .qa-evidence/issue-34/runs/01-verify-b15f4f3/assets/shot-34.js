const { abrir } = require("./cdp.js");
const [BASE, PAG, OUT, SCROLL] = process.argv.slice(2);
(async () => { const b = await abrir(9480); await b.ancho(1280, 900, false); await b.ir(`${BASE}/tutorials/${PAG}.html`, 1800);
  if (SCROLL) { await b.evaluar(`(document.querySelector("${SCROLL}")||document.body).scrollIntoView(); scrollBy(0,-90); 1`); await b.sleep(400); }
  await b.captura(OUT); b.cerrar(); })();
