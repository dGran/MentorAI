#!/usr/bin/env bash
mkdir -p "$1" && node "$(dirname "$0")/qa-3.mjs" http://localhost:8000/ "$1"
