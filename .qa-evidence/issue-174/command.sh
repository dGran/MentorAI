#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-174/qa-examen.js "${1:-/tmp/qa-174}" "${2:-http://localhost:8000}" python\|q177f99\,qd2a397\,q64f9d7\,q0eb31d rust\|qd724dd\,q7e7fa1\,q1f5e1c\,q8d0d76
