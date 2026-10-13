#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-140/qa-texto.js "${1:-/tmp/qa-140}" "${2:-http://localhost:8000}" sentry-a-fondo\|abre\ un\ span\ hijo\ de\ la\ transacción\ activa\|\\Sentry\\startSpan\( sentry-error-tracking\|la\ retención\ de\ Sentry\ depende\ del\ plan\|ahí\ Datadog\ o\ New\ Relic metricas-prometheus\|El\ intervalo\ de\ scraping\ por\ defecto\ es\ 1\ minuto\|por\ defecto\ es\ 15\ segundos promql\|phpfpm_active_processes\ /\ phpfpm_total_processes\|phpfpm_slow_requests_total logs-estructurados\|el\ processor\ recibe\ un\|fn\(array\ \$record\) loki-logql\|Grafana\ Alloy\;\ Promtail\ está\ retirado\|count_distinct_over_time\( alerting\|Alertmanager\ no\ expande\ variables\ de\ entorno\|api_url:\ \"\$SLACK_WEBHOOK\"
