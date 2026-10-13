#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-139/qa-texto.js "${1:-/tmp/qa-139}" "${2:-http://localhost:8000}" phpunit-integracion-bbdd\|DBAL\ 4\ ya\ no\ acepta\ la\ opción\|creas\ la\ BD\ de\ test\ aquí framework-ciclo-http\|Quien\ lo\ ejecuta\ es\ el\ componente\ Runtime\|no\ hay\ regex\ en\ caliente framework-extension-points\|El\ AccessDecisionManager\ recibe\ todos\ los\|El\ SecurityContext\ inyecta\ todos\ los
