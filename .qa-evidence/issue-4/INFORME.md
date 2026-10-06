# QA issue #4

Vehículo: `scripts/verificar-offline.js` (app servida bajo /MentorAI/, Chrome headless real con service worker, «Descargar todo», despliegue simulado reescribiendo VERSION en el sw.js servido, y recorrido con el servidor apagado). Para reproducir se ejecutó el mismo verificador con sw.js y offline.js de main.

| Run | Fase | SHA | Resultado | Evidencia |
|---|---|---|---|---|
| 01 | reproduce | 27a85ec | 4 ✗: contenido 0 entradas tras el despliegue mientras la UI dice «Ya la tienes entera»; tutorial, estilos y buscador vacíos sin servidor | runs/01-reproduce-27a85ec/assets/verificar-offline.txt |
| 02 | verify | ad5e986 | 15/15 ✓: 291 entradas tras el despliegue, UI coherente, contenido refrescado con red, todo disponible sin servidor | runs/02-verify-ad5e986/assets/verificar-offline.txt |

Migración de cachés `academia-content-vXX` existentes: verificada en navegador por el review (15/15 lecciones migradas).
Veredicto: aprobado.
