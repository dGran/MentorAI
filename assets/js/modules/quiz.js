/* ============================================================
   MentorAI — Examen de curso
   Se inyecta al final de la última lección de cada curso que tenga
   preguntas en MENTORAI_QUIZZES, y bloquea el "marcar como completado"
   hasta superarlo.

   Las opciones se barajan en cada intento: los datos traen la respuesta
   correcta casi siempre en la misma posición, y sin barajar el examen se
   aprueba sin leer.

   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const PASS_RATIO = 0.7;

  /* ---------- Helpers ---------- */

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function storageKey(courseSlug) {
    return `academia-quiz-${courseSlug}`;
  }

  function loadResult(courseSlug) {
    try {
      return JSON.parse(localStorage.getItem(storageKey(courseSlug))) ?? null;
    } catch {
      return null;
    }
  }

  function saveResult(courseSlug, passed, score) {
    const previous = loadResult(courseSlug) ?? { attempts: 0, bestScore: 0, passed: false };
    const updated = {
      passed: previous.passed || passed,
      bestScore: Math.max(previous.bestScore, score),
      attempts: previous.attempts + 1,
    };

    try {
      localStorage.setItem(storageKey(courseSlug), JSON.stringify(updated));
    } catch {
      /* localStorage lleno o bloqueado: el examen sigue siendo usable */
    }

    return updated;
  }

  /* ---------- Localizar el examen de esta página ---------- */

  function flatLessons(course) {
    if (Array.isArray(course.lessons)) return course.lessons;

    return (course.modules ?? []).flatMap((module) => module.lessons ?? []);
  }

  function findEntry(slug) {
    const courses = window.MENTORAI_COURSES ?? [];
    const quizzes = window.MENTORAI_QUIZZES ?? {};

    for (const course of courses) {
      const lessons = flatLessons(course);
      const quizData = quizzes[course.slug];

      if (lessons.at(-1) !== slug) continue;
      if (!quizData?.questions?.length) continue;

      return { course, quizData };
    }

    return null;
  }

  function passingScore(quizData) {
    return quizData.passingScore ?? Math.ceil(quizData.questions.length * PASS_RATIO);
  }

  /* ---------- Gate del botón de completado ---------- */

  function gateDoneButton() {
    const button = document.querySelector(".tutorial-action--done");

    if (!button) return;

    button.classList.add("quiz-gated");
    button.disabled = true;
    button.title = "Supera el examen del curso para completar esta lección";
  }

  function releaseDoneButton(slug) {
    const button = document.querySelector(".tutorial-action--done");

    if (!button) return;

    button.classList.remove("quiz-gated");
    button.disabled = false;
    button.title = "";

    if (!MentorAI.Progress.has(slug)) {
      button.click();
    }
  }

  /* ---------- Preparación de las preguntas ---------- */

  function shuffled(list) {
    const copy = [...list];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));

      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }

    return copy;
  }

  function lessonBySlug(slug) {
    return (window.ACADEMIA_TUTORIALS ?? []).find((tutorial) => tutorial.slug === slug);
  }

  function prepareQuestions(questions) {
    return questions.map((question) => {
      const order = shuffled(question.o.map((_option, index) => index));

      return {
        text: question.q,
        options: order.map((original) => question.o[original]),
        correct: order.indexOf(question.a),
        why: question.w ?? "",
        lesson: lessonBySlug(question.lesson),
      };
    });
  }

  /* ---------- Render ---------- */

  function whyHtml({ why, lesson }) {
    if (!why && !lesson) return "";

    const review = lesson
      ? ` <a class="quiz__review" href="${escapeHtml(lesson.slug)}.html">Repasar «${escapeHtml(
          lesson.title
        )}»</a>`
      : "";

    return `<p class="quiz__why" hidden>${escapeHtml(why)}${review}</p>`;
  }

  function questionHtml(question, index) {
    const options = question.options
      .map(
        (option, optionIndex) =>
          `<label class="quiz__option"><input type="radio" name="q${index}" value="${optionIndex}"><span>${escapeHtml(
            option
          )}</span></label>`
      )
      .join("");

    return `<div class="quiz__question" data-correct="${question.correct}">
      <p class="quiz__question-text"><strong>${index + 1}.</strong> ${escapeHtml(
        question.text
      )}</p>
      <div class="quiz__options">${options}</div>
      ${whyHtml(question)}
    </div>`;
  }

  function historyHtml(saved, total) {
    if (!saved) return "";

    const badge = saved.passed
      ? ' &middot; <span class="quiz__badge-inline">✓ Superado</span>'
      : "";

    return `<p class="quiz__history">Mejor resultado: <strong>${saved.bestScore}/${total}</strong> &middot; ${
      saved.attempts
    } intento${saved.attempts === 1 ? "" : "s"}${badge}</p>`;
  }

  function buildQuizSection(course, quizData, prepared, saved) {
    const total = prepared.length;
    const threshold = passingScore(quizData);

    return `<section class="quiz" id="quiz">
      <div class="quiz__header">
        <h2>Pon a prueba lo aprendido</h2>
        <p>Examen del curso <strong>${escapeHtml(
          course.title
        )}</strong> &middot; ${total} preguntas &middot; mínimo ${threshold}/${total} para superar</p>
        ${historyHtml(saved, total)}
      </div>
      <form class="quiz__form" id="quiz-form">
        ${prepared.map(questionHtml).join("")}
        <div class="quiz__actions">
          <button type="submit" class="quiz__submit">Comprobar respuestas</button>
        </div>
      </form>
      <div class="quiz__result" id="quiz-result" hidden></div>
    </section>`;
  }

  /* ---------- Corrección ---------- */

  function gradeQuestion(questionEl, index, form) {
    const selected = form.querySelector(`input[name='q${index}']:checked`);

    if (!selected) return null;

    const correct = Number(questionEl.dataset.correct);
    const answer = Number(selected.value);
    const labels = questionEl.querySelectorAll(".quiz__option");

    questionEl.querySelectorAll("input[type='radio']").forEach((radio) => {
      radio.disabled = true;
    });

    labels[correct].classList.add("quiz__option--correct");

    if (answer !== correct) {
      labels[answer].classList.add("quiz__option--wrong");
    }

    const why = questionEl.querySelector(".quiz__why");

    if (why) {
      why.hidden = false;
    }

    return answer === correct;
  }

  function resultHtml(score, total, threshold, passed) {
    const scoreBlock = `<div class="quiz__score quiz__score--${passed ? "pass" : "fail"}">
      <span class="quiz__score-number">${score}/${total}</span>
      <span class="quiz__score-label">${passed ? "¡Aprobado!" : "No superado"}</span>
    </div>`;

    if (passed) {
      return `${scoreBlock}<p>Has superado el examen. El curso queda registrado como completado.</p>
        <button type="button" class="quiz__complete-btn" id="quiz-complete">Marcar curso como completado</button>`;
    }

    return `${scoreBlock}<p>Necesitas <strong>${threshold}/${total}</strong> para superar el examen. Repasa las lecciones y vuelve a intentarlo.</p>
      <button type="button" class="quiz__retry-btn" id="quiz-retry">Volver a intentarlo</button>`;
  }

  function bindForm(form, resultEl, entry, prepared, lessonSlug, prose) {
    const threshold = passingScore(entry.quizData);
    const total = prepared.length;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const questions = [...form.querySelectorAll(".quiz__question")];
      const outcomes = questions.map((questionEl, index) =>
        gradeQuestion(questionEl, index, form)
      );

      if (outcomes.includes(null)) {
        resultEl.innerHTML =
          '<p class="quiz__warning">Responde todas las preguntas antes de comprobar.</p>';
        resultEl.hidden = false;
        return;
      }

      const score = outcomes.filter(Boolean).length;
      const passed = score >= threshold;
      const saved = saveResult(entry.course.slug, passed, score);

      form.querySelector(".quiz__actions").hidden = true;
      resultEl.innerHTML = resultHtml(score, total, threshold, passed);
      resultEl.hidden = false;

      document.getElementById("quiz-retry")?.addEventListener("click", () => {
        mountQuiz(entry, lessonSlug, prose)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });

      const completeButton = document.getElementById("quiz-complete");

      if (!completeButton) return;

      if (saved.passed && MentorAI.Progress.has(lessonSlug)) {
        completeButton.textContent = "✓ Ya estaba completado";
        completeButton.disabled = true;
      }

      completeButton.addEventListener("click", () => {
        releaseDoneButton(lessonSlug);
        completeButton.textContent = "✓ Curso completado";
        completeButton.disabled = true;
      });
    });
  }

  /* ---------- Montaje ---------- */

  function insertQuiz(prose, html) {
    const anchor = prose.querySelector(".route-nav") ?? prose.querySelector(".tutorial-nav");

    if (anchor) {
      anchor.insertAdjacentHTML("beforebegin", html);
      return;
    }

    prose.insertAdjacentHTML("beforeend", html);
  }

  function mountQuiz(entry, lessonSlug, prose) {
    const saved = loadResult(entry.course.slug);
    const prepared = prepareQuestions(entry.quizData.questions);
    const html = buildQuizSection(entry.course, entry.quizData, prepared, saved);
    const existing = document.getElementById("quiz");

    if (existing) {
      existing.outerHTML = html;
    } else {
      insertQuiz(prose, html);
    }

    const form = document.getElementById("quiz-form");
    const resultEl = document.getElementById("quiz-result");

    if (form && resultEl) {
      bindForm(form, resultEl, entry, prepared, lessonSlug, prose);
    }

    return document.getElementById("quiz");
  }

  /* ---------- Punto de entrada ---------- */

  function initQuiz() {
    const slug = MentorAI.currentTutorialSlug?.() ?? "";

    if (!slug) return;

    const entry = findEntry(slug);

    if (!entry) return;

    if (!loadResult(entry.course.slug)?.passed) {
      gateDoneButton();
    }

    const prose = document.querySelector("article.prose");

    if (!prose) return;

    mountQuiz(entry, slug, prose);
  }

  MentorAI.initQuiz = initQuiz;
})();
