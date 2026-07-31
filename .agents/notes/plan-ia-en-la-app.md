# Plan — Qué papel juega la IA dentro de la app (2026-07-31)

Sustituye al borrador `plan-autoria-en-prod.md` de esta misma sesión, que partía
de la pregunta *"¿cómo hago que se pueda crear contenido con IA desde la app en
producción?"*. Tras analizarlo, **la respuesta es que no se hace**. Esta note
recoge la decisión, el porqué, y lo que sí se hace en su lugar.

## Decisión: la autoría desde la app queda DESCARTADA

No porque la IA sobre para crear contenido — es justo al revés, los 194
tutoriales existen porque los generó una IA — sino porque **la autoría ya está
resuelta, y no vive en la app**.

La evidencia está en el propio `estado.md`: los 21 tutoriales de Python
("escritos por subagentes"), los 21 de Go, los 21 de Rust, el rollout de
«Cuándo aplicarlo» en 84 ficheros ("10 agentes en paralelo"). Nada de eso salió
del modal del compositor. Salió de **sesiones de Claude Code** con un plan en
una note, agentes en paralelo, revisión y commit — y existe una skill
`/tutorial` hecha para exactamente eso.

Una sesión de Claude Code es estrictamente más potente que un formulario de
cuatro campos que genera un tutorial suelto: puede planificar un curso entero,
lanzar 10 agentes, tocar `courses.js` y `paths.js`, revisar cruces y commitear.
El puente (`server/bridge.js`, 2026-06-21) se construyó **antes** de que ese
flujo de notes + skills + agentes estuviera maduro. Es legacy.

**Tampoco se pasa a autoría manual.** Se descartó explícitamente: un tutorial
son ~22 KB de HTML con el TOC casando con los `<h2>`, el escapado de los
`<code>`, la sección «Cuándo aplicarlo», el manifest, el curso, la ruta y 10-12
preguntas de examen. Horas por pieza, y hay 194. Escribir el 195 a mano no es
simplificar, es abandonar el proyecto.

## Qué se elimina

- **El compositor y el refinador de `articulos.html`** (`:119` y `:197`) y el
  botón «Refinar» que `catalog.js:177` pinta en cada tarjeta. Hoy, en Pages,
  prometen algo que **siempre falla** (POST a `/api/generate` contra un origen
  sin puente; la guarda `IS_FILE_PROTOCOL` no cubre `https`). No se arreglan:
  se borran, junto con `assets/js/modules/bridge.js`.
- **Pendiente de decidir: `server/bridge.js`** (599 líneas). Si `/tutorial`
  cubre el caso, es mantenimiento que no devuelve nada. Se puede jubilar en el
  mismo movimiento o dejarlo muerto sin referencias desde la web.

## Qué se hace en su lugar

**Botón «proponer mejora» en la página de tutorial** que abre un issue de
GitHub prellenado (`github.com/dGran/MentorAI/issues/new?title=…&body=…`) con
el slug y la sección desde la que se pulsa.

Es el D5 de `plan-multiusuario.md`, y resuelve el hueco real que deja quitar la
autoría: estás leyendo en la tablet, detectas un error o se te ocurre un
ejemplo mejor, y no tienes dónde meterlo. El patrón es **capturar la intención
donde lees, ejecutarla donde están las herramientas**: la siguiente sesión de
Claude Code lee los issues y los resuelve con la skill.

Cero backend, cero coste de tokens, cero claves. Veinte líneas.

## Lo único que sigue abierto: el tutor por lección

Un panel de chat en la página de tutorial, sobre **la lección que estás
leyendo** (se le pasa el texto del `article.prose` como contexto). *"Explícame
esto de otra forma"*, *"dame otro ejemplo en Python"*, *"ponme 3 preguntas de
este tema"*.

Esto **no es autoría**: es estudio. Es efímero, no escribe ficheros, no toca el
catálogo. Es la única pieza de IA-en-la-app que sobrevive al recorte, porque
cubre una necesidad que ninguna otra herramienta cubre: preguntar sobre el
párrafo que tienes delante, lejos del PC.

### Condición para hacerlo

**Depende del hábito real de lectura del usuario**, y está sin decidir:

- Si lee a menudo lejos del escritorio y con red → merece la pena.
- Si lee casi siempre en el PC → no se monta nada: abrir Claude Code y
  preguntar es mejor y gratis.

**Aviso importante que salió del análisis: el tutor necesita red.** En un vuelo
no funciona. El caso de uso offline y el del tutor **no se solapan**; son dos
features distintas y no hay que confundirlas al priorizar.

### Si se hace, cómo: proxy fino en Vercel (~40 líneas)

Evaluadas tres formas, con datos verificados el 2026-07-31:

| | Quién llama al modelo | Veredicto |
|---|---|---|
| **BYOK (clave en el navegador)** | el navegador | **Descartado.** CORS sí funciona (preflight verificado contra `api.anthropic.com` con `anthropic-dangerous-direct-browser-access` → 200), pero los tutoriales son HTML generado por IA **en el mismo origen**: uno malo podría leer la clave. Riesgo real, no teórico. |
| **Proxy fino en Vercel** | una función `/api/ai` | **Recomendado.** La clave vive en una env var; el navegador no ve nada. |
| **Backend completo en Vercel** | funciones que además commitean | Innecesario si no hay autoría. |

Datos comprobados sobre Vercel:
- Sirve estáticos sin build (`vercel.json` sin comando) → el invariante
  «sin build» y el `file://` se mantienen intactos.
- **300 s de duración máxima en plan Hobby** (doc de 2026-07-01). Sobra.
- Hobby es gratis para uso personal (uso comercial no permitido).
- Sistema de ficheros de solo lectura salvo `/tmp` efímero — irrelevante ahora
  que no hay que escribir contenido.
- Efecto secundario: Vercel sirve en la raíz del dominio, así que los
  bloqueantes 1 y 2 de `plan-offline-real.md` (el `/sw.js` que da 404 bajo
  `/MentorAI/`) desaparecerían solos. **Aun así hay que arreglar las rutas
  bien** en vez de depender del hosting, y el bloqueante 3 (`ignoreSearch`)
  sigue igual.
- La URL es pública: hace falta un secreto compartido en cabecera contra una
  env var, o cualquiera puede quemar créditos.

**Coste (estimado, no medido — falta clave para contar tokens):** con
`claude-opus-5`, entre 1 y 5 céntimos por pregunta al tutor gracias al caché de
prompt sobre la lección. Método de la estimación: la lección media pesa 22 KB.

Detalle técnico si se implementa: módulo `assets/js/modules/ai.js` →
`MentorAI.AI`, `fetch` puro sin dependencias, streaming SSE leído a mano,
`output_config: {effort: "low"}` y `max_tokens: 4096` para latencia. **No
desactivar el thinking** (en Opus 5 está activo por defecto y desactivarlo
tiene modos de fallo conocidos, entre ellos que se filtren etiquetas internas
al texto visible); bajar el `effort` es el lever correcto.

## Consecuencias en otros planes

- **`plan-multiusuario.md`**: A2 (manifest ordenado por slug) y A4 (estado
  `draft`) pierden casi todo su motivo, porque nacían de "varios generando en
  paralelo desde la app". A1 (validador) **sigue siendo válido y prioritario**:
  ahora protege lo que generan los agentes de Claude Code. D3 (quiz en la misma
  generación) se traslada a la skill `/tutorial`, no al puente.
- **`plan-autocategorizacion.md`**: pasa a ser cosa de la skill.
- **`plan-evaluaciones.md`**: su fase 5 (generar exámenes y práctica con IA)
  se apoya en el tutor si se hace; la generación de bancos de preguntas va por
  Claude Code.

## Estado

**Decidido y EJECUTADO 2026-07-31.**

- (a) **Hecho.** Eliminados `assets/js/modules/bridge.js`, `server/bridge.js` (y
  el directorio `server/`), los dos modales y el botón «Añadir artículo» de
  `articulos.html`, el botón «Refinar» de `catalog.js`, las llamadas de
  `init.js`, los `<script>` del puente en los 200 HTML y el CSS muerto
  (`.modal*`, `.composer-form*`, `.field*`, `.card__refine`). Cero referencias
  huérfanas.
- (b) **Hecho.** Botón «proponer mejora» en `tutorial.js`: abre un issue de
  GitHub prellenado con el slug y la sección en la que estás (recalculada en
  `pointerdown`, no al inyectar el botón).
- (c) **Sigue pendiente**: decidir el tutor por lección según el hábito real de
  lectura. Si se hace, todo el diseño técnico está arriba y no hay que volver a
  investigarlo.

Nota para quien retome: la autoría es ahora **exclusivamente** Claude Code +
skill `/tutorial`. Si alguien echa de menos generar desde la web, releer el
apartado «Decisión» antes de reabrirlo.
