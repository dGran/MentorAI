const { abrir } = require("./cdp.js");
const [BASE] = process.argv.slice(2);
const JS = `(() => { const r = performance.getEntriesByType("resource").filter(e => /\\.js(\\?|$)/.test(e.name)); const kb = Math.round(r.reduce((n, e) => n + (e.decodedBodySize || 0), 0) / 1024); const datos = r.map(e => e.name.split("/").pop()).filter(n => /^(quizzes|checks|practica|quiz-summary)\\.js/.test(n)).sort(); return kb + " KB · datos: " + datos.join(",") ; })()`;
(async () => { const b = await abrir(9458); await b.ancho(1280, 900, false); const out = [];
  await b.ir(`${BASE}/index.html`, 800);
  await b.evaluar(`localStorage.clear(); localStorage.setItem("academia-progress", JSON.stringify(["git-comandos-esenciales","git-ramas-y-flujo","git-deshacer","bits-y-bytes"])); localStorage.setItem("academia-repaso", JSON.stringify({ "c:sql-joins:x": { s: 0, d: 0 } })); 1`);
  for (const pag of ["index.html", "rutas.html", "cursos.html", "articulos.html", "curso.html?slug=git", "repaso.html", "tutorials/sql-joins.html", "tutorials/git-deshacer.html"]) {
    await b.ir(`${BASE}/${pag}`, 1800);
    const extra = await b.evaluar(`(() => { const t = (s) => document.querySelectorAll(s).length; return "insignias " + t(".exam-badge") + " · examenes-inicio " + t("#home-exams .exam-row, #home-exams li") + " · panel-curso " + t(".exam-panel") + " · practica " + t(".practica__reto, .practica .reto, [class*=practica__]") + " · checks " + t(".check__item") + " · quiz " + t("#quiz-form .quiz__question") + " · repaso-nav «" + ((document.querySelector(".repaso-nav-link") || {}).textContent || "") + "»"; })()`);
    out.push(`${pag}: ${await b.evaluar(JS)} · ${extra}`);
  }
  await b.ir(`${BASE}/rutas.html#ruta-backend-cimientos`, 1500);
  const boton = await b.evaluar(`(() => { const x = document.querySelector("#ruta-backend-cimientos [data-examen-ruta]"); return x ? (x.click(), "pulsado") : "sin botón"; })()`); await b.sleep(1500);
  out.push("examen de ruta: " + boton + " · preguntas " + await b.evaluar(`document.querySelectorAll("#examen-ruta-form .quiz__question").length`) + " · " + await b.evaluar(JS));
  out.push("errores de consola: " + (b.consola.length ? JSON.stringify(b.consola) : 0));
  console.log(out.join("\n")); b.cerrar(); })();
