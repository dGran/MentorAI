#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-37/qa-curso.js "${1:-/tmp/qa-37}" "${2:-http://localhost:8000}" concurrencia-en-bd
