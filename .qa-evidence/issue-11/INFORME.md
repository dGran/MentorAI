# QA issue #11

Vehículo ui: las 7 páginas raíz en :8000, Chromium 1280x900, contando `[aria-current=page]` y `.is-active` en la navegación.

| Run | Fase | SHA | Resultado | Evidencia |
|---|---|---|---|---|
| 01 | reproduce | 9f6a3c1 | Repaso y Perfil: 2 activos («Sin conexión» además del suyo) | runs/01-reproduce-9f6a3c1/ |
| 02 | verify | 98b05b7 | 1 activo por página, el suyo | runs/02-verify-98b05b7/ |

Veredicto: aprobado.
