#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-38/qa-curso.js "${1:-/tmp/qa-38}" "${2:-http://localhost:8000}" construir-con-ia
