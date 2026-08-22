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
    slug: "cache-y-rendimiento",
    title: "Caché y rendimiento",
    summary:
      "El ciclo completo de hacer que algo vaya rápido: medir con percentiles en vez de medias, perfilar para saber dónde se va el tiempo, arreglar la base de datos —que es casi siempre— y cachear con criterio, incluida la parte difícil de verdad, que es invalidar. Cierra sabiendo cuándo parar.",
    level: "Avanzado",
    icon: "bolt",
    modules: [
      {
        title: "Medir antes de tocar",
        summary: "Optimizar sin medir es adivinar: percentiles, perfilado y presupuesto de latencia.",
        lessons: ["cr-medir-primero", "cr-perfilado", "cr-presupuesto"],
      },
      {
        title: "Casi siempre es la base de datos",
        summary: "Encontrar la consulta culpable y arreglarla sin romper lo demás.",
        lessons: [
          "cr-consultas-lentas",
          "cr-indices-en-practica",
          "cr-paginacion",
          "cr-conexiones-y-pool",
        ],
      },
      {
        title: "Cachear con criterio",
        summary: "Las capas, los patrones, la invalidación y la estampida.",
        lessons: [
          "cr-capas-de-cache",
          "cr-patrones-de-cache",
          "cr-invalidacion",
          "cr-estampida",
          "cr-http-cache",
        ],
      },
      {
        title: "El resto del stack",
        summary: "Lo que mueves, lo que puedes sacar de la petición y cuándo parar.",
        lessons: ["cr-payload-y-serializacion", "cr-fuera-del-camino-critico", "cr-cuando-parar"],
      },
    ],
  },
  {
    slug: "infraestructura",
    title: "Infraestructura",
    summary:
      "Operar lo que hay debajo de tu código: un servidor que arranca solo y se defiende, nginx y TLS delante, DNS y balanceo repartiendo el tráfico, despliegues que no tiran nada, y las cosas de las que nadie se acuerda hasta que hacen falta — copias que restauran, capacidad medida y una guardia con runbook.",
    level: "Avanzado",
    icon: "shield",
    modules: [
      {
        title: "La máquina",
        summary: "Qué hay debajo y cómo se deja lista para producción.",
        lessons: ["inf-servidor-por-dentro", "inf-systemd", "inf-hardening"],
      },
      {
        title: "Servir tráfico",
        summary: "De la petición del navegador a tu proceso: proxy, cifrado, nombres y reparto.",
        lessons: ["inf-nginx", "inf-tls", "inf-dns", "inf-balanceo"],
      },
      {
        title: "Empaquetar y desplegar",
        summary: "Dónde corre tu código y cómo se sustituye sin que se note.",
        lessons: [
          "inf-vm-contenedor-funcion",
          "inf-orquestacion",
          "inf-despliegues-sin-caida",
          "inf-configuracion-y-secretos",
        ],
      },
      {
        title: "Que siga funcionando",
        summary: "Reproducible, recuperable, dimensionado y atendido.",
        lessons: ["inf-iac", "inf-backups", "inf-capacidad", "inf-guardias-y-postmortem"],
      },
    ],
  },
  {
    slug: "protocolos-y-tiempo-real",
    title: "Protocolos y tiempo real",
    summary:
      "Cómo hablan de verdad dos máquinas: qué resuelve cada versión de HTTP, qué cuesta el handshake de TLS, cuándo un formato binario compensa, y todo el repertorio de tiempo real — polling, SSE, WebSockets y webhooks— con la tabla de decisión para no elegir por moda.",
    level: "Avanzado",
    icon: "signal",
    modules: [
      {
        title: "HTTP de verdad",
        summary: "Las versiones, el cifrado y las cabeceras que cambian el comportamiento.",
        lessons: ["pr-http1-a-http3", "pr-tls-handshake", "pr-cabeceras-que-importan"],
      },
      {
        title: "Formatos y contratos",
        summary: "Qué mueves por el cable y cómo cambiarlo sin romper a nadie.",
        lessons: ["pr-serializacion", "pr-grpc", "pr-compatibilidad"],
      },
      {
        title: "Tiempo real",
        summary: "Las cuatro formas de empujar datos al cliente y qué cuesta cada una.",
        lessons: [
          "pr-polling",
          "pr-sse",
          "pr-websockets",
          "pr-elegir-transporte",
          "pr-escalar-tiempo-real",
        ],
      },
      {
        title: "Integrar con otros",
        summary: "Recibir eventos de terceros, firmarlos y devolver respuestas largas.",
        lessons: [
          "pr-webhooks",
          "pr-firmas-y-replay",
          "pr-streaming-http",
          "pr-cuando-no-tiempo-real",
        ],
      },
    ],
  },
  {
    slug: "sistemas-distribuidos",
    title: "Sistemas distribuidos",
    summary:
      "Lo que pasa cuando tu código deja de correr en una sola máquina: fallos parciales, relojes que mienten, datos repartidos y transacciones que ya no caben en un BEGIN. Da por leído el módulo de distribuidos de Fundamentos y va a la parte dura, con ejemplos en PHP. Cierra con la pregunta que casi nadie hace: cuándo NO distribuir.",
    level: "Avanzado",
    icon: "signal",
    modules: [
      {
        title: "Por qué esto es difícil",
        summary: "El modelo mental: qué deja de ser cierto en cuanto sales de un proceso.",
        lessons: ["sd-falacias", "sd-fallos-parciales", "sd-relojes-y-orden"],
      },
      {
        title: "Cómo se hablan los servicios",
        summary: "Síncrono o asíncrono, qué garantiza cada entrega y cómo no perder eventos.",
        lessons: [
          "sd-sincrono-vs-asincrono",
          "sd-garantias-de-entrega",
          "sd-outbox",
          "sd-colas-y-topicos",
        ],
      },
      {
        title: "Datos repartidos",
        summary: "Replicación, particionado y las transacciones que cruzan servicios.",
        lessons: [
          "sd-replicacion",
          "sd-particionado",
          "sd-transacciones-distribuidas",
          "sd-sagas",
        ],
      },
      {
        title: "Sobrevivir al fallo",
        summary: "El repertorio de resiliencia: timeouts, reintentos, cortacircuitos y colas de muertos.",
        lessons: [
          "sd-timeouts-y-reintentos",
          "sd-circuit-breaker",
          "sd-dlq-y-reproceso",
          "sd-backpressure",
        ],
      },
      {
        title: "Coordinación y operación",
        summary: "Ponerse de acuerdo entre nodos, y saber qué pasa cuando ya está en marcha.",
        lessons: [
          "sd-consenso",
          "sd-locks-distribuidos",
          "sd-trazas-distribuidas",
          "sd-cuando-no-distribuir",
        ],
      },
    ],
  },
  {
    slug: "go",
    title: "Go desde cero",
    summary:
      "Aprende Go de principio a fin: el entorno dockerizado, los fundamentos del lenguaje, el modelo de interfaces y composición, la concurrencia con goroutines y channels, y cómo construir un servicio HTTP real. Con ejemplos prácticos y contraste constante con PHP.",
    level: "Intermedio",
    icon: "code",
    modules: [
      {
        title: "El lenguaje y tu primer programa",
        summary: "Por qué Go, cómo montar el entorno y escribir el primer programa que funciona.",
        lessons: ["go-que-es", "go-entorno-docker", "go-editores", "go-primer-programa"],
      },
      {
        title: "Fundamentos del lenguaje",
        summary: "Las piezas básicas: paquetes, tipos, funciones, structs, punteros y colecciones.",
        lessons: ["go-paquetes-y-modulos", "go-tipos-y-variables", "go-funciones-y-control", "go-structs-y-metodos", "go-punteros", "go-slices-y-maps"],
      },
      {
        title: "El modelo de Go",
        summary: "Las ideas que hacen Go diferente: interfaces implícitas, composición, errores como valores y generics.",
        lessons: ["go-interfaces", "go-composicion", "go-errores", "go-generics"],
      },
      {
        title: "Concurrencia: la joya",
        summary: "Goroutines, channels y el modelo de concurrencia que distingue a Go.",
        lessons: ["goroutines", "go-channels", "go-sync-y-context"],
      },
      {
        title: "Backend con Go",
        summary: "HTTP, JSON, base de datos, testing y producción: todo lo que necesitas para un servicio real.",
        lessons: ["go-http", "go-json-y-bd", "go-testing", "go-a-produccion"],
      },
    ],
  },
  {
    slug: "terminal-linux",
    title: "Terminal y Linux para desarrolladores",
    summary:
      "De cero al día a día en Linux: el sistema de ficheros y el árbol FHS, navegación y gestión de ficheros, permisos, usuarios y grupos, búsquedas con find y grep, pipes y redirección, scripting bash, paquetes y cron, y diagnóstico de procesos, SSH y red.",
    level: "Intermedio",
    icon: "bolt",
    lessons: [
      "linux-filesystem",
      "linux-navegacion",
      "linux-permisos",
      "linux-usuarios",
      "linux-busquedas",
      "linux-texto-y-pipes",
      "linux-scripting",
      "linux-sistema",
      "linux-procesos-y-red",
    ],
  },
  {
    slug: "framework-por-dentro",
    title: "Cómo funciona un framework por dentro",
    summary:
      "El recorrido mecánico de una petición HTTP en Symfony y Laravel — de nginx al controlador y vuelta — y los mecanismos formales para extender el framework sin tocar su núcleo: tagged services, compiler passes, service providers, middleware y event subscribers.",
    level: "Avanzado",
    icon: "code",
    lessons: [
      "framework-ciclo-http",
      "framework-extension-points",
    ],
  },
  {
    slug: "patrones-diseno",
    title: "Patrones de diseño GoF",
    summary:
      "El vocabulario compartido del diseño orientado a objetos: los 11 patrones más frecuentes en código de producción, agrupados por familia, con PHP y con los ojos puestos en Symfony y Laravel.",
    level: "Intermedio",
    icon: "code",
    lessons: [
      "patrones-introduccion",
      "patrones-creacionales",
      "patrones-estructurales",
      "patrones-comportamiento-1",
      "patrones-comportamiento-2",
      "patrones-en-el-framework",
    ],
  },
  {
    slug: "sql-aplicado",
    title: "SQL aplicado avanzado",
    summary:
      "El SQL que se escribe a diario en un proyecto real: JOINs con criterio, agregación con GROUP BY y HAVING, subconsultas y CTEs para consultas legibles, y window functions para ranking, acumulados y top-N por grupo.",
    level: "Intermedio",
    icon: "database",
    lessons: [
      "sql-joins",
      "sql-agregacion",
      "sql-subqueries-ctes",
      "sql-window-functions",
    ],
  },
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
    slug: "acceso-a-datos",
    title: "Acceso a datos y ORM",
    summary:
      "El puente entre tu código y la base de datos: ORM, query builder o SQL plano según el caso, las dos filosofías de mapeo (Active Record vs Data Mapper), el problema N+1 y cómo evitarlo, migraciones de esquema y cómo el ORM gestiona transacciones con el unit of work.",
    level: "Intermedio",
    icon: "database",
    lessons: [
      "orm-vs-sql",
      "active-record-vs-data-mapper",
      "problema-n-mas-1",
      "migraciones-de-esquema",
      "orm-transacciones-unit-of-work",
    ],
  },
  {
    slug: "docker",
    title: "Docker para desarrollo",
    summary:
      "Containerizar tu servicio de principio a fin: imagen vs contenedor y por qué no es una VM, el Dockerfile y la caché de capas, docker-compose para levantar el entorno entero, imágenes pequeñas y seguras con multi-stage, y el montaje real de PHP con nginx y php-fpm.",
    level: "Intermedio",
    icon: "code",
    lessons: [
      "docker-imagen-vs-contenedor",
      "dockerfile-y-capas",
      "docker-compose",
      "docker-buenas-practicas",
      "php-en-docker",
    ],
  },
  {
    slug: "ci-cd",
    title: "CI/CD: integración y despliegue continuos",
    summary:
      "Del push a producción sin rituales: qué resuelven la integración y la entrega continuas, la anatomía de un pipeline (jobs, runners, artefactos, caché), el pipeline real de un proyecto PHP con PHPUnit y PHPStan, y desplegar sin miedo con blue-green, canary y rollback.",
    level: "Intermedio",
    icon: "bolt",
    lessons: [
      "ci-cd-que-es",
      "pipeline-anatomia",
      "ci-para-php",
      "despliegue-continuo",
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
    title: "TDD y fundamentos de testing",
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
    slug: "observabilidad",
    title: "Observabilidad y monitoring",
    summary:
      "Logs, métricas y trazas — los tres pilares — con el stack de facto: Sentry para errores, Prometheus y PromQL para métricas, Loki y LogQL para logs, Grafana para dashboards y Alertmanager para alertas que se atienden.",
    level: "Avanzado",
    icon: "signal",
    modules: [
      {
        title: "Fundamentos",
        summary: "Los tres pilares y cómo estructurar los logs para que sean consultables.",
        lessons: ["observabilidad-pilares", "logs-estructurados"],
      },
      {
        title: "Errores con Sentry",
        summary: "Capturar, agrupar y priorizar excepciones en producción.",
        lessons: ["sentry-error-tracking", "sentry-a-fondo"],
      },
      {
        title: "Métricas con Prometheus",
        summary: "Instrumentar, scrappear y consultar métricas con PromQL.",
        lessons: ["metricas-prometheus", "promql"],
      },
      {
        title: "Logs y dashboards con Grafana",
        summary: "Visualizar métricas y consultar logs con Loki desde el mismo panel.",
        lessons: ["grafana-dashboards", "loki-logql"],
      },
      {
        title: "Alerting",
        summary: "Alertas que se atienden: síntomas, SLO, error budget y fatiga cero.",
        lessons: ["alerting"],
      },
    ],
  },
  {
    slug: "phpunit",
    title: "PHPUnit en profundidad",
    summary:
      "Del primer test a la suite completa: anatomía de un test, casos paramétricos con data providers, ciclo de vida de fixtures, stubs y mocks para aislar dependencias, testear excepciones y medir cobertura, y tests de integración con base de datos real.",
    level: "Avanzado",
    icon: "code",
    lessons: [
      "phpunit-primeros-pasos",
      "phpunit-data-providers",
      "phpunit-fixtures",
      "phpunit-mocks",
      "phpunit-excepciones-cobertura",
      "phpunit-integracion-bbdd",
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
    slug: "claude-code",
    title: "Claude Code: ingeniería con agentes",
    summary:
      "Dominar la herramienta agéntica de principio a fin: cómo funciona el agente por dentro (el bucle de tools, el contexto finito, planificar y verificar, subagentes), cómo se configura el entorno (rules, skills, memoria entre sesiones, MCP) y cómo se automatiza (hooks, headless, CI y el flujo de equipo). Cada concepto es transferible a cualquier agente; los ejemplos, de Claude Code.",
    level: "Avanzado",
    icon: "bolt",
    modules: [
      {
        title: "El agente por dentro",
        summary: "Qué hace de verdad la herramienta cuando le pides algo: el bucle, el contexto, el plan y la verificación.",
        lessons: [
          "cc-agente-por-dentro",
          "cc-contexto-finito",
          "cc-plan-y-verificacion",
          "cc-subagentes",
        ],
      },
      {
        title: "Configurar tu entorno",
        summary: "Rules que se obedecen, skills que empaquetan flujos, memoria entre sesiones y MCP para conectar tus herramientas.",
        lessons: [
          "cc-rules",
          "cc-skills",
          "cc-memoria-y-continuidad",
          "cc-mcp",
        ],
      },
      {
        title: "Automatizar",
        summary: "Del uso interactivo a la máquina: hooks y permisos, modo headless, agentes en CI y el flujo de equipo.",
        lessons: [
          "cc-hooks-y-permisos",
          "cc-headless-y-ci",
          "cc-flujo-de-equipo",
        ],
      },
    ],
  },
  {
    slug: "construir-con-ia",
    title: "Construir con IA",
    summary:
      "Meter un LLM dentro de tu producto con criterio: llamar a la API desde el backend, obtener JSON fiable con structured output y tool use, hacer streaming de la respuesta y controlar coste, caché y calidad con evaluaciones mínimas. Con PHP como lenguaje de ejemplo.",
    level: "Avanzado",
    icon: "signal",
    lessons: [
      "ia-llamar-a-un-llm",
      "ia-structured-output",
      "ia-streaming",
      "ia-coste-y-evaluacion",
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
  {
    slug: "python",
    title: "Python desde cero",
    summary:
      "Aprende Python de principio a fin: el entorno dockerizado, los fundamentos del lenguaje, los patrones idiomáticos de Python (comprehensions, decoradores, generadores), y cómo construir una API real con FastAPI y SQLAlchemy.",
    level: "Intermedio",
    icon: "code",
    modules: [
      {
        title: "Introducción y entorno",
        summary: "Qué es Python, para qué proyectos encaja y cómo montar un entorno dockerizado desde cero.",
        lessons: [
          "python-que-es",
          "python-entorno-docker",
          "python-editores",
          "python-primer-programa",
        ],
      },
      {
        title: "Fundamentos del lenguaje",
        summary: "Tipos dinámicos, control de flujo, funciones, clases y módulos.",
        lessons: [
          "python-tipos-y-variables",
          "python-control-de-flujo",
          "python-funciones",
          "python-clases-y-oop",
          "python-modulos-y-paquetes",
        ],
      },
      {
        title: "Patrones idiomáticos",
        summary: "Comprehensions, generadores, decoradores, context managers y tipado estático con mypy.",
        lessons: [
          "python-comprehensions-y-generadores",
          "python-decoradores",
          "python-context-managers",
          "python-tipado-con-mypy",
        ],
      },
      {
        title: "Backend con FastAPI",
        summary: "Una API real con FastAPI: rutas, Pydantic, middleware, SQLAlchemy async y testing con pytest.",
        lessons: [
          "python-fastapi-intro",
          "python-pydantic",
          "python-sqlalchemy-async",
          "python-testing-pytest",
        ],
      },
      {
        title: "Async y producción",
        summary: "Async/await en profundidad, Docker, configuración por entornos y logging estructurado.",
        lessons: [
          "python-async-await",
          "python-docker",
          "python-configuracion",
          "python-a-produccion",
        ],
      },
    ],
  },
  {
    slug: "rust",
    title: "Rust desde cero",
    summary:
      "Aprende Rust de principio a fin: el entorno dockerizado, los fundamentos del lenguaje, el sistema de ownership que lo hace único, la concurrencia sin data races y cómo construir un servicio web con Axum. Con ejemplos prácticos y contraste constante con PHP y Go.",
    level: "Intermedio",
    icon: "code",
    modules: [
      {
        title: "Introducción y entorno",
        summary: "Qué es Rust, por qué existe y cómo montar un entorno de trabajo dockerizado desde cero.",
        lessons: [
          "rust-que-es",
          "rust-entorno-docker",
          "rust-editores",
          "rust-primer-programa",
        ],
      },
      {
        title: "Fundamentos del lenguaje",
        summary: "Los bloques básicos: tipos, control de flujo, funciones, structs, enums y pattern matching.",
        lessons: [
          "rust-tipos-y-variables",
          "rust-control-de-flujo",
          "rust-funciones",
          "rust-structs-y-enums",
          "rust-pattern-matching",
        ],
      },
      {
        title: "El sistema de tipos avanzado",
        summary: "Traits, el ownership que diferencia a Rust, borrowing, lifetimes y smart pointers.",
        lessons: [
          "rust-traits",
          "rust-ownership",
          "rust-borrowing",
          "rust-lifetimes",
          "rust-smart-pointers",
        ],
      },
      {
        title: "Concurrencia y asincronía",
        summary: "Threads sin data races, canales, async/await con Tokio y manejo de errores con ?.",
        lessons: [
          "rust-concurrencia",
          "rust-async-tokio",
          "rust-errores",
        ],
      },
      {
        title: "Ecosistema y producción",
        summary: "Cargo y crates, un servidor HTTP con Axum, serialización con Serde, testing y despliegue.",
        lessons: [
          "rust-cargo-y-crates",
          "rust-axum",
          "rust-serde-y-bd",
          "rust-testing-y-produccion",
        ],
      },
    ],
  },
];
