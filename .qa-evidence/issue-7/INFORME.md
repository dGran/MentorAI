# QA issue #7

Vehículo ui: tutorials/cc-hooks-y-permisos.html servida en :8000, Chromium 1280x900.

| Run | Fase | SHA | Resultado | Evidencia |
|---|---|---|---|---|
| 01 | reproduce | 2e69254 | diagrama «Sale con error → acción bloqueada»; sin settings.json de hooks, sin callouts, sin check de exit 1 | runs/01-reproduce-2e69254/assets/salida.json |
| 02 | verify | e36988e | diagrama 0/2/otro; bloque PreToolUse; callouts «Solo el 2 bloquea» y «Hasta dónde llega un deny»; check de exit 1 presente; 0 errores | runs/02-verify-e36988e/assets/ |

Precisión técnica contrastada con la documentación oficial en el review (hooks, hooks-guide, permissions, sandboxing).
Veredicto: aprobado.
