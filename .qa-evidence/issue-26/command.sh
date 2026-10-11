python3 -m http.server 8000
cd runs/01-verify-6e3b471/assets && for f in qa-26.js qa-26d.js qa-26c.js qa-26f.js qa-26g.js; do node "$f" http://localhost:8000; done
