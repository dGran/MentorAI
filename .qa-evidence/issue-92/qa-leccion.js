const path = require("path"), fs = require("fs");
const { abrir } = require("./cdp.js");
const [, , salida, base, curso, anterior, lecciones, vecinas = ""] = process.argv;
const esperarA = async (b, condicion, ms = 6000) => { for (let t = 0; t < ms; t += 200) { if (await b.evaluar(condicion)) return true; await b.sleep(200); } return false; };
(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const nuevas = lecciones.split(",");
  const b = await abrir(9417);
  const r = { lecciones: [], vecinas: [] };
  try {
    await b.ancho(1280, 900, false);
    await b.ir(`${base}/curso.html?slug=${curso}`, 1500);
    r.ordenEnCurso = await b.evaluar(`[...document.querySelectorAll('.course-modules a[href^="tutorials/"]')].map((a) => a.getAttribute("href").replace("tutorials/", "").replace(".html", ""))`);
    r.tras = r.ordenEnCurso[r.ordenEnCurso.indexOf(nuevas[0]) - 1] ?? null;
    r.colocadaTrasLaPrevista = r.tras === anterior;
    for (const leccion of nuevas) {
      await b.ir(`${base}/tutorials/${leccion}.html#check`, 1500);
      await esperarA(b, `document.querySelectorAll(".check__item").length > 0`);
      r.lecciones.push(await b.evaluar(`(() => ({ leccion: ${JSON.stringify(leccion)}, h1: document.querySelector("h1")?.textContent.trim(), checks: document.querySelectorAll(".check__item").length, cuandoConAncla: !!document.querySelector('#cuando a.anchor[href="#cuando"]'), migaConCurso: [...document.querySelectorAll("nav a, .breadcrumb a")].some((a) => (a.getAttribute("href") ?? "").includes("slug=${curso}")) }))()`));
      await b.evaluar(`window.scrollTo(0, 0)`);
      await b.captura(path.join(salida, `leccion-${leccion}.png`));
    }
    for (const vecina of vecinas.split(",").filter(Boolean)) {
      await b.ir(`${base}/tutorials/${vecina}.html`, 1200);
      const destino = await b.evaluar(`(() => { const a = [...document.querySelectorAll(".prose a")].find((x) => ${JSON.stringify(nuevas)}.some((n) => (x.getAttribute("href") ?? "").startsWith(n + ".html"))); if (!a) return null; a.scrollIntoView({ block: "center", behavior: "instant" }); const c = a.getClientRects()[0]; return { href: a.getAttribute("href"), x: c.left + Math.min(c.width / 2, 10), y: c.top + c.height / 2 }; })()`);

      if (!destino) {
        r.vecinas.push({ vecina, enlace: null });
        continue;
      }

      await b.clic(destino.x, destino.y);
      await b.sleep(800);
      r.vecinas.push({ vecina, enlace: destino.href, llegaA: await b.evaluar("location.pathname.split('/').pop()") });
    }
    await b.ancho(320, 800, true);
    await b.ir(`${base}/tutorials/${nuevas[0]}.html`, 1500);
    r.movil320 = await b.evaluar(`({ ancho: document.documentElement.scrollWidth, viewport: innerWidth })`);
  } finally {
    await b.cerrar();
  }
  r.erroresConsola = b.consola;
  fs.writeFileSync(path.join(salida, "medidas.json"), JSON.stringify({ base, ...r }, null, 2));
  const fallos = [];
  if (!r.colocadaTrasLaPrevista) fallos.push(`colocada tras ${r.tras}`);
  for (const l of r.lecciones) if (l.checks < 2 || !l.cuandoConAncla) fallos.push(`lección ${l.leccion}`);
  for (const v of r.vecinas) if (!v.enlace || !nuevas.includes(v.llegaA.replace(".html", ""))) fallos.push(`vecina ${v.vecina}`);
  if (r.movil320.ancho > r.movil320.viewport) fallos.push("desborde 320");
  if (r.erroresConsola.length) fallos.push("consola");
  console.log(fallos.length ? `FALLOS: ${fallos.join("; ")}` : "verificado", `— tras ${r.tras}; checks ${r.lecciones.map((l) => l.checks).join("·")}; vecinas ${r.vecinas.map((v) => `${v.vecina}→${v.llegaA}`).join(", ") || "—"}; 320 px ${r.movil320.ancho}; consola ${r.erroresConsola.length}`);
})();
