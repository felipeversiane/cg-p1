# Questões das provas anteriores + resposta-modelo

Fontes: `moodle/provas/Prova2024Estudo.pdf`, `prova2024p1.pdf`, `prova2025p1.pdf` (prof. Alessandro). Padrão: **MVP (computador)** + **~3–4 questões teóricas** (texturas, iluminação, shaders), sempre "explique **por quê**" + "indique a solução".

Legenda: ✅ coberto pelo livro · ⚠ **fora do livro** (conhecimento geral; conferir com as aulas).

## Mapa de temas (frequência)
| Tema | 2024 Estudo | 2024 P1 | 2025 P1 |
|---|---|---|---|
| Coordenadas de textura (UV) | Q1 | Q1 | Q1 |
| Filtragem/mipmapping/anisotrópico | Q2 | Q2 | Q2b |
| Interpolação com correção de perspectiva | | | Q2a |
| Iluminação / sombreamento | Q1' (2 planos) | | Q3 |
| Normal / bump mapping | | | Q4 |
| Rasterização / interpolação de atributos | | | Q5 (2 buffers) |
| **MVP + visibilidade** | Q3 | Q3 | Q6 |

---
## 2024 Estudo

### Q1 — UV de cena com textura replicada (rua, calçada, muro) ✅/⚠
**Ideia:** cada vértice recebe (s,t); o **número de repetições** = extensão do intervalo de s/t, com wrap **REPEAT** ⚠.
- Textura em 4 faixas lado a lado (calçamento, azulejo, pedra, tijolo) → é um **atlas** horizontal: cada sub-textura ocupa `s ∈ [k/4,(k+1)/4]`, `t ∈ [0,1]`.
- Para um quadrilátero de **largura 2×** e **altura N×** (usando a imagem separada, REPEAT): vértices `(0,0) (2,0) (2,N) (0,N)`. Rua e muro: s vai de 0 a 2. Altura: t vai de 0 a N (nº de repetições vistas).
- Com atlas, REPEAT repetiria o **atlas inteiro**: para repetir só uma faixa é preciso `s' = k/4 + fract(s)/4` no fragment shader ⚠ (ou imagens separadas / array de texturas).
- Cada vértice **compartilhado entre faces com UV diferentes** precisa ser **duplicado**.

### Q2 — Por que a textura fica borrada com a distância? Solução ✅/⚠
- Longe, vários texels caem no mesmo píxel (**minificação**). Com filtro isotrópico/mipmapping o sistema usa níveis de baixa resolução (média de muitos texels) ⇒ **borrão**; sem filtro ⇒ aliasing/cintilação. Além disso o chão em perspectiva é visto de forma **oblíqua** (pegada alongada).
- **Solução:** mipmapping/trilinear (pré-filtragem) ✅ e, para o borrão em superfícies oblíquas, **filtragem anisotrópica** ⚠ (amostra vários texels ao longo do eixo alongado, escolhe mip pelo eixo menor). Opcional: LOD bias.

### Q1' — Dois planos, mesmo modelo de iluminação, resultados diferentes ✅
Mesma geometria/luz, resultados diferentes ⇒ diferença está **onde a iluminação é calculada**:
- Plano com **poucos vértices** + **Gouraud**: a luz é calculada só nos 4 vértices e interpolada → o **brilho (especular/difuso pontual)** é "lavado"/perde o *hot spot* (a luz está no meio e nenhum vértice a vê).
- Plano com **Phong (por fragmento)** ou **malha tesselada**: o brilho aparece no centro, circular.
- **Vantagem/desvantagem:** Gouraud barato (cálculo por vértice) × impreciso no especular; Phong correto × caro (cálculo por fragmento). Alternativa: **tesselar** o plano (mais vértices) — mais geometria.

### Q3 — MVP (X = último dígito, Y = penúltimo)
Triângulo A(−2.5,−2.5,2), B(X,Y,2), C(−2.5,2.5,2); rot Z 60° central; escala 2; target = centro; up (0,1,0); eye (3,32,1); 800×600; fov 60°; far 25; near 1. → ver [`mvp-passo-a-passo.md`](mvp-passo-a-passo.md). **Aviso:** eye quase colinear com Up.

---
## 2024 P1

### Q1 (2,0) — Mapear o "dado" num cubo ✅
Atlas em cruz **4 colunas × 3 linhas** (origem inferior esquerda):
`u ∈ {0, ¼, ½, ¾, 1}`, `v ∈ {0, ⅓, ⅔, 1}`. Linha do meio (v ∈ [⅓,⅔]): faces **1, 2, 6, 5**; acima da face 6: face **4**; abaixo: face **3** (opostas somam 7: 1–6, 2–5, 3–4 ✔).

Cubo: frente z=+1: A(−1,−1,1) B(1,−1,1) C(1,1,1) D(−1,1,1); trás z=−1: E(−1,−1,−1) F(1,−1,−1) G(1,1,−1) H(−1,1,−1).

| Face (nº) | vértices → (u,v) |
|---|---|
| Frente (6) | A(.5,⅓) B(.75,⅓) C(.75,⅔) D(.5,⅔) |
| Esquerda (2) | E(.25,⅓) A(.5,⅓) D(.5,⅔) H(.25,⅔) |
| Trás (1) | F(0,⅓) E(.25,⅓) H(.25,⅔) G(0,⅔) |
| Direita (5) | B(.75,⅓) F(1,⅓) G(1,⅔) C(.75,⅔) |
| Topo (4) | D(.5,⅔) C(.75,⅔) G(.75,1) H(.5,1) |
| Base (3) | E(.5,0) F(.75,0) B(.75,⅓) A(.5,⅓) |

- **São 24 vértices** (4 por face, cada um com UV próprio), não 8.
- **Vantagem:** 1 textura/1 bind/1 draw call; fácil de pintar (atlas/*unwrap*).
- **Desvantagem:** ½ da imagem desperdiçada (células vazias); resolução por face = 1/12 da imagem; **sangramento (bleeding)** entre faces vizinhas com filtro/mipmap; vértices duplicados; costuras visíveis.
- Se a origem for canto superior esquerdo, v → 1−v.

### Q2 (3,0) — Algoritmo do João (média dos texels no retângulo [u±Δu/2, v±Δv/2]) ✅/⚠
O pseudocódigo é uma **filtragem por caixa (box filter / área)** por fragmento.
- **a) Problema:** **aliasing por minificação** (muitos texels por fragmento: cintilação/moiré/ruído, formas irregulares ao longe). Amostrar **um único texel (NEAREST)** descarta todos os outros → ruído e instabilidade no movimento; a média da área representa melhor o píxel.
- **b) Limitações:** *Performance*: custa **O(N)** leituras por fragmento, N cresce com a distância (justamente onde há mais fragmentos pequenos) → gargalo de largura de banda. *Qualidade*: retângulo **alinhado aos eixos** de (u,v) — em superfícies oblíquas a pegada real é um **trapézio/elipse alongada**, então borra no eixo curto ou deixa aliasing no longo; filtro de **caixa** (pesos iguais) é um mau filtro passa-baixa (vaza frequências); **não trata magnificação**; Δu,Δv por vizinhos têm erro nas arestas/descontinuidades.
- **c) Melhorias:** **Mipmapping** (pré-filtra; O(1) por amostra; trilinear evita saltos; custo +33 % memória) ✅; **filtragem anisotrópica** (amostras ao longo do eixo maior da pegada) ⚠; **bilinear** para magnificação ✅; (opcional) *summed-area tables* ⚠ — média de retângulo em O(1) mas ainda alinhada aos eixos.

### Q3 (5,0) — MVP (X, Y = dígitos): ver `mvp-passo-a-passo.md`.
Pergunta adicional: **o triângulo é visível?** Depende da matrícula (tabela no passo-a-passo): com far=10 e eye em z=15, só entra quando Y ≳ 5; para Y ≤ 4 está **além do far** ⇒ não visível. Justifique com z_ndc > 1.

---
## 2025 P1

### Q1 — Cubo xadrez com textura aplicada errado em 2 das 3 faces ✅/⚠
Procedimento: (1) nomeie os 8 vértices; (2) para cada face visível liste (s,t) por vértice; (3) compare com o correto (face inteira: (0,0),(1,0),(1,1),(0,1)).
- A figura mostra **listras** (não xadrez) em duas faces ⇒ numa direção os UVs **não variam** (ou variam num intervalo mínimo: o mesmo valor de t em dois vértices opostos, ou coordenada esticada): a textura é **projetada/esticada** numa só direção. Isso acontece quando dois vértices de uma aresta recebem o mesmo UV ou quando se mapeia (s,t) = (x,y) em faces cuja normal é X/Y (a coordenada que deveria variar é a perdida) — *projeção plana usada nas faces erradas* ⚠.
- Esboce na resposta: tabela vértice → (s,t) "usado" × "correto". **Veja a imagem no PDF** para nomear os vértices visíveis (frente, topo, lateral).

### Q2a — Interpolação linear no ecrã distorce a textura em perspectiva ✅/⚠
Projeção perspectiva é **não linear** (÷w): pontos igualmente espaçados no 3D **não** são igualmente espaçados no ecrã. Interpolar (s,t) linearmente entre vértices **no espaço da tela** assume espaçamento uniforme ⇒ a textura "dobra" ao longo da diagonal (efeito de rede/trapézio).
**Correção:** interpolar `s/w`, `t/w` e `1/w` linearmente (são lineares no ecrã) e dividir: `s = (s/w)/(1/w)` — a interpolação em espaço **homogêneo** (correção de perspectiva).

### Q2b — Artefato do mipmapping (imagem: chão de pedra borrado ao longe) e solução ✅/⚠
- Por quê: mipmapping usa **um único nível** por fragmento, escolhido pelo **maior** lado da pegada do píxel no espaço da textura; em ângulos rasantes a pegada é **muito alongada** (anisotrópica) ⇒ escolhe-se um nível baixo demais (**over-blur**: borrão/perda de detalhe na direção em que havia detalhe). (Variante: faixas/degraus quando se muda de nível sem trilinear.)
- Solução: **filtragem anisotrópica**: calcula-se o eixo maior e menor da pegada; usa-se o nível pelo eixo **menor** e **toma-se várias amostras (2×–16×) ao longo do eixo maior**, combinadas. Mais caro (mais texels por fragmento) mas preserva nitidez. Trilinear resolve apenas a transição entre níveis.

### Q3 — "Gepeto": cubo com iluminação difusa "piramidal" ⚠
O professor corrigiu em segundos. Avalie cada item do chat:
1. **Vetor de luz com sinal invertido** — `lightDir = normalize(rotPosition − lightPosition)` aponta **da luz para o ponto**; Lambert exige `L = normalize(lightPosition − position)` (da superfície **para** a luz). **Concordo**: com o sinal trocado `n·L` fica negativo em ~metade das faces → `max(...,0)` = preto; o resto aparece com iluminação "ao contrário". É a causa mais plausível.
2. **Normais por face → "aparência piramidal"** — **Concordo só em parte / discordo da conclusão**: normal por face (`cross(v1,v2)`) num cubo é o **correto** (arestas vivas; flat shading é desejado). Não é erro por si. Só seria erro se: (a) a normal não é **normalizada**; (b) a ordem do produto vetorial/winding dá normal para **dentro**; (c) as normais **não são transformadas pela normal matrix** quando o cubo gira (aqui o `rotPosition` mostra que a posição é rodada ⇒ normais também precisam ser). Interpolação de normais entre vértices **não** ocorre se cada vértice carrega a normal da sua face (24 vértices).
3. Portanto: **o Gepeto acerta o erro principal (sinal do vetor)** e **exagera/erra** ao tratar flat shading do cubo como bug.

### Q4a — Normal mapping em espaço tangente com normal errada ⚠
Resultado errado (esquerda) × certo (direita) com "a normal da superfície usada como base não coincide com a geometria real".
- **Causa:** a base **TBN** (Tangent, Bitangent, Normal) é construída com uma **normal errada** (ex.: normal não transformada/renormalizada, normal de outro modelo ou constante), então a normal do mapa é levada para o mundo no referencial errado ⇒ sombreamento incoerente.
- **Solução / onde:** no **vertex shader** receber `aNormal`, `aTangent` (e bitangent = `cross(N,T)·sinal`), transformar com a **normal matrix** `mat3(transpose(inverse(model)))`, **normalizar** (e reortogonalizar T por Gram-Schmidt: `T = normalize(T − N·dot(N,T))`), montar `TBN` e passá-la (ou a luz/olho já em espaço tangente) como `varying` ao **fragment shader**, que amostra o normal map `n = 2·rgb − 1` e usa `normalize(TBN·n)` na iluminação.

### Q4b — Quadrado = 2 triângulos, 2 buffers (posição e cor), 6 cores (1 verde + 5 vermelhas) ✅/⚠
- **Resultado:** degradê verde→vermelho. **Por quê:** os **atributos de vértice (cor) são interpolados linearmente** pelo rasterizador (varying/Gouraud). O vértice verde "contamina" os píxeis próximos — as cores variam continuamente.
- **O que ele queria:** região verde **uniforme** com aresta nítida. **Procedimento:** cores **por primitiva**, não por vértice: (i) duplicar vértices (cada triângulo com seus 3 vértices, `drawArrays` sem índices partilhados) e dar **3 vértices da mesma cor** ao triângulo que deve ser verde; ou (ii) usar interpolação **`flat`** (GLSL ES 3.00) ⚠ — a cor do *provoking vertex* vale para todo o triângulo; ou (iii) uniform de cor por triângulo/draw call.
- Detalhe: com 6 cores e 2 triângulos (6 vértices) → 1 verde + 5 vermelhos gera gradiente no triângulo que contém o verde; para o recorte "pequeno triângulo verde no canto" é preciso **geometria extra** (subdividir o quadrado).

### Q5/Q6 — MVP de dois triângulos T e U + visibilidade
Y = (último dígito mod 5) + 2, X = 8 − Y. T: rot Z 45° (origem), escala 0,5. U: rot X −60° (próprio eixo = centro), escala 2, deslocamento +2 em X. Câmera: target origem, up (0,1,0), eye (0,−0.5,−5), 1024×768, fovy 45°, far 6, near 1. → [`mvp-passo-a-passo.md`](mvp-passo-a-passo.md) (T e U **fora do volume** para qualquer Y = 2…6; correção: **recuar** a câmera, p.ex. `eye=(0,0,−25)`, `far=40`).
