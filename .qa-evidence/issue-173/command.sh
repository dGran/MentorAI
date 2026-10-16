#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-173/qa-examen.js "${1:-/tmp/qa-173}" "${2:-http://localhost:8000}" go\|qfe810b\,q9387f1\,qd1d9cc\,qe7ed33\,q278a45\,q521c9b\,q0242fb\,qbec5d9
