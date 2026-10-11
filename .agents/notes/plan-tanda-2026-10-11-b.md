# Tanda 2026-10-11 (b) — accesibilidad, navegación, inicio y carga

Estado: **en curso**.

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
