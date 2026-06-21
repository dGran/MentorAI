/* ============================================================
   Manifiesto de tutoriales
   ------------------------------------------------------------
   Única fuente de verdad del catálogo. La portada (index.html)
   se construye sola a partir de esta lista: filtros, conteos
   por categoría y tarjetas. Para añadir un tutorial, copia un
   objeto y rellénalo. No hace falta tocar nada más del catálogo.

   Campos:
     slug         identificador corto (= nombre del .html)
     title        título visible
     description  resumen de 1-2 frases
     href         ruta a la página del tutorial
     categories   lista para filtrar (genera los chips sola)
     topic        tema principal (etiqueta legible)
     tags         etiquetas decorativas de la tarjeta
     level         "Principiante" | "Intermedio" | "Avanzado"
     minutes      minutos de lectura
     icon         clave de icono (ver ICONS en main.js)
     status       "published" | "soon"
     date         fecha ISO (ordena el catálogo, más nuevo arriba)
     featured     true para resaltar como "Nuevo"
   ============================================================ */

window.ACADEMIA_TUTORIALS = [
  {
    slug: "hashing",
    title: "Hashing: cómo un hashmap busca en O(1)",
    description:
      "Qué hace una función hash, cómo convierte una clave en una posición, qué son las colisiones y cómo se resuelven, el factor de carga y el rehashing, y por qué un hashmap es O(1) de media pero O(n) en el peor caso.",
    href: "tutorials/hashing.html",
    categories: ["algoritmos"],
    topic: "Fundamentos",
    tags: ["Hashing", "Hashmap", "Colisiones"],
    level: "Intermedio",
    minutes: 14,
    icon: "code",
    status: "published",
    date: "2026-06-21",
    featured: true,
  },
  {
    slug: "estructuras-datos",
    title: "Estructuras de datos: cuál usar y cuándo",
    description:
      "Array, lista enlazada, hashmap, set, árbol y grafo: qué hace barato y qué caro cada uno, cómo elegir por la operación que domina y por qué el array de PHP es un mapa ordenado.",
    href: "tutorials/estructuras-datos.html",
    categories: ["algoritmos"],
    topic: "Fundamentos",
    tags: ["Estructuras", "Hashmap", "Árboles"],
    level: "Intermedio",
    minutes: 15,
    icon: "code",
    status: "published",
    date: "2026-06-21",
  },
  {
    slug: "big-o",
    title: "Big-O sin matemáticas: cómo saber si tu código escala",
    description:
      "Qué mide Big-O (cómo crece el coste, no los segundos), las clases que verás en la práctica (O(1), O(log n), O(n), O(n log n), O(n²)) y cómo cazar el O(n²) escondido que mata el rendimiento.",
    href: "tutorials/big-o.html",
    categories: ["algoritmos"],
    topic: "Fundamentos",
    tags: ["Big-O", "Complejidad", "Rendimiento"],
    level: "Intermedio",
    minutes: 14,
    icon: "signal",
    status: "published",
    date: "2026-06-21",
  },
  {
    slug: "numeros-flotantes",
    title: "Números: enteros, complemento a dos y coma flotante",
    description:
      "Por qué un entero no es infinito, cómo se guardan los negativos, qué es el overflow y por qué 0.1 + 0.2 no da 0.3: la coma flotante IEEE-754 y por qué el dinero nunca va en float.",
    href: "tutorials/numeros-flotantes.html",
    categories: ["representacion"],
    topic: "Fundamentos",
    tags: ["Enteros", "IEEE-754", "Overflow"],
    level: "Intermedio",
    minutes: 15,
    icon: "code",
    status: "published",
    date: "2026-06-21",
  },
  {
    slug: "texto-unicode",
    title: "Texto: de ASCII a Unicode y UTF-8",
    description:
      "Por qué un byte se queda corto para el texto, qué resuelve Unicode separando el carácter de sus bytes, cómo UTF-8 lo codifica en 1 a 4 bytes y por qué se rompen acentos y emojis.",
    href: "tutorials/texto-unicode.html",
    categories: ["representacion"],
    topic: "Fundamentos",
    tags: ["Unicode", "UTF-8", "Encoding"],
    level: "Intermedio",
    minutes: 14,
    icon: "code",
    status: "published",
    date: "2026-06-21",
  },
  {
    slug: "bits-y-bytes",
    title: "Bits y bytes: cómo cuenta de verdad un ordenador",
    description:
      "Qué es un bit, por qué ocho forman un byte, cómo se cuenta en binario y hexadecimal, y las operaciones bit a bit (AND, OR, XOR, shifts) detrás de máscaras y permisos.",
    href: "tutorials/bits-y-bytes.html",
    categories: ["representacion"],
    topic: "Fundamentos",
    tags: ["Binario", "Hexadecimal", "Bitwise"],
    level: "Intermedio",
    minutes: 13,
    icon: "code",
    status: "published",
    date: "2026-06-21",
  },
  {
    slug: "rabbitmq",
    title: "RabbitMQ a fondo: exchanges, colas y durabilidad",
    description:
      "Cómo enruta de verdad (exchanges y bindings), las propiedades de las colas, qué hace falta para no perder mensajes (durable + persistente + confirms), acks, DLX y los tipos de cola: classic, quorum y streams.",
    href: "tutorials/rabbitmq.html",
    categories: ["infra", "mensajeria"],
    topic: "Mensajería",
    tags: ["RabbitMQ", "AMQP", "Colas"],
    level: "Avanzado",
    minutes: 18,
    icon: "signal",
    status: "published",
    date: "2026-06-21",
  },
  {
    slug: "inyeccion-dependencias",
    title: "Inyección de dependencias en PHP",
    description:
      "Por qué una clase no debe fabricar sus colaboradores: desacoplar con constructor e interfaces, el contenedor y cómo todo esto hace tus tests triviales.",
    href: "tutorials/inyeccion-dependencias.html",
    categories: ["php", "arquitectura"],
    topic: "PHP",
    tags: ["PHP", "SOLID", "Testing"],
    level: "Intermedio",
    minutes: 16,
    icon: "code",
    status: "published",
    date: "2026-06-21",
  },
  {
    slug: "opcache",
    title: "OPcache: cómo PHP deja de releer tu código",
    description:
      "Qué es, cómo funciona la caché de opcodes en memoria compartida, cómo configurarlo bien y los errores típicos que matan su efecto.",
    href: "tutorials/opcache.html",
    categories: ["php", "rendimiento"],
    topic: "PHP",
    tags: ["PHP", "Bytecode", "JIT"],
    level: "Intermedio",
    minutes: 15,
    icon: "bolt",
    status: "published",
    date: "2026-06-21",
  },
  {
    slug: "preload",
    title: "Preload: precargar clases al arrancar PHP",
    description:
      "El siguiente paso después de OPcache: dejar tu framework cargado en memoria desde el arranque del proceso.",
    href: "tutorials/preload.html",
    categories: ["php", "rendimiento"],
    topic: "PHP",
    tags: ["PHP", "Rendimiento"],
    level: "Avanzado",
    minutes: 12,
    icon: "signal",
    status: "soon",
    date: "2026-06-20",
  },
  {
    slug: "redis-cache",
    title: "Redis como caché de aplicación",
    description:
      "Estrategias de caché, invalidación, TTL y patrones para no dispararte un pie con datos obsoletos.",
    href: "tutorials/redis-cache.html",
    categories: ["infra", "rendimiento"],
    topic: "Infraestructura",
    tags: ["Redis", "Caché"],
    level: "Intermedio",
    minutes: 14,
    icon: "database",
    status: "soon",
    date: "2026-06-19",
  },
];
