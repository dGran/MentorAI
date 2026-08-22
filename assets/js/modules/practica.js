/* ============================================================
   MentorAI — Ponlo en práctica: mini-retos al cierre de cada curso
   Lee window.MENTORAI_PRACTICE (retos por curso) y pinta la sección al
   final de la ficha de curso, tras el panel de examen. La solución va
   plegada en un <details>; cada reto se marca como hecho y persiste en
   localStorage ("academia-practica"), así que viaja con el perfil.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const KEY = "academia-practica";

  const TOOL_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';

  /* ---------- Persistencia ---------- */

  function readAll() {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY));

      return stored && typeof stored === "object" ? stored : {};
    } catch {
      return {};
    }
  }

  function writeAll(map) {
    try {
      localStorage.setItem(KEY, JSON.stringify(map));
    } catch {
      /* sin espacio o sin permiso: no persistimos, pero no rompemos */
    }
  }

  const challengesOf = (courseSlug) => (window.MENTORAI_PRACTICE ?? {})[courseSlug] ?? [];

  const isDone = (courseSlug, index) => Boolean(readAll()[courseSlug]?.[index]);

  const doneCountOf = (courseSlug) =>
    challengesOf(courseSlug).filter((challenge, index) => isDone(courseSlug, index)).length;

  function toggleDone(courseSlug, index) {
    const all = readAll();
    const byIndex = { ...(all[courseSlug] ?? {}) };
    const done = !byIndex[index];

    done ? (byIndex[index] = true) : delete byIndex[index];
    Object.keys(byIndex).length ? (all[courseSlug] = byIndex) : delete all[courseSlug];
    writeAll(all);

    return done;
  }

  /* ---------- Vistas ---------- */

  function codeBlockHtml(code) {
    if (!code) return "";

    const highlighted = MentorAI.SyntaxHighlighter.highlight(code.source, code.lang);

    return `<div class="code-block practica__code">
      <div class="code-block__head">
        <span class="code-block__lang">${MentorAI.escapeHtml(code.lang)}</span>
      </div>
      <pre><code>${highlighted}</code></pre>
    </div>`;
  }

  function challengeHtml(courseSlug, challenge, index) {
    const escapeHtml = MentorAI.escapeHtml;
    const done = isDone(courseSlug, index);

    return `<article class="practica__reto${done ? " practica__reto--done" : ""}" data-index="${index}">
      <header class="practica__reto-head">
        <span class="practica__num">${index + 1}</span>
        <h3 class="practica__reto-title">${escapeHtml(challenge.title)}</h3>
        <label class="practica__done">
          <input type="checkbox" class="practica__check" ${done ? "checked" : ""} />
          <span>Hecho</span>
        </label>
      </header>
      <p class="practica__statement">${escapeHtml(challenge.statement)}</p>
      ${codeBlockHtml(challenge.code)}
      <details class="practica__solution">
        <summary>Ver la solución</summary>
        <p>${escapeHtml(challenge.solution)}</p>
        ${codeBlockHtml(challenge.solutionCode)}
      </details>
    </article>`;
  }

  function progressLabel(courseSlug) {
    return `${doneCountOf(courseSlug)} de ${challengesOf(courseSlug).length} hechos`;
  }

  function panelHtml(course) {
    const challenges = challengesOf(course.slug);

    if (challenges.length === 0) return "";

    const retos = challenges
      .map((challenge, index) => challengeHtml(course.slug, challenge, index))
      .join("");

    return `<section class="practica" id="practica">
      <header class="practica__head">
        <span class="practica__icon">${TOOL_SVG}</span>
        <div class="practica__headings">
          <h2 class="practica__title">Ponlo en práctica</h2>
          <p class="practica__lead">Retos cortos para aterrizar lo del curso en tu máquina. La solución está plegada: pelea antes de mirarla.</p>
        </div>
        <span class="practica__progress">${progressLabel(course.slug)}</span>
      </header>
      ${retos}
    </section>`;
  }

  function bind(host, course) {
    const section = host.querySelector(".practica");

    if (!section) return;

    for (const check of section.querySelectorAll(".practica__check")) {
      check.addEventListener("change", (event) => {
        const reto = event.target.closest(".practica__reto");
        const done = toggleDone(course.slug, Number(reto.dataset.index));

        reto.classList.toggle("practica__reto--done", done);
        section.querySelector(".practica__progress").textContent = progressLabel(course.slug);
      });
    }
  }

  /* ---------- API pública ---------- */

  MentorAI.Practica = {
    challengesOf,
    panelHtml,
    bind,
  };
})();
