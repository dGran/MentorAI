#!/usr/bin/env bash
mkdir -p "$1" && node "$(dirname "$0")/qa-9.mjs" http://localhost:8000/ "$(git rev-parse --show-toplevel)" "$1" > "$1/salida.json"
