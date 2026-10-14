#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-159/qa-enlaces.js "${1:-/tmp/qa-159}" "${2:-http://localhost:8000}" rust-que-es\|go-que-es python-que-es\|go-que-es rust-editores\|go-editores#gofmt go-sync-y-context\|go-primer-programa#fmt-vet go-tipos-y-variables\|go-primer-programa#fmt-vet go-channels\|go-tipos-y-variables#zero-value python-tipos-y-variables\|go-tipos-y-variables#conversiones go-errores\|go-funciones-y-control#multiples-retornos goroutines\|go-funciones-y-control#defer go-interfaces\|go-generics go-paquetes-y-modulos\|go-json-y-bd#database-sql rust-concurrencia\|go-testing#go-test go-primer-programa\|go-testing
