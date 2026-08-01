/* ============================================================
   MentorAI — Examen final de ruta
   Los exámenes de curso miden una asignatura; este mide la carrera. Toma
   una muestra de preguntas de todos los cursos de la ruta, sin avisar de
   cuál viene de dónde, que es como se examina de verdad.

   Solo se ofrece cuando la ruta está terminada: antes no mide nada útil.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const POR_CURSO = 4;
  const CORTE = 0.7;

  const storageKey = (slug) => `academia-examen-ruta-${slug}`;

  function loadResult(slug) {
    try {
      return JSON.parse(localStorage.getItem(storageKey(slug))) ?? null;
    } catch {
      return null;
    }
  }

  function saveResult(slug, score, total) {
    const previous = loadResult(slug) ?? { attempts: 0, best: 0 };
    const updated = {
      attempts: previous.attempts + 1,
      best: Math.max(previous.best, score),
      total,
      passed: previous.passed || score >= Math.ceil(total * CORTE),
    };

    try {
      localStorage.setItem(storageKey(slug), JSON.stringify(updated));
    } catch {
      /* sin espacio: el examen sigue siendo usable */
    }

    return updated;
  }

  /* ---------- Selección de preguntas ---------- */

  function shuffled(list) {
    const copy = [...list];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));

      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }

    return copy;
  }

  function pathBySlug(slug) {
    return (window.MENTORAI_PATHS ?? []).find((path) => path.slug === slug);
  }

  function coursesOf(path) {
    return (path.steps ?? [])
      .filter((step) => step.type === "course")
      .map((step) => step.ref)
      .filter((ref) => (window.MENTORAI_QUIZZES ?? {})[ref]?.questions?.length);
  }

  /* Muestra equilibrada: unas pocas de cada curso, no todas las de uno. */
  function sample(path) {
    const quizzes = window.MENTORAI_QUIZZES ?? {};

    const preguntas = coursesOf(path).flatMap((course) =>
      shuffled(quizzes[course].questions)
        .slice(0, POR_CURSO)
        .map((question) => ({ ...question, course }))
    );

    return shuffled(preguntas).map((question) => {
      const order = shuffled(question.o.map((_option, index) => index));

      return {
        text: question.q,
        options: order.map((original) => question.o[original]),
        correct: order.indexOf(question.a),
        why: question.w ?? "",
        lesson: question.lesson ?? null,
      };
    });
  }

  /* ---------- Disponibilidad ---------- */

  function readiness(path) {
    const stats = MentorAI.Paths.pathProgress(
      path,
      Object.fromEntries((window.ACADEMIA_TUTORIALS ?? []).map((t) => [t.slug, t]))
    );
    const cursos = coursesOf(path);

    return {
      ready: stats.published > 0 && stats.done === stats.published,
      stats,
      cursos: cursos.length,
      preguntas: Math.min(
        cursos.length * POR_CURSO,
        cursos.reduce((n, c) => n + window.MENTORAI_QUIZZES[c].questions.length, 0)
      ),
    };
  }

  /* ---------- Render ---------- */

  function questionHtml(question, index) {
    const escapeHtml = MentorAI.escapeHtml;
    const options = question.options
      .map(
        (option, position) =>
          `<label class="quiz__option"><input type="radio" name="r${index}" value="${position}"><span>${escapeHtml(
            option
          )}</span></label>`
      )
      .join("");

    const repaso = question.lesson
      ? ` <a class="quiz__review" href="tutorials/${escapeHtml(
          question.lesson
        )}.html">Repasar la lección</a>`
      : "";

    return `<div class="quiz__question" data-correct="${question.correct}">
      <p class="quiz__question-text"><strong>${index + 1}.</strong> ${escapeHtml(
        question.text
      )}</p>
      <div class="quiz__options">${options}</div>
      <p class="quiz__why" hidden>${escapeHtml(question.why)}${repaso}</p>
    </div>`;
  }

  function panelHtml(path) {
    const { escapeHtml } = MentorAI;
    const estado = readiness(path);
    const saved = loadResult(path.slug);

    if (estado.cursos === 0) return "";

    if (!estado.ready) {
      return `<aside class="exam-panel exam-panel--pending">
        <div class="exam-panel__body">
          <h3 class="exam-panel__title">Examen final de «${escapeHtml(path.title)}»</h3>
          <p class="exam-panel__copy">Se abre al terminar la ruta: llevas ${
            estado.stats.done
          } de ${estado.stats.published} lecciones. Serán ${
            estado.preguntas
          } preguntas mezcladas de los ${estado.cursos} cursos, sin decirte de cuál viene cada una.</p>
        </div>
      </aside>`;
    }

    const historial = saved
      ? `<p class="exam-panel__copy">Mejor resultado: <strong>${saved.best}/${saved.total}</strong> en ${
          saved.attempts
        } intento${saved.attempts === 1 ? "" : "s"}${saved.passed ? " · superado" : ""}.</p>`
      : "";

    return `<aside class="exam-panel exam-panel--${saved?.passed ? "passed" : "failed"}">
      <div class="exam-panel__body">
        <h3 class="exam-panel__title">Examen final de «${escapeHtml(path.title)}»</h3>
        <p class="exam-panel__copy">Ruta terminada. ${
          estado.preguntas
        } preguntas mezcladas de los ${estado.cursos} cursos.</p>
        ${historial}
      </div>
      <button type="button" class="btn btn--primary" data-examen-ruta="${escapeHtml(
        path.slug
      )}">${saved ? "Repetir el examen" : "Hacer el examen"}</button>
    </aside>`;
  }

  /* ---------- Sesión ---------- */

  function start(path, host) {
    const preguntas = sample(path);
    const corte = Math.ceil(preguntas.length * CORTE);

    host.innerHTML = `<section class="quiz" id="examen-ruta">
      <div class="quiz__header">
        <h2>Examen final · ${MentorAI.escapeHtml(path.title)}</h2>
        <p>${preguntas.length} preguntas de toda la ruta &middot; mínimo ${corte}/${
          preguntas.length
        } para superar</p>
      </div>
      <form class="quiz__form" id="examen-ruta-form">
        ${preguntas.map(questionHtml).join("")}
        <div class="quiz__actions">
          <button type="submit" class="quiz__submit">Comprobar respuestas</button>
        </div>
      </form>
      <div class="quiz__result" id="examen-ruta-result" hidden></div>
    </section>`;

    const form = document.getElementById("examen-ruta-form");
    const resultEl = document.getElementById("examen-ruta-result");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const bloques = [...form.querySelectorAll(".quiz__question")];
      let score = 0;
      let faltan = false;

      bloques.forEach((bloque, index) => {
        const elegida = form.querySelector(`input[name='r${index}']:checked`);

        if (!elegida) {
          faltan = true;
          return;
        }

        const correcta = Number(bloque.dataset.correct);
        const respuesta = Number(elegida.value);
        const opciones = bloque.querySelectorAll(".quiz__option");

        bloque.querySelectorAll("input").forEach((input) => {
          input.disabled = true;
        });

        opciones[correcta].classList.add("quiz__option--correct");

        if (respuesta !== correcta) {
          opciones[respuesta].classList.add("quiz__option--wrong");
        } else {
          score += 1;
        }

        const why = bloque.querySelector(".quiz__why");

        if (why) why.hidden = false;
      });

      if (faltan) {
        resultEl.innerHTML =
          '<p class="quiz__warning">Responde todas las preguntas antes de comprobar.</p>';
        resultEl.hidden = false;
        return;
      }

      const saved = saveResult(path.slug, score, preguntas.length);
      const aprobado = score >= corte;

      form.querySelector(".quiz__actions").hidden = true;
      resultEl.innerHTML = `<div class="quiz__score quiz__score--${aprobado ? "pass" : "fail"}">
        <span class="quiz__score-number">${score}/${preguntas.length}</span>
        <span class="quiz__score-label">${aprobado ? "¡Aprobado!" : "No superado"}</span>
      </div>
      <p>${
        aprobado
          ? "Has superado el examen de toda la ruta. Eso ya no es haber leído: es saberlo."
          : `Necesitas ${corte}/${preguntas.length}. Las explicaciones de arriba enlazan a las lecciones que conviene repasar.`
      }</p>`;
      resultEl.hidden = false;
      resultEl.scrollIntoView({ behavior: "smooth", block: "center" });

      MentorAI.Repaso?.record(`ruta:${path.slug}`, aprobado);
    });

    host.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- Punto de entrada ---------- */

  function render() {
    const host = document.getElementById("paths");

    if (!host || !Array.isArray(window.MENTORAI_PATHS)) return;

    for (const path of window.MENTORAI_PATHS) {
      const seccion = host.querySelector(`#ruta-${CSS.escape(encodeURIComponent(path.slug))}`);

      if (seccion) seccion.insertAdjacentHTML("beforeend", panelHtml(path));
    }

    host.addEventListener("click", (event) => {
      const boton = event.target.closest("[data-examen-ruta]");

      if (!boton) return;

      const path = pathBySlug(boton.dataset.examenRuta);

      if (!path) return;

      const contenedor = document.getElementById("examen-ruta-host");

      if (contenedor) start(path, contenedor);
    });
  }

  MentorAI.ExamenRuta = { render, readiness, loadResult };
})();
