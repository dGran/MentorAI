#!/usr/bin/env bash
# rama en :8000 (http: aparecen los envoltorios offline)
node assets/qa-27.js http://localhost:8000 assets > assets/c1-c4-navegacion.txt
node assets/qa-27b.js http://localhost:8000 > assets/repintados-y-miga.txt
node assets/qa-27c.js http://localhost:8000 > assets/c3-filtro-visibilidad-real.txt
