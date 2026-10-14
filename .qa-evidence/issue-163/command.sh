#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-163/qa-enlaces.js "${1:-/tmp/qa-163}" "${2:-http://localhost:8000}" ia-llamar-a-un-llm\|ia-streaming pr-streaming-http\|ia-streaming cc-contexto-finito\|cc-memoria-y-continuidad ag-el-metodo-que-aprende\|cc-memoria-y-continuidad#higiene cc-rules\|ag-instalar-un-metodo#herramientas llm-entrenamiento\|ag-por-que-un-metodo#falla llm-muestreo\|ag-por-que-un-metodo cc-skills\|ag-skills-y-contratos#descripcion of-code-review\|ag-qa-con-evidencias ag-del-requisito-al-issue\|ag-qa-con-evidencias#primero cc-flujo-de-equipo\|ag-cerrar-el-ciclo#estado ag-implementar-y-revisar\|ag-cerrar-el-ciclo#gates cc-flujo-de-equipo\|ag-tandas-y-loops#contrato cc-headless-y-ci\|ag-tandas-y-loops#bucles
