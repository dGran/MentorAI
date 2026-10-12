#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-36/qa-curso.js "${1:-/tmp/qa-36}" "${2:-http://localhost:8000}" php-moderno
