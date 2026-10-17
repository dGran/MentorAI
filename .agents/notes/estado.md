# Estado del proyecto

Última actualización: **2026-10-13**.

Este fichero se lee al empezar cada sesión y está pensado para leerse **entero**.
Lo cerrado vive en `archivo/`; si algo de aquí crece demasiado, se archiva.

## Dónde está el proyecto

**344 tutoriales · 36 cursos · 7 rutas · 577 preguntas de examen · 814 checks ·
108 retos de práctica.** `node scripts/validar.js` sale sin errores **y sin
avisos**: el sesgo de las opciones (#25), el ancla de cada `h2` (#112) y la
sección «Cuándo aplicarlo» en todo tutorial (#114) son ERROR.

**Curso `ia-por-dentro` (2026-10-06, épica #23):** «La IA por dentro», 5
lecciones con prefijo `llm-` (tokens y embeddings, atención y contexto,
entrenamiento y sesgos, muestreo, alucinación y verificación). Va entre
`programar-con-ia` y `claude-code` en la ruta `ingenieria-con-ia`, y cierra
`el-grado-que-no-hiciste`. Es la base mecánica del curso de método con
agentes. Nació medido: examen de 16 preguntas con la correcta como la más
larga solo en 2, y checks en 2 de 20.

**Curso `metodo-con-agentes` (2026-10-07, épica #24):** «Método con agentes:
del prompt al flujo de entrega», 13 lecciones con prefijo `ag-` en 4 módulos
(del agente al método, las piezas, el flujo de entrega, escalar y mejorar).
Cierra la ruta `ingenieria-con-ia`, y `cc-flujo-de-equipo` lo enlaza en un
callout sin tocar su «Fin del curso». **Decisión que no se reabre: el curso
enseña con ejemplos sintéticos** (proyecto ficticio «tienda» en PHP, método en
`~/.metodo/`); nunca datos ni nombres del método real del autor, que es
privado. Examen de 17 preguntas sin la correcta como la más larga, 39 checks y
3 retos (router de contexto probado con `echo`, auditar descripciones de
skills, de issue vago a contrato).

**Tanda fundamentos (2026-08-23):** dos cursos nuevos que cierran huecos de
base detectados en auditoría contra un temario de carrera — **`la-maquina`**
(«La máquina por dentro», 5 lecciones: CPU y caché, de código a programa,
kernel y syscalls, scheduler, sockets e I/O; en `el-grado-que-no-hiciste`
justo tras Fundamentos) y **`k8s-para-devs`** («Kubernetes para
desarrolladores», 4 lecciones prácticas con kind; en las dos rutas de infra
tras el curso de Infraestructura) — más el artículo suelto **`regex`**.
Prefijos de slug `maq-` y `k8s-`. Además, **«Tus datos» se movió de
`repaso.html` a la página nueva `perfil.html`** (export/import + sync), con
enlace «Perfil» inyectado en el nav por `perfil.js` — repaso quedaba como un
nombre que escondía la sincronización. Shell `v12`.

**Tanda IA (2026-08-22, segunda del día):** dos cursos nuevos —
**`claude-code`** («Claude Code: ingeniería con agentes», 11 lecciones en 3
módulos: el agente por dentro, configurar el entorno, automatizar) y
**`construir-con-ia`** (4 lecciones: API desde PHP, structured output,
streaming, coste y evals) — más la **7ª ruta `ingenieria-con-ia`**
(programar-con-ia → claude-code → construir-con-ia). Cada curso con su examen,
sus checks por lección y sus retos. Decisión de arquitectura: tres cursos
separados sin solapes en vez de inflar `programar-con-ia`, que queda intacto
como intro. Los slugs nuevos usan prefijos `cc-` e `ia-`.

El **norte está cumplido**: la ruta `el-grado-que-no-hiciste` son 26 cursos, y
**ningún curso queda fuera de una ruta**. Los 16 planes de `archivo/` están
cerrados, y las tres colas de ideas están consumidas: no queda backlog.

**«Ponlo en práctica» se cerró el 2026-08-22** (era lo último pendiente). El
formato decidido con el usuario: datos en `tutorials/practica.js`
(`window.MENTORAI_PRACTICE`, mismo patrón que quizzes/checks), pintados por
`assets/js/modules/practica.js` al final de la ficha de curso — solución en
`<details>` plegado y check «hecho» persistido en `academia-practica`, que viaja
con el export del perfil. 2-3 retos por curso, ejecutables en la máquina del
lector, con la solución explicando el porqué. El `lang` de los bloques de
código **no se restringe** a lo que resalta `syntax.js`: el resaltador escapa y
deja en plano lo que no conoce, así que `sql`, `go` o `rust` son etiquetas
válidas.

De la misma tanda (auditoría 2026-08-22): el validador ganó tres checks
estructurales (enlaces entre tutoriales, ids duplicados, páginas raíz en el
shell del service worker), hay skip link y `aria-live` en el buscador del
inicio (inyectados por JS, sin tocar los 264 HTML), y
**`verificar-offline.js` ahora corre en CI** — se reabrió la decisión de
«solo manual» porque los runners de GitHub traen Chrome de serie.

**Sync entre dispositivos (2026-08-23):** se reabrió —con motivo nuevo real:
uso multi-dispositivo frecuente— la opción Gist que `archivo/plan-multiusuario.md`
dejó anotada como descartada. `assets/js/modules/sync.js`: gist secreto por
usuario (token clásico scope `gist`, pegado hoy en `perfil.html`), fusión
reutilizando `Perfil.importar`, sync oportunista al cargar/salir/botón. El
token vive en `academia-sync` y **no viaja en el export**. Cada compañero usa
su cuenta → independencia gratis; se descartó explícitamente centralizar los
progresos en la cuenta del usuario (exigiría distribuir su token: un secreto
compartido no es un secreto). E2E verificado con dos perfiles de navegador y
gist real (creado, encontrado por token, fusionado en ambas direcciones,
borrado). Ojo para tests futuros: matar Chrome headless a lo bruto puede
perder escrituras de localStorage — no es un bug de la app.

Desde #29 (2026-10-07):
- **Ritmo:** como mucho una sync cada 30 s, contados desde `ultimaSync`, y nunca dos a la vez. «Sincronizar ahora» y conectar fuerzan saltándose el intervalo.
- **Subida al salir:** solo ocurre si esa misma página ya bajó, fusionó y subió. Así nunca pisa el gist sin fusionar; lo pendiente lo sube la siguiente sync.
- **Comparación:** se compara una huella sin `exportadoEn` y con las claves ordenadas, así que no se sube nada si no hay cambios.
- **Cuota llena:** `Perfil.importar` lanza `SinEspacio` si no cabe lo fusionado.

**Tanda de red de seguridad (2026-10-07):** #58, #31, #29, #13, #30 y #15, con
el contrato y el registro en `archivo/plan-tanda-2026-10-07.md`. Lo que cambió en la
forma de trabajar:
- **`verificar-offline.js`** mide el scroll horizontal a 320 y 375 px en
  `articulos.html` y en cada curso, y una limpieza fallida ya no da rojo.
- **`validar.js`** exige que el `<header>` y el `<footer>` de cada tutorial sean
  los de `_PLANTILLA.html`.
- **`init.js`** ejecuta cada paso aislado.
- **El service worker** revalida el shell con 304 (0 bytes por arranque si no
  hay cambios) y solo borra cachés `academia-*`.
- **Tests:** 32 → 63 (SRS, `fragmento` y sync).

A partir de aquí, todo lo que venga es **contenido nuevo o funcionalidad
nueva**, sin plan previo que consultar.

**Tanda del 2026-10-11:** #69, #70, #14, #18, #33 (parcial) y #28, con el
contrato y el registro en `archivo/plan-tanda-2026-10-11.md`. Lo que cambió:
- **Móvil:** ningún tutorial desborda a 320 ni a 375 px, y `verificar-offline.js`
  lo comprueba en los 300 (666 vistas, ~2,5 min en CI). Espera a que cada vista
  esté pintada en vez de dormir 600 ms.
- **`validar.js` da ERROR** ante un `.nav-drawer` escrito en el HTML, un
  `<table>` sin `.table-wrap` o un `reviewed` que no sea una fecha real.
- **Reiniciar progreso** (curso y lección) ofrece «Deshacer» 8 s (`ui-undo.js`).
  Restaura exacto y registra el alta en `academia-cambios` para que el sync no
  vuelva a borrarlo.
- **`reviewed`** en el manifest: las 38 lecciones de IA lo llevan. Es la fecha
  que mira la revisión de frescura.
- **Contenido:** 9 lecciones corregidas contra fuentes y 188 enlaces entre
  lecciones (de 200 a 83 piezas sin enlace entrante).

**Segunda tanda del 2026-10-11:** #78, #77, #16, #17, #32 (partido en #83 y #84),
#27, #22, #25 (piloto) y #26, con el contrato y el registro en
`archivo/plan-tanda-2026-10-11-b.md`. Lo que cambió:
- **Contraste y foco:** marca oscurecida hasta 4,5:1, anillo `:focus-visible` en
  todo lo enfocable y tokens de estado (`--success`, `--danger`…).
  `scripts/contraste.js` mide la matriz de pares en los dos temas, con su test.
- **Checks y exámenes accesibles:** `aria-live`, foco en la primera sin responder
  y etiquetas «Correcto»/«Tu respuesta» que no dependen del color.
- **Navegación:** rutas plegadas con `<details>`, chips de nivel en Cursos,
  «paso N de M» y miga Inicio › Curso › lección. El inicio orienta a quien llega
  («Empieza aquí» con el grado y los cimientos).
- **Lectura:** `--measure: 48ch` en párrafos, listas y callouts, y un solo
  `<main>` por página (lo exige `validar.js`).
- **Carga bajo demanda (#26):** los índices y las lecciones no cargan
  `quizzes.js`, `checks.js` ni `practica.js`. `data-loader.js` los inyecta al
  acercarse al final de la lección, o al momento en la lección del examen o si el
  ancla pide `#quiz`/`#check`. Los totales salen de `tutorials/quiz-summary.js`,
  generado por `scripts/generar-resumen-examenes.js`. `validar.js` da ERROR si el
  resumen está desfasado o si una página carga datos que no le tocan. Solo curso,
  repaso, perfil y offline cargan los tres de entrada. Lección: 1.073 → 425 KB.
- **Sesgo de longitud:** el piloto «fundamentos» fija el criterio del distractor
  plausible (en el refinado de #25). Quedan los demás cursos.

**Tercera tanda del 2026-10-11:** #39, #33 y #25, con el contrato, sus dos
enmiendas y el registro en `archivo/plan-tanda-2026-10-11-c.md`. Lo que cambió:
- **#25 cerrado en 6 bloques (#102-#107):** se reescribieron las opciones de
  ~1.000 preguntas. La correcta como la más larga pasa del 79 % al 17 % en
  exámenes y del 80 % al 21 % en checks. `validar.js` da ERROR por curso por
  longitud, por puesto de longitud y por forma (regla en `global.md`). Ids, `a`
  y orden intactos: el repaso no pierde historial.
- **#33 cerrado (#101):** 18 preguntas de escenario (fundamentos, Go, SOLID);
  ninguna pieza fuera de ruta; `testing` empieza por la pirámide; el nivel de
  un curso es el de su primera lección (cambian 9). Las tres lecciones
  `*-entorno-docker` se quedan, como decisión.
- **#39 desglosado** en #92-#100 (huecos del catálogo, P3).
- **Errores de contenido destapados al reescribir**, corregidos con su lección:
  hash flooding en PHP (no aleatoriza), OOMKilled (lo reinicia el kubelet, no
  el Deployment), `Cargo.lock` (guía de 2023), `flush()` de Doctrine,
  `readonly`, bytes y runes de Go.

**Épica #34 (2026-10-12), cerrada en 4 PRs (#108-#111):** las 63 lecciones de
Python, Go y Rust pasan a la plantilla actual (fase 0, por script y sin tocar el
texto; arregló los botones muertos del hero en Python y Rust) y ganan entradilla,
«Cuándo aplicarlo» y callout de errores típicos (fases 1-3). Los tres exámenes
pasan a 18 preguntas con un 33 % de escenario. `validar.js` gana la regla
`problemasDeEstructura` (ERROR global: índice antiguo, hero sin `.container`,
acciones o toggle escritos a mano, `ul.keypoints`, `<pre>` sueltos, callouts sin
cuerpo). Criterio de minutos acordado con el usuario: **≥ 60 palabras/min de
prosa, sin código** (el p25 del catálogo). Salieron y se corrigieron ~90 errores
de contenido (código que no compilaba, Go 1.22, `cmp.Ordered`, `Cargo.lock`,
Pydantic v2, pytest 8.4, axum…).

**Tanda del 2026-10-12/13** (contrato, registro y cierre en `archivo/plan-tanda-2026-10-12.md`):
vació el backlog en 16 PRs (#115-#130), producción de `v57` a `v70`.
- **Cursos nuevos:** `seguridad-backend` (#35, prefijo `sec-`), `php-moderno` (#36, `pm-`),
  `concurrencia-en-bd` (#37, `bd-`, todo reproducido en MySQL 8.4 y Postgres 17) y
  `oficio-de-ingenieria` (#92, `of-`, categoría `cultura`, en el grado tras protocolos).
- **Ampliaciones:** `construir-con-ia` +3 (RAG con pgvector, seguridad de LLM, agente en
  producto; #38), `testing` +4 (e2e, contrato, mutación, caracterización; #93), `git` +3
  (bisect, rebase interactivo, worktrees; #96), `sql-aplicado` +2 (full-text, JSONB; #98,
  #100), y una lección suelta en `sistemas-distribuidos` (Messenger, #94), `observabilidad`
  (OpenTelemetry, módulo nuevo; #95), `fundamentos` (fechas, #97) y `ci-cd` (flags, #99).
- **Estructura:** todos los `h2` con su ancla (#112) y «Cuándo aplicarlo» en todo el
  catálogo (#113, #114); los dos son ERROR del validador.
- **Método que funcionó:** autores delegados que dejan sus datos «de memoria» en
  `de-memoria.md`, y revisores frescos que reciben esa lista y **ejecutan** en Docker
  (37 errores de contenido cazados en 16 PRs). Los revisores proponen también los enlaces
  de entrada desde las vecinas.

**Tanda de vigencia del 2026-10-13** (contrato, enmienda y cierre en
`archivo/plan-tanda-2026-10-13.md`): 11 PRs (#133, #134, #144-#152), producción de `v70` a
`v81`, **80 lecciones corregidas** contra fuente oficial o Docker.
- **#131 y #132:** id de modelo `claude-opus-5-5` en las lecciones originales de
  `construir-con-ia` (con el razonamiento siempre activo: `maxTokens`, bloque `thinking`, pausa
  antes del primer token) y salidas reales de PHPUnit 13.4.2.
- **Auditoría de vigencia de todo el catálogo** (296 lecciones, fuera las revisadas el 2026-10-12):
  101 hallazgos confirmados (31 falsos, 70 desfasados), volcados en #135-#143 por área. Lo
  gordo: toolchains `golang:1.23`/`rust:1.80` que ya no compilan (pasan a 1.27 y 1.99), APIs
  eliminadas de Symfony 7/8 y DBAL 4, nginx escrito como INI que no pasaba `nginx -t`, tags de
  imagen inexistentes, `checkout@v4`/`cache@v4` en Node 20 (retirado de los runners),
  `--allowedTools` presentado como restricción, SDK de MCP v2, Promtail retirado, uv que crea
  paquete. Los ejemplos ejecutables tocados se ejecutaron en Docker.
- **Método:** auditores de solo lectura → issues con cita, fuente y arreglo propuesto →
  implementadores que **reconfirman cada arreglo antes de escribirlo** (6 propuestos también
  estaban mal) → revisores frescos (12 errores más, casi todos frases vecinas que quedaban
  contradictorias) → publicación en serie recomponiendo cada rama sobre `main`.
- **Remates del 2026-10-14** (#153 → PR #154, `v82`, `archivo/plan-tanda-2026-10-14.md`): PIE en
  las tres lecciones que seguían con `pecl install`, tamaños de Go y Python medidos, `lib/pq`
  v1.12.3, matices de rsyslog y de `pm = dynamic`, `package = false` de uv y la lección pasa a
  llamarse «Docker Compose» (**el slug `docker-compose` no cambia**).

- **Enlaces de entrada (2026-10-14/15)** (#157-#164, PRs #165-#172, `archivo/plan-tanda-2026-10-14-b.md`):
  las 75 lecciones a las que no llegaba ningún enlace desde el cuerpo de otra reciben 122, sin
  excepciones, y `validar.js` avisa de cualquier huérfana nueva (`LECCIONES_SIN_ENTRADA_JUSTIFICADA`,
  hoy vacía). Producción `v90`.

- **Cobertura de exámenes (2026-10-16)** (#173-#177, PRs #178-#182, `archivo/plan-tanda-2026-10-16.md`):
  las 19 lecciones de curso que ninguna pregunta de su examen nombraba en `lesson` tienen ahora 29
  preguntas; `validar.js` avisa de cualquier lección de curso sin pregunta
  (`LECCIONES_SIN_PREGUNTA_DE_EXAMEN_JUSTIFICADA`, hoy vacía). Destapó 4 errores de lección,
  corregidos. Producción `v94`.

## Para retomar (2026-10-16)

`main` en `54a23c2`, producción en `v94`. Ningún PR abierto. `validar.js` sin errores y sin avisos;
`node --test` 126/126.

**Backlog** (P3, `fix`, sin empezar; los restos de la tanda de exámenes):
- #183: `go-a-produccion` pone el ping a la BD en `/health` y su keypoint invierte `/health` y
  `/ready`, al revés de lo que recomienda la propia lección; `expvar` llamado «formato Prometheus».
- #184: `sd-falacias` presenta la opción `timeout` de Guzzle como timeout de lectura (es el total).

Son independientes y pequeños: caben en una tanda corta como la de #155, con el mismo método.

**Herramientas reutilizables** (gitignored, en `.agents/tasks/`):
`lecciones-sueltas/integrar.js` (añade lecciones a un curso existente, tras una lección
o en un módulo nuevo), `lecciones-sueltas/prompt-base.md` y `prompt-review.md`
(encargos de autoría y de review), `tanda-2026-10-12/{publicar,cerrar}.sh` (rama → PR →
QA → merge → Pages → Done), `qa-curso.js`, `qa-leccion.js`, `qa-cuando.js` y `cdp.js`
(Chrome headless con perfil en `~/.cache` y limpieza en `finally`). Para correcciones en
paralelo: `tanda-2026-10-13/`, `tanda-2026-10-14/` y `tanda-2026-10-16/` (`qa-examen.js` pinta el examen, responde bien todo y comprueba el máximo; `examenes/medir.js` cuenta lecciones sin pregunta; la de 10-14 con `qa-enlaces.js`, que hace clic en cada enlace nuevo, y `abrir-pr.sh` por REST; `enlaces-entrada/medir.js` cuenta huérfanas) (`preparar.sh` recompone una rama sobre `main` con parche 3-way,
`reviewed`, índice y `VERSION`; `abrir-pr.sh`, `cerrar-serie.sh`, `qa-texto.js` para «texto
nuevo | texto viejo» por lección, y `revisado.js`).

## Decisiones que no se reabren sin motivo nuevo

Están razonadas en `archivo/`; aquí solo el veredicto, para no volver a
discutirlas por olvido:

- **No hay autoría desde la app**, ni con IA ni manual. Se escribe en sesiones de
  Claude Code con la skill `/tutorial`. El puente (`server/bridge.js`) se borró.
- **No hay tutor con IA por lección.** Rompería el invariante de `file://` y
  offline por una función que compite con leer. El diseño técnico está guardado
  en `archivo/plan-ia-en-la-app.md` por si algún día cambia el criterio.
- ~~No hay tablero de tareas~~ **Reabierta el 2026-10-06** a petición del usuario:
  la auditoría de ese día sacó ~40 tareas y se adoptó el flujo de agent-flow con
  tablero (Project 6). La continuidad del proyecto sigue en este fichero; la de
  cada tarea, en su issue.
- **El uso es individual**: nada de campo `author` ni features de grupo. Sí hay
  export/import del progreso, que es el caso real de dos dispositivos.

## Trampas que ya nos han mordido

Cada una costó una depuración; están aquí para no repetirlas.

- **`verificar-offline.js` no admite dos a la vez, tampoco desde un subagente.** Usa puertos
  fijos (8899/9336): un revisor que lo lanzó mientras el coordinador publicaba dejó los dos
  en rojo y el suyo colgado (2026-10-13). Los revisores no lo ejecutan; lo cubren CI y la
  publicación.
- **Docker Hub corta con 429** cuando varios agentes bajan imágenes a la vez: reutilizar las
  locales (`docker images`) antes de bajar.
- **GraphQL de GitHub se agota con varios agentes a la vez** (5000/h por usuario, compartido): `gh pr
  list`, `gh pr view` y `gh project` fallan con «API rate limit already exceeded». Con más de cuatro
  subagentes en paralelo, que usen REST (`gh api repos/...`) y dejar GraphQL para mover el tablero.

- **Emular «offline» en el navegador no prueba el offline.** No afecta a las
  peticiones del service worker. Hay que **apagar el servidor**: lo hace
  `node scripts/verificar-offline.js`.
- **El sesgo de posición en las preguntas se cuela solo.** La IA tiende a poner
  la correcta en el mismo sitio. El validador lo mide **por curso y en total**,
  porque un curso nuevo mal repartido se diluye en el conjunto.
- **Las notes derivan.** El 2026-08-01 había seis planes declarando «pendiente de
  autoría» cursos publicados semanas antes. Al cerrar algo hay que tocar su
  `## Estado`, no solo la lista de las rules.
- **Un `<` sin escapar dentro de `<code>` se come el resto del bloque.** Lo caza
  el validador; llegó a haber cinco tutoriales rotos así.
- **`pkill -f "patrón"` se mata a sí mismo** si el patrón aparece en la propia
  línea de comandos del shell.
- **Dos PRs que suben `VERSION` al mismo valor se fusionan sin conflicto.** Git
  ve el mismo cambio en los dos lados y no avisa: el segundo despliega su shell
  con la versión que ya tenía el primero. Pasó en la tanda del 2026-10-06 (tres
  PRs con `v13`). La versión se fija **al rebasar sobre `main` justo antes de
  mergear**: la de `main` más uno. Y para que un PR **no** toque `VERSION`, se deja
  `sw.js` sin cambios en la rama: copiarlo de `main` parece neutro, pero tras un
  rebase revierte la subida de otro PR (pasó con #55 sobre #54, arreglado en #57).
- **`verificar-offline.js` usa puertos fijos (8899 y CDP 9336).** Dos ejecuciones
  a la vez se pisan y fallan con errores que parecen del código (`Cannot read
  properties of null`). Se ejecuta en serie, nunca desde dos sesiones a la vez.
- **El sync resuelve los borrados por fecha, con dos límites asumidos.** Las
  bajas se guardan en `academia-cambios` y se purgan a los 180 días: un
  dispositivo que lleve más tiempo sin sincronizar puede resucitar lo borrado.
  Y la fecha es el reloj de cada dispositivo: uno con el reloj adelantado gana
  los empates y purga antes de tiempo.
- **`Perfil.contenido()` lleva `exportadoEn` con la hora actual.** Comparar dos
  exports como texto da siempre «distinto»: el sync hacía un PATCH por página
  sin cambios y su `ultimoSubido` no servía de nada (#29). Se compara la huella
  sin esa fecha.
- **Un `http.server` viejo en el mismo puerto hace que el nuevo no arranque, sin
  avisar.** Lanzado con `setsid … &`, el fallo de `bind` no se ve y el QA
  acaba midiendo otro directorio (pasó dos veces en la tanda del 2026-10-07).
  Antes de levantar uno, `ss -ltnp` y `readlink /proc/<pid>/cwd`.
- **Un dato de documentación volátil se contrasta en la fuente, no en un
  resumen.** Un subagente resumió mal los permisos de Claude Code («un deny de
  `Read` no cubre `cat` por Bash») y la lección llegó a escribirse así; lo cazó
  el review leyendo la página oficial.

- **`overflow-wrap: anywhere` en un contenedor aplasta tablas y botones.** Reduce
  el min-content de todo lo que hay dentro: las tablas dejan de scrollear dentro
  de su `.table-wrap` y se parten palabras normales («Cop/iar»). Pasó en #70: hubo
  1957 palabras partidas a 320 px. Va solo en los flex items con tokens largos, y
  para el texto corrido se usa `break-word`, que no toca el min-content.
- **`quizzes.js`, `checks.js` y `manifest.js` están en el shell del SW.** Un PR de
  contenido que cambia una pregunta también sube `VERSION`. A #18 se le pasó hasta
  el final del PR.
- **`display: flex` le gana a `[hidden]`.** El filtro de Cursos ponía `hidden`
  y la tarjeta seguía visible; el QA miraba el atributo y lo dio por bueno (#27).
  Se verifica la visibilidad real (`getBoundingClientRect`), no el atributo.
- **El límite secundario de GraphQL corta `gh pr` y `gh project`** tras muchas
  llamadas seguidas, durante minutos. Comentarios, PRs, merges y CI van por REST
  (`gh api repos/...`) y los movimientos del tablero, por una cola con reintentos.
- **Los subagentes llenan el disco y pisan ficheros compartidos.** En una tanda
  dejaron más de 1 GB en el scratchpad y uno sobrescribió un script de QA. Cada
  revisor usa su propio directorio temporal y lo borra al terminar.
- **El redondeo esconde el umbral.** Un 45,2 % redondeado a 45 % pasaba por
  bueno; los umbrales se comparan sin redondear.
- **Arreglar un sesgo mecánico de las preguntas crea el siguiente.** Al igualar
  longitudes, la correcta pasó a ser la segunda más larga y luego a tener otra
  forma. Se mide el truco entero (longitud, puesto y forma), no solo el del issue.
- **Los autores delegados escriben bien el contenido y mal los datos de versión.**
  Cada lote de redacción destapó errores de la lección original (y alguno nuevo):
  la review fresca contra la semántica real del lenguaje y la versión actual es la
  que los caza. Pide a cada autor que liste lo que puso de memoria.
- **Un script de migración de HTML comprueba que el texto visible no cambia**
  antes de escribir. Así la fase 0 de #34 tocó 63 ficheros sin perder una palabra.
- **`pgrep -f patrón` se encuentra a sí mismo** si el patrón aparece en la línea
  de comandos del shell que lo lanza: dio «viva» a una cola ya parada.
- **El service worker sirve el HTML viejo en la primera visita tras subir
  `VERSION`.** Un perfil de Chrome reutilizado mide la página anterior; la
  medida buena es la segunda visita.
- **Un script que calcula la raíz del repo con `__dirname` ignora el worktree desde el que
  se lanza.** El integrador de lecciones escribió en el working tree principal (con un
  revisor y un offline leyéndolo) en vez de en el worktree de revisión. Los scripts que
  escriben en el repo usan `process.cwd()`, y los borradores se leen por ruta absoluta.
- **Un `http.server` que sobrevive de otra sesión ocupa el puerto** y sirve otro
  directorio: el QA lo midió y falló contra él (pasó en #113 con el 8001). `readlink
  /proc/<pid>/cwd` antes de medir, y un puerto propio por QA.
- **Hacer clic en el centro de un enlace partido en dos líneas cae fuera del texto.** El
  QA de enlaces de entrada usa el primer rectángulo (`getClientRects()[0]`).
- **Symfony versiona el `.env`; lo ignorado es `.env.local`** (Laravel sí ignora `.env`).
  Una lección y un check lo trataban al revés (#96).

## Rutina pendiente: revisión de frescura

El validador vigila la estructura, no la verdad: el contenido caduca sin que
nada avise. **La primera pasada completa se hizo el 2026-10-13** (tanda de vigencia: 101
hallazgos en 296 lecciones; el método, en `archivo/plan-tanda-2026-10-13.md`). **Hacia
abril de 2027, la siguiente revisión de frescura** de
las categorías volátiles — los cursos `claude-code`, `construir-con-ia` y
`metodo-con-agentes` (hooks, subagentes y formato de skills cambian con la
herramienta) sobre todo (la lección de la API ya nació corrigiendo `temperature`, que desapareció
de los modelos actuales), y de paso `programar-con-ia` y la sección «Lo que el
proveedor ya no deja tocar» de `llm-muestreo` (el resto de `ia-por-dentro` es
mecánica estable). Formato: una sesión de
auditoría como la del 2026-08-22, leyendo contra las fuentes actuales y
corrigiendo con `/tutorial`. Repetir cada ~6 meses solo para esas categorías;
el resto del catálogo (SQL, OOP, Linux…) envejece a décadas, no a meses.

## Cómo se mantiene

| Comando | Para qué |
| --- | --- |
| `node scripts/validar.js` | Valida el catálogo entero, incluida la cabecera y el pie de plantilla de cada tutorial. Corre en CI |
| `node scripts/generar-indice.js` | Regenera el índice de búsqueda tras tocar tutoriales |
| `node scripts/generar-resumen-examenes.js` | Regenera `tutorials/quiz-summary.js` tras tocar un examen (`--comprobar` lo usa `validar.js`) |
| `node scripts/contraste.js` | Matriz de contraste de los tokens en los dos temas |
| `node scripts/verificar-offline.js` | Comprueba el offline con el servidor apagado y el scroll horizontal a 320/375 px. Corre en CI |
| `node --test 'scripts/tests/**/*.test.js'` | Tests de la lógica pura (`node:test` + `vm`, sin dependencias). Corre en CI |

Al tocar `sw.js` o el shell (módulos, CSS, `quizzes.js`, `checks.js`, `manifest.js`), **subir `VERSION`** (va por `v70`). La
caché de contenido guardado (`academia-content`) ya no lleva versión: un
despliegue no borra lo que el lector guardó para viajar.

## El archivo

`archivo/` guarda los 16 planes cerrados, las tres colas de ideas consumidas y
`estado-historico.md` (el log de sesiones de junio y julio de 2026, 1500 líneas).
No hace falta leerlo para trabajar; sirve para responder «¿por qué esto es así?».
