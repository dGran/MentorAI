/* ============================================================
   Exámenes por curso
   ------------------------------------------------------------
   Cada clave es el slug de un curso de MENTORAI_COURSES.
   Las preguntas se van añadiendo curso a curso.

   Estructura por pregunta:
     q  enunciado
     o  array de 4 opciones (texto)
     a  índice (0-based) de la opción correcta

   La nota de corte por defecto es ceil(preguntas × 0.7).
   Se puede sobreescribir con passingScore: N en el objeto del curso.
   ============================================================ */

window.MENTORAI_QUIZZES = {};
