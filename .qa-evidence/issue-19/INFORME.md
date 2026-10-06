# QA issue #19

Vehículo ui: misma carga en main y en la rama. 27 claves de repaso posicionales (20 lecciones de checks y 6 preguntas de un examen) más `ruta:backend`, y retos de git 0 y 2 marcados por posición. Se recorre repaso.html, perfil.html y curso.html?slug=git y se lee el estado resultante.

| Run | Fase | SHA | Resultado |
|---|---|---|---|
| 01 | línea base | 6c7e111 | «27 preguntas en repaso», retos «2 de 3» (1 y 3); 26 claves posicionales |
| 02 | verify | rama | lo mismo en la interfaz; 0 claves posicionales, 0 mal asignadas comparando enunciados, `ruta:*` conservada, práctica por id |

Colisiones, export antiguo, sync y páginas sin datos: verificados por el review (459 claves).
Veredicto: aprobado.
