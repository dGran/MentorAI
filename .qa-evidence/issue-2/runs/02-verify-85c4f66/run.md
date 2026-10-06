# Run 02 — verificado
- Fecha: 2026-10-06T19:10:59+02:00
- Commit: 85c4f66
- Rama: fix/2-fusion-sin-pisar
- Entorno: python3 -m http.server 8000, Chromium headless (Playwright global), service workers bloqueados, localStorage sembrado por el script
- Vehículo: ui
- Resultado: verificado
## Esperado
Tras importar remoto.json (examen suspendido con 40, examen de ruta con 9, retos distintos): quiz passed:true bestScore:90 attempts:3; examen de ruta passed:true best:18; práctica con la unión de retos.
## Comando
`../../command.sh <dir>`
## Evidencias
- `assets/salida.json` — localStorage antes (local), fichero importado (remoto) y después (tras_importar), sin paráfrasis.
- `assets/remoto.json` — fichero importado por el input #perfil-fichero.
- `assets/perfil-tras-importar.png` — la página tras importar; no muestra aviso de éxito (#29, preexistente) y marca «Sin conexión» como activa (#11, preexistente).
## No probado
Sync por gist real (usa la misma Perfil.importar).
