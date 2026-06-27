/* ============================================================
   Rutas de aprendizaje (itinerarios)
   ------------------------------------------------------------
   Una ruta ordena CURSOS y ARTÍCULOS hacia un objetivo. Es la
   capa por encima de los cursos: agrupa contenido existente y
   marca un camino recomendado. No duplica nada: cada paso
   referencia un slug por su tipo.

     - type "course"  -> ref = slug de un curso (tutorials/courses.js)
     - type "article" -> ref = slug de un tutorial del manifest

   Mismo patrón file:// que el manifest y los cursos: un .js que
   asigna a un global, incluido con <script> antes de los módulos
   de assets/js/modules/.

   Al añadir contenido nuevo, revisar estas rutas para ver si el
   nuevo tutorial/curso encaja en alguna y ampliarla.
   ============================================================ */

window.MENTORAI_PATHS = [
  {
    slug: "php-a-fondo",
    title: "PHP a fondo",
    summary:
      "Cómo funciona PHP por debajo: extensiones, el modelo de ejecución, la memoria y el rendimiento. De entender el motor a exprimirlo en producción.",
    icon: "code",
    steps: [
      { type: "article", ref: "extensiones-php" },
      { type: "article", ref: "php-fpm" },
      { type: "article", ref: "memoria-php" },
      { type: "article", ref: "workers-php" },
      { type: "article", ref: "opcache" },
      { type: "article", ref: "preload" },
    ],
  },
  {
    slug: "diseno-oo",
    title: "Diseño orientado a objetos",
    summary:
      "Del ejercicio al patrón: buenas prácticas de diseño OO, inyección de dependencias y la arquitectura que sostiene un dominio complejo (hexagonal, DDD, CQRS).",
    icon: "code",
    steps: [
      { type: "article", ref: "object-calisthenics" },
      { type: "article", ref: "inyeccion-dependencias" },
      { type: "course", ref: "diseno-y-arquitectura" },
    ],
  },
  {
    slug: "backend-cimientos",
    title: "Backend desde los cimientos",
    summary:
      "El camino completo para un backend autodidacta: los fundamentos de informática, cómo trabajar con IA y cómo testear con criterio. Los tres cursos base.",
    icon: "signal",
    steps: [
      { type: "course", ref: "fundamentos" },
      { type: "course", ref: "programar-con-ia" },
      { type: "course", ref: "testing" },
    ],
  },
];
