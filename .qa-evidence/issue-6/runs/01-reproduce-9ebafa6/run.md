# Run 01 — reproducido
- Commit: 9ebafa6 (main)
- Entorno: python3 -m http.server 8000, Chromium 375x812, SW bloqueado
- Vehículo: ui
- Resultado: reproducido
## Observado
El drawer lista Inicio, Rutas, Cursos, Artículos, Repaso, Sin conexión; el script agota 30 s esperando el enlace «Perfil».
## Evidencias
- `assets/drawer-375.png` — drawer abierto sin Perfil (abierta y revisada).
- `assets/salida.txt` — TimeoutError literal.
