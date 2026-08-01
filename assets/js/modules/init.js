/* ============================================================
   MentorAI — Arranque
   Carga al final: orquesta los módulos de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = window.MentorAI;

  document.addEventListener("DOMContentLoaded", function () {
    MentorAI.initTheme();
    MentorAI.initMobileNav();
    MentorAI.initReadingProgress();
    MentorAI.initScrollSpy();
    MentorAI.initCopyButtons();
    MentorAI.Catalog.render();
    MentorAI.Courses.render();
    MentorAI.Courses.renderCoursePage();

    if (MentorAI.Paths) {
      MentorAI.Paths.render();
      MentorAI.Paths.renderHome();
    }

    if (MentorAI.Repaso) {
      MentorAI.Repaso.init();
      MentorAI.Repaso.renderHome();
      MentorAI.Repaso.renderPage();
    }

    if (MentorAI.Exams) {
      MentorAI.Exams.renderHome();
    }

    MentorAI.Home.render();
    MentorAI.Home.initSearch();
    MentorAI.initHeroStat();
    MentorAI.initTutorialPage();
    MentorAI.initChecks();
    MentorAI.initQuiz();
    MentorAI.initYear();
    MentorAI.SyntaxHighlighter.run();

    if (MentorAI.Offline) {
      MentorAI.Offline.init();
      MentorAI.Offline.initCourseButtons();
      MentorAI.Offline.initOfflinePage();
    }
  });

  window.addEventListener("load", function () {
    document.documentElement.classList.add("smooth-scroll");
  });
})();
