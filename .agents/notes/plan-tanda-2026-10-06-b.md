# Tanda 2026-10-06 (b) — navegación y menú móvil

Estado: **en curso** (21:16 → 22:16). Contrato escrito antes de tocar código; el cierre se añade al final.

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
