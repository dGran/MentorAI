#!/usr/bin/env bash
node assets/qa-69.js http://localhost:8001 > assets/main.txt
node assets/qa-69.js http://localhost:8000 assets > assets/rama.txt
