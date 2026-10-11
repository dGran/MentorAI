#!/usr/bin/env bash
node scripts/contraste.js > assets/c1-c2-c3-matriz-rama.txt
node assets/qa-16.js http://localhost:8000 assets > assets/c2-c3-navegador.txt
