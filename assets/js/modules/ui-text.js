/* ============================================================
   MentorAI — Helpers de texto compartidos
   Estaban duplicados en casi todos los módulos. Cualquier dato del
   manifiesto que se inyecte como HTML pasa por escapeHtml; las búsquedas
   comparan con normalize, sin acentos ni mayúsculas.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  MentorAI.escapeHtml = (text) =>
    String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const CORRECT_LABEL = "Correcto";
  const CHOSEN_LABEL = "Tu respuesta";
  const CHECK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
  const CROSS_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  function answerTag(label, isCorrect) {
    const tag = document.createElement("span");

    tag.className = `answer-tag answer-tag--${isCorrect ? "correct" : "wrong"}`;
    tag.innerHTML = `${isCorrect ? CHECK_ICON : CROSS_ICON}${label}`;

    return tag;
  }

  MentorAI.markAnswer = (options, correctIndex, chosenIndex) => {
    options[correctIndex].append(answerTag(CORRECT_LABEL, true));
    options[chosenIndex].append(answerTag(CHOSEN_LABEL, chosenIndex === correctIndex));
  };

  MentorAI.normalize = (text) =>
    String(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
})();
