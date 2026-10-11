const { abrir } = require("./cdp.js");
const [A, B] = process.argv.slice(2);
const SNAP = `[...document.querySelectorAll(".code-block, .code-block *, .copy-btn, .chip, .nav, .btn, .callout, .quiz, .check, .tutorial-action")].slice(0, 400).map(e => { const c = getComputedStyle(e); return [c.color, c.backgroundColor, c.borderTopColor, c.backgroundImage.slice(0, 60), c.boxShadow.slice(0, 50)].join("|"); }).join("\\n")`;
(async () => { const b = await abrir(9446); let distintas = 0;
 for (const tema of ["light", "dark"]) for (const pag of ["tutorials/sql-joins.html", "index.html", "cursos.html", "tutorials/go-interfaces.html"]) {
  const snaps = [];
  for (const raiz of [A, B]) { await b.ir(`file://${raiz}/${pag}`, 300); await b.evaluar(`localStorage.setItem("academia-theme", "${tema}"); 1`); await b.ir(`file://${raiz}/${pag}`, 1000); snaps.push(await b.evaluar(SNAP)); }
  const iguales = snaps[0] === snaps[1]; if (!iguales) distintas++;
  console.log(tema, pag, iguales ? "colores idénticos" : "DISTINTOS");
 }
 b.cerrar(); })();
