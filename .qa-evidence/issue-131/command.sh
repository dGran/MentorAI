#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-131/qa-texto.js "${1:-/tmp/qa-131}" "${2:-http://localhost:8000}" ia-llamar-a-un-llm\|con\ este\ modelo\ el\ razonamiento\ está\ siempre\ activo\|1024\ sobra\ para\ una\ palabra ia-structured-output\|claude-opus-5-5\|model:\ \"claude-opus-5\"\, ia-streaming\|primero\ el\ del\ razonamiento\,\ luego\ el\ del\ texto\|uno\ o\ dos\ segundos\,\ normalmente
