#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-92/qa-curso.js "${1:-/tmp/qa-92}" "${2:-http://localhost:8000}" oficio-de-ingenieria
