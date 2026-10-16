#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-175/qa-examen.js "${1:-/tmp/qa-175}" "${2:-http://localhost:8000}" sistemas-distribuidos\|q912412\,q697e83\,qbdc57e sql-aplicado\|qd48436\,q0bb43e\,q1ea5a4\,q3bdf2f
