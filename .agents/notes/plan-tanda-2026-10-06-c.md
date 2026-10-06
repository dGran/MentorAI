# Tanda 2026-10-06 (c) — cimientos para los cursos nuevos

Estado: **en curso** (22:06 → 23:06). Contrato escrito antes de tocar código; el cierre se añade al final.

## 1. Estado de partida (medido 22:06 +02:00)

- `main` en `48eead0`, limpio, 0 PRs abiertos, `check-board.sh --project 6` → exit 0.
- `validar.js` sin errores (282 tutoriales · 30 cursos · 431 preguntas de examen · 623 checks · 88 retos); `node --test` 26/26. Producción en `v24`.
- Issues `OPEN`, `Backlog`, sin bloqueantes:

| Issue | Reproduce hoy |
|---|---|
| #20 sesgo de longitud | la correcta es la más larga en 383/431 preguntas de examen y 580/623 checks; el validador no lo mide |
| #21 hero vs manifest y «Cuándo aplicarlo» | 96 tutoriales sin `#cuando`; el validador no compara el hero con el manifest |
| #19 ids estables | ni preguntas ni retos tienen `id`; repaso y práctica indexan por posición |

## 2. Línea de no colisión

Sin otros tracks. Los tres tocan `scripts/validar.js`: van en serie, con rebase antes de cada uno. #19 toca además `tutorials/quizzes.js`, `checks.js`, `practica.js`, `repaso.js` y `practica.js` del front.

## 3. Orden por demostrabilidad

#20 (solo validador, skip-qa) → #21 (validador + datos del hero) → #19 (formato de datos y migración del historial, con tests `node:test`; el que más riesgo tiene para datos de usuario).

## 4. Límites y fuera de la tanda

| Fuera | Motivo |
|---|---|
| Reescribir preguntas sesgadas | Es #25; aquí solo se mide |
| Añadir «Cuándo aplicarlo» a 96 tutoriales | Es contenido de la épica #34; #21 solo lo mide (aviso) |

## 5. Criterio de parada

Primer rojo sin arreglo evidente; criterio inviable o falso → comentario y se salta; decisión de producto → pregunta anotada; cualquier pérdida de historial de repaso o práctica en la migración de #19 → para; límites del loop: 5 intentos por nodo, 20 ciclos, **60 minutos**.

## 6. Decidido por el usuario al lanzar

> «¿Lanzo la tanda de cimientos (#20, #19, #21) con el mismo contrato y automerge?» → **«dale»**
