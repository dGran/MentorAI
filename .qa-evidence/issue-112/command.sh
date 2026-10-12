#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-112/qa-112.js "${1:-/tmp/qa-112}" "${2:-http://localhost:8000}"
