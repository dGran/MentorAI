# Tanda 2026-10-06 (c) — cimientos para los cursos nuevos

Estado: **cerrada a las 22:40**. Los 3 issues mergeados, desplegados (`v25`) y en Done, más un fix de `VERSION` (#57) que la propia tanda rompió y arregló.

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

## Registro (22:06 → 22:40)

| Issue | PR | Merge | Review (subagente, contexto fresco) | QA |
|---|---|---|---|---|
| #20 sesgo de longitud | #53 | `6c7e111` | aprobado; el mínimo de 12 preguntas dejaba sin medir los exámenes de 10 → mínimo propio de 5 | skip-qa documentado: 383/431 y 580/623, 60 avisos |
| #19 ids estables | #54 | `1968483` | **pérdida de datos** en la colisión clave posicional/id según el orden → regla simétrica + test | misma carga en main y rama: interfaz idéntica, 0 posicionales, 0 mal asignadas |
| #21 hero y «Cuándo aplicarlo» | #55 | `c41a364` | aprobado; regex de nivel con límites de palabra; skip-qa retirado (el hero se ve) | 5 lecciones de las dos plantillas: hero = manifest |
| #57 VERSION perdida | #56 | `afc1dc1` | aprobado | producción sirve `v25` |

### Desviaciones del contrato

- **#55 revirtió la `v25` de #54.** Un commit «para no tocar VERSION» copiaba `sw.js` de `main`; tras el rebase era una reversión. Detectado al verificar producción (servía `v24`) y arreglado en #56/#57. Trampa ampliada en `estado.md`.
- **#56 se mergeó con el job `offline` en rojo.** El bucle de espera de checks terminó al ver el fallo, pero el comando siguiente iba encadenado con `&&` a algo que no comprobaba ese resultado, y el merge se ejecutó. El fallo era de la limpieza del script (ENOTEMPTY tras 16 comprobaciones verdes) y `main` pasó en verde, pero el gate se saltó. Issue #58 para la limpieza.

### Lecciones

- El gate «checks en verde» se comprueba como paso propio que **para** la ejecución; nunca en una cadena de comandos donde un `&&` posterior no depende de él.
- Para que un PR no toque `VERSION`, se deja `sw.js` sin cambios; copiarlo de `main` es una reversión en diferido.
- Un umbral heredado de otra medida (`MINIMO_PARA_MEDIR_GRUPO`) puede dejar fuera justo los casos que importan (cursos nuevos de 10 preguntas).

### Lo que la tanda destapó

- #58: la limpieza de `verificar-offline.js` puede tumbar una verificación correcta.
- Notas en #33 (nivel de `python-docker`; 33 tutoriales de fundamentos sin «Cuándo aplicarlo» sin dueño) y en #34 (6 lecciones con la sección bajo otro id).

### Estado

Desbloqueadas las épicas #23 (`ia-por-dentro`) y #24 (`metodo-con-agentes`), y #25 (reescribir preguntas sesgadas).
