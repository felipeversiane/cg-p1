# Cap. 8 — Discretização, texturas, visibilidade e aliasing (livro p. 85–111 do PDF)

> **Escopo da prova: só 8.3** (seções 3 e 4 abaixo). **🔗 Apoio:** da seção 1/2 só a ideia de fragmento + interpolação de atributos, e da seção 6 só o conceito de aliasing/Nyquist (é o porquê do mipmapping). **🚫 Fora:** algoritmos de rasterização (Bresenham, scanline) e composição (Z-buffer, blending).

> **O assunto preferido da prova**: as três provas têm ≥ 2 questões de textura. As páginas 152–153 do livro (filtragem: magnificação/minificação) **não estão no PDF** — as partes marcadas ⚠ vêm de conhecimento geral, para completar.

## 1. Bloco de discretização
Rasterização → cálculo de cor do fragmento → composição (Z-buffer + blending).
- **Fragmento** = píxel potencial: posição (x,y), profundidade, cor (+ normal, coord. de textura interpoladas). Vira píxel se passar no teste de profundidade.
- Atributos dos vértices são **interpolados linearmente** pelo rasterizador (profundidade, cor, normal, uv). *(é por isso que "1 verde + 5 vermelhos" vira degradê — ver provas.md)*

## 2. Rasterização
**Segmento de reta** (cresce: imediato → incremental → Bresenham)
- Imediato: `y = round(m·x + b)` (multiplicação + float por pixel).
- Incremental: `y += m` (só adições; **acumula erro**).
- **Bresenham**: só **inteiros**, critério do **ponto médio** da função implícita `F(x,y)=Δy·x − Δx·y + Δx·B`. Decisão `d`: `d = 2Δy − Δx`; `incE = 2Δy`; `incNE = 2(Δy−Δx)`; se `d<0` vai para E (`d += incE`), senão NE (`d += incNE`, `y++`). Requer 1º octante (declive 0–1).
- Ex. (5,8)→(9,11): d=2; incE=6; incNE=−2.

**Polígono** (scanline): para cada linha de varrimento, interseções com os lados ativos → ordena por x → pares = **spans** → preenche. Arredonda **para cima à esquerda, para baixo à direita**.
- Lados horizontais: descartados; vértice com 2 lados: ignora o lado em que ele é y_max (evita duplicar).
- Estruturas: **tabela de lados** (por y_min) e **tabela de lados ativos** (ordenada por x). A cada linha: `x += 1/m`. Remover lado quando `y = y_max`.
- **Fragmentação (slivers)**: span com 0–1 píxel → descontinuidades.

## 3. Cálculo de cor
Constante / Gouraud (cor interpolada; nada a fazer no fragmento) / Phong (aplica Blinn-Phong por fragmento) / **Texturização**.

## 4. Texturização
- Textura = imagem de **texels**; espaço de textura **(s,t) ∈ [0,1]²** (independe da resolução). Pode ser 1D/2D/3D. Potências de 2 aceleram.
- Mapeamento **direto** (textura → objeto no mundo) × **inverso** (fragmento → texel). O pipeline faz **inverso**: cada fragmento calcula (s,t) → busca o texel.
- Em perspectiva a textura deforma (**encurtamento perspetivo**; um quadrado vira trapézio).
- ⚠ **Interpolação com correção de perspectiva**: interpolar linearmente (s,t) *no ecrã* é errado (a projeção é não linear). Interpola-se **s/w, t/w e 1/w** linearmente no ecrã e recupera-se `s = (s/w)/(1/w)`. (Em WebGL/OpenGL isto é automático para `varying`.)
- ⚠ **Wrap/Repeat**: coordenadas > 1 com `REPEAT` repetem a textura (ex.: uv de 0 a 4 na altura = 4 repetições); `CLAMP_TO_EDGE` estica a borda; `MIRRORED_REPEAT` espelha.

### 4.1 Filtragem (o que o professor cobra)
- **Magnificação** (textura menor que a área na tela, pouca resolução): `NEAREST` → blocos; `LINEAR`/**bilinear** → média ponderada 2×2 → suave/borrado.
- **Minificação** (muitos texels por píxel, objeto longe): 1 texel por fragmento ⇒ **aliasing** (cintilação, moiré, ladrilhos "fundidos" — fig. 8.22). Solução: **média ponderada** dos texels cobertos (filtro).
- **Mipmapping** (*multum in parvo*): **pré-filtragem**; cadeia de cópias com metade da resolução até 1×1; escolhe o nível cuja resolução ≈ a do objeto na tela. **Custa +33 % de memória** ⚠ e é O(1) por fragmento.
  - **Trilinear** = interpola bilinear em dois níveis adjacentes (evita "salto" visível entre níveis).
  - Limite ⚠: o nível é escolhido por **um** fator isotrópico (quadrado). Em superfície oblíqua (chão rasante) a pegada é alongada → escolhe nível muito baixo → **borrão**. Solução: **filtragem anisotrópica** (várias amostras ao longo do eixo alongado; 2×–16×).

### 4.2 Técnicas baseadas em textura
- **Bump mapping**: 2ª textura (height map, tons de cinza) cujo **gradiente** perturba a **normal local**; **não altera a geometria**, só a iluminação (silhueta continua lisa).
  ⚠ Variante *normal mapping em espaço tangente*: o mapa guarda normais (RGB→XYZ); precisam ser levadas ao mundo pela base **TBN** (Tangent, Bitangent, Normal) montada **no vertex shader** a partir da normal real da malha transformada com a normal matrix.
- **Environment mapping**: textura do ambiente simulando superfície refletora (barato vs ray tracing).

## 5. Composição
### Visibilidade (hidden surface)
- Taxonomia de Sutherland: **espaço objeto** (preciso, vetorial, O(n·n)) · **espaço imagem** (raster, O(n·p), sujeito a aliasing) · **lista de prioridades** (híbrido).
- **Z-buffer** (Catmull): espaço imagem; buffer de cor + buffer de profundidade. Para cada fragmento: `se z_frag < z_buffer(x,y)` então escreve z e cor; senão descarta. Inicializa z com o máximo. Ordem dos polígonos **arbitrária**. **Só funciona com objetos opacos**.

### Blending (translucidez)
`C'_D = f_D·C_D + f_S·C_S`. Com canal alfa: `f_S = α_S`, `f_D = 1 − α_S` ⇒ `C' = α·C_S + (1−α)·C_D` (α=1 opaco, 0 transparente).
- **Depth cueing / névoa**: `C = f·C_obj + (1−f)·C_atmosfera`, f decai com a distância.
- ⚠ Translúcidos exigem desenhar **depois** dos opacos, de trás para frente.

## 6. Aliasing e antialiasing
- Aliasing = reconstruir mal sinal contínuo por amostragem insuficiente. **Nyquist**: amostrar a ≥ **2×** a frequência. Sintomas: **escada**, perda de detalhe com a distância, texturas regulares fundidas. Aumentar resolução **não elimina**.
- **Pré-filtragem** (espaço dos objetos; mistura proporcional das cores na área do píxel; ponderada pela distância; usada em ray tracing).
- **Pós-filtragem / supersampling**: gera imagem maior e faz média 2×2 ou 3×3. Simples, **pesado** (memória + píxeis).
- Wu = combina as duas.

## Exercícios do livro (cap. 8)
8.1 incremental × Bresenham (float+erro vs inteiro) · 8.2 reduzir ao 1º octante e devolver · 8.3 e 8.4 tabelas de lados (triângulo (1,2),(10,12),(1,15); lados horizontais em y=8).
