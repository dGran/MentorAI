#!/usr/bin/env bash
# rama servida en :8000 con python3 -m http.server
node assets/qa-14.js http://localhost:8000 assets > assets/c1-c2-curso-y-leccion.txt
node assets/qa-14b.js http://localhost:8000 assets > assets/c2-doble-clic-teclado-320.txt
node assets/qa-14c.js http://localhost:8000 > assets/c1-pausa-hover.txt
