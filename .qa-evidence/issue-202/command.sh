#!/usr/bin/env bash
set -euo pipefail

REPO="$(git rev-parse --show-toplevel)"
SHA="$(git -C "$REPO" rev-parse --short HEAD)"
RUN="${1:-01-verify-$SHA}"
RUN_DIR="$REPO/.qa-evidence/issue-202/runs/$RUN"
PORT=8123

cd "$REPO"
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1

PLAYWRIGHT_ROOT="${PLAYWRIGHT_ROOT:-$HOME/pw-qa/node_modules}" node "$REPO/.qa-evidence/issue-202/qa.mjs" \
  "$RUN_DIR" \
  "http://127.0.0.1:$PORT/index.html" \
  "https://dgran.github.io/MentorAI/index.html" \
  "file://$REPO/index.html"
