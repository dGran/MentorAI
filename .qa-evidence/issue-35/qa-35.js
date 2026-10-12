const path = require("path"), fs = require("fs");
const { abrir } = require("./cdp.js");
const [, , salida, base = "http://localhost:8000"] = process.argv;
const LECCIONES = ["sec-autorizacion", "sec-validacion-y-asignacion-masiva", "sec-ssrf", "sec-subida-de-ficheros", "sec-fuerza-bruta-y-limites", "sec-csrf-moderno", "sec-secretos-y-cadena-de-suministro", "sec-logging-seguro"];
const esperarA = async (b, condicion, ms = 6000) => { for (let t = 0; t < ms; t += 200) { if (await b.evaluar(condicion)) return true; await b.sleep(200); } return false; };
(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const b = await abrir(9415);
  const r = {};
  try {
    await b.ancho(1280, 900, false);
    await b.ir(`${base}/cursos.html`, 1200);
    r.tarjetaEnCursos = await b.evaluar(`(() => { const a = document.querySelector('a.course-card[href*="seguridad-backend"]'); return a ? { visible: a.getBoundingClientRect().height > 0, texto: a.textContent.replace(/\\s+/g, " ").trim().slice(0, 120), nivel: a.dataset.level } : null; })()`);
    await b.ir(`${base}/curso.html?slug=seguridad-backend`, 1500);
    r.curso = await b.evaluar(`(() => ({ titulo: document.querySelector(".course-hero h1")?.textContent.trim(), modulos: [...document.querySelectorAll(".course-modules > *")].length, enlaces: [...document.querySelectorAll('.course-modules a[href*="sec-"]')].map((a) => a.getAttribute("href")) }))()`);
    await b.evaluar(`window.scrollTo(0, document.body.scrollHeight)`);
    await esperarA(b, `document.body.textContent.includes("Ponlo en práctica")`);
    r.retos = await b.evaluar(`(() => { const t = document.body.textContent; return ["El test de los dos usuarios", "Valida la IP, no la URL", "Audita un lock con avisos"].map((titulo) => ({ titulo, presente: t.includes(titulo) })); })()`);
    await b.evaluar(`window.scrollTo(0, 0)`);
    await b.captura(path.join(salida, "criterio-01-ficha-del-curso.png"));
    r.lecciones = [];
    for (const leccion of LECCIONES) {
      await b.ir(`${base}/tutorials/${leccion}.html#check`, 1500);
      await esperarA(b, `document.querySelectorAll(".check__item").length > 0`);
      r.lecciones.push(await b.evaluar(`(() => ({ leccion: ${JSON.stringify(leccion)}, checks: document.querySelectorAll(".check__item").length, quiz: document.querySelectorAll(".quiz__question").length, h1: document.querySelector("h1")?.textContent.trim(), cuandoConAncla: !!document.querySelector('#cuando a.anchor[href="#cuando"]'), anchoPagina: document.documentElement.scrollWidth }))()`));
    }
    const conExamen = r.lecciones.find((l) => l.quiz > 0)?.leccion;
    r.leccionDelExamen = conExamen ?? null;

    if (conExamen) {
      await b.ir(`${base}/tutorials/${conExamen}.html#quiz`, 1500);
      await esperarA(b, `document.querySelectorAll(".quiz__question").length > 0`);
      await b.evaluar(`document.getElementById("quiz").scrollIntoView({ block: "start", behavior: "instant" })`);
      await b.sleep(300);
      await b.captura(path.join(salida, "criterio-01-examen.png"));
    }

    await b.ir(`${base}/rutas.html`, 1500);
    r.rutas = await b.evaluar(`(() => [...document.querySelectorAll("details.path")].map((d) => { const refs = [...d.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")); const i = refs.findIndex((h) => h.includes("seguridad-backend")); return { ruta: d.id, posicion: i, anterior: i > 0 ? refs[i - 1] : null }; }).filter((x) => x.posicion >= 0))()`);
    await b.ancho(320, 800, true);
    await b.ir(`${base}/tutorials/sec-ssrf.html`, 1500);
    r.movil320 = await b.evaluar(`({ ancho: document.documentElement.scrollWidth, viewport: innerWidth })`);
    await b.captura(path.join(salida, "criterio-01-leccion-320px.png"));
  } finally {
    await b.cerrar();
  }
  r.erroresConsola = b.consola;
  fs.writeFileSync(path.join(salida, "medidas.json"), JSON.stringify({ base, ...r }, null, 2));
  console.log(JSON.stringify(r, null, 2));
})();
