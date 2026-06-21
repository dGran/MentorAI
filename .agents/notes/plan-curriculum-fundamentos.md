# Plan — Currículum de fundamentos (CS para backend autodidacta)

## Objetivo
El usuario es backend dev sin carrera; quiere **reforzar los fundamentos de CS**
que normalmente se saltan los autodidactas. Se construye como una capa
**transversal** debajo del catálogo actual (que es muy PHP-aplicado: opcache, DI,
rabbitmq). Cada tema es muy visual → encaja con el vocabulario de componentes del
proyecto (diagramas CSS, compare, callouts).

## Decisiones del usuario (2026-06-21)
- **Alcance = el currículum COMPLETO.** No es "elegir uno": se quieren los 7
  pilares y todos sus tutoriales (22 en total).
- **Orden lógico bottom-up.** Se descartó ordenar por impacto diario; manda la
  dependencia conceptual: cada pilar se apoya en el anterior. Por eso se arranca
  por **Representación de datos** (la materia prima: todo son bits), no por BBDD.
- **Ejemplos en PHP + SQL/bash** (su stack, y lo que ya/va a resaltar el
  highlighter). Aterrizar el fundamento en algo que usa a diario.

## Dependencia técnica (para el pilar 3, Bases de datos)
El highlighter (`SyntaxHighlighter.LANGUAGES` en `main.js`) solo soporta
`php/bash/ini`. **Antes del primer tutorial de BBDD hay que añadir `sql`**:
keywords (SELECT/FROM/WHERE/JOIN/INDEX/EXPLAIN/BEGIN/COMMIT...), strings,
números, comentarios `--`. Misma forma que los lenguajes existentes (una pasada,
regex combinado). NO bloquea el arranque: los pilares 1 y 2 usan PHP, que ya está.
Recordar escapar `<`, `>`, `&` dentro de `<code data-lang="sql">`.

## Los 7 pilares — currículum completo (orden lógico)
Se hacen TODOS. Dentro de cada pilar, los tutoriales van en orden. Slug propuesto
entre paréntesis; el tracker de abajo lleva el progreso.

### Pilar 1 — Representación de datos  ← ARRANCAMOS AQUÍ   `cat: ["representacion"]`
La materia prima. Todo lo demás (redes, hashing, BBDD, cifrado) asume esto.
1. **Bits y bytes** (`bits-y-bytes`) — binario, hexadecimal, qué es un byte,
   operaciones bit a bit (AND/OR/XOR, shifts, máscaras), enteros sin signo.
   Principiante/Intermedio. (estrena el chip **Representación de datos**)
2. **Texto: ASCII → Unicode → UTF-8** (`texto-unicode`) — por qué un byte se queda
   corto, code points vs bytes, por qué se rompen acentos y emojis. Intermedio.
3. **Números: enteros y coma flotante** (`numeros-flotantes`) — complemento a dos,
   overflow, IEEE-754, `0.1 + 0.2 !== 0.3`. Intermedio.

### Pilar 2 — Datos y algoritmos   `cat: ["algoritmos"]`
Cómo organizas y mides operaciones sobre esos datos. Hashing prepara BBDD y cifrado.
1. **Big-O sin matemáticas** (`big-o`) — cómo saber si algo escala a 10×/1000×.
2. **Estructuras de datos: cuál y cuándo** (`estructuras-datos`) — array, lista,
   hashmap, set, árbol, grafo y el criterio de elección.
3. **Hashing por dentro** (`hashing`) — O(1), colisiones, por qué un mal hash lo
   arruina; cómo crece un hashmap.

### Pilar 3 — Bases de datos   `cat: ["bbdd"]`   (requiere highlighter SQL)
Persistir y consultar. Usa B-tree (estructuras) y hashing del pilar 2.
1. **Índices (B-tree): por qué tu query es lenta** (`indices-btree`) — full scan,
   anatomía de un B-tree, leer un `EXPLAIN`, índices compuestos y orden de
   columnas, cuándo un índice NO se usa. Intermedio. (estrena el chip **Base de datos**)
2. **Transacciones y ACID** (`transacciones-acid`) — niveles de aislamiento, locks,
   deadlocks, lecturas sucias/fantasma. Intermedio/Avanzado.
3. **Modelado relacional** (`modelado-relacional`) — normalización (1FN→3FN) sin
   dogma, claves, relaciones, cuándo desnormalizar a propósito. Principiante/Intermedio.

### Pilar 4 — El sistema por debajo (SO + hardware)   `cat: ["sistemas"]`
Cómo se ejecuta el código. Memoria conecta con representación; concurrencia es base
de async y distribuidos.
1. **Procesos vs hilos** (`procesos-hilos`) — qué comparten, qué no, por qué importa.
2. **Concurrencia: el bug que solo pasa en prod** (`concurrencia`) — race
   conditions, mutex, deadlock, atomicidad.
3. **Async y el event loop** (`async-event-loop`) — un hilo para miles de
   conexiones (Node/Swoole).
4. **Memoria** (`memoria`) — stack vs heap, memoria virtual, caché de CPU y localidad.
   (OJO: PHP flojo en hilos → ejemplos mixtos; pseudocódigo donde PHP estorbe.)

### Pilar 5 — Cómo viaja un dato (redes)   `cat: ["redes"]`
Comunicación entre máquinas. Necesita bytes (pilar 1) y puertos/conexiones (pilar 4).
1. **Qué pasa al escribir una URL** (`url-a-fondo`) — DNS → TCP → TLS → HTTP.
2. **HTTP a fondo** (`http-a-fondo`) — métodos, status reales, cabeceras, caché,
   cookies vs tokens.
3. **TCP/IP** (`tcp-ip`) — handshake, puertos, ventanas, por qué "se queda colgado".

### Pilar 6 — Sistemas distribuidos   `cat: ["distribuidos"]` (+ reusa infra/mensajeria)
Coordinar varias máquinas. Combina redes + concurrencia + consistencia de BBDD.
1. **Idempotencia y entrega at-least-once** (`idempotencia`) — generaliza lo de
   rabbitmq.
2. **CAP y consistencia eventual** (`cap-consistencia`) — el trade-off inevitable.
3. **Caché distribuida** (`redis-cache`) — YA está en el manifest como `soon`;
   este pilar lo recupera y lo desarrolla.

### Pilar 7 — Seguridad de fundamentos   `cat: ["seguridad"]` (label ya existe)
Transversal, cierra: usa hashing (pilar 2), TLS (pilar 5), inyección (pilar 3).
1. **Hashing vs cifrado** (`hashing-vs-cifrado`) — contraseñas, bcrypt/argon2, por
   qué no MD5.
2. **Autenticación: sesiones, JWT, OAuth** (`autenticacion`) — qué resuelve cada uno.
3. **OWASP imprescindible** (`owasp`) — inyección, XSS, CSRF.

## Tracker de progreso (currículum completo)
Marcar al publicar. 22 tutoriales en total.
- [x] P1.1 bits-y-bytes  (publicado 2026-06-21)
- [x] P1.2 texto-unicode  (publicado 2026-06-21)
- [x] P1.3 numeros-flotantes  (publicado 2026-06-21) ← Pilar 1 COMPLETO
- [x] P2.1 big-o  (publicado 2026-06-21)
- [x] P2.2 estructuras-datos  (publicado 2026-06-21)
- [x] P2.3 hashing  (publicado 2026-06-21) ← Pilar 2 COMPLETO
- [x] P3.1 indices-btree  (publicado 2026-06-21)
- [x] P3.2 transacciones-acid  (publicado 2026-06-21)
- [x] P3.3 modelado-relacional  (publicado 2026-06-21) ← Pilar 3 COMPLETO
- [x] P4.1 procesos-hilos  (publicado 2026-06-21)
- [x] P4.2 concurrencia  (publicado 2026-06-21)
- [x] P4.3 async-event-loop  (publicado 2026-06-21)
- [x] P4.4 memoria  (publicado 2026-06-21) ← Pilar 4 COMPLETO
- [x] P5.1 url-a-fondo  (publicado 2026-06-21)
- [x] P5.2 http-a-fondo  (publicado 2026-06-21)
- [x] P5.3 tcp-ip  (publicado 2026-06-21) ← Pilar 5 COMPLETO
- [ ] P6.1 idempotencia
- [ ] P6.2 cap-consistencia
- [ ] P6.3 redis-cache
- [ ] P7.1 hashing-vs-cifrado
- [ ] P7.2 autenticacion
- [ ] P7.3 owasp

## Categorías nuevas que aparecerán (chips auto-generados)
- `representacion` → label "Representación de datos".
- `algoritmos` → "Algoritmos".
- `bbdd` → "Base de datos".
- `sistemas` → "Sistemas" (SO/concurrencia).
- `redes` → "Cómo viaja un dato" (label = el topic del pilar, igual que `sistemas`).
- `distribuidos` → "Sistemas distribuidos".
- `seguridad` → ya existe en CATEGORY_LABELS.
- `infra` / `mensajeria` → ya existen (pilar 6 los reusa).
Crear el label en `CATEGORY_LABELS` al publicar el primer tutorial de cada pilar.

## Cómo se crea cada tutorial
Seguir la skill `/tutorial`: `tutorials/<slug>.html` desde `_PLANTILLA.html` +
entrada en `manifest.js` (mover `featured` al nuevo). Verificar siempre:
`node --check` del manifest, escapado (`&lt;?php`) = nº de bloques php, ids del TOC
= ids de los `<h2>`, derivación del catálogo.

## Estado
Plan aprobado: alcance = currículum COMPLETO (22 tutoriales), orden lógico
bottom-up, arranque por Representación de datos, enfoque PHP+SQL/bash. Progreso en
el tracker de arriba. En curso: P1.1 `bits-y-bytes` (primer tutorial).
