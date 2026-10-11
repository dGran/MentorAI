const { abrir } = require("./cdp.js");
const [BASE] = process.argv.slice(2);
const visibles = `(() => { const v = (sel) => [...document.querySelectorAll(sel)].filter(e => e.getBoundingClientRect().height > 0).length; return { tarjetas: v(".course-card"), envoltorios: v(".course-card-wrap"), botones: v(".course-card-wrap button, .course-card-wrap .offline-btn") }; })()`;
(async () => { const b = await abrir(9452); await b.ancho(1280, 900, false); const out = [];
  await b.ir(`${BASE}/cursos.html`, 1800);
  out.push("todos: " + JSON.stringify(await b.evaluar(visibles)));
  for (const nivel of ["Principiante", "Intermedio", "Avanzado", "all"]) { await b.evaluar(`document.querySelector('[data-level-filter="${nivel}"]').click(); 1`); await b.sleep(200); out.push(nivel + ": " + JSON.stringify(await b.evaluar(visibles))); }
  await b.evaluar(`document.querySelector('[data-level-filter="Intermedio"]').click(); MentorAI.Courses.render(); MentorAI.Offline.initCourseButtons(); 1`); await b.sleep(300);
  out.push("tras repintado como el sync (Intermedio): " + JSON.stringify(await b.evaluar(visibles)) + " · barras " + await b.evaluar("document.querySelectorAll('.course-filters').length"));
  out.push("errores de consola: " + (b.consola.length ? JSON.stringify(b.consola) : 0));
  console.log(out.join("\n")); b.cerrar(); })();
