# Cap. 5 — Processamento geométrico (livro p. 43–64 do PDF)

> **Escopo da prova: capítulo inteiro.**

> **O capítulo da questão MVP.** Dois dialetos: o **livro** (câmara "mão esquerda", estilo Direct3D, z canônico [0,1]) e **OpenGL/WebGL** (mão direita, z canônico [−1,1]) — **a planilha usa OpenGL**. Os conceitos são os mesmos.
> ⚠ O PDF não contém o cap. 6 (recorte); o resumo de recorte abaixo vem só das seções 5.5.3.4 e 5.2.

## 1. Andares do processamento geométrico
Visualização → Iluminação (vértices) → **Projeção** → **Recorte** → (divisão perspetiva) → **Viewport**.

Espaços: **mundo** →(View)→ **câmara** →(Projeção)→ **recorte (clip, 4D homogêneo)** →(÷w)→ **NDC** →(Viewport)→ **dispositivo** (x,y píxel; z profundidade).

## 2. Câmara virtual simples
Parâmetros no mundo: **posição C (eye)**, **target** (ou vetor de visualização V = target − eye), **UP** (ou UP' aproximado, não paralelo a V; o sistema o projeta no plano de visualização).
Base da câmara (uvn):
```
n = V / |V|          (direção de visão normalizada)
UP = UP' − n (n·UP') ; v = UP/|UP|      (Gram-Schmidt)
u = n × v      (livro, mão esquerda)   |   OpenGL: s = f × up ; u = s × f
```
- Livro/Direct3D: câmara olha para **+z**, menor profundidade = mais perto.
- **OpenGL: câmara olha para −z**; near/far em z = −near / −far.

## 3. Volume de visualização
- **Janela de visualização**: retângulo 2ℓ × 2a no plano a distância d, centrado no eixo z (câmara "simples"; ℓ = meia largura, a = meia altura).
- **Ortogonal**: paralelepípedo; raios paralelos a V. **Perspetiva**: pirâmide com ápice em C → com near/far vira **frustum** (tronco de pirâmide).
- near/far: perspetiva → `0 < n < f`; ortogonal só `n < f`. near/far evitam objetos longínquos (pontos inúteis) e objetos colados à câmera.
- **FOV (abertura)**: `tg(θv/2) = a/d`, `tg(θh/2) = ℓ/d`. Aspect = ℓ/a = largura/altura. Reduzir o FOV = efeito telescópio (zoom).
  - Relação útil: `tg(θh/2) = aspect · tg(θv/2)`. **Se o enunciado diz "FOV horizontal 120°", converta ou use a opção "Horizontal" da planilha.**
- OpenGL pede: `fovy`, `aspect`, `near`, `far`.

## 4. Transformação de visualização (View)
Translação −C seguida de rotação que alinha os eixos com uvn (e, no livro, reflexão z por S(1,1,−1) para mão esquerda):
```
OpenGL:  V = | sx  sy  sz  −s·eye |       s = (f × up)/|…|, u = s × f, f = (target−eye)/|…|
             | ux  uy  uz  −u·eye |
             | −fx −fy −fz  f·eye |
             |  0   0   0    1    |
```
(Bate com as células G87:J90 da aba *Matrizes*.)

## 5. Projeção
### 5.1 Ortogonal (livro)
`N_ort = S(1/ℓ, 1/a, 1/(f−n)) · T(0,0,−n)` → leva o volume ao canônico: x,y ∈ [−1,1], z ∈ [0,1]. `w` continua 1 (homogeneização neutra).
(Exercício 5.3 do livro: a sequência correta é **translada −n em z primeiro** e depois escala por `1/ℓ, 1/a, 1/(f−n)`. Escreva a matriz como `S·T`, já que T age primeiro. Das alternativas B–E, só a **D** tem os fatores certos (`T(0,0,−n)` e `1/(f−n)`), mas o livro a escreve na ordem `T·S`; A não está legível no OCR — confira no PDF p. 63–64.)

### 5.2 Perspetiva (livro) — 2 passos
1. **Deformação perspetiva** (frustum → paralelepípedo, ordena profundidade sem perdê-la):
   `M_persp = | d 0 0 0 ; 0 d 0 0 ; 0 0 n+f −nf ; 0 0 1 0 |`  →  `z' = (n+f) − nf/z`  (não linear, mas **monótona**).
2. Normalização ortogonal `N_ort`. Total: `N_persp = N_ort · M_persp`.
- Projeção simples: `x_p = d·x/z`, `y_p = d·y/z` → **encurtamento perspetivo**; linhas preservadas, **paralelismo não**.
- **w ≠ 1** após a multiplicação (w = z); **divisão perspetiva** (÷w) devolve cartesianas.
- Projeção simples é **não invertível**; a versão com z preservado serve ao Z-buffer.

### 5.3 Perspetiva OpenGL (o que a planilha usa)
```
f = 1/tan(fovy/2)
P = | f/aspect 0   0              0              |
    | 0        f   0              0              |
    | 0        0  −(F+N)/(F−N)   −2FN/(F−N)      |
    | 0        0  −1              0              |
```
Tipo "Horizontal" na planilha: a célula da diagonal x vira `1/tan(fov/2)` e a de y multiplica por aspect.

## 6. Recorte e divisão perspetiva
- Volume canônico (OpenGL): **−w ≤ x,y,z ≤ w** em clip space (equivale a −1 ≤ x/w,y/w,z/w ≤ 1 em NDC). É exatamente o teste da aba *Matrizes* (`x+w`, `w−x`, `y+w`, `w−y`, `z+w`, `w−z` ≥ 0).
- Recorte é feito **antes** da divisão (divisão é cara). **Obrigatório** recortar contra o plano *near* antes de dividir: ponto com z<0 e w<0 viraria z>0 e reapareceria na frente da câmera.
- Resultado: **Dentro** (todos os 6 planos OK), **Parcialmente** (recorte), **Fora** (rejeitado). Oclusão por outro objeto é outra coisa (Z-buffer).

## 7. Viewport
Converte NDC → píxeis: `x_s = x_min + (x_ndc + 1)·(Δx)/2` (idem y); z mantém [0,1].
`M_vp = T(xmin,ymin,0) · S(Δx/2, Δy/2, 1) · T(1,1,0)`.

## 8. Exercícios do livro
5.1 FOV vertical 90°, d=20, aspect 4/3 → `a = d·tg45° = 20`, altura 40, largura 53,3; 800 de largura ⇒ altura **600** (mantém aspect, evita distorção). 5.2 View para C=(1,2,7), target (1,2,0), UP (0,1,0): translação T(−1,−2,−7) e rotação (n = (0,0,−1)).
