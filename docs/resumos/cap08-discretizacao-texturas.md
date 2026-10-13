# Cap. 8 — Discretização e texturas (livro p. 85–111 do PDF)

> **Escopo da prova: só 8.3** (seções 2 e 3 abaixo). 🔗 Apoio: seção 1 (fragmento e interpolação) e seção 4 (aliasing). 🚫 Fora: Bresenham, scanline, Z-buffer, blending (no anexo).
> ⚠ As páginas 152–153 do livro (início da filtragem de textura) **não estão no PDF**; o texto retoma em 8.3.4.2 (p. 154, mipmapping).
> Aparece em **todas** as provas: UV (3/3) e filtragem/mipmapping (3/3).

## 1. 🔗 Fragmento e interpolação (base de 8.3)
- A rasterização amostra a primitiva e produz **fragmentos** = píxeis potenciais: posição (x,y), profundidade e cor (+ normal e coordenadas de textura).
- Os atributos dos vértices (cor, normal, uv) são **interpolados linearmente** ao longo do polígono. É daí que vem o degradê "1 vértice verde + 5 vermelhos".

## 2. Cálculo de cor no fragmento (8.3.1–8.3.3)
- **Constante:** mesma cor para todos os fragmentos da primitiva (cor do polígono, de um vértice ou média).
- **Gouraud:** iluminação (Blinn-Phong) já calculada nos **vértices**, no processamento geométrico; fragmentos recebem a cor **interpolada**; o andar de cor só repassa.
- **Phong:** fragmentos recebem a **normal interpolada**; o andar de cor aplica o modelo de reflexão **em cada fragmento**. Nº de cálculos = nº de fragmentos (Gouraud: nº de vértices) → mais caro, melhor.

## 3. Texturização (8.3.4)
- Textura = imagem de **texels**; espaço **(s,t) ∈ [0,1]²**, independente da resolução. Pode ser 1D, 2D ou 3D. Usada para cor, rugosidade, reflexos.
- **Mapeamento direto** (textura → objeto no mundo) × **inverso** (espaço do dispositivo → textura). O pipeline faz **inverso**: o fragmento calcula (s,t) e busca o texel.
- Em **perspetiva** o quadrado vira trapézio (encurtamento perspetivo): a textura deforma.
  - ⚠ *Não está no livro:* para não distorcer, (s,t) devem ser interpolados com correção de perspetiva (interpolar s/w, t/w, 1/w e dividir). Ligação com 7.3.4.
- ⚠ *Não está no livro:* coordenadas > 1 com `REPEAT` repetem a textura (nº de repetições = extensão do intervalo de uv).

### 3.1 Filtragem (8.3.4.2)
- **Minificação** (objeto longe, vários texels por píxel): usar 1 texel ⇒ **ruído/aliasing**. Solução: **média ponderada** dos texels cobertos (filtro 2×2 é comum).
- **Mipmapping** (*multum in parvo*), p. 154: **pré-filtragem** — cadeia de cópias com metade da resolução até 1×1; o sistema escolhe a cópia cuja resolução mais se aproxima do tamanho do objeto na tela; **filtro trilinear**.
  - ⚠ *Não está no livro:* trilinear = bilinear em 2 níveis + interpolação entre eles; em superfícies oblíquas o nível único borra ⇒ **filtragem anisotrópica**.
- ⚠ Magnificação (poucos texels): NEAREST = blocos; bilinear = suave.

### 3.2 Técnicas por textura (8.3.4.3–8.3.4.4)
- **Bump mapping:** 2ª textura em tons de cinza (**height map**); o **gradiente** perturba as **normais locais**; **não altera a geometria**, só a iluminação.
- **Environment mapping:** imagem do ambiente simula superfícies refletoras (aprox. barata vs ray tracing).

## 4. 🔗 Aliasing (8.5, só o conceito)
Discretizar um sinal contínuo perde informação (**Nyquist:** amostrar a ≥ 2× a frequência). Em CG: escada, texturas regulares "fundidas" ao longe. Aumentar a resolução **não** elimina. É o *porquê* do mipmapping (pré-filtragem). Outras técnicas: supersampling (pós-filtragem).

---
## Anexo 🚫 fora do escopo
- **Bresenham:** inteiros, ponto médio, `d = 2Δy−Δx`, `incE = 2Δy`, `incNE = 2(Δy−Δx)`; 1º octante.
- **Polígonos (scanline):** tabela de lados e de lados ativos, spans por pares, `x += 1/m`.
- **Z-buffer:** `se z_frag < zbuf(x,y)` escreve z e cor; só opacos.
- **Blending:** `C = α·C_src + (1−α)·C_dst`; depth cueing `C = f·C_obj + (1−f)·C_atm`.
