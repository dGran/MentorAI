# Plan — Curso `sistemas-distribuidos`

## Estado
**Estructura APROBADA 2026-08-01 (19 lecciones, ejemplos en PHP).**
Es el primero de los 4 cursos aprobados el 2026-07-06 y nunca escritos
(ver `plan-carrera-completa.md`). Progreso lección a lección en el tracker
de abajo.

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

Ninguna lección escrita todavía. Al escribir cada una: `.html` + entrada en
`manifest.js` + marcar aquí.

## Al terminar el curso

- Añadirlo a `tutorials/paths.js`. Encaja en `el-grado-que-no-hiciste`
  (después de `observabilidad`) y da pie a una ruta propia de escalado junto a
  `cache-y-rendimiento` cuando ese exista.
- Preguntas de examen en `tutorials/quizzes.js` y checks en `tutorials/checks.js`.
  **Ojo al sesgo de posición**: `scripts/validar.js` falla si la respuesta
  correcta cae en la misma posición más del 45 % de las veces.
