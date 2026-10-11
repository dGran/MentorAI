#!/usr/bin/env bash
# rama en :8000 (python3 -m http.server)
node assets/qa-28.js http://localhost:8000 > assets/enlaces-seguidos.txt
node assets/enlaces-28.js <raiz-rama> --pares > assets/conteo-rama.txt
node assets/enlaces-28.js <raiz-main> --pares > assets/conteo-main.txt
