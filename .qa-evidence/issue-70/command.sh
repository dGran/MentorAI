#!/usr/bin/env bash
BASE=http://localhost:8001 node assets/medir-desborde.js <raiz-main> > assets/c1-desbordes-main.txt
BASE=http://localhost:8000 node assets/medir-desborde.js <raiz-rama> > assets/c1-desbordes-rama.txt
node scripts/verificar-offline.js > assets/c2-verificar-offline-rama.txt
node assets/qa-70-tabla.js http://localhost:8000 assets > assets/c3-tablas-rama.txt
SOLO_DISTINTAS=1 node assets/layout.js <raiz-main> <raiz-rama> --todos > assets/c4-geometria-1280.txt
