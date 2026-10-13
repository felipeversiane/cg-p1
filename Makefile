PORT ?= 8000
PYTHON ?= python3

.PHONY: help up serve open test mvp

help: ## lista os alvos
	@grep -E '^[a-z]+:.*##' $(MAKEFILE_LIST) | sed -E 's/:.*## /\t/'

up: serve ## sobe o app de estudo em http://localhost:$(PORT)/app/

serve: ## servidor estático na raiz do repositório
	@echo "→ http://localhost:$(PORT)/app/   (Ctrl+C para parar)"
	@$(PYTHON) -m http.server $(PORT)

open: ## abre o app no navegador (com o servidor já no ar)
	@xdg-open http://localhost:$(PORT)/app/ >/dev/null 2>&1 || echo "abra http://localhost:$(PORT)/app/"

test: ## confere que mvp.js e tools/mvp.py dão o mesmo resultado
	@node -e 'const M=require("./app/mvp.js");const r=M.run(M.PRESETS["2024p1"].build(7,4)[0]);console.log("js:",r.estado)'
	@$(PYTHON) -I tools/mvp.py --prova 2024p1 --ultimo 7 --penultimo 4 | grep Estado

mvp: ## calcula no terminal: make mvp PROVA=2025p1 MAT=20231847
	@$(PYTHON) -I tools/mvp.py --prova $(PROVA) --matricula $(MAT)
