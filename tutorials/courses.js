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
   incluido con <script> antes de main.js (funciona en file://).
   ============================================================ */

window.MENTORAI_COURSES = [
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
];
