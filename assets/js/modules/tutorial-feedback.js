/* ============================================================
   MentorAI — Proponer mejora sobre un tutorial
   La autoría vive fuera de la app (Claude Code + la skill /tutorial), así
   que desde la lectura solo se captura la intención: un issue prellenado
   con el tutorial y la sección desde la que se pulsa.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const ISSUES_URL = "https://github.com/dGran/MentorAI/issues/new";
  const FEEDBACK_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>';

  const HEADING_OFFSET = 120;

  /* ---------- Sección visible ----------
     Se recalcula al pulsar, no al construir el botón: si no, siempre
     apuntaría a la primera sección de la página. */
  function currentSectionTitle() {
    const headings = Array.from(document.querySelectorAll("article.prose h2[id]"));
    const passed = headings.filter(
      (heading) => heading.getBoundingClientRect().top < HEADING_OFFSET
    );

    return passed.at(-1)?.textContent.trim() ?? "";
  }

  function issueUrl(slug) {
    const [title] = (document.title || slug).split(" — ");
    const section = currentSectionTitle();

    const lines = [`**Tutorial:** \`${slug}\``];

    if (section) {
      lines.push(`**Sección:** ${section}`);
    }

    lines.push("", "**Qué mejorarías:**", "");

    const params = new URLSearchParams({
      title: `Mejora en «${title}»`,
      body: lines.join("\n"),
    });

    return `${ISSUES_URL}?${params}`;
  }

  function buildFeedbackButton(slug) {
    const link = document.createElement("a");

    link.className = "tutorial-action tutorial-action--feedback";
    link.href = issueUrl(slug);
    link.target = "_blank";
    link.rel = "noopener";
    link.title = "Abrir una propuesta de mejora en GitHub";
    link.innerHTML = `${FEEDBACK_SVG}<span>Proponer mejora</span>`;

    link.addEventListener("pointerdown", () => {
      link.href = issueUrl(slug);
    });

    return link;
  }

  /* ---------- API pública ---------- */

  MentorAI.TutorialFeedback = { build: buildFeedbackButton };
})();
