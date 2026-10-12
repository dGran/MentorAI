# Run 03-verify-retos-938ed1d — verify

- Commit: 938ed1d
- Entorno: postgres:17 en Docker
- Vehículo: cli
- Resultado: verificado

Salida literal en `assets/retos-postgres.txt`: lost update 70 → con FOR UPDATE 20; SKIP LOCKED worker 1 toma 1, worker 2 toma 2; optimista UPDATE 1 / UPDATE 0.
