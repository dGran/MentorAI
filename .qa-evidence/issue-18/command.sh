#!/usr/bin/env bash
# rama en :8000 y main en :8001 (python3 -m http.server)
node assets/qa-18.js http://localhost:8000 assets > assets/lecciones.txt
node assets/ancho.js http://localhost:8000 <lecciones> > assets/ancho-1280-rama.txt
node assets/ancho.js http://localhost:8001 <lecciones> > assets/ancho-1280-main.txt
