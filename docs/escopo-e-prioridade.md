# Escopo da prova, frequência nas provas e prioridade

## 1. Escopo (informado pelo professor) + nível de apoio
O livro é a referência. Três níveis:
- **Dentro** — pode ser o assunto de uma questão (lista do professor).
- **🔗 Apoio** — *fora da lista*, mas é a base conceitual de algo dentro; ler só o conceito (1 parágrafo), **sem** exercícios nem cards próprios.
- **🚫 Fora** — não é base de nada do escopo; ignorar.

| Capítulo | Dentro | 🔗 Apoio (por quê) | 🚫 Fora |
|---|---|---|---|
| 2 | **2.2 a 2.6** (arquitetura raster, aplicações 3D, cenas, síntese de imagem, pipeline) | — | 2.1 dispositivos; **2.7 cor** |
| 3 | **3.1 a 3.5** | — | **3.6 modelação hierárquica / grafo de cena** |
| 5 | **Capítulo inteiro** | — | — |
| 7 | **7.1**, **7.2.1–7.2.3** (ambiente, difusa, especular), **7.3** (sombreamento) | **7.2.4** expressão global: é a soma dos 3 termos que Gouraud/Phong calculam por vértice/fragmento | **7.2.5–7.2.8** (aprox. de Blinn, atenuação, luz cromática, várias fontes) |
| 8 | **8.3** (constante, Gouraud, Phong, texturização 8.3.4) | **8.2 (só a ideia)**: fragmento e interpolação linear de atributos pelo rasterizador — base de 8.3 inteiro. **8.5 (só o conceito)**: aliasing é o *porquê* da filtragem/mipmapping 8.3.4.2 | Algoritmos de 8.2 (Bresenham, scanline, tabelas de lados); **8.4 Z-buffer/blending** |
| 4, 6 | — | — | ausentes do PDF |

## 2. Regra de classificação e prioridade
Aplicada **card a card** (e a cada resumo/seção). A classificação de cada card está em [classificacao-cards.md](classificacao-cards.md).

**Passo 1 — Escopo** (pela seção do livro em que o conteúdo está):
1. A seção está na lista do professor? ⇒ **Dentro**.
2. Senão: algum item **Dentro** precisa dela para ser explicado/respondido? ⇒ **🔗 Apoio** (só o conceito).
3. Senão ⇒ **🚫 Fora**.

**Passo 2 — Recorrência** (só para Dentro). Conta-se em quantas das provas o **tema** apareceu:
| Provas | Nível |
|---|---|
| 3 de 3 | 🔴 |
| 2 de 3 | 🟠 |
| 1 de 3 | 🟡 |
| 0 de 3 | ⚪ |

- **Mesmo tema** = mesmo *mecanismo*, independente do objeto cobrado (UV num cubo, numa cena ou num dado = "Coordenadas de textura"; borrão com a distância e artefato do mipmapping = "Filtragem de textura").
- **Um card herda o nível do tema mais recorrente que precisa dele para ser respondido**, não do capítulo todo. Ex.: o card "transformação de viewport" fica ⚪ porque a questão MVP termina em clip/NDC.

**Passo 3 — Livro.** Se o mecanismo central do card **não está no livro** (⚠), rebaixa **um** nível (🔴→🟠→🟡→⚪). Motivo: a referência é o livro; o resto é só a ideia.

**Passo 4 — Peso (ordenação, não nível).** Dentro do mesmo nível, estude primeiro o que apareceu na questão de maior pontuação (hoje só 2024 P1 tem notas: Q1 2,0 · Q2 3,0 · Q3 5,0 — o MVP).

**Como os arquivos herdam isso:** `cards.md` agrupa por nível final; os resumos trazem um aviso de escopo no topo e um anexo 🚫 no fim; `provas.md` mostra a seção do livro de cada questão.

## 3. Matriz de recorrência (preencher/ajustar a cada prova nova)
| Tema | Seção do livro | 2024 Estudo | 2024 P1 | 2025 P1 | Freq. | Prioridade |
|---|---|---|---|---|---|---|
| **MVP do triângulo** (R→S→T, câmara, projeção, visível?) | 3.2–3.5, 5.2–5.6 | Q3 | Q3 (5,0) | Q6 | **3/3** | 🔴 |
| **Coordenadas de textura (UV)** em cena/cubo | 8.3.4.1 | Q1 | Q1 (2,0) | Q1 | **3/3** | 🔴 |
| **Filtragem de textura / mipmapping** (borrão, aliasing) | 8.3.4.2 | Q2 | Q2 (3,0) | Q2b | **3/3** | 🔴 |
| Gouraud × Phong (calcular luz no vértice × fragmento) | 7.3.2–7.3.3, 8.3.2–8.3.3 | Q1' | — | Q4b (cor interpolada) | 2/3 | 🟠 |
| Distorção por interpolação em perspectiva | 7.3.4 ("distorção de perspetiva"), 8.3.4.1 | — | — | Q2a | 1/3 | 🟡 |
| Reflexão difusa (Lambert, vetor L) / normais | 7.2.2, 7.3.1 | — | — | Q3 | 1/3 | 🟡 |
| Bump mapping (normais perturbadas) | 8.3.4.3 | — | — | Q4a | 1/3 | 🟡 |
| Environment mapping | 8.3.4.4 | — | — | — | 0/3 | ⚪ |
| Especular / ambiente / fontes de luz | 7.1, 7.2.1, 7.2.3 | — | — | — | 0/3 | ⚪ (base p/ responder as outras) |
| Pipeline, framebuffer, janela×viewport | 2.2–2.6 | — | — | — | 0/3 | ⚪ (teoria "de graça") |

**Padrão das provas:** sempre `1 questão MVP (peso alto) + 2–3 de textura + 1 de iluminação/shader`. As questões pedem **"explique por quê" + "qual a solução"**, não definições.

## 4. Como manter
1. Uma linha por **tema** (não por questão); colunas = provas; célula = nº da questão (+ peso).
2. Coluna **seção do livro** — é o que valida se está no escopo.
3. Ao entrar uma prova nova, só adicionar a coluna e recalcular Freq./Prioridade.
4. Separar o que **o livro responde** do que veio de aula (⚠ nos resumos).
