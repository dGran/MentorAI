#!/usr/bin/env bash
mkdir -p "$1" && node "$(dirname "$0")/qa-1.mjs" http://localhost:8000/index.html "$1" > "$1/salida.json"
