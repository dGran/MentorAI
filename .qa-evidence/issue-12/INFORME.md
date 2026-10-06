# QA issue #12

Vehículo ui: script de comprobación del review (`check.mjs`), que recorre la página entera con Tab a 375 y 1280 px en index, un tutorial y un tutorial python-*, y ejercita apertura, Tab/Shift+Tab, tema, Esc, cerrar y clic en el fondo. Servidor :8000.

| Run | Fase | SHA | Resultado | Evidencia |
|---|---|---|---|---|
| 01 | reproduce | 02f559f | la hamburguesa no tiene `aria-controls` ni `aria-expanded`; el script no puede ni empezar. En una pasada previa (qa-12.mjs), Esc no cerraba el drawer y este tapaba la hamburguesa | runs/01-reproduce-02f559f/assets/salida.txt |
| 02 | verify | f167dec | cerrado: 0 paradas de Tab en el drawer de 53-62; abierto: foco en «Inicio», Tab y Shift+Tab atrapados; Esc, cerrar y fondo devuelven el foco; sin sombra a 1280 | runs/02-verify-f167dec/assets/ |

Pendiente fuera de alcance: en tutorials/python-* la hamburguesa y el drawer antiguos hardcodeados siguen en el orden de Tab (#13). Caso límite anotado en #13: abrir en móvil y ensanchar la ventana deja el foco en body al cerrar.
Veredicto: aprobado.
