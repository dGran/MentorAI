# QA issue #8

Vehículo ui (fichas de curso con la solución desplegada y la lección maq-cpu), servidor :8000, Chromium 1280x900.

| Run | Fase | SHA | Resultado | Evidencia |
|---|---|---|---|---|
| 01 | reproduce | 2bcaaff | du -ah en la solución; k8s «despliega v1 sana»; Go con data, _ :=; «diferencia moderada»; maq-cpu con array_fill y sin callout | runs/01-reproduce-2bcaaff/assets/salida.json |
| 02 | verify | ea37ae7 | find -type f; v2 sana; err != nil; «entre dos y cuatro»; código fila a fila + callout; 0 errores | runs/02-verify-ea37ae7/assets/ |

Ejecución de las soluciones (cli): verificada en el review (disco: 5 ficheros; PHP 2,5–3,5×; Go compila y reporta el error).
Veredicto: aprobado.
