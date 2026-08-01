# Plan — Los 3 cursos que cierran la carrera

## Estado
**En curso desde 2026-08-01.** Son los tres que quedaban de los 4 aprobados el
2026-07-06 (`sistemas-distribuidos` se cerró el mismo día, ver
`plan-curso-sistemas-distribuidos.md`). Al terminar los tres, el norte de
`plan-carrera-completa.md` queda cubierto.

Estructura aprobada de un tirón por el usuario («vamos con esos 3 cursos»), con
el mismo criterio que el anterior: **ejemplos en PHP** y nivel **Avanzado**.

## El criterio que ordena los tres: no repetir lo que ya existe

Se auditó el catálogo antes de diseñar. Los solapamientos son grandes y son lo
que fija el alcance de cada curso:

| Curso | Ya existe y NO se reescribe | Qué queda para el curso |
|---|---|---|
| `cache-y-rendimiento` | `big-o`, `indices-btree`, `memoria` (fundamentos); `problema-n-mas-1` (acceso-a-datos); `redis-cache` (fundamentos); artículos `redis-a-fondo`, `opcache`, `preload`, `memoria-php` | Medir con criterio, el ciclo entero de diagnóstico, invalidación, estampida, caché HTTP y CDN |
| `infraestructura` | curso `terminal-linux` (9 lecciones), curso `docker` (5), curso `ci-cd` (3) | Operar el servidor: systemd, nginx, TLS, DNS, balanceo, orquestación, despliegues sin caída, IaC, backups, guardias |
| `protocolos-y-tiempo-real` | `http-a-fondo`, `tcp-ip`, `url-a-fondo` (fundamentos); curso `apis-rest` entero incluido `rest-vs-rpc-vs-graphql` | Las versiones de HTTP, formatos binarios, gRPC, y todo el bloque de tiempo real (SSE, WebSockets, webhooks) |

**Los artículos sueltos NO se absorben como lecciones**, aunque encajarían: sacarlos
de `articulos.html` los haría desaparecer de ahí y cambiaría la ruta `php-a-fondo`,
que referencia `opcache`, `preload` y `memoria-php` como artículos. Se enlazan
desde las lecciones, igual que se hizo con `rabbitmq` en el curso anterior.

## Temarios

### `cache-y-rendimiento` — 15 lecciones

**M1. Medir antes de tocar**
1. `cr-medir-primero` — Percentiles, no medias
2. `cr-perfilado` — Perfilado: dónde se va el tiempo de verdad
3. `cr-presupuesto` — Presupuesto de latencia

**M2. Casi siempre es la base de datos**
4. `cr-consultas-lentas` — Encontrar la consulta culpable
5. `cr-indices-en-practica` — Índices compuestos, de cobertura y los que sobran
6. `cr-paginacion` — Paginación que no se degrada
7. `cr-conexiones-y-pool` — Conexiones y el coste de abrir

**M3. Cachear con criterio**
8. `cr-capas-de-cache` — Las capas: navegador, CDN, aplicación, base de datos
9. `cr-patrones-de-cache` — Cache-aside, write-through y read-through
10. `cr-invalidacion` — Invalidación: el problema difícil de verdad
11. `cr-estampida` — Estampida de caché
12. `cr-http-cache` — ETag, Cache-Control y CDN

**M4. El resto del stack**
13. `cr-payload-y-serializacion` — El peso de lo que mueves
14. `cr-fuera-del-camino-critico` — Sacar trabajo de la petición
15. `cr-cuando-parar` — Cuándo dejar de optimizar

### `infraestructura` — 15 lecciones

**M1. La máquina**
1. `inf-servidor-por-dentro` — CPU, memoria, disco y sus límites reales
2. `inf-systemd` — Servicios que arrancan solos y se reinician
3. `inf-hardening` — Endurecer un servidor: SSH, firewall, usuarios

**M2. Servir tráfico**
4. `inf-nginx` — nginx como servidor web y proxy inverso
5. `inf-tls` — TLS y certificados en la práctica
6. `inf-dns` — Registros, TTL y por qué tarda en propagar
7. `inf-balanceo` — Balanceo de carga y health checks

**M3. Empaquetar y desplegar**
8. `inf-vm-contenedor-funcion` — Qué eliges para ejecutar tu código
9. `inf-orquestacion` — Qué resuelve Kubernetes y qué te cobra
10. `inf-despliegues-sin-caida` — Azul/verde, canario y rolling
11. `inf-configuracion-y-secretos` — Configuración y secretos fuera del código

**M4. Que siga funcionando**
12. `inf-iac` — Infraestructura como código: Terraform y Ansible
13. `inf-backups` — Copias que sirven: RPO, RTO y probar la restauración
14. `inf-capacidad` — Capacidad y escalado
15. `inf-guardias-y-postmortem` — Cuando se rompe: runbooks y post mortem

### `protocolos-y-tiempo-real` — 15 lecciones

**M1. HTTP de verdad**
1. `pr-http1-a-http3` — Qué problema resuelve cada versión
2. `pr-tls-handshake` — El handshake y su coste en latencia
3. `pr-cabeceras-que-importan` — Las que de verdad cambian el comportamiento

**M2. Formatos y contratos**
4. `pr-serializacion` — JSON, Protobuf y MessagePack
5. `pr-grpc` — RPC con contrato y streaming
6. `pr-compatibilidad` — Versionar sin romper

**M3. Tiempo real**
7. `pr-polling` — Polling y long polling: la línea base
8. `pr-sse` — Server-Sent Events: el que casi nadie usa
9. `pr-websockets` — El canal bidireccional y lo que cuesta
10. `pr-elegir-transporte` — La tabla de decisión
11. `pr-escalar-tiempo-real` — Conexiones persistentes, fan-out y presencia

**M4. Integrar con otros**
12. `pr-webhooks` — Recibir eventos de terceros sin perderlos
13. `pr-firmas-y-replay` — HMAC, replay y secretos compartidos
14. `pr-streaming-http` — Chunked, NDJSON y respuestas largas
15. `pr-cuando-no-tiempo-real` — Cuándo NO lo necesitas

## Al cerrar cada curso

- Entrada en `tutorials/courses.js` (el esqueleto ya está: las lecciones sin
  escribir salen como «Planificado», y el validador lo avisa sin fallar).
- Encajarlo en `tutorials/paths.js`. Los tres van a `el-grado-que-no-hiciste`;
  `cache-y-rendimiento` e `infraestructura` encajan además en
  `construir-un-servicio`.
- Examen en `quizzes.js` y checks en `checks.js`. **El validador ahora mide el
  sesgo de posición por curso**, no solo en total: si no repartes, falla.
