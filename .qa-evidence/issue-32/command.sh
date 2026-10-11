#!/usr/bin/env bash
SOLO_DISTINTAS=1 node assets/layout.js <raiz-main> <raiz-rama> --todos > assets/geometria-1280.txt
node assets/colores.js <raiz-main> <raiz-rama> > assets/colores-computados.txt
