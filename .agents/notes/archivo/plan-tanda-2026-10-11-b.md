# Tanda 2026-10-11 (b) — accesibilidad, navegación, inicio y carga

Estado: **cerrada**. De los 9 issues entraron todos, mergeados en 11 PRs (#32 se partió en tres) y desplegados hasta `v47`. #25 entró como piloto y sigue abierto con el resto de cursos. La revisión fresca cazó 4 hallazgos altos o mayores, todos arreglados antes del merge.

## 1. Estado de partida (medido 08:35 +02:00)

- `main` en `92bccd2`, limpio, 0 PRs abiertos, `check-board.sh --project 6` → exit 0. Producción en `v37`.
- `validar.js` sin errores, 61 avisos; `node --test` 68/68; `verificar-offline.js` verde con 666 vistas móviles (última pasada, en la tanda anterior).
- Issues de la tanda: `OPEN`, `Backlog`, sin asignar, sin rama, sin PR, sin `blocked-external`. Los bloqueantes son internos y se resuelven en orden: #17 espera a #16 y #32 a #17. #22 dependía de #1 y #10, los dos cerrados.

| Issue | Reproduce hoy |
|---|---|
| #78 tests de `validar.js` | `scripts/tests/` no tiene ningún test de `validar.js` |
| #77 desborde y solape en escritorio | `sql-joins` +1 px a 1280 (medido en la tanda anterior); `.flow` de `alerting` con texto solapado (captura de la review de #72) |
| #16 contraste y foco | `--text-muted`/`--bg` 4,42; blanco/`--brand-2` (claro) 4,23; blanco/`--brand` (oscuro) 3,40; 0 reglas `:focus-visible`; 4 `outline: none` |
| #17 checks y exámenes accesibles | 19 literales `#16a34a`/`#dc2626` en `styles.css`; 0 `aria-live`/`role="status"` en `checks.js` y `quiz.js` |
| #32 deuda de CSS y lectura | 14 `transition: all`; `orientation` bloqueada en `manifest.webmanifest` |
| #27 Rutas y Cursos navegables | se mide en el refine (altura de `rutas.html`, filtros de `cursos.html`) |
| #22 inicio para quien llega | se mide en el refine (orden de bloques con `localStorage` vacío) |
| #25 sesgo de longitud (piloto) | checks de «fundamentos»: la correcta es la más larga en el 100 % de 45 (`validar.js`) |
| #26 carga bajo demanda | una lección carga 1.080 KB de JS (medido el 2026-10-11) |

## 2. Línea de no colisión

Sin otros tracks ni otras personas. Solapes internos, en serie y con `git pull` + rebase antes de cada issue:

- `assets/css/styles.css`: #77, #16, #17, #32, #27 y #22, en ese orden. #16 fija los tokens que #17 y #32 consumen.
- `checks.js`/`quiz.js` (módulos): #17 y #26, en ese orden.
- `home.js`: #32 (buscador del inicio) y #22, en ese orden.
- `tutorials/checks.js`: #25 y #26, en ese orden.
- `scripts/validar.js`: #78 primero (lo vuelve testeable); después, cualquier regla nueva de otros issues.
- `sw.js`/`VERSION`: cada issue que toque shell fija `VERSION` = `main` + 1 al rebasar justo antes de mergear (rule actualizada hoy).

## 3. Orden por demostrabilidad

1. **#78.** Construye red: las reglas de `validar.js` con tests.
2. **#77.** Pequeño; con la red de geometría de #70.
3. **#16.** Crea su propia red (script de matriz de contraste) y fija los tokens.
4. **#17.** Tokens de estado sobre la matriz de #16; QA de teclado y lector en navegador.
5. **#32.** Limpieza de CSS con red de geometría y contraste. Se parte si crece (CSS / lectura / buscador).
6. **#27.** Navegación en `rutas.html`, `cursos.html` y la ficha de curso.
7. **#22.** Reordena el inicio.
8. **#25 piloto.** Contenido, solo el curso «fundamentos».
9. **#26.** El de más riesgo: toca los `<script>` de 309 páginas y 6 consumidores. Cierra la tanda.

## 4. Límites y fuera de la tanda

Decididos por el usuario (§ 6):

- **#16.** Se oscurecen `--brand`/`--brand-2` lo justo para que el blanco llegue a 4,5:1, y `--text-muted` un punto más oscuro. El tono violeta cambia levemente.
- **#22.** «Empieza aquí» recomienda «El grado que no hiciste» y «Backend desde los cimientos».
- **#25.** Solo el curso piloto «fundamentos» (exámenes y checks). El umbral **no** pasa a error: eso exige todos los cursos y queda en el issue.
- **#27.** Valores por defecto: rutas plegadas con `<details>` y anclas; chips de nivel en `cursos.html` sin estado en la URL; «paso N de M» en la ficha; miga Inicio › Curso › lección.
- **#26.** Criterio rebajado (aprobado en la tanda anterior): las 4 páginas índice no cargan `quizzes.js`, `checks.js` ni `practica.js`, y la lección los inyecta bajo demanda. Hace falta un resumen generado con total, nota de corte e ids válidos (ver sus comentarios de refinado).

| Fuera | Motivo |
|---|---|
| #33 (lo que queda) | Decisiones editoriales: rutas, niveles, lecciones gemelas, preguntas de escenario |
| #34-#38 | Épicas de curso: `/implement-epic` |
| #39 | Paraguas sin tarea concreta |

## 5. Criterio de parada

- Primer rojo sin arreglo evidente: PR abierto con diagnóstico y salto al siguiente **solo si es independiente**. #16 → #17 → #32 es una cadena: un rojo en #16 o #17 para la cadena entera.
- Criterio inviable o falso → comentario en el issue y se salta; no se reinterpreta.
- Decisión de producto o diseño nueva que no cubre § 4 → pregunta anotada y se sigue con lo independiente.
- **#16**: si la paleta oscurecida no llega a 4,5:1 en algún par sin cambiar el tono de forma visible → para la cadena y se pregunta.
- **#26 y #25**: cualquier pérdida o cambio de datos guardados del usuario (repaso, progreso) → para la tanda.
- Borrar algo no acordado aquí → para.
- Gate de checks siempre en un paso propio; `verificar-offline.js` nunca en paralelo; `ss -ltnp` antes de levantar un servidor.
- Límites del loop: 5 intentos por nodo, 60 ciclos, sin tope de tiempo (decisión del usuario).

## 6. Decidido por el usuario al lanzar

> «podemos preparar una nueva tanda?» → con estas decisiones:
>
> «#16: ¿cómo?» → **«Oscurecer la marca (Recomendado)»**.
>
> «#22: ¿qué rutas?» → **«Grado + cimientos (Recomendado)»**.
>
> «#25: ¿qué alcance?» → **«Solo curso piloto (Recomendado)»**.
>
> «#27: ¿con defaults?» → **«Sí, con defaults (Recomendado)»**.
>
> «¿Cómo la lanzo?» → **«Automerge, sin límite de tiempo (Recomendado)»**: se mergea lo que pase review fresca, QA y CI, con evidencias en cada PR.

## Registro

| Issue | PR | Merge | Review (subagente, contexto fresco) | QA |
|---|---|---|---|---|
| #78 tests de `validar.js` | #79 | `ddd4367` | aprobado; refactor con salida idéntica (`cmp`, también con errores inyectados) y 6 mutaciones cazadas. Menores aplicados: casos límite (`reviewed` = `date`, dos problemas a la vez) y `TZ` fija para que el test del día local discrimine en CI | `skip-qa` (tooling); producción sin cambio de shell |
| #77 desbordes y solapes en escritorio | #80 | `51fbef1` | **2 rondas, aprobado.** Refine: la causa era el `.compare` (19 páginas), y el criterio 3 se enmendó. Ronda 1: menores aplicados y **ampliación**, porque 38 tutoriales tenían scroll horizontal a 1280 por `<pre>` sueltos y callouts y `keypoints` antiguos (segunda enmienda). Ronda 2: aprobado; menor aplicado (agrupar las reglas). Límite secundario de GraphQL → comentarios, merge y CI por REST | 1280: 38 → 0 tutoriales con scroll; 375/320: 0; plantilla actual sin cambios; producción en `v38` |
| #16 contraste y foco | #81 | `4eeb6cc` | **2 rondas.** Ronda 1: 2 medios aceptados (anillo recortado por el `overflow` del índice y la miga; textos translúcidos sobre el relleno a 3,16-3,55) y menores aplicados (anillo sobre `--code-bg`, pares de la matriz, constantes WCAG, `a:hover`). Ronda 2: aprobado; menor aplicado: `--link-hover` (4,82) | matriz con 46/46 ✓ (20 ✗ en `main`); 25 enfocables con anillo en cada tema; producción en `v39` |
| #17 checks y exámenes accesibles | #82 | `d4db132` | **2 rondas.** Ronda 1: alta aceptada (etiquetas duplicadas al reenviar el examen, y doble registro en el repaso que ya estaba en `main`) y media (la opacidad de `:disabled` bajaba las etiquetas a 3,11), más menores y SR (`aria-disabled`, foco en la primera sin responder). Ronda 2: media aplicada (aviso de incompleto como `role="alert"`), verificada por el autor | etiquetas 2/pregunta tras reenvíos, foco fuera del `body`, matriz 72/72 ✓; producción en `v40`. Tablero: movimientos con retraso por el límite secundario de GraphQL |
| #32 deuda de CSS (partido) | #85 | `0126525` | aprobado: estilos computados de todos los elementos idénticos salvo la transición, 0 literales fuera de tokens y selectores muertos sin uso. Refine: partido en #32 (CSS), #83 (lectura) y #84 (buscador) | 300/300 geometrías y colores idénticos en los dos temas; producción en `v41` |
| #27 Rutas y Cursos navegables | #86 | `9eca279` | **2 rondas.** Ronda 1: mayor aceptado (por http, el filtro dejaba los botones offline huérfanos), más repintados del sync, la miga de los artículos y tests. Ronda 2: el arreglo no funcionaba (`display: flex` ganaba a `hidden`; mi verificación miraba el atributo) → `:has` en CSS y volver a envolver tras el sync | rutas a 1.895 px plegadas (antes 8.218); filtro por visibilidad real 32/2/18/12; producción en `v42` |
| #22 orientar en el inicio | #87 | `bb2e15d` | **2 rondas.** Ronda 1: regresión del buscador (resultados 2 pantallas más abajo), sync desfasado y jerarquía de encabezados, aceptados. Ronda 2: aprobado | «Empieza aquí» con 2 rutas; Rutas antes que Novedades; métricas para el alumno; producción en `v43` |
| #25 sesgo de longitud (piloto «fundamentos») | #88 | `6dd777c` | **2 rondas** de contenido: 3 distractores defendibles y una pista por puntuación (16/20 → 4/65), aceptados; 3 retoques | checks 45/45 → 7/45 y examen 15/20 → 2/20 con la correcta como la más larga; producción en `v44`. **#25 sigue abierto** con el resto de cursos |
| #83 ancho de línea y `<main>` | #89 | `83b0a6a` | aprobado; candidato aplicado: la medida también en listas y callouts (iban a 85-95 caracteres) | párrafos ≤ 73, listas ≤ 67, callouts ≤ 74 caracteres; skip link → `MAIN`; producción en `v45` |
| #84 buscador del inicio | #90 | `5a5a750` | aprobado; menores aplicados (poca altura, pista oculta, naming) | primer resultado entero a 1280/1024/375; «Índice» en el título primero; producción en `v46` |
| #26 carga bajo demanda | #91 | `f0065c2` | **2 rondas.** Ronda 1: alta (un enlace a `#quiz` ya no llevaba al examen) y falta de tests, aceptadas; medias (curso del examen con varios cursos por lección, botón «Hecho» sin bloquear hasta llegar los datos) aplicadas. Ronda 2: aprobado; menores aplicados (regla de `validar.js` sobre qué datos carga cada página, ancla a sección existente sin carga forzada) | índices 1.073 → 425 KB; lección 425 KB y checks al acercarse al final; lección del examen 965 KB; misma UI que `main` en las 8 páginas medidas; producción en `v47` |

## Cierre

| Issue | Estado | Producción |
|---|---|---|
| #78 | Done | sin shell |
| #77 | Done | `v38` |
| #16 | Done | `v39` |
| #17 | Done | `v40` |
| #32 (partido en #32, #83 y #84) | Done | `v41` |
| #27 | Done | `v42` |
| #22 | Done | `v43` |
| #25 (piloto «fundamentos») | Backlog, con el resto de cursos | `v44` |
| #83 | Done | `v45` |
| #84 | Done | `v46` |
| #26 | Done | `v47` |

Gates al cierre (`main` en `f0065c2`): `validar.js` sin errores (59 avisos; 61 al empezar), `node --test` 99/99 (68 al empezar), `contraste.js` con la matriz entera en verde (no existía) y `verificar-offline.js` en verde, con el paso nuevo «checks cargados bajo demanda sin red».

**Lecciones:**
- Verificar la visibilidad real (`getBoundingClientRect`), no el atributo `hidden`: `display: flex` le gana y mi QA de #27 dio por bueno un filtro que no ocultaba → trampa en `estado.md`.
- El límite secundario de GraphQL corta `gh pr`/`gh project` tras muchas llamadas seguidas. Comentarios, PRs, merges y CI van por REST, y el tablero por una cola con reintentos → trampa en `estado.md`.
- Los subagentes de review dejaron más de 1 GB en el scratchpad y uno sobrescribió un script compartido. Cada revisor trabaja en su propio directorio temporal y lo borra al terminar → trampa en `estado.md`.
- La trampa de `VERSION` al mismo valor tras rebasar mordió en 4 PRs de la tanda; fijarla justo antes del merge la cazó todas las veces.
- Los filtros de QA por nombre de fichero confunden `modules/checks.js` con `tutorials/checks.js`, y un perfil de Chrome reutilizado sirve el HTML viejo del service worker en la primera visita. Medir por ruta completa y descartar la primera visita tras subir `VERSION`.
- La revisión fresca cazó 1 alta o mayor en 4 de los 11 PRs (#17, #27, #22, #26). Ningún gate mecánico la habría visto.

**Issues nuevos:** #83 y #84, partidos de #32 en el refinado.

**Limitación aceptada (#26, C3):** resaltados y audio leen el DOM al cargar y no ven el texto de los checks inyectados después.

**Preguntas que esperan al usuario:** las de lo que queda de #33 (escenarios, orden de rutas, niveles, lecciones gemelas, piezas fuera de ruta) y la priorización de las épicas #34-#38 y del paraguas #39.
