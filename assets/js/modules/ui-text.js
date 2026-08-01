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

  MentorAI.normalize = (text) =>
    String(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
})();
