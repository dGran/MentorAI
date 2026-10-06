# Auditoría 2026-10-06 — código, UX, contenido y huecos

Estado: **abierta**. Entrada para `/spec`. Cuatro auditorías de solo lectura
(código/arquitectura, UX/a11y con 60 capturas, calidad de contenido con 13
lecciones leídas a fondo, huecos + diseño de curso). Los hallazgos marcados ✔
se re-verificaron en el código tras la auditoría.

## Lo que está bien (no tocar)

- Invariantes intactos: 283 tutoriales con la misma lista de `<script>`,
  `init.js` último en las 291 páginas, datos como globals, índice bajo demanda.
- localStorage defensivo, prefijo `academia-`, `escapeHtml` consistente, token
  de sync cuidado (no viaja, solo últimos 4 caracteres visibles).
- Validador rápido (2 s) y amplio; `verificar-offline.js` en CI.
- Tokens con paridad claro/oscuro, tema sin destello, `prefers-reduced-motion`.
- Página de lección muy bien montada (TOC sticky, scrollspy, copiar, callouts,
  checks, anterior/siguiente). Estados vacíos bien escritos.
- Núcleo PHP/backend de calidad alta; cursos de IA anclados al presente;
  exámenes recientes de escenario, no de memoria.

## Tareas — P0 (bugs que el usuario ya sufre)

| # | Tarea | Criterio de aceptación | Tam |
|---|---|---|---|
| 1 | ✔ Tarjetas de Novedades/Destacados muestran «1», «2», «3» | `map(miniCardHtml)` pasa el índice como `fragmento` (`home.js:130,141`). Ninguna `.mini-card__desc` contiene solo dígitos | S |
| 2 | ✔ Fusión de sync pisa local con remoto | `perfil.js:159-168` cae en `return suyo` para quiz, examen-ruta y practica. quiz/examen: `passed=a\|\|b`, `best=max`; practica: unión profunda; fallback conserva local. Test `node:test` lo cubre | S |
| 3 | Lo borrado resucita con sync activo | Quitar marcador/subrayado/completado y sincronizar dos veces: no reaparece. Lápidas con timestamp + migración del export | M |
| 4 | ✔ Bump de `VERSION` borra los cursos guardados offline y la UI dice «Guardado» | `CONTENT` sin versión (`sw.js:17`); estado «guardado» derivado de `caches.match`; `verificar-offline.js` cubre el bump | M |
| 5 | «Guardar para viajar» marca guardado aunque falle | `SAVE_DONE` con `{ok, failed}`; «Faltan N» con reintento; timeout en `cacheUrls` | S |
| 6 | ✔ Perfil inalcanzable en móvil + lista de páginas copiada en 4 sitios | `PAGES` (`core.js:198`) sin perfil; una sola fuente o validador que cruce sw.js/offline.js/core.js/verificar-offline.js | S |
| 7 | Anterior/Siguiente cruzan de curso | `tutorial-nav.js` aplana todos los cursos. Vecinas dentro del curso; última lección → «Fin del curso / examen» | S |
| 8 | «Curso en marcha» siempre propone Caché y rendimiento | `pendingCourse()` ignora el progreso. Curso con actividad reciente; sin progreso → «Empieza aquí» | S |
| 9 | Repaso y Perfil marcan «Sin conexión» como página actual | Un único `aria-current=page` por página | S |
| 10 | ✔ `cc-hooks-y-permisos` enseña mal los exit codes | Solo `exit 2` bloquea; añadir registro en `settings.json` y callout de límites de `deny` | S |
| 11 | Reto `terminal-linux` con solución errónea y experimento de `maq-cpu` falso | `du -ah` lista directorios → `find -type f`. Matriz con copy-on-write compartido: construir con valores distintos, cifras reales (~4×). Retos k8s (v1/v2/v3) y Go (error ignorado) | S |

## Tareas — P1 (accesibilidad, rendimiento, contenido)

| # | Tarea | Criterio | Tam |
|---|---|---|---|
| 12 | Drawer móvil accesible | Cerrado: fuera del orden de Tab (`inert`/`<dialog>`); `aria-expanded`, Esc, foco entra y vuelve; sin sombra asomando en escritorio | S |
| 13 | Normalizar cabeceras de tutoriales | 5 variantes de `<header>`; 42 `python-*` con hamburguesa duplicada. Un solo hash; `initMobileNav` idempotente; check en validador | S |
| 14 | Confirmar/deshacer reinicios de progreso | Ni curso ni lección borran sin confirmar o sin «Deshacer» | S |
| 15 | Sin scroll horizontal a 320/375 px | `.practica__*` desborda en `curso.html`; `scrollWidth===clientWidth` en las 30 fichas y articulos | S |
| 16 | Contraste y foco | `--text-muted` ≥4.5:1 en claro; botones con gradiente ≥4.5:1; token `--focus-ring` + `:focus-visible` global | S |
| 17 | Checks y exámenes accesibles | Icono+texto además de color, `role=status`, foco no se pierde, tokens `--success/--danger` | M |
| 18 | Errores técnicos en lecciones | `python-async-await` (finally), `rust-ownership` (refcount PHP determinista), `sql-joins` (USING, UNION ALL, LEFT→INNER, NOT IN+NULL), `opcache` (ejemplo primos), `procesos-hilos`, `cap-consistencia`, `k8s-objetos` (Ingress/Gateway API, verificar), `ia-llamar-a-un-llm` (`APIConnectionException`, `stop_reason`), `go-testing` (`b.Loop`) | M |
| 19 | Sesgo de longitud en preguntas | La correcta es la más larga en 90 % (examen) y 94 % (checks). Validador lo mide y avisa >40 %; reescritura por curso piloto | L |
| 20 | Validador: hero vs manifest y «Cuándo aplicarlo» | 27 discrepancias de minutos/nivel; 107/282 sin `#cuando` aunque la skill dice obligatoria | S |
| 21 | Carga diferida de quizzes/checks/practica | Cada página parsea ~790 KB de datos que no usa. Patrón de `search.js`; tutorial <300 KB de JS | M |
| 22 | Ids estables en preguntas y retos | Repaso y práctica indexan por posición: reordenar reasigna historial. `id` obligatorio y único | M |
| 23 | Onboarding del inicio | Sin progreso: «Empieza aquí» con rutas tras el hero; exámenes ocultos hasta empezar algo; métricas para el alumno, no el autor | M |
| 24 | Rutas y cursos navegables | rutas.html plegada con anclas; ficha de curso dice su ruta; filtro por nivel en cursos.html | M |
| 25 | Enlaces entre piezas | 197 piezas sin enlace entrante; enlazar básico↔avanzado (idempotencia↔sd-garantias, cap↔sd-replicacion, procesos↔maq-scheduler, inf-orquestacion↔k8s-objetos, flujo-con-agentes↔cc-agente) | M |

## Tareas — P2 (deuda y pulido)

- Sync más barato: throttle, flag `enCurso`, JSON sin indentar, `keepalive` ≤64 KB, `ultimoSubido` tras `ok` (S).
- Refresco del shell sin re-descargar fuentes (~1,4 MB por arranque del worker) (S).
- `activate` del SW solo borra cachés `academia-*` (origen compartido en github.io) (S).
- Aviso de import invisible (`renderPage` tras `decir`) y cuota reportada (S).
- `init.js` tolerante a fallos (`safely(name, fn)`) (S).
- Tests de lógica pura con `node --test` (fusiones, SRS) en CI (M).
- Helpers duplicados: `escapeHtml` ×4, `readJson/writeJson` ×9, basePath ×6 (M).
- CSS: tokens de estado, 16 `transition: all`, selectores muertos, 67 hex sueltos (M).
- Convenciones: 4 `else`, ~34 comentarios de prosa, notas con cifras caducadas (v12, perfil.html, 1,8 MB, 25 cursos en el-grado) (S).
- Script de tema sin try/catch (S). Etiqueta del input del token de sync (S). `<main>` en lecciones (M).
- Lectura: ancho de línea ~83 car. → ≤75; hero de lección ocupa todo el primer pantallazo en móvil (S).
- Buscador: resultados fuera de vista y título sin peso en el ranking (S).
- Python/Go/Rust (63 lecciones) a la plantilla actual, un curso por sesión (L).
- Preguntas discutibles (Go `select`, TTL, Sentry, GraphQL) y exámenes de memorización (M).
- Campo `reviewed` en el manifest para la revisión de frescura (S).
- Coherencia de rutas: `mas-alla-de-php` sin Python, orden de `testing`, nivel de `phpunit`, 4 piezas sin ruta (S).

## Contenido nuevo propuesto

1. **`ia-por-dentro`** (prefijo `llm-`, 5 lecciones): tokens y embeddings,
   atención y contexto, entrenamiento y sesgos, muestreo, alucinación y
   verificación. Envejece en años. Ruta `ingenieria-con-ia` antes de
   `claude-code`, y también en `el-grado-que-no-hiciste`.
2. **`metodo-con-agentes`** (prefijo `ag-`, 13 lecciones en 4 módulos): el
   método agent-flow artefacto a artefacto — capas y orden de autoridad, qué
   entra en contexto y cuándo, instalación por symlinks, rules por stack con
   IDs y excepciones, skills y contratos compartidos, hooks que inyectan
   contexto, roles de subagente, issue como contrato, implement/review con
   tiers, QA con evidencias, tablero y deploy, tandas y loops, retros. Cierra
   la ruta `ingenieria-con-ia`. Entra en la revisión de frescura semestral.
   **Bloqueo:** agent-flow es privado y contiene nombres de terceros y una
   debilidad de seguridad de un proyecto real; MentorAI es público.
3. Huecos del catálogo, por prioridad: seguridad aplicada al backend (`sec-`),
   PHP moderno y calidad estática, concurrencia y consistencia en BD,
   RAG + seguridad de LLM (ampliar `construir-con-ia`), oficio de ingeniería,
   testing más allá del unitario, colas en PHP, OpenTelemetry/SLO, git
   avanzado, fechas y dinero, full-text, feature flags, Postgres.
