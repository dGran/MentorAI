# Plan — Curso `sistemas-distribuidos`

## Estado
**CERRADO 2026-08-01. Las 19 lecciones escritas y publicadas**, más 20
preguntas de examen y 39 checks. El curso está en la ruta
`el-grado-que-no-hiciste`, después de `observabilidad`.
Era el primero de los 4 cursos aprobados el 2026-07-06 y nunca escritos
(ver `plan-carrera-completa.md`); quedan `cache-y-rendimiento`,
`infraestructura` y `protocolos-y-tiempo-real`.

## Por qué este curso no es una introducción

Antes de diseñarlo se revisó qué había escrito ya, y había mucho:

- `fundamentos` tiene un módulo **«Sistemas distribuidos»** de 3 lecciones a
  nivel intro: `idempotencia`, `cap-consistencia`, `redis-cache`. También
  `transacciones-acid`, `concurrencia` y `async-event-loop`.
- `diseno-y-arquitectura` cubre `eventos-de-dominio` y `cqrs-event-sourcing`.
- `rabbitmq` existe como **artículo suelto** (no pertenece a ningún curso).

Decisión: el curso **da por leído** todo eso y va a la parte dura. No se
reescribe CAP ni idempotencia; se enlazan. `rabbitmq` se engancha como lectura
previa del módulo 2 en lugar de duplicarlo.

## Enfoque

- Nivel **Avanzado**. Requiere `fundamentos` y `apis-rest`.
- **Ejemplos en PHP** (Symfony/Laravel, RabbitMQ y Redis reales, SQL donde
  toque), coherente con el grueso del catálogo. Decidido por el usuario frente
  a la alternativa políglota y a la conceptual sin código.
- El cierre **«cuándo NO distribuir»** es deliberado: la mitad del valor del
  temario es saber que el problema no lo tienes.

## Temario aprobado

### M1 — Por qué esto es difícil
1. `sd-falacias` — Las ocho falacias del cómputo distribuido
2. `sd-fallos-parciales` — Fallos parciales: la respuesta que nunca llega
3. `sd-relojes-y-orden` — Relojes, orden y causalidad

### M2 — Cómo se hablan los servicios
4. `sd-sincrono-vs-asincrono` — Síncrono o asíncrono: elegir con criterio
5. `sd-garantias-de-entrega` — At-most-once, at-least-once, exactly-once
6. `sd-outbox` — El patrón outbox: guardar y publicar sin perder eventos
7. `sd-colas-y-topicos` — Colas y topics: RabbitMQ frente a Kafka

### M3 — Datos repartidos
8. `sd-replicacion` — Replicación: líder-seguidor, lag y lecturas obsoletas
9. `sd-particionado` — Particionado y sharding
10. `sd-transacciones-distribuidas` — 2PC y por qué casi nadie lo usa
11. `sd-sagas` — Sagas: transacciones largas con compensación

### M4 — Sobrevivir al fallo
12. `sd-timeouts-y-reintentos` — Timeouts, reintentos, backoff y jitter
13. `sd-circuit-breaker` — Circuit breaker y bulkheads
14. `sd-dlq-y-reproceso` — Dead letter queues y reproceso
15. `sd-backpressure` — Contrapresión y degradación elegante

### M5 — Coordinación y operación
16. `sd-consenso` — Consenso: Raft, quórum y para qué lo necesitas
17. `sd-locks-distribuidos` — Locks distribuidos: el que casi siempre está mal
18. `sd-trazas-distribuidas` — Seguir una petición entre servicios
19. `sd-cuando-no-distribuir` — Cuándo NO distribuir: el monolito que aguanta

## Tracker

Las 19 escritas. Todas con sección «Cuándo aplicarlo», TOC verificado contra
los `<h2 id>` y render comprobado en Chrome headless.

Dos lecciones salieron **sin bloques de código** y es deliberado:
`sd-cuando-no-distribuir` es de criterio, no de implementación. A
`sd-transacciones-distribuidas` y `sd-consenso` sí se les añadió uno después
(las sentencias `XA` de MySQL y `etcdctl elect`) porque en un curso con
ejemplos en PHP quedaban descolgadas.

## Lo que se aprendió por el camino

- **El sesgo de posición volvió a colarse**, y el validador NO lo detectó: mis
  39 checks tenían un 54 % en la posición 1, pero se diluía en el total de 440.
  Arreglado en dos sitios: los datos rotados a 13/13/13, y `scripts/validar.js`
  ahora mide el sesgo **por curso además de en total** (agrupando los checks por
  el curso al que pertenece cada lección, porque van por lección y una muestra
  de 2-3 no dice nada). Verificado reintroduciendo el sesgo a propósito.
- **El validador chocaba con una función documentada**: `courses.js` dice que
  una lección que aún no existe se pinta como «Planificado», pero el validador
  lo daba por error. Ahora es aviso.

## Al añadir más lecciones aquí

- Preguntas de examen en `tutorials/quizzes.js` y checks en `tutorials/checks.js`.
  **Ojo al sesgo de posición**: `scripts/validar.js` falla si la correcta cae en
  la misma posición más del 45 % de las veces, ahora también por curso.
