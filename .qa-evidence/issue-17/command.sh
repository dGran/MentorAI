#!/usr/bin/env bash
# rama en :8000
node assets/qa-17.js http://localhost:8000 sql-joins git-deshacer assets > assets/c1-c2-check-y-examen.txt
node assets/qa-17b.js http://localhost:8000 sql-joins git-deshacer assets > assets/c3-foco-y-reenvios.txt
node scripts/contraste.js > assets/c4-matriz.txt
