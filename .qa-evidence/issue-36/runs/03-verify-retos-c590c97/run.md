# Run 03-verify-retos-c590c97 — verify

- Fecha: 2026-10-13T00:00:00+02:00
- Commit: c590c97
- Entorno: PHP 8.5.4 local; código extraído de tutorials/practica.js
- Vehículo: cli
- Resultado: verificado

## Esperado
Reto 1: el checkout laxo imprime 5997 y 1999; el estricto lanza TypeError.
## Observado
Igual a lo esperado; salida literal en `assets/reto-1-strict-types.txt`.
## No probado
Retos 2 (PHPStan) y 3 (Rector): necesitan instalar paquetes de Packagist; se ejecutaron en implement (3 errores → baseline → ignore.unmatched; dry-run exit 2 con 4 reglas) y los repitió la review con PHPStan 2.3.1 y Rector 2.7.0.
