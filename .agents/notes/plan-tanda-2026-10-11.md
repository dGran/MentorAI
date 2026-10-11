# Tanda 2026-10-11 — accesibilidad móvil, carga y repaso de contenido

Estado: **en curso**.

## 1. Estado de partida (medido 04:40 +02:00)

- `main` en `dc712ef`, limpio, 0 PRs abiertos, `check-board.sh --project 6` → exit 0. Producción en `v33`.
- `validar.js` sin errores, 61 avisos (300 tutoriales · 32 cursos); `node --test` 63/63; `verificar-offline.js` verde (66 vistas móviles, 1 m 26 s).
- Ramas remotas vivas: solo las de trabajo ya mergeado; ninguna de los issues de la tanda.
- Issues de la tanda: `OPEN`, `Backlog`, sin asignar, sin rama, sin PR, 0 bloqueantes abiertos (#26 dependía de #19, cerrado), sin `blocked-external`. Reproducción contra `main` de hoy:

| Issue | Reproduce hoy |
|---|---|
| #69 drawer estático muerto | 42 `tutorials/*.html` con `.nav-drawer` escrito en el HTML |
| #70 scroll horizontal en tutoriales | barrido CDP por `file://` de los 300: 103 desbordan a 320 px y 88 a 375 px; peores `go-a-produccion` (+1058), `go-tipos-y-variables` (+970), `python-entorno-docker` (+870) |
| #14 reiniciar progreso | `courses.js` borra `Progress` y `Reading` del curso sin confirmar ni deshacer |
| #26 carga bajo demanda | una lección carga 1.080 KB de JS: `quizzes.js` 277, `checks.js` 273, `manifest.js` 177, `practica.js` 116 |
| #33 deuda de contenido | pendiente de medir en el refine (preguntas y cifras citadas) |
| #28 enlaces básico ↔ avanzado | pendiente de medir en el refine (la cifra base de 197 no se reprodujo en la tanda del 07-10) |
| #18 errores de nueve lecciones | muestreados en `main`: `CancelledError` en `python-async-await`, «no es determinista» en `rust-ownership`, `USING (cliente_id)` en `sql-joins`, 12.000 vs 10.000 en `opcache`, DynamoDB en `cap-consistencia`, «casi siempre» en `k8s-objetos`, 0 `stop_reason` y errata «seria» en `ia-llamar-a-un-llm`, «0.3 ns/op» sin `b.Loop` en `go-testing` |

## 2. Línea de no colisión

Sin otros tracks ni otras personas. Solapes internos, todos en serie y con `git pull` + rebase antes de cada issue:

- `scripts/validar.js`: #69 (regla del drawer), #70 (regla de `.table-wrap`), #33 (campo `reviewed`) → en ese orden.
- `scripts/verificar-offline.js`: #70 (tutoriales en el paso de desborde) y #26 (si la carga bajo demanda necesita comprobación offline) → #70 primero.
- `tutorials/*.html`: #69 (drawer), #70 (`.table-wrap`), #26 (`<script>` de datos), #33, #28 y #18 (cuerpos) → hunks distintos, en serie.
- `tutorials/quizzes.js`, `checks.js`, `manifest.js`: #26 (cómo se cargan), #33 (preguntas y `reviewed`), #18 (preguntas de las nueve lecciones) → #26 primero.
- `sw.js`/`VERSION`: #70, #14 y #26 tocan shell → cada uno fija `VERSION` = la de `main` + 1 **al rebasar justo antes de mergear**; quien no toque shell deja `sw.js` sin cambios en la rama.

## 3. Orden por demostrabilidad

1. **#69** — mecánico; construye su propia red: `validar.js` da ERROR ante un drawer escrito en el HTML.
2. **#70** — construye la red que hoy falta: el paso de desborde de `verificar-offline.js` recorre los tutoriales. Escritorio comparado píxel a píxel con `main`.
3. **#14** — lógica de datos del usuario; tests `node:test` de deshacer antes del cambio, QA en navegador.
4. **#26** — refactor sin cambio de comportamiento, cubierto por `validar.js`, `node --test` y `verificar-offline.js` (ya con los tutoriales de #70). Toca el SW.
5. **#33 parcial** — `reviewed` entra con su regla en el validador; las cifras se comprueban con `grep`; las 4 preguntas contra fuentes.
6. **#28 limitado** — `validar.js` caza enlaces rotos; el conteo de enlaces entrantes va como script en el PR.
7. **#18** — editorial, sin red mecánica de la verdad del texto: solo la revisión fresca contra fuentes oficiales. Cierra la tanda.

## 4. Límites y fuera de la tanda

Límites dentro de la tanda (decididos por el usuario, § 6):

- **#14**: patrón «deshacer» (~8 s, `role="status"`), no confirmación. Restaura `academia-progress` y `academia-reading` exactamente.
- **#26**: el criterio «< 300 KB» se refina a: las 4 páginas índice no cargan `quizzes.js`, `checks.js` ni `practica.js`, y una lección los inyecta bajo demanda (objetivo medido ~415 KB, desde 1.080). El manifest sigue cargándose siempre.
- **#28**: entran las 5 parejas del criterio 1 y la conversión a enlace de las referencias en texto plano encontradas; la cifra objetivo del criterio 2 se recalcula en el refine sobre el conteo de hoy.
- **#33**: entran las 4 preguntas discutibles, las cifras caducadas (`grep`) y el campo `reviewed` (manifest + validador, cursos de IA). Fuera: orden de rutas, niveles, lecciones gemelas y el ≥ 30 % de preguntas de escenario → quedan en el issue, que no se cierra.
- **#18**: un solo PR con un commit por lección; cada punto «verificar» contrastado con documentación oficial actual y la fuente citada en el PR.

| Fuera | Motivo |
|---|---|
| #16 contraste y foco | Decisión de paleta |
| #17 accesibilidad de checks y exámenes | Bloqueado por #16 |
| #22 orientación en el inicio | Decisión de producto |
| #25 sesgo de longitud | Criterio editorial y L: 6-10 PRs |
| #27 rutas y cursos navegables | Decisión de diseño |
| #32 deuda de CSS | Bloqueado por #17 |
| #34-#38 | Épicas de curso: `/implement-epic` |
| #39 | Paraguas de catálogo, sin tarea concreta |

Precedentes: lo excluido el 07-10 sigue excluido salvo #14, #18, #26, #28 y #33, que el usuario metió hoy con los límites de arriba.

## 5. Criterio de parada

- Primer rojo sin arreglo evidente: PR abierto con diagnóstico y salto al siguiente **solo si es independiente** (#69→#70 y #26→#33→#18 son cadenas por fichero; #14 y #28 son independientes).
- Criterio inviable o falso → comentario en el issue y se salta; no se reinterpreta.
- Cualquier decisión de producto, diseño o paleta nueva → pregunta anotada y se sigue con lo independiente.
- **#14 y #26**: cualquier pérdida o cambio de datos guardados del usuario en tests o QA → para la tanda.
- **#69 y #70**: un cambio visible en escritorio (1280 px) fuera de lo pedido → para ese issue.
- **#18, #28 y #33**: un dato que no se pueda contrastar en fuente oficial no se cambia; se anota en el PR.
- Borrar algo no acordado aquí → para.
- Gate de checks siempre en un paso propio que corta la ejecución; nunca encadenado al merge.
- `verificar-offline.js` nunca en paralelo (puertos fijos), tampoco en los revisores. Antes de levantar un `http.server`, `ss -ltnp`.
- Límites del loop: 5 intentos por nodo, 45 ciclos, 360 minutos.

## 6. Decidido por el usuario al lanzar

> «¿Metemos #18 en la tanda?» → **«Dentro, al final»**.
>
> «¿Cómo lanzo la tanda?» → **«Automerge (Recomendado)»**: se mergea lo que pase review con subagente fresco, QA y gates de CI, con evidencias enlazadas en cada PR para repasar después.
>
> «no podemos añadir nada más a la tanda?» → **«#14 reiniciar progreso, #26 carga bajo demanda, #28 enlaces, limitado, #33 parcial»**.
>
> «#14: ¿qué patrón?» → **«Deshacer ~8 s (Recomendado)»**.

## Registro

| Issue | PR | Merge | Review (subagente, contexto fresco) | QA |
|---|---|---|---|---|
