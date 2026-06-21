/* ============================================================
   Ruta de aprendizaje (itinerario)
   ------------------------------------------------------------
   Define el ORDEN recomendado de los tutoriales, agrupados por
   pilares. El catálogo (manifest.js) sigue siendo la fuente de
   verdad de cada tutorial; aquí solo vive la estructura y la
   secuencia. Cada paso referencia un slug del manifest:

     - Si el slug existe y está publicado -> enlace + progreso.
     - Si existe como "soon" -> "Próximamente".
     - Si aún no existe -> "Planificado" (se usa el title de aquí).

   Mismo patrón que el manifest: un .js que asigna a un global,
   incluido con <script> antes de main.js (funciona en file://).
   ============================================================ */

window.MENTORAI_ROADMAP = [
  {
    id: "representacion",
    title: "Representación de datos",
    summary: "La materia prima: todo son bits. Lo demás se apoya en esto.",
    steps: [
      { slug: "bits-y-bytes", title: "Bits y bytes" },
      { slug: "texto-unicode", title: "Texto: de ASCII a Unicode y UTF-8" },
      { slug: "numeros-flotantes", title: "Números: enteros y coma flotante" },
    ],
  },
  {
    id: "algoritmos",
    title: "Datos y algoritmos",
    summary: "Cómo organizas y mides las operaciones sobre esos datos.",
    steps: [
      { slug: "big-o", title: "Big-O sin matemáticas" },
      { slug: "estructuras-datos", title: "Estructuras de datos: cuál y cuándo" },
      { slug: "hashing", title: "Hashing por dentro" },
    ],
  },
  {
    id: "bbdd",
    title: "Bases de datos",
    summary: "Persistir y consultar con criterio. Usa árboles y hashing.",
    steps: [
      { slug: "indices-btree", title: "Índices y B-tree" },
      { slug: "transacciones-acid", title: "Transacciones y ACID" },
      { slug: "modelado-relacional", title: "Modelado relacional" },
    ],
  },
  {
    id: "sistemas",
    title: "El sistema por debajo",
    summary: "Cómo se ejecuta tu código: procesos, hilos y memoria.",
    steps: [
      { slug: "procesos-hilos", title: "Procesos vs hilos" },
      { slug: "concurrencia", title: "Concurrencia: el bug que solo pasa en prod" },
      { slug: "async-event-loop", title: "Async y el event loop" },
      { slug: "memoria", title: "Memoria: stack, heap y caché" },
    ],
  },
  {
    id: "redes",
    title: "Cómo viaja un dato (redes)",
    summary: "Comunicación entre máquinas. Necesita bytes y conexiones.",
    steps: [
      { slug: "url-a-fondo", title: "Qué pasa al escribir una URL" },
      { slug: "http-a-fondo", title: "HTTP a fondo" },
      { slug: "tcp-ip", title: "TCP/IP" },
    ],
  },
  {
    id: "distribuidos",
    title: "Sistemas distribuidos",
    summary: "Coordinar varias máquinas: redes + concurrencia + consistencia.",
    steps: [
      { slug: "idempotencia", title: "Idempotencia y entrega at-least-once" },
      { slug: "cap-consistencia", title: "CAP y consistencia eventual" },
      { slug: "redis-cache", title: "Redis como caché distribuida" },
    ],
  },
  {
    id: "seguridad",
    title: "Seguridad de fundamentos",
    summary: "Cierra el círculo: usa hashing, TLS e inyección.",
    steps: [
      { slug: "hashing-vs-cifrado", title: "Hashing vs cifrado" },
      { slug: "autenticacion", title: "Autenticación: sesiones, JWT, OAuth" },
      { slug: "owasp", title: "OWASP imprescindible" },
    ],
  },
  {
    id: "monograficos",
    title: "Monográficos aplicados",
    summary: "Temas concretos de tu stack PHP e infraestructura.",
    steps: [
      { slug: "opcache", title: "OPcache" },
      { slug: "preload", title: "Preload" },
      { slug: "inyeccion-dependencias", title: "Inyección de dependencias" },
      { slug: "rabbitmq", title: "RabbitMQ a fondo" },
    ],
  },
];
