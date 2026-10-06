#!/usr/bin/env bash
# Requiere: python3 -m http.server 8000 desde la raíz del repo y Playwright global
mkdir -p "$1" && node "$(dirname "$0")/qa-2.mjs" http://localhost:8000/ "$1" > "$1/salida.json"
