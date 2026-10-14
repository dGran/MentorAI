# Tanda 2026-10-14: restos de la auditoría de vigencia (#153)

Estado: **lanzada** el 2026-10-14 («lanza la tanda»).

## 1. Estado de partida (medido 2026-10-14)

- `main` en `51199a0`, limpio, 0 PRs abiertos, `check-board.sh --project 6` con exit 0. Producción en `v81`.
- `validar.js` sin errores ni avisos; `node --test` 114/114. Sin `/smoke`: la red visual es
  `verificar-offline.js`.
- #153: `OPEN`, en `Backlog`, P3, sin asignar, sin rama ni PR, sin bloqueantes ni `blocked-external`.

| Criterio de #153 | Reproduce hoy |
|---|---|
| PECL → PIE | `pecl install` en `php-en-docker`, `opentelemetry-en-php` y `tests-de-mutacion` |
| `20-redis.ini` | el bloque mezcla `extension=redis` con `zend_extension=xdebug` (`extensiones-php:222-226`) |
| tamaños de Go | `go-entorno-docker:111` «25 MB vs 800 MB» en `golang:1.27-alpine` |
| `lib/pq` | `go-paquetes-y-modulos:217` fija `v1.10.9` |
| `syslog` | tabla de `/var/log` en `linux-filesystem:145` sin el matiz de rsyslog |
| tamaños de Python | la tabla de `python-docker` no se volvió a medir con 3.14 |
| ratio de php-fpm | `promql:287` sin el matiz de `pm = dynamic` |
| «docker-compose» | título, meta description y `h1` de `docker-compose`, manifest y resumen de `courses.js:359` |

## 2. Línea de no colisión

Un único coordinador, sin otros tracks ni PRs abiertos. Un issue, un PR. Ficheros compartidos
(`manifest.js` por el título y `reviewed`, `courses.js`, índice y `sw.js`): se recompone sobre `main`
justo antes de mergear con `tanda-2026-10-13/preparar.sh`. Los cambios a `manifest.js` van en
`manifest-153.json`. `verificar-offline.js` lo ejecuta solo el coordinador: el revisor no
(trampa de `estado.md`).

## 3. Orden

1. **Implementar #153**: un subagente en el worktree `../MentorAI-153`, con el mismo encargo que
   #135-#143 (reconfirma cada arreglo en Docker o contra la fuente antes de escribirlo). Mide tamaños
   reutilizando imágenes locales antes de bajar (Docker Hub corta con 429).
2. **Review fresca** con `prompt-review.md`, sin offline.
3. **Publicación**: `cerrar-serie.sh` (recompone, gates, QA por http y por `file://`, CI, merge, Pages).

## 4. Límites y fuera de la tanda

- **«docker-compose» → «Docker Compose»**: título, `h1`, meta description, descripción del manifest
  y resumen del curso. Como comando, `docker compose`. **El slug `docker-compose` y su URL no cambian**
  (enlaces, progreso y repaso guardados por slug).
- Las dos dudas «Sin confirmar» de #153 (`uv run` en `python-entorno-docker`, reparto gratis/Pro de
  PyCharm) entran solo si se confirman.
- Nada fuera de los criterios de #153; lo que aparezca se apunta para un issue nuevo.

## 5. Criterio de parada

Primer rojo sin arreglo evidente; un criterio inviable o falso (se comenta en el issue y no se
reinterpreta); cualquier otra decisión de producto o de norma; borrar contenido no acordado.

## 6. Decidido por el usuario al preparar (2026-10-14)

- Nombre de la lección: «“Docker Compose” (Recomendado)». Slug y URL intactos.
- Automerge: «Sí, igual que antes (Recomendado)». Lo que pase review fresca, QA y CI se mergea sin
  pausa.
