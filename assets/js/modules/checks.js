/* ============================================================
   MentorAI — Comprobación rápida al final de cada lección
   Recuperación activa: 2-3 preguntas justo después de leer, con
   corrección inmediata y el porqué. No bloquean nada — el portero sigue
   siendo el examen del curso; esto es para ti, no para aprobar.

   Guarda el resultado por pregunta en localStorage para poder alimentar
   el repaso espaciado más adelante.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const KEY = "academia-checks";

  /* ---------- Persistencia ---------- */

  function readAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) ?? {};
    } catch {
      return {};
    }
  }

  function saveResult(slug, results) {
    const all = readAll();

    all[slug] = { at: Date.now(), results };

    try {
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      /* sin espacio: la comprobación sigue siendo usable */
    }
  }

  /* ---------- Barajado ---------- */

  function shuffled(list) {
    const copy = [...list];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));

      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }

    return copy;
  }

  function prepare(questions) {
    return questions.map((question) => {
      const order = shuffled(question.o.map((_option, index) => index));

      return {
        text: question.q,
        options: order.map((original) => question.o[original]),
        correct: order.indexOf(question.a),
        why: question.w ?? "",
      };
    });
  }

  /* ---------- Render ---------- */

  function questionHtml(question, index) {
    const escapeHtml = MentorAI.escapeHtml;

    const options = question.options
      .map(
        (option, optionIndex) =>
          `<button type="button" class="check__option" data-question="${index}" data-option="${optionIndex}">${escapeHtml(
            option
          )}</button>`
      )
      .join("");

    return `<li class="check__item" data-correct="${question.correct}">
      <p class="check__question">${escapeHtml(question.text)}</p>
      <div class="check__options">${options}</div>
      <p class="check__why" hidden>${escapeHtml(question.why)}</p>
    </li>`;
  }

  function sectionHtml(prepared) {
    return `<section class="check" id="check">
      <h2 class="check__title">Comprueba lo que te llevas</h2>
      <p class="check__lead">Responde de memoria antes de seguir. No cuenta para nada: es para fijar lo leído.</p>
      <ol class="check__list">${prepared.map(questionHtml).join("")}</ol>
    </section>`;
  }

  /* ---------- Interacción ---------- */

  function wire(section, prepared, slug) {
    const results = new Array(prepared.length).fill(null);

    section.addEventListener("click", (event) => {
      const button = event.target.closest(".check__option");

      if (!button) return;

      const item = button.closest(".check__item");

      if (item.classList.contains("is-answered")) return;

      const index = Number(button.dataset.question);
      const chosen = Number(button.dataset.option);
      const correct = Number(item.dataset.correct);
      const options = [...item.querySelectorAll(".check__option")];

      options[correct].classList.add("check__option--correct");

      if (chosen !== correct) {
        button.classList.add("check__option--wrong");
      }

      for (const option of options) {
        option.disabled = true;
      }

      const why = item.querySelector(".check__why");

      if (why?.textContent) why.hidden = false;

      item.classList.add("is-answered");
      results[index] = chosen === correct;

      if (!results.includes(null)) {
        saveResult(slug, results);
      }
    });
  }

  /* ---------- Punto de entrada ---------- */

  function initChecks() {
    const slug = MentorAI.currentTutorialSlug?.() ?? "";
    const questions = (window.MENTORAI_CHECKS ?? {})[slug];

    if (!slug || !questions?.length) return;

    const prose = document.querySelector("article.prose");

    if (!prose) return;

    const prepared = prepare(questions);
    const anchor = prose.querySelector(".route-nav") ?? prose.querySelector(".tutorial-nav");
    const html = sectionHtml(prepared);

    if (anchor) {
      anchor.insertAdjacentHTML("beforebegin", html);
    } else {
      prose.insertAdjacentHTML("beforeend", html);
    }

    wire(document.getElementById("check"), prepared, slug);
  }

  MentorAI.Checks = { read: readAll };
  MentorAI.initChecks = initChecks;
})();
