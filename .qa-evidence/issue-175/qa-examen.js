const path = require("path"), fs = require("fs");
const { abrir } = require("./cdp.js");
const [, , salida, base, ...casos] = process.argv;
const datos = {};
global.window = datos;
for (const fichero of ["courses", "quizzes"]) require(path.join(process.cwd(), "tutorials", `${fichero}.js`));
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
const leccionesDe = (curso) => (Array.isArray(curso.lessons) ? curso.lessons : (curso.modules ?? []).flatMap((modulo) => modulo.lessons ?? []));

async function esperarA(navegador, condicion, ms = 8000) {
  for (let transcurrido = 0; transcurrido < ms; transcurrido += 200) {
    if (await navegador.evaluar(condicion)) return true;

    await esperar(200);
  }

  return false;
}

(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const navegador = await abrir(9420);
  const medidas = [];
  try {
    for (const caso of casos) {
      const [slugDelCurso, idsNuevos = ""] = caso.split("|");
      const curso = datos.MENTORAI_COURSES.find((candidato) => candidato.slug === slugDelCurso);
      const preguntas = datos.MENTORAI_QUIZZES[slugDelCurso].questions;
      const textosNuevos = idsNuevos.split(",").filter(Boolean).map((id) => preguntas.find((pregunta) => pregunta.id === id)?.q ?? `(id ${id} no está en quizzes.js)`);
      const leccion = leccionesDe(curso).at(-1);
      await navegador.ancho(1280, 900, false);
      await navegador.ir(`${base}/tutorials/${leccion}.html#quiz`, 1500);
      const pintado = await esperarA(navegador, `document.querySelectorAll(".quiz__question").length === ${preguntas.length}`);
      const medida = await navegador.evaluar(`(() => {
        const textos = [...document.querySelectorAll(".quiz__question-text")].map((nodo) => nodo.textContent.replace(/^\\s*\\d+\\.\\s*/, "").trim());
        return {
          curso: ${JSON.stringify(slugDelCurso)},
          leccion: ${JSON.stringify(leccion)},
          esperadas: ${preguntas.length},
          pintadas: textos.length,
          cabeceraConTotal: document.querySelector(".quiz__header")?.textContent.includes("${preguntas.length} preguntas") ?? false,
          nuevasAusentes: ${JSON.stringify(textosNuevos)}.filter((texto) => !textos.includes(texto)),
        };
      })()`);
      medida.pintado = pintado;
      await navegador.evaluar(`document.getElementById("quiz")?.scrollIntoView({ block: "start", behavior: "instant" })`);
      await esperar(300);
      await navegador.captura(path.join(salida, `${slugDelCurso}-examen.png`));
      await navegador.evaluar(`(() => {
        for (const pregunta of document.querySelectorAll(".quiz__question")) pregunta.querySelector('input[value="' + pregunta.dataset.correct + '"]').click();
        document.querySelector(".quiz__submit").click();
      })()`);
      await esperarA(navegador, `!document.getElementById("quiz-result").hidden`);
      medida.resultado = await navegador.evaluar(`document.getElementById("quiz-result").textContent.replace(/\\s+/g, " ").trim().slice(0, 160)`);
      medida.notaMaxima = medida.resultado.includes(`${preguntas.length}/${preguntas.length}`);
      await navegador.evaluar(`document.getElementById("quiz-result").scrollIntoView({ block: "center", behavior: "instant" })`);
      await esperar(300);
      await navegador.captura(path.join(salida, `${slugDelCurso}-resultado.png`));
      await navegador.ancho(320, 800, true);
      await navegador.ir(`${base}/tutorials/${leccion}.html#quiz`, 1500);
      await esperarA(navegador, `document.querySelectorAll(".quiz__question").length > 0`);
      medida.movil320 = await navegador.evaluar(`({ ancho: document.documentElement.scrollWidth, viewport: innerWidth })`);
      medidas.push(medida);
    }
  } finally {
    await navegador.cerrar();
  }
  const fallos = medidas.flatMap((m) => [
    !m.pintado && `${m.curso}: pinta ${m.pintadas} de ${m.esperadas} preguntas`,
    !m.cabeceraConTotal && `${m.curso}: la cabecera no dice ${m.esperadas} preguntas`,
    m.nuevasAusentes.length > 0 && `${m.curso}: faltan ${m.nuevasAusentes.length} preguntas nuevas`,
    !m.notaMaxima && `${m.curso}: respondiendo bien no da el máximo («${m.resultado}»)`,
    m.movil320.ancho > m.movil320.viewport && `${m.curso}: desborde 320`,
  ].filter(Boolean));

  if (navegador.consola.length) fallos.push(`consola: ${navegador.consola.length}`);

  fs.writeFileSync(path.join(salida, "medidas.json"), JSON.stringify({ base, medidas, erroresConsola: navegador.consola }, null, 2));
  console.log(fallos.length ? `FALLOS: ${fallos.join("; ")}` : "verificado", "—", medidas.map((m) => `${m.curso} ${m.pintadas}/${m.esperadas} máx ${m.notaMaxima ? "✓" : "✗"}`).join(" · "));
})();
