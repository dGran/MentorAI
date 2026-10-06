# QA issue #5

Vehículo ui: copia del sitio servida en :8021 por el propio script (se apaga y enciende para simular la caída), Chromium con service worker real.

| Run | Fase | SHA | Resultado | Evidencia |
|---|---|---|---|---|
| 01 | reproduce | 7b9f954 | sin servidor el botón vuelve en silencio a «Guardar para viajar»; con el worker mudo se queda en «Guardando…» más de 60 s (el script agota su espera) | runs/01-reproduce-7b9f954/assets/ |
| 02 | verify | 6d05126 | «Faltan 3 de 3 · Reintentar» + aviso en role=status; reintento → «Guardado»; worker mudo → sale a los 45 s; «Descargar todo» sin red → «Faltan 288 de 291…»; con red → «Listo» | runs/02-verify-6d05126/assets/ |

Carreras (SAVE_DONE tardío, reintento durante una descarga vieja, cuerpo lento) verificadas por el review con sondas propias.
Veredicto: aprobado.
