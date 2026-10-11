const { abrir } = require("./cdp.js");
const [BASE] = process.argv.slice(2);
(async () => { const b = await abrir(9460); await b.ancho(1280, 900, false);
  await b.ir(`${BASE}/rutas.html`, 1500);
  const antes = await b.evaluar(`!!window.MENTORAI_QUIZZES`);
  await b.evaluar(`(() => { const x = document.createElement("button"); x.dataset.examenRuta = "backend-cimientos"; document.getElementById("paths").append(x); x.click(); return 1; })()`); await b.sleep(2000);
  console.log("quizzes cargado antes:", antes, "· después:", await b.evaluar(`!!window.MENTORAI_QUIZZES`), "· preguntas del examen:", await b.evaluar(`document.querySelectorAll("#examen-ruta-form .quiz__question").length`), "· errores:", b.consola.length ? JSON.stringify(b.consola) : 0);
  b.cerrar(); })();
