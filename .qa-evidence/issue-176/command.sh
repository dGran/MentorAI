#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-176/qa-examen.js "${1:-/tmp/qa-176}" "${2:-http://localhost:8000}" terminal-linux\|q64049c\,qc3c9d7 programar-con-ia\|qe5c035\,q4cf1f6 fundamentos\|qa96260\,q94bac7
