# Run 03-verify-retos-6860970 — verify

- Fecha: 2026-10-12T23:43:10+02:00
- Commit: 6860970
- Rama/base: feat/35-seguridad-backend → main
- Entorno: PHP 8.5.4 local, código de los retos extraído de tutorials/practica.js
- Vehículo: cli
- Resultado: verificado
- Exit/status: 0

## Esperado
Reto 1: alice 200, bob→pedido de alice 404, bob→suyo 200, inexistente 404, sin cabecera 401. Reto 2: solo https://example.com/ permitida.
## Observado
Igual a lo esperado; salida literal en `assets/`.
## Comando
ver cabecera de `assets/reto-1-dos-usuarios.txt`; `php ssrf.php`
## Evidencias
- `assets/reto-1-dos-usuarios.txt` — peticiones y códigos HTTP.
- `assets/reto-2-ssrf.txt` — veredicto por URL.
## No probado
Reto 3 (composer audit) no se repite aquí: necesita red a Packagist; se ejecutó en implement con Composer 2.9.5 (install bloqueado, audit exit 1, tras require ^7.4 exit 0).
