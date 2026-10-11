const { abrir } = require("./cdp.js");
const [BASE] = process.argv.slice(2);
const DATOS = `performance.getEntriesByType("resource").map(e => e.name).filter(n => /tutorials\\/(quizzes|checks)\\.js/.test(n)).map(n => n.split("/").pop()).join(",") || "ninguno"`;
(async () => { const b = await abrir(9464); await b.ancho(1280, 900, false);
  for (const pag of ["sql-joins", "inf-tls"]) {
    await b.ir(`${BASE}/tutorials/${pag}.html`, 1200);
    const id = await b.evaluar("document.querySelector('article.prose h2[id]').id");
    const alto = await b.evaluar("Math.round(document.body.scrollHeight)");
    await b.ir(`${BASE}/index.html`, 500); await b.ir(`${BASE}/tutorials/${pag}.html#${id}`, 2000);
    console.log(`${pag}#${id} (alto ${alto}): top`, await b.evaluar(`Math.round(document.getElementById('${id}').getBoundingClientRect().top)`), "· datos", await b.evaluar(DATOS));
  }
  b.cerrar(); })();
