# Folha do MVP — como usar a planilha `MVP_Excel_corrigido.xlsx`

**Convenção da planilha:** OpenGL · vetores coluna · `MVP = P·V·M` · `M = T·S·R` (rotação 1º, escala 2º, deslocamento 3º) · NDC em [−1, 1].
Abas: **Calculadora** (entrada e resultados) · **Matrizes** (todas as contas) · **Detalhes** (por que está dentro/fora).

## 1. Antes de mexer
1. Calcule **X** e **Y** pela regra da prova (ex.: X = último dígito, Y = penúltimo; ou `Y = (último mod 5) + 2`, `X = 8 − Y`).
2. Escreva as coordenadas finais de **A, B, C**.
3. Releia o enunciado para: **pivô** (central/centro × origem), **sentido** do ângulo (negativo = horário), **FOV** (vertical × horizontal) e **target**.

## 2. Preencher — somente as células amarelas (aba Calculadora)
| Enunciado diz… | Célula | Observação |
|---|---|---|
| Pontos A, B, C | `C8:E10` | x, y, z de cada vértice |
| Rotação em torno do eixo X/Y/Z | `C13` | sem rotação → **Nenhuma** |
| Ângulo | `C14` | em graus |
| Rotação em relação ao… | `C15` | **Centro** (centro do triângulo) ou **Origem** |
| Aumento/redução de escala | `C19` | 2 = dobro · 0,5 = metade · 1 = sem mudança |
| Escala em relação ao… | `C20` | **Centro** mantém o triângulo no lugar; **Origem** usa (0,0,0) |
| Deslocamento | `C25:E25` | somar a x, y, z; sem deslocamento → 0, 0, 0 |
| Posição do olho/câmera | `C30:E30` | x, y, z |
| Target da câmera | `C31` | **Origem** · **Centro** (centro final do triângulo) · **Manual** |
| Target manual (só se Manual) | `C32:E32` | x, y, z |
| Up vector | `C33:E33` | não pode ser paralelo à direção de visão |
| FOV | `C37` | em graus; `E37` = **Vertical** ou **Horizontal** (se não disser, assuma vertical e **declare**) |
| Largura × altura da janela | `C38` (largura), `E38` (altura) | define o aspect |
| Near / Far | `C39` / `E39` | `0 < near < far` |

## 3. Ler os resultados (aba Calculadora)
| O quê | Onde |
|---|---|
| Matriz **M** (transformações do objeto) | `G7:J10` |
| Matriz **MVP** final | `G13:J16` |
| Pontos finais no mundo (A, B, C) | `G20:I23` |
| Pontos **normalizados por w** (NDC) | `G27:I30` |
| **Visibilidade** (dentro / parcialmente / fora) | `G34` — a aba **Detalhes** explica o porquê |

Se aparecer **"—"** ou mensagem em vez de números, falta preencher algo ou há valor inválido (near ≤ 0, far ≤ near, FOV fora de 0–180).

## 4. O que escrever na prova (matrizes com nome) — aba Matrizes
| Nome | Conteúdo | Onde |
|---|---|---|
| `T(−c)`, `T(+c)` | levar o centro à origem / devolvê-lo | `B21`, `G21` (rotação) · `B45`, `G45` (escala) |
| `M_R` | rotação com pivô = `T(+c)·R·T(−c)` | `B28` |
| `S`, `M_S` | escala na origem / com pivô | `B38`, `B52` |
| `T` | deslocamento | `G59` |
| `M = T·M_S·M_R` | transformação do objeto | `B66` |
| `V` | View (lookAt) | `G86` |
| `P` | Projection (perspetiva) | `B93` |
| `MV = V·M` | intermediária | `G93` |
| `MVP = P·V·M` | final | `B100` |

**Posição final** = `MVP · (x, y, z, 1)ᵀ` → dividir por **w** → NDC. Pontos no mundo: `M · (x, y, z, 1)ᵀ`.

## 5. Visível? Como interpretar
- **Dentro** ⇔ para cada vértice `−w ≤ x, y, z ≤ w` (equivale a −1 ≤ NDC ≤ 1). Todos dentro → **visível**; alguns → **parcialmente** (recortado); nenhum → **fora**.
- `z_ndc > 1` → **além do far** · `z_ndc < −1` → **antes do near** · `w ≤ 0` → **atrás da câmera** · `|x_ndc|` ou `|y_ndc|` > 1 → **fora dos lados**.
- A planilha **não** calcula oclusão por outro objeto (isso é o Z-buffer).

## 6. "Modifique a câmera para ficar dentro do volume"
| Sintoma | Ajuste |
|---|---|
| além do far (`z_ndc > 1`) | aumentar **Far** (> distância ao vértice mais longe) ou aproximar a câmera |
| antes do near / atrás (`z_ndc < −1`, `w ≤ 0`) | diminuir **Near** ou **afastar** a câmera / posicionar o objeto à frente |
| fora dos lados | aumentar o **FOV** ou afastar a câmera / apontar o target ao centro |

Depois de mudar, confira `G34` na planilha. Em geral, **afastar o olho ao longo da direção de visão** e aumentar o far resolve tudo.

## 7. Armadilhas
- **FOV horizontal × vertical** (`E37`): erro comum de 1 linha.
- **Pivô** (`C15`, `C20`): Centro × Origem muda tudo. Se o enunciado **não diz** o pivô da escala, **teste os dois** em `C20`, compare `G34` e **declare a suposição** na resposta.
- **Target = Centro** usa o centro **após** as transformações do objeto.
- **Rotação negativa** gira no sentido horário.
- **Up paralelo à direção de visão** → câmera inválida.
- A ordem é **fixa**: rotação → escala → deslocamento. Se o enunciado pedir outra ordem, a planilha não serve diretamente (escreva `M` na ordem pedida).
