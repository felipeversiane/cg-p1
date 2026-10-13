# Estudo — Computação Gráfica (P1)

Material de estudo montado a partir do livro (`livro-ocr/`), das provas anteriores (`moodle/provas/`) e da planilha `MVP_Excel_corrigido.xlsx`.

> **Leia primeiro:** [escopo-e-prioridade.md](escopo-e-prioridade.md) — o que entra na prova, matriz de recorrência e regra de prioridade.

## App de estudo (navegador)
```
make up      # ou: python3 -m http.server 8000
# abra http://localhost:8000/app/
```
Lê os `.md` de `docs/` (fonte da verdade): navegação e busca nos resumos, **cards com progresso**, **provas em modo treino**, **calculadora MVP** (digite a matrícula). O filtro 🔗 apoio / 🚫 fora fica no topo; por padrão só aparece o que está **dentro** do escopo. O progresso fica no `localStorage` do navegador. Sem build; `marked` está em `app/vendor` (funciona offline).

## Impressão (A4, P&B, frente e verso)
`make pdf` gera `dist/resumo-teorico.pdf` (resumo teórico objetivo, 2 páginas) e `dist/tutorial-planilha.pdf` (folha do MVP: como usar a planilha, 2 páginas) a partir de `docs/impressao/*.md`. No app, o botão **🖨 Imprimir** usa o mesmo estilo de página.

## Como a prova costuma ser
1. **Computador**: questão do **MVP do triângulo** (rotação → escala → deslocamento → câmera → projeção → visível?). Pede matrizes intermediárias nomeadas.
2. **Teórica**: texturas (UV, filtragem, mipmapping, perspectiva), iluminação/sombreamento, shaders/normais.

## Ordem de estudo recomendada (tempo curto)
| # | O que | Tempo | Arquivo |
|---|---|---|---|
| 1 | Receita do MVP + treinar na planilha com 2 provas | 60–90 min | [mvp-passo-a-passo.md](mvp-passo-a-passo.md) |
| 2 | Cap. 3 + Cap. 5 (resumos) | 45 min | [resumos/cap03](resumos/cap03-transformacoes-geometricas.md), [cap05](resumos/cap05-processamento-geometrico.md) |
| 3 | Cap. 8 (texturas) + Cap. 7 (iluminação) | 60 min | [cap08](resumos/cap08-discretizacao-texturas.md), [cap07](resumos/cap07-iluminacao-sombreamento.md) |
| 4 | Cards 🔴 e 🟠 em voz alta | 30 min | [cards.md](cards.md) |
| 5 | Refazer as questões das provas **sem olhar** | 60 min | [provas.md](provas.md) |
| 6 | Cap. 2.2–2.6 (leitura rápida) | 15 min | [cap02](resumos/cap02-conceitos-fundamentais.md) |

## Arquivos
- `resumos/` — um resumo por capítulo (2, 3, 5, 7, 8).
- `cards.md` — cartões Q→A **ordenados por prioridade** (🔴→⚪, depois 🔗 apoio e 🚫 fora).
- `escopo-e-prioridade.md` — escopo, **regra de classificação/prioridade** (4 passos) e matriz de recorrência.
- `classificacao-cards.md` — cada card com seção do livro, tema, frequência e nível (aplicação da regra).
- `provas.md` — questões das 3 provas com resposta-modelo e mapa de temas.
- `mvp-passo-a-passo.md` — mapeamento enunciado→planilha, ordem das matrizes, interpretação de visibilidade.
- `../tools/mvp.py` — **mesma conta da planilha em Python** (validado: reproduz o estado atual da planilha). Serve para conferir sua resposta.

## ⚠ Lacunas do PDF do livro
Os capítulos 1, 4 e 6 não estão no PDF e **não caem** na prova. A p. 64 do PDF (exercício 5.3, opções B–E) está com OCR ruim, e as **páginas 152–153 do livro** (início da filtragem de textura) não estão no PDF (a transcrição salta da p. 151 para 154).
Trechos marcados com **⚠** vêm de conhecimento geral (repeat, correção de perspetiva, anisotrópico, normal matrix, TBN, `flat`): **não estão no livro**, então têm prioridade baixa — basta a ideia.

## Convenções assumidas (conferir!)
- **Convenção adotada: OpenGL** (câmera olha para −z, NDC z ∈ [−1,1], vetores coluna, `MVP = P·V·M`), igual à planilha. O livro usa mão esquerda / z∈[0,1]; conceito igual.
- **Matrícula sempre parametrizada**: `python3 tools/mvp.py --prova 2025p1 --matricula <sua>` (ou `--ultimo N --penultimo M`). Nunca fixe X/Y no papel.
- "FOV" sem qualificação = **vertical** (como `fovy` do OpenGL). Diga isso na prova.
- Rotação/escala "central/no próprio eixo" = em torno do **centróide**; sem a palavra = **origem**.

## Status
- [x] Resumos por capítulo
- [x] Cards do livro
- [x] Questões das provas respondidas
- [x] Resumos atualizados com o que caiu em prova (blocos ⚠ e 📝)
- [x] Níveis dentro / 🔗 apoio / 🚫 fora aplicados a resumos e cards
- [ ] Resolver o MVP com **seus** dígitos de matrícula
