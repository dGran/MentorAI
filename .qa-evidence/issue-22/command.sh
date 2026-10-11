#!/usr/bin/env bash
node assets/qa-22.js http://localhost:8000 assets > assets/c1-c5-orden-y-metricas.txt
node assets/qa-22b.js http://localhost:8000 > assets/buscador-y-sync.txt
