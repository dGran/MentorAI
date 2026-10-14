# Tanda 2026-10-06 (b) — navegación y menú móvil

Estado: **cerrada a las 21:42**. Los 4 issues mergeados, desplegados (`v24`) y en Done.

## 1. Estado de partida (medido 21:16 +02:00)

- `main` en `f47142d`, limpio, 0 PRs abiertos. `check-board.sh --project 6` → exit 0.
- `validar.js` sin errores; `node --test` 26/26; `verificar-offline.js` verde. Producción en `v20`.
- Issues `OPEN`, `Backlog`, sin asignar, sin bloqueantes abiertos (#11 y #12 dependían de #6, cerrado):

| Issue | Reproduce hoy |
|---|---|
| #9 anterior/siguiente cruza de curso | sí: `courseSequence()` aplana todos los cursos (`tutorial-nav.js:36-50`) |
| #10 «Curso en marcha» falso | sí: `pendingCourse()` devuelve el primer curso con pendientes (`home.js:149-165`) |
| #11 «Sin conexión» activo en Repaso y Perfil | sí: `repaso.html:30`, `perfil.html:30` con `is-active` y `aria-current` |
| #12 drawer no accesible | sí: `initMobileNav` sin `aria-expanded`, Esc ni gestión de foco (`core.js`) |

## 2. Línea de no colisión

Sin otros tracks. Ficheros: #9 `tutorial-nav.js`; #10 `home.js`; #11 `repaso.html`, `perfil.html`; #12 `core.js` y `styles.css`. Disjuntos; `VERSION` de `sw.js` se fija al rebasar antes de cada merge (trampa de `estado.md`).

## 3. Orden por demostrabilidad

Ninguno tiene red automática (no hay regresión visual): todos se verifican con Playwright en QA. Orden de menor a mayor riesgo: #11 (HTML), #10, #9, #12 (interacción y foco, el que más superficie toca).

## 4. Límites y fuera de la tanda

| Fuera | Motivo |
|---|---|
| #13 cabeceras de tutoriales | Depende de #12; no está en el encargo |
| P0 restantes | No quedan |

## 5. Criterio de parada

Primer rojo sin arreglo evidente; criterio inviable o falso → comentario y se salta; decisión de producto o diseño → pregunta anotada; borrar algo no acordado; límites del loop: 5 intentos por nodo, 20 ciclos, **60 minutos**.

## 6. Decidido por el usuario al lanzar

> «¿Autorizas automerge de lo que pase review con contexto fresco, QA y gates, con el mismo límite de 60 minutos?» → **«Sí, las 4 (Recomendado)»**

Review con subagente de contexto fresco; evidencias de QA enlazadas por SHA; tablero con ids de campo leídos una vez por sesión (lección de la tanda anterior).

## Registro (21:16 → 21:42)

| Issue | PR | Merge | Review (subagente, contexto fresco) | QA |
|---|---|---|---|---|
| #11 aria-current único | #48 | `11906fc` | aprobado | 2/2: Repaso y Perfil pasan de 2 activos a 1 |
| #10 curso en marcha | #49 | `b9af26e` | **2 bloqueantes**: actividad solo por lectura (no por marcado) y render de 5,6 → ~80 ms por parsear localStorage en el bucle → lectura única + `Progress.markedAt()` | 3/3: en main siempre «Caché y rendimiento 0/15» |
| #9 navegación del curso | #50 | `02f559f` | aprobado; examen ofrecido con la misma regla que lo pinta | 4/4: 58 cruces de curso en main → 0 en 269 lecciones |
| #12 drawer accesible | #52 | `c120778` | aprobado; `inert` en vez de `visibility` (con la transición el foco no entraba) | 4/4 con el script del revisor (recorrido completo con Tab) |

### Lecciones

- Una prueba de «fuera del orden de Tab» tiene que recorrer la página entera: mi script daba 25 Tab y el drawer está al final del body, así que su «0» no demostraba nada. Lo cazó el review.
- `visibility` con transición retrasada deja un elemento no enfocable en el frame de apertura; para sacar algo del orden de Tab, `inert`.
- Una función nueva sobre datos de `localStorage` dentro de un bucle de 269 lecciones multiplica el coste: leer una vez antes del bucle.

### Lo que la tanda destapó

- Comentado en #13: con el drawer abierto en móvil, ensanchar la ventana y cerrar deja el foco en `body`.
- Ya en #13: en `tutorials/python-*` la hamburguesa y el drawer antiguos hardcodeados siguen en el orden de Tab.
