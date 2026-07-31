/* ============================================================
   MentorAI — Quiz de curso
   Se inyecta al final de la última lección de cada curso que
   tenga preguntas en MENTORAI_QUIZZES. Bloquea el "Marcar como
   completado" hasta que el examen se supere.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Helpers ---------- */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function storageKey(courseSlug) {
    return "academia-quiz-" + courseSlug;
  }

  function loadResult(courseSlug) {
    try {
      var raw = localStorage.getItem(storageKey(courseSlug));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveResult(courseSlug, passed, score) {
    var previous = loadResult(courseSlug) || { attempts: 0, bestScore: 0, passed: false };
    var updated = {
      passed: previous.passed || passed,
      bestScore: Math.max(previous.bestScore, score),
      attempts: previous.attempts + 1,
    };

    try {
      localStorage.setItem(storageKey(courseSlug), JSON.stringify(updated));
    } catch (e) {}

    return updated;
  }

  /* ---------- Detectar si esta página es la última lección de un curso con quiz ---------- */

  function findEntry(slug) {
    var courses = window.MENTORAI_COURSES || [];
    var quizzes = window.MENTORAI_QUIZZES || {};

    for (var i = 0; i < courses.length; i++) {
      var course = courses[i];
      var lessons = flatLessons(course);

      if (lessons.length === 0) continue;
      if (lessons[lessons.length - 1] !== slug) continue;
      if (!quizzes[course.slug]) continue;
      if (!quizzes[course.slug].questions || !quizzes[course.slug].questions.length) continue;

      return { course: course, quizData: quizzes[course.slug] };
    }

    return null;
  }

  function flatLessons(course) {
    if (Array.isArray(course.lessons)) return course.lessons;

    var result = [];
    (course.modules || []).forEach(function (m) {
      (m.lessons || []).forEach(function (s) { result.push(s); });
    });

    return result;
  }

  function passingScore(quizData) {
    return quizData.passingScore || Math.ceil(quizData.questions.length * 0.7);
  }

  /* ---------- Barajado de opciones ---------- */

  function shuffled(list) {
    var copy = list.slice();

    for (var index = copy.length - 1; index > 0; index -= 1) {
      var swap = Math.floor(Math.random() * (index + 1));
      var current = copy[index];

      copy[index] = copy[swap];
      copy[swap] = current;
    }

    return copy;
  }

  function prepareQuestions(questions) {
    return questions.map(function (question) {
      var order = shuffled(
        question.o.map(function (_option, index) {
          return index;
        })
      );

      return {
        text: question.q,
        options: order.map(function (originalIndex) {
          return question.o[originalIndex];
        }),
        correct: order.indexOf(question.a),
      };
    });
  }

  /* ---------- Bloquear el botón de completado individual ---------- */

  function gateDoneButton() {
    var btn = document.querySelector(".tutorial-action--done");
    if (!btn) return;
    btn.classList.add("quiz-gated");
    btn.disabled = true;
    btn.title = "Supera el examen del curso para completar esta lección";
  }

  function releaseDoneButton(slug) {
    var btn = document.querySelector(".tutorial-action--done");
    if (!btn) return;
    btn.classList.remove("quiz-gated");
    btn.disabled = false;
    btn.title = "";

    if (!MentorAI.Progress.has(slug)) {
      btn.click();
    }
  }

  /* ---------- Render del quiz ---------- */

  function buildQuizSection(course, quizData, prepared, saved) {
    var threshold = passingScore(quizData);
    var total = prepared.length;

    var historyHtml = "";

    if (saved) {
      historyHtml =
        '<p class="quiz__history">Mejor resultado: <strong>' +
        saved.bestScore +
        "/" +
        total +
        "</strong> &middot; " +
        saved.attempts +
        " intento" +
        (saved.attempts !== 1 ? "s" : "") +
        (saved.passed ? ' &middot; <span class="quiz__badge-inline">✓ Superado</span>' : "") +
        "</p>";
    }

    var questionsHtml = prepared
      .map(function (question, idx) {
        var optionsHtml = question.options
          .map(function (opt, optIdx) {
            return (
              '<label class="quiz__option">' +
              '<input type="radio" name="q' + idx + '" value="' + optIdx + '">' +
              "<span>" + escapeHtml(opt) + "</span>" +
              "</label>"
            );
          })
          .join("");

        return (
          '<div class="quiz__question" data-correct="' + question.correct + '">' +
          '<p class="quiz__question-text"><strong>' + (idx + 1) + ".</strong> " + escapeHtml(question.text) + "</p>" +
          '<div class="quiz__options">' + optionsHtml + "</div>" +
          "</div>"
        );
      })
      .join("");

    return (
      '<section class="quiz" id="quiz">' +
      '<div class="quiz__header">' +
      "<h2>Pon a prueba lo aprendido</h2>" +
      "<p>Examen del curso <strong>" + escapeHtml(course.title) + "</strong> &middot; " +
      total + " preguntas &middot; mínimo " + threshold + "/" + total + " para superar</p>" +
      historyHtml +
      "</div>" +
      '<form class="quiz__form" id="quiz-form">' +
      questionsHtml +
      '<div class="quiz__actions">' +
      '<button type="submit" class="quiz__submit">Comprobar respuestas</button>' +
      "</div>" +
      "</form>" +
      '<div class="quiz__result" id="quiz-result" hidden></div>' +
      "</section>"
    );
  }

  /* ---------- Lógica de evaluación ---------- */

  function bindForm(form, resultEl, entry, prepared, lessonSlug, prose) {
    var threshold = passingScore(entry.quizData);
    var total = prepared.length;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var questions = form.querySelectorAll(".quiz__question");
      var score = 0;
      var allAnswered = true;

      questions.forEach(function (qEl, idx) {
        var selected = form.querySelector("input[name='q" + idx + "']:checked");

        if (!selected) {
          allAnswered = false;
          return;
        }

        var correct = parseInt(qEl.dataset.correct, 10);
        var answer = parseInt(selected.value, 10);
        var labels = qEl.querySelectorAll(".quiz__option");

        qEl.querySelectorAll("input[type='radio']").forEach(function (r) {
          r.disabled = true;
        });

        if (answer === correct) {
          score += 1;
          labels[answer].classList.add("quiz__option--correct");
        } else {
          labels[answer].classList.add("quiz__option--wrong");
          labels[correct].classList.add("quiz__option--correct");
        }
      });

      if (!allAnswered) {
        resultEl.innerHTML = '<p class="quiz__warning">Responde todas las preguntas antes de comprobar.</p>';
        resultEl.hidden = false;
        return;
      }

      var passed = score >= threshold;
      var saved = saveResult(entry.course.slug, passed, score);

      form.querySelector(".quiz__actions").hidden = true;

      var resultHtml =
        '<div class="quiz__score quiz__score--' + (passed ? "pass" : "fail") + '">' +
        '<span class="quiz__score-number">' + score + "/" + total + "</span>" +
        '<span class="quiz__score-label">' + (passed ? "¡Aprobado!" : "No superado") + "</span>" +
        "</div>";

      if (passed) {
        resultHtml +=
          "<p>Has superado el examen. El curso queda registrado como completado.</p>" +
          '<button type="button" class="quiz__complete-btn" id="quiz-complete">Marcar curso como completado</button>';
      } else {
        resultHtml +=
          "<p>Necesitas <strong>" + threshold + "/" + total + "</strong> para superar el examen. Repasa las lecciones y vuelve a intentarlo.</p>" +
          '<button type="button" class="quiz__retry-btn" id="quiz-retry">Volver a intentarlo</button>';
      }

      resultEl.innerHTML = resultHtml;
      resultEl.hidden = false;

      var retryBtn = document.getElementById("quiz-retry");
      if (retryBtn) {
        retryBtn.addEventListener("click", function () {
          var section = mountQuiz(entry, lessonSlug, prose);

          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }

      var completeBtn = document.getElementById("quiz-complete");
      if (completeBtn) {
        if (saved.passed && MentorAI.Progress.has(lessonSlug)) {
          completeBtn.textContent = "✓ Ya estaba completado";
          completeBtn.disabled = true;
        }

        completeBtn.addEventListener("click", function () {
          releaseDoneButton(lessonSlug);
          completeBtn.textContent = "✓ Curso completado";
          completeBtn.disabled = true;
        });
      }
    });
  }

  /* ---------- Montaje ---------- */

  function insertQuiz(prose, html) {
    var routeNav = prose.querySelector(".route-nav");

    if (routeNav) {
      routeNav.insertAdjacentHTML("beforebegin", html);
      return;
    }

    var manualNav = prose.querySelector(".tutorial-nav");

    if (manualNav) {
      manualNav.insertAdjacentHTML("beforebegin", html);
      return;
    }

    prose.insertAdjacentHTML("beforeend", html);
  }

  function mountQuiz(entry, lessonSlug, prose) {
    var saved = loadResult(entry.course.slug);
    var prepared = prepareQuestions(entry.quizData.questions);
    var html = buildQuizSection(entry.course, entry.quizData, prepared, saved);
    var existing = document.getElementById("quiz");

    if (existing) {
      existing.outerHTML = html;
    } else {
      insertQuiz(prose, html);
    }

    var form = document.getElementById("quiz-form");
    var resultEl = document.getElementById("quiz-result");

    if (form && resultEl) {
      bindForm(form, resultEl, entry, prepared, lessonSlug, prose);
    }

    return document.getElementById("quiz");
  }

  /* ---------- Punto de entrada ---------- */

  function initQuiz() {
    var slug = MentorAI.currentTutorialSlug ? MentorAI.currentTutorialSlug() : "";
    if (!slug) return;

    var entry = findEntry(slug);
    if (!entry) return;

    var saved = loadResult(entry.course.slug);

    if (!saved || !saved.passed) {
      gateDoneButton();
    }

    var prose = document.querySelector("article.prose");
    if (!prose) return;

    mountQuiz(entry, slug, prose);
  }

  MentorAI.initQuiz = initQuiz;
})();
