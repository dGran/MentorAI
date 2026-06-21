# Ideas — tutoriales sueltos (cola)

Ideas que no entran en el currículum de fundamentos ni en el bloque "PHP por
dentro" (`ideas-php-por-dentro.md`). Backlog suelto; decidir categoría al
arrancar cada uno.

## Redis a fondo — estructuras de datos (`redis-a-fondo`)
Pedido 2026-06-21: tipos de caché, sets, hashes, etc.

Enfoque: **Redis como servidor de estructuras de datos en memoria**, no solo
caché. Qué cubrir:
- Qué es Redis (single-thread, en memoria) y por qué es rápido.
- Tipos: strings, lists, **sets**, sorted sets (rankings), **hashes** (objetos),
  bitmaps/HyperLogLog, streams, pub/sub. Cuándo usar cada uno con un ejemplo.
- TTL/expiración, claves y convenciones de nombrado.
- Persistencia: RDB vs AOF (que "en memoria" no es "se pierde siempre").
- Atomicidad de comandos y `MULTI`/pipelines por encima.

**Reparto con lo que ya existe (importante, no duplicar):**
- `redis-cache` (ya en manifest como `soon`, y es P6.3 del currículum, ángulo
  **caché distribuida** en Pilar 6) = *usar* Redis como caché: estrategias, TTL,
  invalidación, patrones. NO repetir aquí estructuras.
- `redis-a-fondo` (esta idea) = *qué es* Redis y sus tipos de datos. Va **antes**
  de `redis-cache` conceptualmente: primero las estructuras, luego el patrón de
  caché. Enlazar uno con otro.
- Categoría sugerida: `infra` (+ quizá `bbdd`). Decidir al publicar.

## Jerga del desarrollo (`jerga`)
Pedido 2026-06-21: palabras comunes del mundo dev (parsear, stack overflow…).

Tutorial-glosario, tono ligero y útil para quien se incorpora. Formato: agrupar
por bloques temáticos con definición corta + ejemplo de uso real, apoyado en los
componentes de glosario/tabla del proyecto. Términos candidatos:
- Código/ejecución: parsear, compilar/interpretar, runtime, build, deploy,
  rollback, hotfix, refactor, deprecated, boilerplate.
- Errores/estados: bug, edge case, race condition (enlazar `concurrencia`),
  **stack overflow** (la pila, no la web), memory leak, flaky.
- Flujo/proceso: merge, rebase, cherry-pick, PR, blocker, WIP, MVP, tech debt.
- Datos/red: payload, endpoint, idempotente (enlazar futuro `idempotencia`),
  cache hit/miss, throughput, latencia.
- Cultura: yak shaving, bikeshedding, rubber duck, foo/bar, "funciona en mi
  máquina".

Es transversal y autoconclusivo: no depende de ningún otro tutorial, pero puede
**enlazar** a los que profundizan cada término (concurrencia, hashing, http…).
Categoría sugerida: nueva `cultura` o reusar algo genérico. Decidir al arrancar.

## Estado
Solo ideas en cola; ninguno empezado.
