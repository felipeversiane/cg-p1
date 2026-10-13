PORT ?= 8000
PYTHON ?= python3

.PHONY: help up serve open test mvp pdf

help: ## lista os alvos
	@grep -E '^[a-z]+:.*##' $(MAKEFILE_LIST) | sed -E 's/:.*## /\t/'

up: serve ## sobe o app de estudo em http://localhost:$(PORT)/app/

serve: ## servidor estático na raiz; usa a próxima porta livre a partir de $(PORT)
	@p=$(PORT); \
	while $(PYTHON) -c "import socket,sys; s=socket.socket(); sys.exit(0 if s.connect_ex(('127.0.0.1',$$p))==0 else 1)"; do \
	  echo "porta $$p ocupada, tentando $$((p+1))…"; p=$$((p+1)); done; \
	echo "→ http://localhost:$$p/app/   (Ctrl+C para parar)"; \
	exec $(PYTHON) -m http.server $$p

open: ## abre o app no navegador (PORT=a porta que o make up informou)
	@xdg-open http://localhost:$(PORT)/app/ >/dev/null 2>&1 || echo "abra http://localhost:$(PORT)/app/"

test: ## confere que mvp.js e tools/mvp.py dão o mesmo resultado
	@node -e 'const M=require("./app/mvp.js");const r=M.run(M.PRESETS["2024p1"].build(7,4)[0]);console.log("js:",r.estado)'
	@$(PYTHON) -I tools/mvp.py --prova 2024p1 --ultimo 7 --penultimo 4 | grep Estado

mvp: ## calcula no terminal: make mvp PROVA=2025p1 MAT=20231847
	@$(PYTHON) -I tools/mvp.py --prova $(PROVA) --matricula $(MAT)

pdf: ## gera dist/resumo-teorico.pdf e dist/tutorial-planilha.pdf (A4, P&B)
	@tools/pdf.sh
