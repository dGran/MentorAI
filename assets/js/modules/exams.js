/* ============================================================
   MentorAI — Estado de los exámenes
   Los exámenes viven al final de la última lección de cada curso, así que
   sin esto solo los encuentra quien llega hasta ahí. Este módulo los saca
   a la ficha del curso, a la tarjeta del catálogo y al inicio.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const PASS_RATIO = 0.7;

  const TROPHY_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v4a6 6 0 0 1-12 0Z"/><path d="M6 6H4a2 2 0 0 0 2 4"/><path d="M18 6h2a2 2 0 0 1-2 4"/><path d="M9 20h6"/><path d="M12 14v6"/></svg>';

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- Datos ---------- */

  function quizOf(courseSlug) {
    return (window.MENTORAI_QUIZZES ?? {})[courseSlug] ?? null;
  }

  function hasExam(courseSlug) {
    return Boolean(quizOf(courseSlug)?.questions?.length);
  }

  function resultOf(courseSlug) {
    try {
      return JSON.parse(localStorage.getItem(`academia-quiz-${courseSlug}`)) ?? null;
    } catch {
      return null;
    }
  }

  function lessonsOf(course) {
    if (Array.isArray(course.lessons)) return course.lessons;

    return (course.modules ?? []).flatMap((module) => module.lessons ?? []);
  }

  function examHref(course, fromRoot = true) {
    const lastLesson = lessonsOf(course).at(-1);

    if (!lastLesson) return null;

    return `${fromRoot ? "tutorials/" : ""}${lastLesson}.html#quiz`;
  }

  /* ---------- Estado legible ---------- */

  function statusOf(course) {
    const quiz = quizOf(course.slug);

    if (!quiz?.questions?.length) return null;

    const total = quiz.questions.length;
    const threshold = quiz.passingScore ?? Math.ceil(total * PASS_RATIO);
    const result = resultOf(course.slug);

    if (!result) {
      return { state: "pending", label: "Examen sin hacer", total, threshold };
    }

    if (result.passed) {
      return {
        state: "passed",
        label: `Examen superado · ${result.bestScore}/${total}`,
        total,
        threshold,
        best: result.bestScore,
      };
    }

    return {
      state: "failed",
      label: `Examen: ${result.bestScore}/${total}`,
      total,
      threshold,
      best: result.bestScore,
    };
  }

  /* ---------- Vistas ---------- */

  function badgeHtml(course) {
    const status = statusOf(course);

    if (!status) return "";

    return `<span class="exam-badge exam-badge--${status.state}">${TROPHY_SVG}${escapeHtml(
      status.label
    )}</span>`;
  }

  function panelHtml(course) {
    const status = statusOf(course);
    const href = examHref(course);

    if (!status || !href) return "";

    const copy = {
      pending: `Cuando termines el curso, ponte a prueba: ${status.total} preguntas, mínimo ${status.threshold} para superarlo.`,
      failed: `Tu mejor resultado es ${status.best}/${status.total}. Necesitas ${status.threshold} para superarlo.`,
      passed: `Lo superaste con ${status.best}/${status.total}. Puedes repetirlo para repasar cuando quieras.`,
    };

    const cta = {
      pending: "Ir al examen",
      failed: "Volver a intentarlo",
      passed: "Repetir el examen",
    };

    return `<aside class="exam-panel exam-panel--${status.state}">
      <div class="exam-panel__icon">${TROPHY_SVG}</div>
      <div class="exam-panel__body">
        <h3 class="exam-panel__title">Examen del curso</h3>
        <p class="exam-panel__copy">${escapeHtml(copy[status.state])}</p>
      </div>
      <a class="btn btn--primary" href="${escapeHtml(href)}">${cta[status.state]}</a>
    </aside>`;
  }

  /* ---------- Resumen del inicio ---------- */

  function summaryRow(course) {
    const status = statusOf(course);
    const href = examHref(course);

    return `<li class="exam-row exam-row--${status.state}">
      <a href="${escapeHtml(href)}">
        <span class="exam-row__title">${escapeHtml(course.title)}</span>
        <span class="exam-row__state">${escapeHtml(status.label)}</span>
      </a>
    </li>`;
  }

  function renderHome() {
    const host = document.getElementById("home-exams");

    if (!host) return;

    const courses = (window.MENTORAI_COURSES ?? []).filter((course) =>
      hasExam(course.slug)
    );

    if (courses.length === 0) {
      host.hidden = true;
      return;
    }

    const order = { failed: 0, pending: 1, passed: 2 };
    const sorted = [...courses].sort(
      (a, b) => order[statusOf(a).state] - order[statusOf(b).state]
    );
    const passed = courses.filter((course) => statusOf(course).state === "passed").length;

    host.innerHTML = `
      <div class="shelf__head">
        <h2 class="shelf__title">Exámenes</h2>
        <span class="shelf__hint">${passed} de ${courses.length} superados</span>
      </div>
      <ul class="exam-list">${sorted.map(summaryRow).join("")}</ul>`;
    host.hidden = false;
  }

  /* ---------- API pública ---------- */

  MentorAI.Exams = {
    hasExam,
    statusOf,
    examHref,
    badgeHtml,
    panelHtml,
    renderHome,
  };
})();
