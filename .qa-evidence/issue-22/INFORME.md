# QA #22 — orientar a quien llega por primera vez

Vehículo: Chrome headless por CDP contra la rama `7b1a1c8` en `:8000`, con `localStorage` vacío y con progreso sembrado.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. «Empieza aquí» primero tras el hero, con 2 rutas y su porqué | ✅ «El grado que no hiciste» y «Backend desde los cimientos», 2 motivos, y = 807 | `c1-c5-orden-y-metricas.txt`, `inicio-vacio.png` |
| 2. Exámenes ocultos hasta empezar un curso | ✅ oculto sin progreso, visible con progreso | `c1-c5-orden-y-metricas.txt` |
| 3. Rutas por encima de Novedades | ✅ y = 1281 frente a 2715 | `c1-c5-orden-y-metricas.txt` |
| 4. Métricas para el alumno | ✅ 300 Publicados / 32 Cursos / 7 Rutas / 67 Horas | `c1-c5-orden-y-metricas.txt` |
| 5. Con progreso, «Seguir viendo» primero | ✅; «Empieza aquí» se oculta al instante con `Home.render()` (el repintado del sync) | `c1-c5-orden-y-metricas.txt`, `buscador-y-sync.txt`, `inicio-con-progreso.png` |
| No regresión del buscador | ✅ resultados en y = 807, bajo el hero | `buscador-y-sync.txt` |
