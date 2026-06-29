/* ============================================================
   Cursos (colecciones temáticas)
   ------------------------------------------------------------
   Un curso agrupa y ordena lecciones en módulos. El catálogo
   (manifest.js) sigue siendo la fuente de verdad de cada pieza;
   aquí solo vive la estructura y la secuencia. Cada lección
   referencia un slug del manifest:

     - Si el slug existe y está publicado -> enlace + progreso.
     - Si existe como "soon" -> "Próximamente".
     - Si aún no existe -> "Planificado" (se usa el title de aquí).

   Un curso puede tener "modules" (cada uno con su lista de
   "lessons") o "lessons" directo (módulo único implícito). Las
   piezas del manifest que no aparecen en ningún curso son
   "artículos" sueltos.

   Mismo patrón que el manifest: un .js que asigna a un global,
   incluido con <script> antes de los módulos de assets/js/modules/
   (funciona en file://).
   ============================================================ */

window.MENTORAI_COURSES = [
  {
    slug: "git",
    title: "Git: control de versiones",
    summary:
      "Git de principio a fin, también como referencia: los comandos del día a día con su explicación y ejemplo, cómo trabajar con ramas (merge vs rebase, conflictos, pull requests) y cómo salir de cualquier lío deshaciendo y rescatando.",
    level: "Principiante",
    icon: "code",
    lessons: [
      "git-comandos-esenciales",
      "git-ramas-y-flujo",
      "git-deshacer",
    ],
  },
  {
    slug: "apis-rest",
    title: "Diseño de APIs REST",
    summary:
      "Diseñar una API que se entienda sola: qué es REST de verdad (recursos, representaciones, sin estado), elegir verbo y código de estado con criterio, nombrar URLs y paginar, devolver errores consistentes con problem+json, y cuándo REST, RPC o GraphQL.",
    level: "Intermedio",
    icon: "signal",
    lessons: [
      "rest-que-es",
      "rest-metodos-y-estados",
      "rest-diseno-de-urls",
      "rest-errores-y-validacion",
      "rest-vs-rpc-vs-graphql",
    ],
  },
  {
    slug: "oop",
    title: "Programación orientada a objetos",
    summary:
      "Los fundamentos de la OOP en PHP, de cero: clases y objetos, encapsulación, herencia, polimorfismo, interfaces y clases abstractas, hasta saber elegir el tipo de clase adecuado. La base que SOLID y el diseño asumen por sabida.",
    level: "Principiante",
    icon: "code",
    lessons: [
      "oop-clases-y-objetos",
      "herencia",
      "polimorfismo",
      "interfaces",
      "clases-abstractas",
      "tipos-de-clases-php",
    ],
  },
  {
    slug: "solid",
    title: "Principios SOLID",
    summary:
      "Los cinco principios de diseño orientado a objetos de Robert C. Martin, cada uno con su analogía, el código que lo viola y el refactor que lo cumple. De la responsabilidad única a la inversión de dependencias, y cómo encajan los cinco.",
    level: "Intermedio",
    icon: "code",
    lessons: [
      "solid-introduccion",
      "srp-responsabilidad-unica",
      "ocp-abierto-cerrado",
      "lsp-sustitucion-liskov",
      "isp-segregacion-interfaces",
      "dip-inversion-dependencias",
      "solid-en-conjunto",
    ],
  },
  {
    slug: "clean-code",
    title: "Clean Code: escribir para quien lee",
    summary:
      "Escribir código que la próxima persona entienda sin esfuerzo: buenos nombres, funciones pequeñas, comentarios que aportan, manejo de errores con criterio y cómo detectar code smells y refactorizar con seguridad. Adaptado a PHP.",
    level: "Intermedio",
    icon: "code",
    lessons: [
      "clean-code-intro",
      "nombres",
      "funciones-limpias",
      "comentarios",
      "manejo-errores",
      "code-smells-refactoring",
    ],
  },
  {
    slug: "di-contenedores",
    title: "Inyección de dependencias y contenedores",
    summary:
      "De los fundamentos de la inyección de dependencias al contenedor por dentro: por qué una clase no fabrica sus colaboradores, y cómo un contenedor resuelve el grafo con autowiring, ciclo de vida, compilación y la memoria que eso implica.",
    level: "Avanzado",
    icon: "code",
    lessons: [
      "inyeccion-dependencias",
      "contenedor-di",
    ],
  },
  {
    slug: "fundamentos",
    title: "Fundamentos de CS para backend",
    summary:
      "El temario de informática que un backend autodidacta se salta: de los bits a los sistemas distribuidos y la seguridad. Orden bottom-up, cada módulo se apoya en el anterior.",
    level: "Intermedio",
    icon: "code",
    modules: [
      {
        title: "Representación de datos",
        summary: "La materia prima: todo son bits. Lo demás se apoya en esto.",
        lessons: ["bits-y-bytes", "texto-unicode", "numeros-flotantes"],
      },
      {
        title: "Datos y algoritmos",
        summary: "Cómo organizas y mides las operaciones sobre esos datos.",
        lessons: ["big-o", "estructuras-datos", "hashing"],
      },
      {
        title: "Bases de datos",
        summary: "Persistir y consultar con criterio. Usa árboles y hashing.",
        lessons: ["indices-btree", "transacciones-acid", "modelado-relacional"],
      },
      {
        title: "El sistema por debajo",
        summary: "Cómo se ejecuta tu código: procesos, hilos y memoria.",
        lessons: ["procesos-hilos", "concurrencia", "async-event-loop", "memoria"],
      },
      {
        title: "Cómo viaja un dato (redes)",
        summary: "Comunicación entre máquinas. Necesita bytes y conexiones.",
        lessons: ["url-a-fondo", "http-a-fondo", "tcp-ip"],
      },
      {
        title: "Sistemas distribuidos",
        summary: "Coordinar varias máquinas: redes + concurrencia + consistencia.",
        lessons: ["idempotencia", "cap-consistencia", "redis-cache"],
      },
      {
        title: "Seguridad de fundamentos",
        summary: "Cierra el círculo: usa hashing, TLS e inyección.",
        lessons: ["hashing-vs-cifrado", "autenticacion", "owasp"],
      },
    ],
  },
  {
    slug: "testing",
    title: "Testing y TDD para backend",
    summary:
      "Escribir código con red de seguridad: el ciclo de TDD, cómo organizar los tests en niveles, los dobles para aislar dependencias y cómo evitar los tests que estorban.",
    level: "Intermedio",
    icon: "code",
    lessons: [
      "tdd-ciclo",
      "tipos-de-test",
      "test-doubles",
      "tests-que-no-estorban",
    ],
  },
  {
    slug: "programar-con-ia",
    title: "Programar con IA",
    summary:
      "Trabajar con modelos y agentes sin perder el criterio: cómo piensa un LLM, prompting para código, el flujo con agentes y la gestión de los riesgos de lo generado.",
    level: "Intermedio",
    icon: "signal",
    lessons: [
      "conceptos-ia",
      "como-piensa-un-llm",
      "prompting-para-codigo",
      "flujo-con-agentes",
      "criterio-y-riesgos",
    ],
  },
  {
    slug: "diseno-y-arquitectura",
    title: "Diseño y arquitectura",
    summary:
      "De la teoría a la práctica del diseño táctico y estratégico: arquitectura hexagonal, Domain-Driven Design y CQRS con event sourcing. Cada módulo se apoya en el anterior.",
    level: "Avanzado",
    icon: "code",
    modules: [
      {
        title: "Arquitectura hexagonal",
        summary: "Proteger el dominio del mundo exterior con puertos y adaptadores.",
        lessons: ["hexagonal", "hexagonal-en-php"],
      },
      {
        title: "Domain-Driven Design",
        summary: "Modelar dominios complejos: lo estratégico, lo táctico y los eventos.",
        lessons: [
          "ddd-que-es",
          "ddd-estrategico",
          "ddd-tactico",
          "eventos-de-dominio",
        ],
      },
      {
        title: "CQRS y Event Sourcing",
        summary: "Separar lecturas de escrituras y guardar la historia como verdad.",
        lessons: ["cqrs", "cqrs-event-sourcing"],
      },
    ],
  },
];
