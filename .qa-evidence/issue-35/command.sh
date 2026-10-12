#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-35/qa-35.js "${1:-/tmp/qa-35}" "${2:-http://localhost:8000}"
