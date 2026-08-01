/* ============================================================
   MentorAI — Arranque
   Va el último en cada página: orquesta los módulos de window.MentorAI.
   Cada init hace early-return si su contenedor no está, así que el mismo
   conjunto de scripts sirve para todas las páginas.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = window.MentorAI;

  document.addEventListener("DOMContentLoaded", () => {
    MentorAI.initTheme();
    MentorAI.initMobileNav();
    MentorAI.initReadingProgress();
    MentorAI.initScrollSpy();
    MentorAI.initCopyButtons();

    MentorAI.Catalog.render();
    MentorAI.Courses.render();
    MentorAI.Courses.renderCoursePage();

    MentorAI.Paths?.render();
    MentorAI.Paths?.renderHome();

    MentorAI.ExamenRuta?.render();

    MentorAI.Repaso?.init();
    MentorAI.Repaso?.renderHome();
    MentorAI.Repaso?.renderPage();
    MentorAI.Exams?.renderHome();

    MentorAI.Home.render();
    MentorAI.Home.initSearch();
    MentorAI.initHeroStat();

    MentorAI.initTutorialPage();
    MentorAI.initChecks();
    MentorAI.initQuiz();
    MentorAI.initYear();
    MentorAI.SyntaxHighlighter.run();

    MentorAI.Offline?.init();
    MentorAI.Offline?.initCourseButtons();
    MentorAI.Offline?.initOfflinePage();
  });

  window.addEventListener("load", () => {
    document.documentElement.classList.add("smooth-scroll");
  });
})();
