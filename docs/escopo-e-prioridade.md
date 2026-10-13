# Escopo da prova, frequência nas provas e prioridade

## 1. Escopo (informado pelo professor)
O livro é a referência; **só cai o que está nestas seções**:

| Capítulo | Entra | **Fica de fora** |
|---|---|---|
| 2 | **2.2 a 2.6** (arquitetura raster, aplicações 3D, descrição de cenas, síntese de imagem, pipeline) | 2.1 dispositivos, **2.7 cor** (RGB/CMY/HSV/CIE) |
| 3 | **3.1 a 3.5** (pontos, transformações 2D/3D, homogêneas, composição, pivô) | **3.6 modelação hierárquica / grafo de cena** |
| 5 | **Capítulo inteiro** (câmara, volumes, View, projeções, recorte×divisão, viewport) | — |
| 7 | **7.1** fontes de luz, **7.2.1–7.2.3** (ambiente, difusa, especular), **7.3** sombreamento | **7.2.4 a 7.2.8** (expressão global, Blinn, atenuação, luz cromática, múltiplas fontes) |
| 8 | **8.3** (cálculo de cor: constante, Gouraud, Phong, **texturização 8.3.4**: espaço de textura, filtragem/mipmapping, bump, environment) | 8.1/8.2 rasterização, **8.4 Z-buffer/blending**, 8.5 aliasing |
| 4, 6 | — (ausentes) | tudo |

## 2. Regra de prioridade (proposta)
`Prioridade = está no escopo? × (nº de provas em que o tema reapareceu) × peso da questão`
- **Fora do escopo ⇒ não estudar**, mesmo que tenha caído (ex.: nada de Bresenham, Z-buffer, CMY).
- Tema que **caiu mas não está no livro** (ex.: TBN, anisotrópico, correção de perspectiva) ⇒ **prioridade baixa**; basta a ideia, ancorada no que o livro diz.
- Dentro do escopo, ordenar por recorrência: 🔴 3/3 provas · 🟠 2/3 · 🟡 1/3 · ⚪ nunca caiu.

> Correção ao que eu tinha feito antes: marquei 🔥 em cards de Z-buffer, Bresenham e modelos de cor "pelo peso no livro", **não** por recorrência. Isso estava errado para o seu escopo; os cards foram anotados abaixo (🚫).

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

## 4. Sugestão de como manter este documento
1. Uma linha por **tema** (não por questão); colunas = provas; célula = nº da questão (+ peso).
2. Coluna **seção do livro** — é o que valida se está no escopo.
3. Ao entrar uma prova nova, só adicionar a coluna e recalcular Freq./Prioridade.
4. Separar o que **o livro responde** do que veio de aula (⚠ nos resumos).
