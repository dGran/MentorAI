#!/usr/bin/env bash
mkdir -p "$2" && node "$(dirname "$0")/qa-5.mjs" "$1" "$2" > "$2/salida.json"
