#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-155/qa-texto.js "${1:-/tmp/qa-155}" "${2:-http://localhost:8000}" go-paquetes-y-modulos\|github.com/gin-gonic/gin\ v1.12.0\|github.com/gin-gonic/gin\ v1.10.0 python-docker\|ni\ siquiera\ con\ el\ 3.13\|
