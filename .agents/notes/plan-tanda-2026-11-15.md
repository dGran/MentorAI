# Tanda 2026-11-15 — buscador global (#202 → #203)

## 1. Estado de partida, medido hoy

- `main` en `60d09ca` (= `origin/main`), árbol limpio.
- `node scripts/validar.js`: sin errores ni avisos. `node --test 'scripts/tests/**/*.test.js'`: 129/129.
- `verificar-offline.js`: en local fallaba en «SW nuevo activo tras subir VERSION» y «lo guardado se refresca con
  red» también en `main`, y se dio por deuda del entorno. **Era falso** (corregido el 2026-11-16): un `http.server`
  huérfano de una ejecución anterior ocupaba el 8899 y servía un directorio borrado. Matado el huérfano, las dos
  comprobaciones pasan. Lección: antes de dar un rojo por «del entorno», mirar qué ocupa el puerto (`readlink
  /proc/<pid>/cwd`), que es la trampa ya anotada en `estado.md`.
- `check-board.sh --project 6`: sin incoherencias. Sin `/smoke` configurado en el proyecto.
- #202 y #203: `OPEN`, en `Backlog`, sin asignar, sin rama ni PR, autor `dGran` (admin). #202 sin bloqueantes.
  #203 bloqueado por #202 (dependencia nativa).

**Sobre la dependencia:** la tanda solo tiene un issue libre. Se acepta igualmente porque el usuario está
presente y lo pidió así: #203 entra **después** de que #202 esté desplegado; en ese momento se vuelve a
comprobar que su bloqueante está cerrado antes de tomarlo.

## 2. Línea de no colisión

Sin PRs abiertos ni issues `In Progress` de otras personas. Las ramas remotas viejas (`fix/15…`, `refactor/31…`)
son de issues cerrados. Ficheros compartidos entre los dos issues: `home.js`, `search.js`, `sw.js`, los HTML
(scripts) → secuencial, `git pull` de `main` antes de empezar #203. Un solo carril: puerto de QA 8123.

## 3. Orden

#202 primero: es el refactor que construye la red (tests del motor de búsqueda y consultas de referencia del
inicio). #203 después, apoyado en esa red.

## 4. Límites declarados

Entra todo lo que piden los criterios de los dos issues. Fuera: cambiar el diseño del buscador del inicio,
el ranking más allá de lo que ya hace, y la búsqueda dentro de Rutas o Cursos por URL (solo Artículos acepta
la consulta por URL, como dice #203).

## 5. Criterio de parada

Primer rojo sin arreglo evidente; un criterio inviable o falso (se comenta en el issue y se para); cualquier
decisión de producto o diseño no cubierta por los criterios (se anota y se sigue con lo independiente);
borrar algo no acordado; dos intentos seguidos con el mismo fallo sin evidencia nueva. Límite del loop:
5 intentos por nodo, 20 ciclos, 240 minutos (hasta 2026-11-16T03:00+01:00).

## 6. Decidido por el usuario al lanzar

- Automerge: «Automerge de los dos». Si pasan gates, review y QA con evidencias, squash + verificación de
  Pages sin esperar; las evidencias de QA quedan enlazadas en el PR para repaso posterior.
- Freno de uso: «quita el freno y si se para por el limite ya se retomara» → `Freno de uso: ninguno`
  (`usage-brake.sh --clear`).
- Review en subagente sin el contexto de implementación (tanda en solitario). El orquestador commitea,
  empuja y abre PR; los subagentes de review solo leen.
