# Cap. 2 — Conceitos fundamentais (livro p. 1–24 do PDF)

> **Escopo da prova: 2.2 a 2.6.** A seção 5 abaixo (cor, 2.7) está **fora**.

> Capítulo mais "decoreba" e menos provável de cair nas questões práticas. Foco: **pipeline**, **framebuffer**, **janela × viewport**, **modelos de cor**.

## 1. Dispositivos e arquitetura raster
- **Vetorial**: geometria em domínio contínuo (pontos extremos, centro+raio...). **Raster (matricial)**: domínio discreto, matriz de píxeis; resolução = horiz × vert. Converter contínuo→discreto causa **aliasing**.
- **Interativo**: resposta < **0,1 s**.
- Placa gráfica raster = 3 blocos: **GPU** (gera a imagem a partir de comandos), **memória de imagem / framebuffer** (guarda píxeis), **controlador de vídeo** (lê o framebuffer e gera o sinal para o monitor). Mais um **controlador de memória** que arbitra o acesso GPU × vídeo e faz refresh da DRAM.
- **Profundidade do píxel (N bits)** → nº máx. de cores simultâneas.
  - *True Color*: 24 bits (R,G,B de 8 bits) → 16 M cores. 1280×1024×24 bits = **3,75 MB**.
  - *Cor indexada*: píxel = índice numa **lookup table** → ex.: 256 cores simultâneas, 1280×1024×8 bits = 1,25 MB (+ tabela 256×24 bits).
- Tearing / fluidez: VRAM (2 portas) → **double buffering** → **triple buffering** + sincronização FPS × frequência do monitor (60–75 Hz).

## 2. Aplicações 3D e descrição de cena
- API gráfica **baixo nível**: OpenGL, Direct3D, WebGL (falam com drivers). **Alto nível**: Java3D, OpenInventor, Unity, Unreal.
- Cena = **objetos** (geometria + atributos) + **fontes de luz**.
- Atributos de cor: (1) RGB nos vértices (ignora luzes); (2) **material** + modelo de iluminação; (3) **coordenadas de textura**.
- **Grafo de cena**: árvore; nós internos têm matrizes/atributos herdados; folhas têm o objeto em coordenadas locais. A composição das matrizes da raiz até a folha posiciona o objeto no **sistema de coordenadas do mundo**.
- Pistas 3D numa imagem 2D: **oclusão**, **gradiente de cor**, **sombra**. Estereoscopia/paralaxe = duas câmaras.

## 3. Janela de visualização × viewport
- **Janela de visualização**: retângulo na cena por onde "capturamos" o que interessa. **Viewport (canvas)**: área do ecrã onde a imagem é desenhada (≈ tamanho da foto).
- **Relação de aspeto** (largura/altura) do viewport deve ser **igual** à da janela → senão há distorção.

## 4. Pipeline de visualização (decorar a ordem!)
1. Lógica da aplicação → 2. geração de primitivas simples (pontos, linhas, polígonos convexos; tesselação) →
3. **Transformação de visualização** (mundo→câmara) → 4. **Iluminação nos vértices** → 5. **Projeção** → 6. **Recorte** → 7. **Viewport** →
8. **Rasterização** (fragmentos) → 9. **Cálculo de cor do fragmento** → 10. **Composição** (z-buffer, blending) → píxeis.

| Bloco | Andares | Faz |
|---|---|---|
| Aplicação | 1–2 | lógica, colisões, navegação; gera primitivas simples |
| **Processamento geométrico** | 3–7 | mundo → coordenadas do dispositivo (x,y = píxel; z = profundidade) |
| **Discretização** | 8–10 | primitivas → píxeis com cor |

- GPUs só aceleram **triângulos** em hardware.
- **Gargalo = discretização** (nº de píxeis e acessos à memória), não a geometria.
- Pipeline (tempo real, compromisso FPS×realismo) × **fotorrealismo/ray tracing** (qualidade máx., reflexões múltiplas, lento).

## 5. Cor
- **Teoria dos 3 estímulos** (3 tipos de cones; 400 nm–700 nm).
- **RGB** aditivo (ecrãs): cubo unitário; preto (0,0,0), branco (1,1,1), cinzas na diagonal. **sRGB** normaliza primárias + gama.
- **CMY** subtrativo (impressoras): `[R,G,B] = [1,1,1] − [C,M,Y]`; branco (0,0,0), preto (1,1,1). **CMYK** não é modelo: só acrescenta tinteiro preto (K).
- **HSV / HSL**: mais intuitivos. H = matiz (ângulo, 60° entre primárias), S = saturação, V = valor / L = luminosidade. HSV = pirâmide hexagonal; HSL = duas pirâmides (L=0,5 nas primárias).
- **YC'bC'r (YUV)**: luma `Y' = 0,299R + 0,587G + 0,114B`; crominâncias = diferenças. Usado em TV e **JPEG** (olho é mais sensível à luminância → comprime a crominância).
- **CIE XYZ**: cobre todo o espectro visível; **diagrama de cromaticidade** (x,y; z = 1−x−y). Triângulo de 3 primárias **nunca** cobre todas as cores visíveis.

## Exercícios do livro (cap. 2)
2.1 blocos da arquitetura raster · 2.2 janela × viewport · 2.3 blocos do pipeline · 2.4 framebuffer · 2.5 modelo de cor para laser monocromática (→ só níveis de cinza/preto: modelo com **luminância/K**; CMY não é necessário).
