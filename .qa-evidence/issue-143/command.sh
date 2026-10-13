#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node .qa-evidence/issue-143/qa-texto.js "${1:-/tmp/qa-143}" "${2:-http://localhost:8000}" sd-colas-y-topicos\|Kafka\ 4.2:\ las\ share\ groups\|no\ se\ puede\ emular\ en\ RabbitMQ sd-locks-distribuidos\|Desde\ Redis\ 8.4\ no\ hace\ falta\ el\ script\|En\ Redis\ eso\ significa\ un\ script\ Lua interfaces\|No\ tiene\ estado\ ni\ cuerpo\ de\ métodos\|No\ tiene\ propiedades\ ni\ cuerpo\ de\ métodos patrones-en-el-framework\|un\ objeto\ lazy\ nativo\;\ antes\,\ un\ proxy\ generado\ que\ hereda\ de\ la\ clase\|Form\ facade\ de\ Laravel patrones-estructurales\|Con\ Symfony\ 7.4+\ sobre\ PHP\ 8.4+\ ese\ sustituto\ es\ un\ objeto\ lazy\ nativo\ del\ lenguaje\|generado\ en\ tiempo\ de\ compilación\ del\ contenedor
