const { abrir } = require("./cdp.js");
const [BASE, OUT] = process.argv.slice(2);
(async () => { const b = await abrir(9477); await b.ancho(1280, 900, false);
  await b.ir(`${BASE}/curso.html?slug=k8s-para-devs`, 2500);
  const r = await b.evaluar(`(() => { const t = document.body.innerText; const i = t.indexOf("Provoca un OOMKilled"); const d = [...document.querySelectorAll("details")].find(x => x.textContent.includes("kubelet")); if (d) { d.open = true; d.scrollIntoView(); } return "reto visible: " + (i >= 0) + " · solución menciona kubelet: " + !!d + " · menciona «resucitó»: " + t.includes("resucitó"); })()`);
  await b.sleep(400); await b.captura(`${OUT}/practica-oomkilled.png`);
  console.log(r, "· errores", b.consola.length ? JSON.stringify(b.consola) : 0); b.cerrar(); })();
