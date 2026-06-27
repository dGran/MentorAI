# Plan — Práctica del backend (huecos del día a día) (2026-06-27)

Cola de temarios nueva, surgida de una revisión de huecos pedida por el usuario
("¿qué nos puede faltar básico para un backend developer?"). El catálogo es
fuerte en **teoría profunda** (fundamentos CS, OOP, SOLID, Clean Code,
arquitectura hexagonal/DDD/CQRS, seguridad de fundamentos, PHP por dentro) pero
flojo en la **capa práctica de construir y operar un servicio real**. Tiene el
protocolo HTTP a fondo pero no cómo se *diseña* una API; tiene la BD por dentro
pero no cómo la app habla con ella.

**Contexto del usuario** (ver memoria `user-perfil`): backend autodidacta, sin
base universitaria, formado sobre la marcha. Stack PHP, siempre Docker, trabaja
en PhpStorm y hace git desde el IDE (no terminal). Esto **calibra el enfoque**:
explicar el porqué desde cero sin asumir base reglada, sin condescender en lo
práctico.

## Decidido por el usuario
- Confirma que faltan estos temas y que "todos son muy importantes".
- **Git**: le interesa sobre todo como **referencia de comandos** — todos los
  comandos a mano, breve explicación + ejemplo de cada uno (porque tira de
  PhpStorm y no de terminal, quiere la chuleta a mano). Formato más chuleta
  comentada que prosa conceptual.
- **API REST**: lo marca como fundamental.
- Pendiente: aprobar la estructura curso a curso antes de la autoría (mismo flujo
  que con OOP/SOLID/Clean Code/DI).

## Temas de la cola (estructura propuesta, a refinar al publicar)

### 1. Git (curso `git` o artículo-referencia) — PRIORIDAD, pedido explícito
Enfoque referencia/chuleta. Posible estructura (3 lecciones) o 1 artículo denso:
- **Comandos del día a día** (referencia): config, clone/init, status, add, commit,
  log, diff, push/pull/fetch, branch, checkout/switch, merge, remote… cada uno con
  qué hace + ejemplo. La chuleta que pide.
- **Ramas y flujo**: crear/cambiar de rama, merge vs rebase (con su porqué),
  resolución de conflictos, flujo de trabajo (feature branches, PRs).
- **Deshacer y rescatar**: reset (soft/mixed/hard) vs revert vs restore, stash,
  reflog, amend, cherry-pick. "Cómo salir de un lío".
Categoría: nueva `herramientas` o reusar `cultura` (junto a jerga). Sin highlighter
nuevo (bloques `bash`). Decidir curso vs artículo al publicar.

### 2. Diseño de APIs REST (curso `apis-rest`) — fundamental
Tiene url/http/tcp-a-fondo (el cable), falta diseñar la API. ~5-6 lecciones:
- Qué es REST: recursos, representaciones, stateless, niveles de Richardson.
- Verbos HTTP y status codes aplicados al diseño (GET/POST/PUT/PATCH/DELETE,
  2xx/4xx/5xx con criterio).
- Diseño de URLs, versionado, paginación, filtrado y ordenación.
- Errores de API (formato consistente, problem+json), validación de entrada.
- REST vs RPC vs GraphQL (cuándo cada uno).
- Autenticación de APIs (remite a `autenticacion`: API keys, JWT, OAuth).
Categoría `arquitectura` o nueva `apis`. Cruza http-a-fondo, autenticacion,
idempotencia. Bloques php + http (http ya existe sin data-lang en http-a-fondo).

### 3. Acceso a datos / ORM (curso `acceso-a-datos`)
Tiene la BD por dentro, falta el puente app↔BD. ~4 lecciones:
- ORM vs query builder vs SQL plano (cuándo cada uno).
- Active Record vs Data Mapper (Eloquent vs Doctrine).
- El problema **N+1** (hoy solo mencionado de pasada en big-o) y cómo detectarlo/
  resolverlo (eager loading).
- Migraciones de esquema (versionar la BD, up/down, datos vs estructura).
Categoría `bbdd` + `php`. Cruza indices-btree, modelado-relacional, big-o.

### 4. Docker / contenedores (curso `docker`)
Cero en el catálogo, y el usuario trabaja SIEMPRE containerizado. ~4-5 lecciones:
- Imagen vs contenedor, por qué contenedores (vs VM).
- Dockerfile y capas (caché de capas, orden de instrucciones).
- docker-compose para el entorno local (servicios, redes, volúmenes).
- Multi-stage builds y buenas prácticas (imagen pequeña, no root, .dockerignore).
- (Opcional) PHP en Docker: php-fpm + nginx, extensiones (cruza extensiones-php).
Categoría nueva `devops` o `infra`. Bloques bash + dockerfile/yaml (sin data-lang
o añadir lexer si compensa).

### 5. CI/CD (curso `ci-cd`) — después de observabilidad
Pipelines, tests en automático, despliegue. ~3-4 lecciones. Engancha con el frente
testing/observabilidad ya planificado (los tests que corren en el pipeline).

### Artículos sueltos menores (transversales)
- **Configuración y entornos (12-factor)**: variables de entorno, secrets, config
  por entorno. 1 artículo.
- **Composer / autoload PSR-4 / semver**: gestión de dependencias del ecosistema
  PHP. 1 artículo (encaja en "PHP por dentro" o `herramientas`).

### Nice-to-have (no prioritarios)
Patrones de diseño GoF (curso), validación de entrada a fondo, fechas/zonas
horarias, rate limiting, RBAC/permisos.

## Orden sugerido
**Git** (rápido, útil ya, pedido) → **APIs REST** (fundamental) → **Acceso a
datos/ORM** → **Docker** → (frente testing/observabilidad ya planificado) →
**CI/CD**. Config y Composer como artículos sueltos intercalados cuando encajen.

## Relación con los otros planes
Este frente es **independiente** de `plan-testing-y-observabilidad.md` (que sigue
pendiente: phpunit 6 + observabilidad 9). `plan-diseno-y-calidad.md` ya está
COMPLETO (OOP, SOLID, Clean Code, di-contenedores publicados 2026-06-27).

## Estado
**Cola documentada; pendiente aprobar estructura curso a curso para arrancar la
autoría.** El usuario quiere empezar a meter estos temas; el siguiente paso
natural es Git (lo pidió explícito) o APIs REST.
