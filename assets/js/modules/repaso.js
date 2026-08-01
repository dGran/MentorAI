/* ============================================================
   MentorAI — Repaso espaciado
   Lo leído se olvida; lo recuperado a intervalos crecientes se queda.
   Cada pregunta que respondes (en un check o en un examen) entra en una
   cola con su próxima fecha: acertar la aleja, fallar la trae de vuelta.

   Intervalos en días: 1 → 3 → 7 → 16 → 35 → 70. Fallar vuelve al primero.

   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const KEY = "academia-repaso";
  const STEPS = [1, 3, 7, 16, 35, 70];
  const DAY = 24 * 60 * 60 * 1000;

  /* ---------- Persistencia ----------
     Entrada por pregunta: { s: paso, d: fecha de repaso, f: fallos } */

  function readAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) ?? {};
    } catch {
      return {};
    }
  }

  function writeAll(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* sin espacio: el repaso deja de recordarse, la app sigue */
    }
  }

  function startOfToday() {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }

  /* ---------- Registro de respuestas ---------- */

  function record(id, wasCorrect) {
    const state = readAll();
    const previous = state[id] ?? { s: 0, f: 0 };
    const step = wasCorrect ? Math.min(previous.s + 1, STEPS.length - 1) : 0;

    state[id] = {
      s: step,
      d: startOfToday() + STEPS[step] * DAY,
      f: previous.f + (wasCorrect ? 0 : 1),
    };

    writeAll(state);
  }

  /* ---------- Índice de preguntas ----------
     Las preguntas viven en checks.js y quizzes.js; aquí solo se guardan
     identificadores, y se resuelven contra esas fuentes al repasar. */

  function questionIndex() {
    const index = {};

    for (const [slug, questions] of Object.entries(window.MENTORAI_CHECKS ?? {})) {
      questions.forEach((question, position) => {
        index[`c:${slug}:${position}`] = { question, source: slug };
      });
    }

    for (const [course, quiz] of Object.entries(window.MENTORAI_QUIZZES ?? {})) {
      (quiz.questions ?? []).forEach((question, position) => {
        index[`q:${course}:${position}`] = { question, source: question.lesson ?? null };
      });
    }

    return index;
  }

  /* ---------- Cola de hoy ---------- */

  function dueIds(state = readAll()) {
    const limit = startOfToday() + DAY - 1;

    return Object.keys(state).filter((id) => state[id].d <= limit);
  }

  function dueQuestions() {
    const index = questionIndex();

    return dueIds()
      .filter((id) => index[id])
      .map((id) => ({ id, ...index[id] }));
  }

  function stats() {
    const state = readAll();
    const ids = Object.keys(state);
    const dominadas = ids.filter((id) => state[id].s >= STEPS.length - 1).length;

    return { total: ids.length, due: dueIds(state).length, dominadas };
  }

  /* ---------- Tarjeta del inicio ---------- */

  function renderHome() {
    const host = document.getElementById("home-repaso");

    if (!host) return;

    const { total, due, dominadas } = stats();

    if (total === 0) {
      host.hidden = true;
      return;
    }

    const base = location.pathname.includes("/tutorials/") ? "../" : "";
    const cuerpo =
      due === 0
        ? `<p class="repaso-card__copy">Nada que repasar hoy. Llevas ${total} preguntas en seguimiento y ${dominadas} dominadas.</p>`
        : `<p class="repaso-card__copy">${due} pregunta${
            due === 1 ? "" : "s"
          } esperando. Son de lo que ya estudiaste: recuperarlas ahora es lo que las fija.</p>
           <a class="btn btn--primary" href="${base}repaso.html">Repasar ahora</a>`;

    host.innerHTML = `<div class="repaso-card">
      <div class="repaso-card__body">
        <h2 class="repaso-card__title">Repaso de hoy</h2>
        ${cuerpo}
      </div>
    </div>`;
    host.hidden = false;
  }

  /* ---------- Sesión de repaso ---------- */

  function optionsHtml(question, index) {
    const escapeHtml = MentorAI.escapeHtml;

    return question.o
      .map(
        (option, position) =>
          `<button type="button" class="check__option" data-question="${index}" data-option="${position}">${escapeHtml(
            option
          )}</button>`
      )
      .join("");
  }

  function cardHtml(entry, index) {
    const { escapeHtml } = MentorAI;
    const { question, source } = entry;
    const origen = source
      ? `<a class="repaso-item__source" href="tutorials/${escapeHtml(source)}.html">Ver la lección</a>`
      : "";

    return `<li class="check__item repaso-item" data-correct="${question.a}" data-id="${escapeHtml(
      entry.id
    )}">
      <p class="check__question">${escapeHtml(question.q)}</p>
      <div class="check__options">${optionsHtml(question, index)}</div>
      <p class="check__why" hidden>${escapeHtml(question.w ?? "")} ${origen}</p>
    </li>`;
  }

  function renderPage() {
    const host = document.getElementById("repaso");

    if (!host) return;

    const pending = dueQuestions();

    if (pending.length === 0) {
      const { total, dominadas } = stats();
      host.innerHTML =
        total === 0
          ? `<p class="repaso-empty">Todavía no hay nada que repasar. Responde las comprobaciones al final de las lecciones y aparecerán aquí, espaciadas en el tiempo.</p>`
          : `<p class="repaso-empty">Hoy no toca repasar nada. Llevas <strong>${total}</strong> preguntas en seguimiento y <strong>${dominadas}</strong> dominadas.</p>`;
      return;
    }

    host.innerHTML = `
      <p class="repaso-lead">${pending.length} pregunta${
        pending.length === 1 ? "" : "s"
      } para hoy. Responde de memoria: fallar no penaliza, solo la trae de vuelta antes.</p>
      <ol class="check__list">${pending.map(cardHtml).join("")}</ol>
      <p class="repaso-done" id="repaso-done" hidden>Repaso terminado. Las que has acertado vuelven más adelante; las falladas, mañana.</p>`;

    wire(host, pending.length);
  }

  function wire(host, total) {
    let answered = 0;

    host.addEventListener("click", (event) => {
      const button = event.target.closest(".check__option");

      if (!button) return;

      const item = button.closest(".repaso-item");

      if (item.classList.contains("is-answered")) return;

      const correct = Number(item.dataset.correct);
      const chosen = Number(button.dataset.option);
      const options = [...item.querySelectorAll(".check__option")];

      options[correct].classList.add("check__option--correct");

      if (chosen !== correct) {
        button.classList.add("check__option--wrong");
      }

      for (const option of options) {
        option.disabled = true;
      }

      const why = item.querySelector(".check__why");

      if (why) why.hidden = false;

      item.classList.add("is-answered");
      record(item.dataset.id, chosen === correct);

      answered += 1;

      if (answered === total) {
        const done = document.getElementById("repaso-done");

        if (done) done.hidden = false;
      }
    });
  }

  /* ---------- Enlace en la navegación ----------
     Se inyecta como el de "Sin conexión", para no tener que tocar los
     200 HTML del catálogo. Muestra el número de preguntas pendientes. */

  function injectNavLink() {
    const nav = document.querySelector(".nav__actions");

    if (!nav || nav.querySelector(".repaso-nav-link")) return;

    const { due } = stats();
    const base = location.pathname.includes("/tutorials/") ? "../" : "";
    const link = document.createElement("a");

    link.className = "nav__link repaso-nav-link";
    link.href = `${base}repaso.html`;
    link.textContent = due > 0 ? `Repaso (${due})` : "Repaso";

    if (/\brepaso\.html\b/.test(location.pathname)) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }

    nav.insertBefore(link, nav.querySelector(".offline-nav-link") ?? nav.querySelector(".theme-toggle"));
  }

  /* ---------- API pública ---------- */

  MentorAI.Repaso = {
    record,
    stats,
    dueQuestions,
    renderHome,
    renderPage,
    init: injectNavLink,
  };
})();
