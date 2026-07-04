# Plan — Huecos de versatilidad + prácticas (2026-07-04)

Cola nueva, surgida de la revisión "¿es suficiente para un profesional completo
y versátil?" (2026-07-04). Conclusión de la revisión: la amplitud teórica ya es
de grado (~70-80% troncal) y la profundidad por tutorial (13-16 min) es la
correcta — no se alarga el formato. Lo que falta es **versatilidad transversal**
(4 temas aprobados por el usuario) y el salto de **leer a hacer** (prácticas).

## Aprobado por el usuario (2026-07-04)
Los 4 temas entran en cola, más la idea "Ponlo en práctica". Estructura de cada
curso se aprueba antes de la autoría, como siempre.

## Temas

### 1. SQL aplicado avanzado (curso `sql-aplicado`) — el más rentable
El catálogo tiene la BD por dentro (indices-btree, transacciones-acid,
modelado-relacional) y el ORM (acceso-a-datos), pero no el SQL que se escribe a
diario. ~4-5 lecciones: JOINs a fondo (INNER/LEFT/self-join, cuándo cada uno),
agregación (GROUP BY/HAVING, errores típicos), subconsultas y CTEs (WITH,
legibilidad), window functions (ROW_NUMBER/RANK/LAG, top-N por grupo).
Categoría `bbdd`, bloques `sql` (highlighter ya lo soporta). Cruza
indices-btree, orm-vs-sql, problema-n-mas-1.

### 2. Patrones de diseño GoF (curso `patrones-diseno`)
Subido de nice-to-have (plan-practica-backend) a cola real: es el vocabulario
compartido de la profesión y ya existe la base que los hace fáciles de contar
(OOP + SOLID). ~6 lecciones agrupadas por familia: qué son y cómo estudiarlos
(no memorizar, reconocer), creacionales (factory method/abstract factory,
builder, singleton y por qué se odia), estructurales (adapter, decorator,
facade, proxy — proxy cruza lazy services de contenedor-di), comportamiento I
(strategy — ya insinuado en ocp —, observer — cruza eventos-de-dominio),
comportamiento II (template method — ya en clases-abstractas —, command,
chain of responsibility → middleware), cierre (patrones en el framework:
dónde los usas sin saberlo). Categoría `arquitectura`, PHP con `compare`.

### 3. Cómo funciona un framework por dentro (curso corto o artículo denso)
El catálogo es agnóstico de framework (bien), pero entender qué hace
Symfony/Laravel por debajo une piezas ya publicadas: contenedor-di, php-fpm,
hexagonal, patrones. Contenido: request lifecycle (de nginx/FPM al controlador
y vuelta), front controller, routing, middleware/kernel events, resolución del
contenedor. Decidir formato al aprobar estructura (¿2-3 lecciones o 1 artículo
de 18 min?). Categorías `php`/`arquitectura`.

### 4. Terminal/Linux para desarrolladores (curso `terminal` o artículo-chuleta)
Mismo enfoque que el curso `git` (el usuario trabaja desde PhpStorm, quiere la
chuleta a mano): navegación y ficheros, pipes y redirección, buscar (grep/find),
permisos y propietarios, procesos (ps/kill/top), ssh/scp. Es la "práctica de
SO" que un grado da y complementa el pilar sistemas. Categoría `herramientas`,
bloques `bash`. Decidir curso (2-3 lecciones) vs artículo al aprobar.

### 5. "Ponlo en práctica" — mini-retos al cierre de cada curso (producto)
Hoy MentorAI es 100% lectura; una carrera es teoría + prácticas. Idea: sección
final opcional en la última lección de cada curso (o bloque en curso.html) con
un mini-reto guiado — enunciado, pistas plegables, solución comentada plegable.
Sin corrección automática, HTML/CSS puro (respeta las invariantes file://).
Pendiente de diseñar: dónde vive (¿lección de cierre? ¿curso.html?), componente
CSS (¿reusar callouts + details/summary?), y en qué cursos estrenar (candidatos:
git, apis-rest, sql-aplicado). Diseñar cuando toque, antes de escribir retos.

### Nota adicional de la revisión
**Profiling** ("mi endpoint tarda 2s, ¿dónde miro?": Xdebug, query log, dónde
medir) NO va aquí: encaja como lección o cruce dentro del futuro curso
`observabilidad` (plan-testing-y-observabilidad). Recordarlo al estructurarlo.

## Orden sugerido (a confirmar cuando llegue el momento)
Después de cerrar CI/CD y el frente testing/observabilidad:
**SQL aplicado** (máximo valor inmediato) → **Patrones GoF** → **Framework por
dentro** → **Terminal**. "Ponlo en práctica" puede diseñarse en paralelo en
cualquier momento (es producto, no autoría). Compite en cola con las teóricas
de plan-carrera-completa (funcional, metodologías); decidir prioridad entonces.

## Estado
**Cola documentada (2026-07-04). Nada estructurado ni escrito aún.**
