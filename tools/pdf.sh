#!/usr/bin/env bash
# Gera PDFs A4 das páginas de impressão usando o Chrome headless e um servidor temporário.
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)}"
[ -n "$CHROME" ] || { echo "Chrome/Chromium não encontrado (defina CHROME=...)" >&2; exit 1; }
port=8100
while python3 -c "import socket,sys; s=socket.socket(); sys.exit(0 if s.connect_ex(('127.0.0.1',$port))==0 else 1)"; do port=$((port+1)); done
python3 -m http.server "$port" >/dev/null 2>&1 &
srv=$!
trap 'kill $srv 2>/dev/null || true' EXIT
sleep 1
mkdir -p dist
for nome in resumo-teorico tutorial-planilha; do
  "$CHROME" --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer --virtual-time-budget=6000 \
    --print-to-pdf="dist/$nome.pdf" "http://localhost:$port/app/#/doc/impressao/$nome.md" >/dev/null 2>&1
  echo "→ dist/$nome.pdf"
done
