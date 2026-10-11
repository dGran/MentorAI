const { abrir } = require("./cdp.js");
const [BASE, OUT] = process.argv.slice(2);
(async () => { const b = await abrir(9457); const out = [];
 for (const [w, h] of [[1280, 900], [1024, 768], [375, 812], [320, 640]]) {
  await b.ancho(w, h, w < 600); await b.ir(`${BASE}/index.html`, 800); await b.evaluar("localStorage.clear(); 1"); await b.ir(`${BASE}/index.html`, 1500);
  await b.evaluar(`document.getElementById("home-search").focus(); 1`);
  for (const ch of "indice") { await b.send("Input.insertText", { text: ch }); await b.sleep(60); }
  await b.sleep(3500);
  const r = await b.evaluar(`(() => { const c = document.querySelector("#home-results .mini-card"); const rc = c.getBoundingClientRect(); return { scrollY: Math.round(scrollY), primeroTop: Math.round(rc.top), primeroBottom: Math.round(rc.bottom), viewport: innerHeight, visible: rc.top >= 0 && rc.top < innerHeight - 40, primeros: [...document.querySelectorAll("#home-results .mini-card")].slice(0, 4).map(x => (x.querySelector("h3, .mini-card__title, b") || x).textContent.trim().slice(0, 32)) }; })()`);
  out.push(`${w}x${h}: ` + JSON.stringify(r));
  if (OUT) await b.captura(`${OUT}/busqueda-${w}.png`);
 }
 out.push("errores de consola: " + (b.consola.length ? JSON.stringify(b.consola) : 0));
 console.log(out.join("\n")); b.cerrar(); })();
