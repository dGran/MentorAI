# Plan — SOLID + Clean Code (2026-06-27)

Frente de diseño/calidad de código, pedido por el usuario ("¿tenemos curso de
SOLID? estaría bien cada punto con ejemplos claros" + "también estaría bien algo
de clean code"). Complementa a `object-calisthenics.html` (ya publicado, artículo
suelto) en la misma familia: buenas prácticas de diseño OO.

**Decisiones (AskUserQuestion):**
- SOLID: **curso propio** (no módulo del curso de arquitectura).
- DIP: **lección nueva y breve** que remite a `inyeccion-dependencias` (el
  artículo sigue suelto, no se reescribe ni se mueve).
- Clean Code: **curso propio** (confirmado por el usuario: "clean code como curso
  aparte", NO agrupado con SOLID).
- Contenedor de DI por dentro: **un artículo denso**, integrado **en un curso**
  nuevo de DI junto al artículo existente (ver Curso 3).

Categoría: **reusar `arquitectura`** para ambos (no proliferar chips; ya la usan
object-calisthenics, hexagonal, DDD, CQRS). Ejemplos PHP en formato comparativa
(`compare`: mal → bien). Sin lenguajes nuevos en el highlighter.

---

## Curso 0 — Programación orientada a objetos (`oop`)

Pedido por el usuario (2026-06-27): "POO, herencia y polimorfismo... ¿tenemos
algo? ¿quizá un curso? son fundamentos básicos". Verificado: **no existe nada**
de OOP fundamentos; las interfaces se usan (DI, hexagonal, DDD) pero nunca se
explican; `abstract` no aparece como clase abstracta en ningún sitio. El usuario
destaca especial interés en **interfaces**, **clases abstractas** y **los tipos
de clases de PHP y cuándo usar cada una**.

Es el fundamento que va **antes de SOLID** (SOLID asume OOP). Curso propio,
nivel Principiante→Intermedio, icon `code`, topic "Orientación a objetos".
Categoría nueva `oop` (label "Orientación a objetos" en CATEGORY_LABELS), o
reusar `php` si se prefiere no añadir chip — **decidir al publicar**. Ejemplos
PHP en `compare` donde aplique. 6 lecciones:

1. **`oop-clases-y-objetos`** (Princ, 13m) — qué resuelve la OOP, clase vs objeto
   (molde vs instancia), estado y comportamiento, instanciación, `$this`,
   constructor, **encapsulación** (visibilidad public/protected/private, por qué
   ocultar el estado). El primer pilar.
2. **`herencia`** (Int, 14m) — `extends`, reutilizar y especializar, `parent::`,
   sobrescribir métodos, jerarquías; **herencia vs composición** (preferir
   composición), el problema de las jerarquías profundas/frágiles. Cruza
   object-calisthenics y (futuro) LSP.
3. **`polimorfismo`** (Int, 14m) — un mismo mensaje, distintas respuestas;
   polimorfismo por herencia y por interfaces; type hints como contrato;
   sustituibilidad (puente a LSP). El pilar que da flexibilidad.
4. **`interfaces`** (Int, 13m) — la interfaz como **contrato** (qué, no cómo),
   `implements`, programar contra interfaces (puente a DIP/inyección), implementar
   varias, interface vs herencia. Cruza inyeccion-dependencias e (futuro) ISP.
5. **`clases-abstractas`** (Int, 13m) — clase abstracta y métodos abstractos,
   plantilla parcial (template method), **abstract vs interface: cuándo cada
   una** (el punto que más le interesa al usuario). Cruza interfaces.
6. **`tipos-de-clases-php`** (Int, 15m) — el "zoo" de PHP y cuándo usar cada uno:
   clase normal, `abstract`, `final`, `interface`, `trait`, `enum` (8.1),
   propiedades `readonly` (8.2), clases anónimas. Tabla de decisión. Cierra el
   curso atando interfaces/abstract con el resto.

Total: **6 lecciones**. Posible 1 chip nuevo (`oop`).

## Curso 1 — SOLID (`solid`)

"Principios SOLID", nivel Intermedio, icon `code`, topic "Principios SOLID".
7 lecciones, categoría `["arquitectura"]`. Cada principio = una analogía + el
problema (código que viola el principio) + la solución (refactor) en `compare`.

1. **`solid-introduccion`** (Int, 13m) — qué es SOLID, de dónde viene (Robert C.
   Martin), el hilo común (gestionar el cambio y las dependencias), por qué los 5
   se refuerzan, aviso de no sobre-aplicar (no es una checklist). Sin/poco código.
2. **`srp-responsabilidad-unica`** (Int, 13m) — SRP: "una sola razón para
   cambiar"; god class (factura que calcula + persiste + imprime) → tres clases.
   Cohesión. Cruza object-calisthenics (entidades pequeñas).
3. **`ocp-abierto-cerrado`** (Int, 14m) — OCP: abierto a extensión, cerrado a
   modificación; `switch`/`if` por tipo que crece a cada feature → polimorfismo /
   patrón estrategia. Cruza inyeccion-dependencias.
4. **`lsp-sustitucion-liskov`** (Avz, 14m) — LSP: un subtipo debe poder sustituir
   al base sin romper expectativas; el clásico cuadrado/rectángulo, precondiciones
   que no se endurecen / postcondiciones que no se debilitan, herencia que miente.
5. **`isp-segregacion-interfaces`** (Int, 13m) — ISP: interfaces pequeñas y
   específicas; interfaz "gorda" que obliga a implementar métodos que no usas →
   varias interfaces finas por rol. Cruza ddd-tactico (puertos).
6. **`dip-inversion-dependencias`** (Int, 12m, **breve**) — DIP: depender de
   abstracciones, no de concreciones; resumen del principio + ejemplo mínimo, y
   **remite a `inyeccion-dependencias` y `hexagonal`** para profundizar (no
   duplica su contenido).
7. **`solid-en-conjunto`** (Avz, 13m) — cómo encajan los 5, cómo se apoyan entre
   sí, errores comunes (sobre-ingeniería, abstracciones especulativas), cuándo NO
   forzarlos. Cierre del curso.

Total: **7 lecciones**.

---

## Curso 2 — Clean Code (`clean-code`)

"Clean Code: escribir para quien lee", nivel Intermedio, icon `code`, topic
"Clean Code". 6 lecciones, categoría `["arquitectura"]`. Base: el libro de Robert
C. Martin, adaptado a PHP y a las convenciones del repo (booleanos `is/has/should`,
sin `else`, naming semántico).

1. **`clean-code-intro`** (Int, 13m) — qué es código limpio, "se lee mucho más de
   lo que se escribe", el coste real del código sucio (la deuda diaria), la regla
   del boy scout (dejarlo más limpio de como lo encontraste).
2. **`nombres`** (Int, 13m) — naming con intención: revelar el porqué, evitar
   desinformación, nombres pronunciables y buscables, no abreviar, convenciones
   (`is/has/should` para booleanos). Cruza object-calisthenics (no abreviar).
3. **`funciones-limpias`** (Int, 14m) — funciones pequeñas que hacen una cosa, un
   solo nivel de abstracción, pocos argumentos, sin efectos secundarios ocultos,
   command-query separation, early return en vez de anidar. Cruza
   object-calisthenics (un nivel de indentación) y tdd-ciclo.
4. **`comentarios`** (Int, 12m) — por qué un buen comentario es raro: comentarios
   que mienten, comentarios que suplen un mal nombre, el código se explica con
   naming; cuándo sí comentar (el porqué, no el qué; avisos, decisiones). Conecta
   con la convención del repo (sin comentarios de prosa).
5. **`manejo-errores`** (Int, 13m) — excepciones vs códigos de error, no devolver
   ni pasar `null`, excepciones específicas (no genéricas), fail fast, separar la
   lógica del manejo de errores. Cruza las rules del proyecto.
6. **`code-smells-refactoring`** (Avz, 15m) — catálogo de code smells (duplicación,
   método largo, clase grande, lista de parámetros larga, feature envy, obsesión
   por primitivos), refactoring **seguro** apoyado en tests, refactors comunes
   (extraer método/clase, reemplazar condicional por polimorfismo). Cruza el curso
   de testing y SOLID.

Total: **6 lecciones**.

---

## Curso 3 — Inyección de dependencias y contenedores (`di-contenedores`)

"Inyección de dependencias y contenedores", nivel Intermedio→Avanzado, icon
`code`, topic "Inyección de dependencias". Resuelve la petición del usuario de
profundizar en el container ("cómo funciona, garbage collection, gestión de
memoria"). Decidido: **1 artículo denso nuevo**, integrado **en un curso** junto
al artículo ya existente. 2 lecciones:

1. **`inyeccion-dependencias`** (YA EXISTE — se **reutiliza como lección**, deja de
   ser artículo suelto; NO se reescribe) — los fundamentos: constructor,
   interfaces/DIP, contenedor por encima, testing con fakes.
2. **`contenedor-di`** (NUEVO, Avz, ~18m, `["php","arquitectura"]`) — el contenedor
   **por dentro**, denso. Secciones: qué problema resuelve y definiciones de
   servicio; **resolución recursiva + autowiring por reflexión** del constructor;
   detección de ciclos; **ciclo de vida** (shared/singleton vs factory, lazy
   services con proxies); **container compilado vs runtime** (Symfony compila a PHP
   plano para no reflexionar en cada request); **memoria y GC**: cuánto vive un
   servicio (FPM = request, "gratis" por la arena de Zend → memoria-php; workers
   long-running Swoole/RoadRunner = persiste entre requests → leaks y estado
   compartido), ciclos de referencia entre servicios y el container; el **service
   locator** como antipatrón. Cruza inyeccion-dependencias, memoria-php,
   workers-php, php-fpm. Highlighter: php.

**Implicación:** `inyeccion-dependencias` pasa de artículo suelto a lección del
curso `di-contenedores`. La **lección DIP del curso SOLID** sigue remitiendo a
este curso/lección (el enlace funciona esté donde esté el slug). En la vista
Artículos dejará de aparecer `inyeccion-dependencias` (pasa a ser lección).

## Resumen de impacto

- **20 tutoriales nuevos** (6 OOP + 7 SOLID + 6 Clean Code + 1 contenedor-di).
- **4 cursos nuevos** en courses.js (`oop`, `solid`, `clean-code`,
  `di-contenedores`).
- **Posible 1 categoría nueva** (`oop`); el resto reusa `arquitectura`/`php`.
- **0 lenguajes nuevos** en el highlighter (php).
- `inyeccion-dependencias` deja de ser artículo suelto → lección de
  `di-contenedores`. `object-calisthenics` sigue suelto, enlazado desde estos
  cursos.

## Orden de autoría sugerido

**OOP fundamentos primero** (base de todo lo demás), luego SOLID, Clean Code y el
curso DI (reutiliza el artículo existente + 1 nuevo). Independientes del frente de
testing/observabilidad (`plan-testing-y-observabilidad.md`).

## Estado

**Plan en estructura; pendiente OK del usuario para arrancar la autoría.**
Junto con `plan-testing-y-observabilidad.md`, hay **35 tutoriales** planificados
sin escribir (20 aquí + 15 allí).
