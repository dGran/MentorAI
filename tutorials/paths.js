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
      "Del ejercicio al patrón: buenas prácticas de diseño OO, el vocabulario de los patrones GoF, inyección de dependencias y la arquitectura que sostiene un dominio complejo (hexagonal, DDD, CQRS). Cierra viendo todo eso aplicado dentro de un framework real.",
    icon: "code",
    steps: [
      { type: "course", ref: "oop" },
      { type: "course", ref: "solid" },
      { type: "course", ref: "clean-code" },
      { type: "article", ref: "object-calisthenics" },
      { type: "course", ref: "patrones-diseno" },
      { type: "course", ref: "di-contenedores" },
      { type: "course", ref: "diseno-y-arquitectura" },
      { type: "course", ref: "framework-por-dentro" },
    ],
  },
  {
    slug: "el-grado-que-no-hiciste",
    title: "El grado que no hiciste",
    summary:
      "La carrera completa, en orden: de los fundamentos de informática y la terminal al diseño orientado a objetos, los patrones, la arquitectura, el testing y la práctica de construir, desplegar y operar un servicio real. El temario troncal, de principio a fin.",
    icon: "signal",
    steps: [
      { type: "course", ref: "fundamentos" },
      { type: "course", ref: "terminal-linux" },
      { type: "course", ref: "oop" },
      { type: "course", ref: "solid" },
      { type: "course", ref: "clean-code" },
      { type: "course", ref: "patrones-diseno" },
      { type: "course", ref: "di-contenedores" },
      { type: "course", ref: "diseno-y-arquitectura" },
      { type: "course", ref: "framework-por-dentro" },
      { type: "course", ref: "testing" },
      { type: "course", ref: "phpunit" },
      { type: "course", ref: "git" },
      { type: "course", ref: "apis-rest" },
      { type: "course", ref: "acceso-a-datos" },
      { type: "course", ref: "sql-aplicado" },
      { type: "course", ref: "docker" },
      { type: "course", ref: "ci-cd" },
      { type: "course", ref: "infraestructura" },
      { type: "course", ref: "observabilidad" },
      { type: "course", ref: "cache-y-rendimiento" },
      { type: "course", ref: "sistemas-distribuidos" },
      { type: "course", ref: "protocolos-y-tiempo-real" },
      { type: "course", ref: "programar-con-ia" },
    ],
  },
  {
    slug: "construir-un-servicio",
    title: "Construir un servicio",
    summary:
      "El ciclo completo de construir y operar un servicio real: versionarlo con Git, gestionar sus dependencias, diseñar su API, hablar con la base de datos y escribir el SQL que de verdad se escribe, containerizarlo, configurarlo por entornos, automatizar su camino a producción y saber qué está pasando ahí dentro cuando ya está en marcha.",
    icon: "bolt",
    steps: [
      { type: "course", ref: "git" },
      { type: "article", ref: "composer" },
      { type: "course", ref: "apis-rest" },
      { type: "course", ref: "acceso-a-datos" },
      { type: "course", ref: "sql-aplicado" },
      { type: "course", ref: "cache-y-rendimiento" },
      { type: "course", ref: "docker" },
      { type: "article", ref: "config-y-entornos" },
      { type: "course", ref: "ci-cd" },
      { type: "course", ref: "infraestructura" },
      { type: "course", ref: "observabilidad" },
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
  {
    slug: "mas-alla-de-php",
    title: "Más allá de PHP",
    summary:
      "Amplía tu stack aprendiendo lenguajes que abren puertas distintas: Go para servicios de alta concurrencia y Rust para sistemas con control total de memoria. Cada curso parte de cero y llega a producción.",
    icon: "code",
    steps: [
      { type: "course", ref: "go" },
      { type: "course", ref: "rust" },
      { type: "course", ref: "python" },
    ],
  },
];
