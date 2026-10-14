# Questão MVP do triângulo — passo a passo (parte no computador)

Todas as provas (2024 Estudo, 2024 P1, 2025 P1) têm essa questão e ela é a mais pesada (5,0 pts em 2024). A planilha `MVP_Excel_corrigido.xlsx` faz a conta; **a prova cobra que você apresente as matrizes intermediárias nomeadas**, o resultado final e a interpretação.

> **Convenção: OpenGL** (câmera olha para −z, NDC z ∈ [−1,1], vetores coluna, `MVP = P·V·M`) — a mesma da planilha. Matrícula **sempre parametrizada**: `python3 tools/mvp.py --prova 2025p1 --matricula <sua>`.

## 0. Antes de tudo
1. **Calcule X e Y da sua matrícula** (2024: X = último dígito, Y = penúltimo; 2025: `Y = (último dígito mod 5) + 2`, `X = 8 − Y`).
2. Escreva as coordenadas finais dos 3 vértices.
3. **Leia o que diz "central/centro/origem"** — define o pivô da rotação e da escala.

## 1. Mapeamento enunciado → células da planilha (aba *Calculadora*)
| Enunciado | Onde preencher | Cuidado |
|---|---|---|
| Pontos A, B, C | `C8:E10` (x,y,z de A, B, C) | |
| "Rotação em torno do eixo Z/X/Y por θ" | `C13` eixo, `C14` ângulo | sentido anti-horário positivo; "−60°" = horário |
| "…em relação ao ponto central do triângulo" | `C15` = **Centro** | senão **Origem** |
| "Aumento em dobro" / "escala 0,5" | `C19` = 2 / 0,5 | `C20` pivô: Centro (mantém o triângulo no lugar) ou Origem |
| "Deslocamento no eixo X em 2" | `C25:E25` = (2,0,0) | |
| "Posição do olho/câmera" | `C30:E30` | |
| "Target é o centro do triângulo / a origem" | `C31` = Centro / Origem | centro = **após** as transformações do modelo |
| "Up vector" | `C33:E33` | não pode ser paralelo à direção de visão |
| "FOV 60°" | `C37`; `E37` = Vertical/Horizontal | **se disser "horizontal" escolha Horizontal**; se não disser, assuma vertical (OpenGL `fovy`) e **declare isso** |
| Largura × altura da janela | `C38` (largura), `E38` (altura) | aspect = L/A |
| near / far | `C39` / `E39` | far > near > 0 |

Saídas: `M` (G7:J10…), `MVP` (G13:J16), pontos no mundo (G20:I23), **pontos normalizados por w** (G27:I30), **visibilidade** (G34 → aba *Detalhes* explica).

## 2. Ordem das matrizes (o que escrever na prova)
```
M   = T · S · R            (rotação 1º, escala 2º, deslocamento 3º; o mais à direita age primeiro)
 R  = T(+c) · Rz(θ) · T(−c)  (se pivô = centro c = (A+B+C)/3)
 S  = T(+c') · S(s) · T(−c') (c' = centro após a rotação)
 V  = View (lookAt: eye, target, up)
 P  = Projection (perspectiva: fov, aspect, near, far)
MVP = P · V · M            → clip = MVP · (x,y,z,1)ᵀ → NDC = clip / w
```
Dê **nome** a cada uma: `T_centro⁻¹`, `R_z(60°)`, `T_centro`, `M_rot`, `S_centro`, `M`, `V`, `P`, `MVP` (a aba *Matrizes* mostra todas, copie dali).

## 3. Interpretação da visibilidade
Em clip space um vértice está dentro se **−w ≤ x,y,z ≤ w** (equivalente a −1 ≤ NDC ≤ 1).
- **Todos dentro** → totalmente visível. **Alguns** → *parcialmente visível* (será recortado). **Nenhum e triângulo fora do volume** → não visível.
- `z_ndc > 1` → **além do far**; `z_ndc < −1` → **antes do near**; `w ≤ 0` → **atrás da câmera**.
- Oclusão (um objeto na frente do outro) **não** é decidida aqui — é o Z-buffer. Na 2025 a pergunta "visíveis, oclusos ou parcialmente visíveis" quer: dentro/fora do **volume de visualização** primeiro.

## 4. "Modifique a câmera para o triângulo ficar totalmente dentro"
Diagnostique pelos NDC e corrija **o parâmetro que estourou**:
| Sintoma | Correção |
|---|---|
| z_ndc > 1 (além do far) | aumentar **far** (> distância ao vértice mais longe) **ou** aproximar a câmera |
| z_ndc < −1 / w ≤ 0 | diminuir **near** ou **afastar** a câmera / mover o objeto para frente da câmera |
| \|x\| ou \|y\| > 1 | aumentar o **FOV** ou afastar a câmera (ou apontar o target ao centro do triângulo) |

Dica: afastar a câmera ao longo da direção de visão (mantendo o target) e fixar far = distância máxima + folga costuma resolver tudo de uma vez. Verifique de novo na planilha.

## 5. Validação independente (script)
`tools/mvp.py` replica a planilha (mesma convenção; `--demo` reproduz o estado atual da planilha, MVP linha 1 = `−0.6402 0.6402 0 2.1339`) e **recorta o triângulo** contra os 6 planos para dizer Dentro/Parcial/Fora:

```python
import sys; sys.path.insert(0, "tools")
from mvp import run
X, Y = 5, 7   # <- seus dígitos
run([(2,3,Y), (-2,X,Y), (-3,-2,Y)],           # prova 2024 P1
    rot=("Z", 60, "Centro"), escala=(2, "Centro"),
    eye=(3,0,15), target="Centro", up=(0,1,0),
    fov=120, tipo="Horizontal", largura=2048, altura=1024, near=1, far=10)
```

## 6. Mapa de resultados por matrícula (calculado com o script)
**2024 P1** — D=dentro, P=parcial, F=fora; linhas = Y (penúltimo), colunas = X (último) de 0 a 9:
```
        X: 0123456789
Y=0:       FFFFFFFFFF
Y=1:       FFFFFFFFFF
Y=2:       FFFFFFFFFP
Y=3:       FFFFFFPPPP
Y=4:       FFFPPPPPPP
Y=5..6:    PPPPPPPPPP
Y=7:       DDPPPPPPPP
Y=8:       DPPPPPPPPP
Y=9:       PPPPPPPPPP
```
(Intuição: o eye está em z=15 e o far=10; o triângulo está em z=Y ⇒ distância ≈ 15−Y. Só entra no volume quando 15−Y ≲ 10, i.e., Y ≳ 5.)

**2024 Estudo** (eye (3,32,1), fov 60°, far 25, triângulo em z=2; X,Y = último/penúltimo): quase sempre **parcial**; só fora para Y baixo e X baixo (X ≤ 3 com Y ≤ 3…).
⚠ Nesta prova o **eye (3,32,1) está quase em cima do triângulo olhando para baixo**, quase paralelo ao Up (0,1,0) → lookAt é mal condicionado (cuidado ao justificar o Up).

**2025 P1** (Y = 2…6): T e U ficam **fora do volume em todos os casos** com a leitura "rotação/escala em torno da origem para T; centro para U". Em T, z_ndc ≈ 1,05 → **além do far=6** (distância ≈ 6,8); em U, três vértices têm w<0 ou x,y,z fora. Correção (testada com o script para Y=2…6): **só aumentar o far resolve T** (far = 14 já basta para Y=3,4,5; Y=2 e 6 ficam parciais), mas **U continua fora** porque parte dele está *atrás/ao lado* da câmera (z < −5). É preciso **recuar a câmera**: `eye=(0,0,−20), far=30` deixa T dentro e U dentro (Y=3,4,5; parcial em Y=2,6); `eye=(0,0,−25), far=40` deixa **ambos dentro para todo Y = 2…6**.

## Oclusão (um triângulo na frente do outro)
A planilha **não** calcula, mas dá os NDC dos dois (`G27:I30` de cada). Método (é o Z-buffer à mão):
1. **Cada triângulo está no volume?** Fora ⇒ não aparece, logo não há oclusão a discutir. Com `w ≤ 0` o teste não vale (recorte antes).
2. **Sobrepõem-se na tela?** Compare **(x_ndc, y_ndc)** dos dois: caixas que não se tocam ⇒ sem oclusão. Se tocam, veja se algum vértice de um cai dentro do outro (ou se as arestas se cruzam).
3. **Na região comum, quem tem o menor z_ndc?** Menor z = mais perto = **oculta** o outro (mesmo critério do Z-buffer, livro 8.4).
4. **Conclusão por triângulo:** nenhuma área coberta ⇒ *visível*; parte coberta ⇒ *parcialmente oculto*; tudo coberto ⇒ *oculto*. Se os planos se cruzam (z muda de ordem), há trechos de cada um.

No script: `python3 -I tools/mvp.py --prova 2025p1 --oclusao [--olho X Y Z] [--far F]`. Ele amostra a tela, compara o z_ndc interpolado e informa a % de cada triângulo oculta. **Com a matrícula do aluno e a câmera do enunciado, T e U ficam fora do volume** (então "não visíveis"); com o olho recuado (0,0,−25) e far 40 ambos entram e **não se sobrepõem** na tela.
