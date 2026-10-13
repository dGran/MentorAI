#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-132/qa-texto.js "${1:-/tmp/qa-132}" "${2:-http://localhost:8000}" phpunit-data-providers\|aplica_el_descuento_por_tramo@frontera\ exacta\ del\ 5%\ with\ data\ \(10000\,\ 5\)\|with\ data\ set phpunit-primeros-pasos\|assertEquals\(null\,\ 0\)\ ✔\ pasa\|pasa\ \(PHPUnit\ 9\)
