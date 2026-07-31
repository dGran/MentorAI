/* ============================================================
   MentorAI — Página de tutorial: acciones, progreso e índice
   Orquesta las mejoras que se inyectan por JS según el slug del fichero,
   para no tener que editarlas a mano en cada tutorial. El lector por voz,
   la navegación de ruta y el botón de mejora viven en sus propios módulos.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Iconos ---------- */

  const DONE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const RESET_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>';
  const CHEVRON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  /* ---------- Slug de la página actual ---------- */

  function currentTutorialSlug() {
    const { pathname } = window.location;

    return pathname.slice(pathname.lastIndexOf("/") + 1).replace(/\.html$/, "");
  }

  /* ---------- Índice plegable ---------- */

  function initTocToggle() {
    const toc = document.querySelector(".toc");
    const title = toc?.querySelector(".toc__title");
    const list = toc?.querySelector(".toc__list");

    if (!toc || !title || !list) return;

    const toggle = document.createElement("button");
    toggle.className = "toc__toggle";
    toggle.innerHTML = title.textContent + CHEVRON_SVG;

    toc.insertBefore(toggle, title);
    title.hidden = true;

    toggle.addEventListener("click", () => toc.classList.toggle("is-open"));
  }

  /* ---------- Botones de progreso ---------- */

  function buildDoneButton(slug) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tutorial-action tutorial-action--done";

    const paint = (isDone) => {
      button.classList.toggle("is-done", isDone);
      button.innerHTML = `${DONE_SVG}<span>${
        isDone ? "Completado" : "Marcar como completado"
      }</span>`;
    };

    paint(MentorAI.Progress.has(slug));
    button.addEventListener("click", () => paint(MentorAI.Progress.toggle(slug)));

    return button;
  }

  function buildResetButton(slug, doneButton) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tutorial-action tutorial-action--reset";
    button.innerHTML = `${RESET_SVG}<span>Reiniciar</span>`;

    button.addEventListener("click", () => {
      MentorAI.Progress.remove([slug]);
      MentorAI.Reading.clear([slug]);
      doneButton.click();

      if (MentorAI.Progress.has(slug)) {
        doneButton.click();
      }
    });

    return button;
  }

  /* ---------- Barra de lectura ---------- */

  function buildReadingProgress(slug) {
    const el = document.createElement("div");
    el.className = "tutorial-progress";
    el.innerHTML =
      '<div class="tutorial-progress__bar"><span></span></div>' +
      '<span class="tutorial-progress__label"></span>';

    const fill = el.querySelector(".tutorial-progress__bar span");
    const label = el.querySelector(".tutorial-progress__label");

    let shown = MentorAI.Reading.get(slug)?.percent ?? 0;
    let complete = MentorAI.Progress.has(slug);

    const render = () => {
      const value = complete ? 100 : shown;

      fill.style.width = `${value}%`;
      label.textContent = `${value}% leído`;
    };

    render();

    window.addEventListener(
      "scroll",
      () => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const current = height > 0 ? Math.round((window.scrollY / height) * 100) : 0;

        if (current <= shown) return;

        shown = current;

        if (!complete) render();
      },
      { passive: true }
    );

    return {
      el,
      reset: () => {
        shown = 0;
        complete = false;
        render();
      },
      setComplete: (isComplete) => {
        complete = isComplete;
        render();
      },
    };
  }

  /* ---------- Barra de acciones ---------- */

  function injectTutorialActions(slug, prose) {
    const host = document.querySelector(".tutorial-hero .container");

    if (!host) return;

    const actions = document.createElement("div");
    actions.className = "tutorial-actions";

    const doneButton = buildDoneButton(slug);
    const resetButton = buildResetButton(slug, doneButton);

    if (MentorAI.TutorialAudio?.isSupported()) {
      actions.appendChild(MentorAI.TutorialAudio.build(prose));
    }

    actions.append(doneButton, resetButton);

    if (MentorAI.TutorialFeedback) {
      actions.appendChild(MentorAI.TutorialFeedback.build(slug));
    }

    host.appendChild(actions);

    const progress = buildReadingProgress(slug);
    host.appendChild(progress.el);

    doneButton.addEventListener("click", () =>
      progress.setComplete(MentorAI.Progress.has(slug))
    );
    resetButton.addEventListener("click", progress.reset);
  }

  /* ---------- Punto de entrada ---------- */

  function initTutorialPage() {
    const prose = document.querySelector("article.prose");

    if (!prose) return;

    const slug = currentTutorialSlug();

    injectTutorialActions(slug, prose);
    MentorAI.TutorialNav?.injectCourseCrumb(slug);
    MentorAI.TutorialNav?.injectRouteNav(slug, prose);
    initTocToggle();
  }

  MentorAI.currentTutorialSlug = currentTutorialSlug;
  MentorAI.initTutorialPage = initTutorialPage;
})();
