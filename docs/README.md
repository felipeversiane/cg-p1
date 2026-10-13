# Estudo — Computação Gráfica (P1)

Material de estudo montado a partir do livro (`livro-ocr/`), das provas anteriores (`moodle/provas/`) e da planilha `MVP_Excel_corrigido.xlsx`.

> **Leia primeiro:** [escopo-e-prioridade.md](escopo-e-prioridade.md) — o que entra na prova, matriz de recorrência e regra de prioridade.

## Como a prova costuma ser
1. **Computador**: questão do **MVP do triângulo** (rotação → escala → deslocamento → câmera → projeção → visível?). Pede matrizes intermediárias nomeadas.
2. **Teórica**: texturas (UV, filtragem, mipmapping, perspectiva), iluminação/sombreamento, shaders/normais.

## Ordem de estudo recomendada (tempo curto)
| # | O que | Tempo | Arquivo |
|---|---|---|---|
| 1 | Receita do MVP + treinar na planilha com 2 provas | 60–90 min | [mvp-passo-a-passo.md](mvp-passo-a-passo.md) |
| 2 | Cap. 3 + Cap. 5 (resumos) | 45 min | [resumos/cap03](resumos/cap03-transformacoes-geometricas.md), [cap05](resumos/cap05-processamento-geometrico.md) |
| 3 | Cap. 8 (texturas) + Cap. 7 (iluminação) | 60 min | [cap08](resumos/cap08-discretizacao-texturas.md), [cap07](resumos/cap07-iluminacao-sombreamento.md) |
| 4 | Cards 🔥 em voz alta | 30 min | [cards.md](cards.md) |
| 5 | Refazer as questões das provas **sem olhar** | 60 min | [provas.md](provas.md) |
| 6 | Cap. 2 (leitura rápida) | 15 min | [cap02](resumos/cap02-conceitos-fundamentais.md) |

## Arquivos
- `resumos/` — um resumo por capítulo (2, 3, 5, 7, 8).
- `cards.md` — cartões Q→A (livro + provas).
- `provas.md` — questões das 3 provas com resposta-modelo e mapa de temas.
- `mvp-passo-a-passo.md` — mapeamento enunciado→planilha, ordem das matrizes, interpretação de visibilidade.
- `../tools/mvp.py` — **mesma conta da planilha em Python** (validado: reproduz o estado atual da planilha). Serve para conferir sua resposta.

## ⚠ Lacunas do PDF do livro
O PDF de 111 páginas **não contém** os capítulos 1, 4 (modelação geométrica) e 6 (recorte), a página 96 do original (exercício 5.3 opções B–E, p. 64 do PDF) está com OCR ruim e **as páginas 152–153 do livro** (filtragem de texturas: magnificação, bilinear, início de minificação) não estão no PDF (a transcrição salta da p. 151 para 154).
Os trechos marcados com **⚠** nos resumos/respostas vêm de conhecimento geral de CG (repeat/wrap, correção de perspectiva, anisotrópico, normal matrix, TBN, `flat`); **confira com as notas de aula** do professor.

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
- [ ] Revisar com o professor/aulas o que está marcado ⚠
- [ ] Resolver o MVP com **seus** dígitos de matrícula
