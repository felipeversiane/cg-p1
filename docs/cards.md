# Cards de estudo (pergunta → resposta)

Como usar: leia a pergunta, **responda em voz alta/papel**, só então abra a resposta (`<details>`). Tags: 📘 livro · 📝 caiu em prova · ⚠ fora do livro · 🔥 prioridade.
Os cards estão **ordenados por prioridade** (recorrência nas provas × escopo); estude de cima para baixo. 🔗 = **apoio** (base conceitual de algo dentro do escopo; estude só a ideia). 🚫 = **fora do escopo** da prova (ver [escopo-e-prioridade.md](escopo-e-prioridade.md)): só leia se sobrar tempo.

## 🔴 MVP do triângulo (3/3 provas, peso alto)

<details><summary>🔥📘 Por que usar coordenadas homogêneas?</summary>

Para que **translação** vire multiplicação de matriz como rotação/escala → uma só matriz composta (M) para tudo.
</details>

<details><summary>🔥📘 Ordem da composição: aplicar T₁, depois T₂, depois T₃ — qual é M?</summary>

`M = T₃·T₂·T₁` (primeiro aplicado fica à direita). Não é comutativa.
</details>

<details><summary>🔥📘 Matriz para rodar em torno de um ponto C?</summary>

`T(C)·R(θ)·T(−C)`. Idem escala mantendo o centro: `T(C)·S·T(−C)`.
</details>

<details><summary>📘 Escreva Rz(θ), T(dx,dy,dz), S(s).</summary>

Rz: `[cos −sen 0 0; sen cos 0 0; 0 0 1 0; 0 0 0 1]`. T: identidade com (dx,dy,dz) na última coluna. S: diagonal (sx,sy,sz,1).
</details>

<details><summary>📘 Inversas de T, S e R?</summary>

`T(−d)`, `S(1/s)`, `R(−θ)=Rᵀ`.
</details>

<details><summary>📘 Que transformações preservam ângulos e comprimentos?</summary>

Translação e rotação (corpo rígido). Escala uniforme preserva ângulos; não uniforme distorce.
</details>

<details><summary>🔥📘 O que é MVP e em que ordem se multiplica?</summary>

`MVP = P·V·M`. Vértice passa por Model (mundo) → View (câmara) → Projection (clip). Depois ÷w → NDC → viewport.
</details>

<details><summary>🔥📘 Parâmetros da câmara virtual simples?</summary>

Posição (eye), target (ou vetor de visão), up; janela (FOV/aspect), near, far, tipo de projeção.
</details>

<details><summary>🔥📘 Como se calcula a base da câmera (lookAt)?</summary>

`f = norm(target − eye)`; `s = norm(f × up)`; `u = s × f`; View: linhas s, u, −f e translação `−s·eye, −u·eye, +f·eye` (OpenGL).
</details>

<details><summary>🔥📘 Matriz de projeção perspetiva (OpenGL)?</summary>

`f=1/tan(fovy/2)`; diag `(f/aspect, f, −(F+N)/(F−N))`; `P[2][3] = −2FN/(F−N)`; `P[3][2] = −1`.
</details>

<details><summary>📘 Por que w ≠ 1 depois da projeção e o que é a divisão perspetiva?</summary>

A última linha da matriz coloca z (câmera) em w. Dividir x,y,z por w produz NDC e o encurtamento perspetivo.
</details>

<details><summary>🔥📘 Condição de visibilidade em clip space?</summary>

`−w ≤ x,y,z ≤ w` (NDC em [−1,1] em OpenGL). Fora do near/far/laterais ⇒ cortado.
</details>

<details><summary>📘 Por que recortar o plano near antes da divisão perspetiva?</summary>

Pontos com z<0 e w<0 viram, após ÷w, pontos "na frente" da câmera (reaparecem).
</details>

<details><summary>📘 Por que near > 0 e far finito?</summary>

near=0 ⇒ singularidade (divisão por 0); far finito evita desperdício com objetos minúsculos e dá precisão ao z-buffer.
</details>

<details><summary>📘 Relação FOV, janela e distância?</summary>

`tg(θv/2) = a/d`, `tg(θh/2) = ℓ/d`; `ℓ/a = aspect`.
</details>

<details><summary>📘 Ortográfica × perspetiva (volume)?</summary>

Paralelepípedo (raios paralelos, sem encurtamento) × frustum (ápice no olho, objetos distantes menores).
</details>

<details><summary>📘 Por que a projeção usa 4×4 invertível (preserva z)?</summary>

Para o Z-buffer ainda comparar profundidades; projeção "simples" perde a profundidade (não invertível).
</details>

<details><summary>📘 Exercício 5.1: fov vertical 90°, d=20, aspect 4/3.</summary>

a = 20·tg45 = 20 → altura 40, largura 53,3. Com 800 de largura → altura 600.
</details>

<details><summary>📘 Transformação de viewport?</summary>

NDC [−1,1]→píxeis: `T(xmin,ymin,0)·S(Δx/2,Δy/2,1)·T(1,1,0)`; z mantém.
</details>

## 🔴 Texturas: UV e filtragem (3/3 provas)

<details><summary>🔥📘📝 O que é mipmapping, e o que é trilinear?</summary>

Pirâmide de cópias com metade da resolução; escolhe o nível ≈ tamanho na tela. Trilinear: interpolação bilinear em 2 níveis + interpolação entre níveis (sem saltos).
</details>

<details><summary>🔥📝⚠ Qual o defeito do mipmapping e a solução?</summary>

Pegada alongada em superfícies oblíquas → nível muito baixo → borrão. Solução: filtragem anisotrópica (várias amostras no eixo maior).
</details>

<details><summary>📘 Mapeamento direto × inverso?</summary>

Direto: textura→objeto (mundo). Inverso: fragmento→texel (feito no pipeline).
</details>

<details><summary>📝⚠ Magnificação × minificação?</summary>

Mag: poucos texels para muitos píxeis → NEAREST (blocos)/bilinear (borrado). Min: muitos texels por píxel → aliasing → mipmap.
</details>

<details><summary>📝⚠ Por que atlas de textura exige vértices duplicados?</summary>

Cada face tem UVs distintos no mesmo vértice geométrico; o vértice no GPU é (posição + UV + normal…) ⇒ 24 vértices para o cubo.
</details>

## 🟠 Gouraud × Phong e sombreamento (2/3)

<details><summary>🔥📘📝 Constante × Gouraud × Phong?</summary>

Constante: 1 cor/polígono. Gouraud: ilumina nos vértices, interpola **cor**. Phong: interpola **normal**, ilumina **por fragmento**. Qualidade e custo crescentes. Gouraud perde brilhos especulares; Phong correto mas caro.
</details>

<details><summary>📘 Limitações do shading interpolado (cite 2).</summary>

Silhueta poligonal; distorção de perspetiva (interpola no ecrã); dependência da orientação do polígono; vértices não partilhados; normais incorretas → falso alisamento.
</details>

<details><summary>📝⚠ Por que "1 verde + 5 vermelhos" gera degradê?</summary>

Atributos de vértice são interpolados pelo rasterizador. Para bloco uniforme: duplicar vértices e igualar cores, ou `flat`.
</details>

## 🟡 Lambert, normais, bump, perspetiva (1/3)

<details><summary>🔥📝⚠ Qual o sentido do vetor L (luz) no Lambert?</summary>

Da **superfície para a luz**: `L = normalize(lightPos − fragPos)`. Invertido ⇒ n·L<0 ⇒ faces pretas.
</details>

<details><summary>📝⚠ Por que a normal precisa da normal matrix?</summary>

Normais não se transformam por M quando há escala não uniforme; usa-se `transpose(inverse(M))` e renormaliza.
</details>

<details><summary>📝⚠ Cubo com arestas vivas: normais por vértice ou por face?</summary>

24 vértices (4 por face) com a normal da face → flat correto. Compartilhar 8 vértices com normal média arredonda o cubo.
</details>

<details><summary>🔥📝⚠ Por que a interpolação linear de UV no ecrã distorce?</summary>

Perspectiva não linear (÷w). Corrige-se interpolando s/w, t/w, 1/w e dividindo.
</details>

<details><summary>📘 Bump mapping × environment mapping?</summary>

Bump: perturba normais por um height map (geometria não muda). Environment: textura do ambiente simula reflexos.
</details>

<details><summary>📝⚠ Normal mapping em espaço tangente: o que é TBN e onde se monta?</summary>

Base (Tangente, Bitangente, Normal) da superfície. Monta-se no vertex shader com a normal transformada pela normal matrix; no fragment shader leva `n_map` para o mundo.
</details>

## ⚪ Dentro do escopo, nunca caiu (teoria base)

<details><summary>🔥📘 Liste a ordem dos andares do pipeline de visualização.</summary>

Aplicação → primitivas simples → **visualização** → **iluminação (vértices)** → **projeção** → **recorte** → **viewport** → **rasterização** → **cálculo de cor do fragmento** → **composição** (z-buffer/blending) → píxeis.
</details>

<details><summary>📘 Que blocos formam o pipeline gráfico 3D e qual é o gargalo?</summary>

Processamento geométrico (vértices, ponto flutuante) + discretização (píxeis, acessos ao framebuffer). **Gargalo: discretização** — depende do nº de píxeis.
</details>

<details><summary>📘 Diferença entre janela de visualização e viewport?</summary>

Janela = região da cena capturada; viewport = área do ecrã onde a imagem é desenhada. Aspect ratio igual evita distorção.
</details>

<details><summary>📘 Quais são os 3 blocos da placa gráfica raster?</summary>

GPU, framebuffer (memória de imagem), controlador de vídeo (+ controlador de memória).
</details>

<details><summary>📘 True color × cor indexada (1280×1024)?</summary>

24 bits/píxel → 3,75 MB, 16 M cores simultâneas. Indexada 8 bits + LUT → 1,25 MB (+tabela), 256 cores simultâneas.
</details>

<details><summary>📘 Pipeline × ray tracing?</summary>

Pipeline: rápido, aproximado, tempo real. Ray tracing (fotorrealismo): qualidade, reflexões múltiplas, lento.
</details>

<details><summary>📘 Para que serve a componente ambiente?</summary>

Aproxima reflexões múltiplas; sem ela, zonas não iluminadas diretamente ficam pretas.
</details>

<details><summary>📘 Brilho (shininess) alto significa…?</summary>

Reflexo especular concentrado, brilho pequeno (superfície polida/metal 100–500).
</details>

<details><summary>📘 O que são bandas de Mach?</summary>

Realce perceptivo (inibição lateral) das fronteiras entre polígonos com intensidades diferentes no flat shading.
</details>

## 🔗 Apoio (só a ideia)

<details><summary>🔗 📘 Fórmula de Blinn-Phong.</summary>

`I = ka·La + kd·Ld·max(n·l,0) + ks·Ls·max(n·h,0)^β`, `h = (l+v)/|l+v|`; atenuação `1/(a+bd+cd²)` nos termos de luz direta (não no ambiente).
</details>

<details><summary>🔗 📘📝 O que é aliasing? Como minimizar?</summary>

Perda por amostragem insuficiente (Nyquist 2×). Pré-filtragem (espaço objeto), pós-filtragem/supersampling, mipmapping (texturas).
</details>

## 🚫 Fora do escopo (se sobrar tempo)

<details><summary>🚫 📘 RGB × CMY × HSV × YCbCr × CIE — para que serve cada um?</summary>

RGB aditivo (ecrãs). CMY subtrativo (impressão; CMYK só acrescenta preto). HSV/HSL intuitivos (matiz, saturação, valor/luminosidade). YCbCr: TV/JPEG, separa luminância. CIE: cobre todo o visível (referência).
</details>

<details><summary>🚫 📘 O que é grafo de cena / modelação hierárquica?</summary>

Árvore (acíclica) de nós com transformações e objetos; filhos herdam a matriz do pai (`M_filho = M_pai · T · R`). Girar a base arrasta todas as peças.
</details>

<details><summary>🚫 📘 O que é a aproximação de Blinn e qual a vantagem?</summary>

Usa o halfway vector h em vez do reflexo r → evita calcular `r`; com expoente β.
</details>

<details><summary>🚫 📘 Algoritmo do Z-buffer.</summary>

Para cada fragmento: se `z < zbuf[x,y]` escreve z e cor; senão descarta. Inicializa z=max. Ordem arbitrária. Só opacos.
</details>

<details><summary>🚫 📘 Como tratar transparência?</summary>

Blending com alfa: `C = α·C_src + (1−α)·C_dst`. Desenhar translúcidos depois dos opacos, de trás para frente ⚠.
</details>

<details><summary>🚫 📘 Bresenham: por que é melhor que o incremental?</summary>

Só aritmética inteira (ponto médio); sem acumulação de erro de ponto flutuante.
</details>

<details><summary>🚫 📘 Bresenham: valores iniciais.</summary>

`dx, dy, d = 2dy − dx, incE = 2dy, incNE = 2(dy−dx)`; d<0 → E, senão NE e y++.
</details>

<details><summary>🚫 📘 Rasterização de polígonos: passos.</summary>

Tabela de lados (ordenada por y_min) → lados ativos ordenados por x → spans por pares → incrementa `x += 1/m` por linha; remove em y_max; ignora horizontais.
</details>
