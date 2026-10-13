# Computação Gráfica — P1: resumo teórico

**Escopo:** cap. 2 (2.2–2.6), 3 (3.1–3.5), 5, 7 (7.1, 7.2.1–7.2.3, 7.3), 8.3. **Convenção:** OpenGL (câmera olha para −z, NDC em [−1, 1]).
Marcas: **[R]** caiu nas 3 provas · **[2/3]** caiu em 2 · **[1/3]** caiu em 1.

## 1. Arquitetura e pipeline (cap. 2.2–2.6)
- **Placa raster = 3 blocos:** GPU (gera a imagem), **framebuffer** (guarda os píxeis), controlador de vídeo (lê o framebuffer e envia ao monitor).
- **Profundidade do píxel** (bits/píxel) define as cores simultâneas: *true color* 24 bits (16 M) × *cor indexada* (índice + lookup table, poucas cores, menos memória).
- **Double/triple buffering** evitam *tearing*; sincronizar FPS × frequência do monitor.
- **Cena** = objetos (geometria + atributos) + luzes. Atributos: cor por vértice, **material** (modelo de iluminação) ou **textura**.
- **Janela de visualização** = o que se captura da cena; **viewport** = onde se desenha no ecrã. Mesma relação de aspeto, senão distorce.
- **Pipeline (ordem):** aplicação → visualização → iluminação nos vértices → projeção → recorte → viewport → rasterização → cor do fragmento → composição.
  - **Processamento geométrico** (vértices) + **discretização** (píxeis). O gargalo é a **discretização**.
  - Pipeline = rápido e aproximado (tempo real). **Ray tracing** = fotorrealista e lento.

## 2. Transformações (cap. 3.1–3.5)
- **Coordenadas homogêneas** `(x,y,z,1)`: fazem da translação uma multiplicação de matriz → tudo compõe em **uma** matriz M.
- **Translação e rotação** preservam comprimentos e ângulos (corpo rígido); **escala** só preserva ângulos se uniforme.
- **Rotação e escala são relativas à ORIGEM.** Para girar/escalar em torno do centro C do objeto: **T(C) · R · T(−C)**.
- **Composição:** `M = T₃·T₂·T₁` — o **primeiro** passo fica à **direita**. Não é comutativa (a ordem muda o resultado).
- Inversas: T(−d), S(1/s), R(−θ) = Rᵀ.

## 3. Câmera, projeção e recorte (cap. 5) **[R]**
- **Câmera virtual:** posição (eye), **target** (ou vetor de visão), **Up**; define a base *uvn* (n = direção de visão). Up não pode ser paralelo à direção de visão.
- **Volume de visualização:** ortogonal = paralelepípedo (raios paralelos); **perspetiva = frustum** (ápice no olho). **near/far** limitam (near > 0, far > near).
- **FOV:** abertura vertical ou horizontal; relaciona-se com a janela por `tg(θ/2) = meia-altura / d` e **aspect = largura/altura**. Reduzir o FOV = zoom.
- **Cadeia de espaços:** modelo →(M)→ mundo →(View)→ câmera →(Projeção)→ **clip** →(÷w)→ **NDC** →(viewport)→ ecrã. **MVP = P·V·M.**
- **Perspetiva:** após a projeção `w ≠ 1`; a **divisão por w** produz o encurtamento (distantes ficam menores; paralelismo não se mantém). O z não linear mantém a **ordem** de profundidade para o Z-buffer.
- **Recorte:** ponto dentro se **−w ≤ x,y,z ≤ w** (NDC em [−1,1]). É feito **antes** da divisão; contra o plano **near** é obrigatório (senão pontos atrás da câmera reaparecem).
- **Resultado:** *dentro* (todo visível) · *parcial* (recortado) · *fora* (rejeitado). z_ndc > 1 = além do far; z_ndc < −1 = antes do near; w ≤ 0 = atrás da câmera.
- **Viewport:** converte NDC [−1,1] em píxeis; o z mantém-se.

## 4. Iluminação e sombreamento (cap. 7)
- **Fontes:** ambiente (sem posição/direção) · direcional (no infinito, sem atenuação) · pontual (atenua com a distância) · spotlight (cone).
- **Modelo local:** só luz direta; sem sombras nem reflexões múltiplas. A **ambiente** aproxima essas reflexões (sem ela, o que não recebe luz fica preto).
- **Difusa (Lambert)** [1/3]: `kd·Ld·max(n·l,0)`; **não depende do observador**; **l vai da superfície para a luz** (invertido ⇒ faces pretas).
- **Especular:** `ks·Ls·max(r·v,0)^α`; depende do observador; **α alto = brilho pequeno e concentrado** (superfície polida).
- **Sombreamento [2/3]:**

| | Constante | Gouraud | Phong |
|---|---|---|---|
| Ilumina | 1× por polígono | **por vértice** | **por fragmento** |
| Interpola | — | **a cor** | **a normal** |
| Resultado | facetado, bandas de Mach | liso, **perde brilho especular** | brilhos corretos |
| Custo | menor | médio | maior |

- **Limitações do sombreamento interpolado:** silhueta poligonal; distorção de perspetiva (interpola no ecrã); depende da orientação do polígono; vértices não partilhados; normais incorretas. Remédio: **subdividir**.

## 5. Cor do fragmento e texturas (cap. 8.3) **[R]**
- **Fragmento** = píxel potencial (posição, profundidade, cor/normal/uv). A rasterização **interpola linearmente** os atributos dos vértices — por isso 1 vértice verde entre vermelhos dá **degradê**.
- **Constante/Gouraud/Phong** aplicados ao fragmento: Gouraud = cor interpolada; Phong = normal interpolada + iluminação por fragmento.
- **Textura:** imagem de **texels** com coordenadas **(s,t) ∈ [0,1]²**; cada vértice guarda o seu (s,t) e o rasterizador interpola. Mapeamento **inverso**: fragmento → texel.
  - Em perspetiva o quadrado vira trapézio (encurtamento perspetivo).
  - Vértices com UV diferentes por face são **duplicados** (cubo: 24 vértices).
- **Minificação (objeto longe):** vários texels por píxel. Usar 1 texel ⇒ **aliasing** (ruído, cintilação, texturas "fundidas"); a solução é **média ponderada**.
- **Mipmapping [R]:** **pré-filtragem** — cópias com metade da resolução até 1×1; escolhe-se o nível mais próximo do tamanho na tela. **Trilinear** interpola entre níveis. Mais rápido que filtrar na hora; +33 % de memória.
- **Bump mapping [1/3]:** mapa de altura (cinza) perturba as **normais locais**; **não muda a geometria**, só a iluminação. **Environment mapping:** imagem do ambiente simula reflexos.
- **Aliasing:** discretizar perde informação (Nyquist: amostrar ≥ 2× a frequência); aumentar a resolução **não** elimina. Pré-filtragem e supersampling reduzem.

## 6. Perguntas-tipo (o professor pede "por quê" + "solução")
| Pergunta | Resposta objetiva |
|---|---|
| Por que a textura fica **borrada/ruidosa ao longe**? | Minificação: muitos texels por píxel. Sem filtro ⇒ aliasing; com mipmapping ⇒ níveis baixos (borrão). **Solução:** mipmapping/trilinear; em superfícies oblíquas, filtragem anisotrópica ⚠. |
| Por que **dois planos** iguais ficam diferentes? | Onde a luz é calculada: Gouraud (vértices) perde o brilho; Phong (fragmento) ou malha mais fina o reproduz. |
| Cubo com **faces pretas**/aberração | Vetor da luz com sinal errado (`l` deve ir da superfície para a luz); normais não transformadas/normalizadas. |
| Por que 1 vértice verde + 5 vermelhos dá **degradê**? | Interpolação linear dos atributos. Para áreas uniformes: vértices duplicados com a mesma cor (ou `flat`) ⚠. |
| **Como dar UV** a um cubo/dado/cena? | (s,t) por vértice no intervalo da célula da textura; repetir = ir além de 1 com REPEAT ⚠; vértices por face duplicados. |
| Por que **bump mapping** melhora a imagem? | Perturba as normais com o gradiente do mapa de altura, sem aumentar a geometria. |
| Objeto está **visível**? | Testa −w ≤ x,y,z ≤ w; indica qual plano (near/far/lados) falha e qual parâmetro da câmera ajustar. |

⚠ = não está no livro (aula/prática). Baixa prioridade: basta a ideia.
