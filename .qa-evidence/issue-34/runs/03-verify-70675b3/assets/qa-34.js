const { abrir } = require("./cdp.js");
const [BASE, PUERTO, ...PAGINAS] = process.argv.slice(2);
const MEDIDA = `(() => { const n = (s) => document.querySelectorAll(s).length; const pre = n("article.prose pre"); const enBloque = n("article.prose .code-block pre"); const sueltos = [...document.querySelectorAll("article.prose .callout")].filter(c => !c.querySelector(".callout__body")).length;
  return { acciones: n(".tutorial-hero .tutorial-action"), escuchar: n(".tutorial-hero .tutorial-action:not(.tutorial-action--done):not(.tutorial-action--reset)"), migaEnlaces: n(".breadcrumb a"), cursoEnMiga: n(".breadcrumb a[href*='curso.html']"), togglesIndice: n(".toc__toggle"), toc: document.querySelector(".toc__title")?.textContent.trim(), preSueltos: pre - enBloque, calloutsSinCuerpo: sueltos, keypoints: n(".keypoints li span"), anclas: n("article.prose h2 .anchor"), desborde: document.documentElement.scrollWidth - innerWidth, errores: 0 }; })()`;
(async () => { const b = await abrir(Number(PUERTO)); const out = [];
  for (const pag of PAGINAS) for (const [w, h, movil] of [[1280, 900, false], [375, 812, true]]) {
    await b.ancho(w, h, movil); await b.ir(`${BASE}/tutorials/${pag}.html`, 1800);
    const m = await b.evaluar(MEDIDA); m.errores = b.consola.length; out.push(`${pag} @${w}: ${JSON.stringify(m)}`);
  }
  console.log(out.join("\n")); b.cerrar(); })();
