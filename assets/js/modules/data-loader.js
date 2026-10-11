(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const DATA_GLOBALS = {
    quizzes: "MENTORAI_QUIZZES",
    checks: "MENTORAI_CHECKS",
    practica: "MENTORAI_PRACTICE",
  };

  const pending = {};

  function inject(src) {
    return new Promise((resolve, reject) => {
      const tag = document.createElement("script");

      tag.src = src;
      tag.onload = () => resolve();
      tag.onerror = () => {
        tag.remove();
        reject(new Error(`no se pudo cargar ${src}`));
      };
      document.head.appendChild(tag);
    });
  }

  function loadOne(name) {
    if (window[DATA_GLOBALS[name]]) return Promise.resolve();

    pending[name] ??= inject(`${MentorAI.basePath()}tutorials/${name}.js`).catch((error) => {
      delete pending[name];
      throw error;
    });

    return pending[name];
  }

  MentorAI.loadData = (names) => Promise.all(names.map(loadOne));

  MentorAI.examSummary = (courseSlug) => {
    const quiz = window.MENTORAI_QUIZZES?.[courseSlug];

    if (quiz?.questions?.length) {
      return { total: quiz.questions.length, passingScore: quiz.passingScore ?? null };
    }

    return window.MENTORAI_QUIZ_SUMMARY?.[courseSlug] ?? null;
  };
})();
