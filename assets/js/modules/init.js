/* ============================================================
   MentorAI — Arranque
   Carga al final: orquesta los módulos de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = window.MentorAI;

  document.addEventListener("DOMContentLoaded", function () {
    MentorAI.initTheme();
    MentorAI.initReadingProgress();
    MentorAI.initScrollSpy();
    MentorAI.initCopyButtons();
    MentorAI.Catalog.render();
    MentorAI.Courses.render();
    MentorAI.Courses.renderCoursePage();
    MentorAI.Home.render();
    MentorAI.Home.initSearch();
    MentorAI.initHeroStat();
    MentorAI.initTutorialPage();
    MentorAI.initComposer();
    MentorAI.initRefiner();
    MentorAI.initYear();
    MentorAI.SyntaxHighlighter.run();
  });

  window.addEventListener("load", function () {
    document.documentElement.classList.add("smooth-scroll");
  });
})();
