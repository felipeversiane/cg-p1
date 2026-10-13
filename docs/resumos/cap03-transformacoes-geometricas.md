# Cap. 3 — Transformações geométricas (livro p. 25–42 do PDF)

> **Escopo da prova: 3.1 a 3.5.** Modelação hierárquica/grafo de cena (3.6) está no **anexo** no fim do arquivo (🚫 fora).

> **Alto risco de prova** (Questão MVP vale 5,0 pts em 2024). Aqui está a base da conta no computador.

## 1. Transformações elementares (2D → 3D, coord. homogêneas)
Todo ponto vira `(x, y, z, 1)ᵀ` (vetor coluna). Assim **translação também vira multiplicação de matriz** e dá para compor tudo em **uma matriz**.

```
T(dx,dy,dz) = | 1 0 0 dx |    S(sx,sy,sz) = | sx 0  0  0 |
              | 0 1 0 dy |                  | 0  sy 0  0 |
              | 0 0 1 dz |                  | 0  0  sz 0 |
              | 0 0 0 1  |                  | 0  0  0  1 |

Rz(β) = | cosβ -senβ 0 0 |   Rx(β) = | 1 0    0     0 |   Ry(β) = |  cosβ 0 senβ 0 |
        | senβ  cosβ 0 0 |           | 0 cosβ -senβ 0 |           |   0   1  0   0 |
        |  0     0   1 0 |           | 0 senβ  cosβ 0 |           | -senβ 0 cosβ 0 |
        |  0     0   0 1 |           | 0  0     0   1 |           |   0   0  0   1 |
```
(sentido **anti-horário / direto**, referencial de mão direita; note o **sinal trocado de sen em Ry**.)

- **Translação** e **rotação**: preservam comprimento e ângulos (*corpo rígido*). **Escala**: só preserva ângulos se uniforme (sx=sy=sz); fatores negativos = reflexão.
- **Escala e rotação são relativas à ORIGEM** → objeto fora da origem "anda".
- **Inversas**: `T⁻¹(d) = T(−d)`; `S⁻¹(s) = S(1/s)`; `R⁻¹(β) = R(−β) = Rᵀ(β)`.

## 2. Composição
- Aplicar T₁ depois T₂ depois T₃ ⇒ **`M = T₃ · T₂ · T₁`** (a matriz do **primeiro** passo fica **mais à direita**). Multiplicação **não é comutativa**.
- Calcula-se **M uma vez** e aplica-se a todos os vértices (eficiência).

## 3. Receitas com pivô (muito cobrado)
- **Rotar em torno de um ponto C**: `M = T(+C) · R(β) · T(−C)`
- **Escalar mantendo o centro C no lugar**: `M = T(+C) · S(s) · T(−C)`
- "Rotação em torno do eixo Z **central/no centro do triângulo**" ⇒ C = **centróide** = média dos 3 vértices.
- "Aumento do objeto em dobro" ⇒ S(2,2,2). Em dúvida do pivô: **diga explicitamente** na prova qual assumiu (livro: escala é relativa à origem; "mantendo o centro" exige T(C)·S·T(−C)).

## Exercícios do livro (cap. 3)
3.1–3.4 composição e não-comutatividade (T·R·S ≠ S·R·T) · 3.5–3.7 transformar triângulo 3D em outro · 3.8–3.9 bicicleta (referencial da roda dentro do da bicicleta: é hierarquia, tema de 3.6 → provavelmente 🚫 fora).

---
## Anexo 🚫 fora do escopo (3.6 — modelação hierárquica)
### 4. Modelação hierárquica e grafo de cena
- Peças modeladas na origem (coord. locais) e posicionadas por uma **transformação de instanciação**.
- Filho herda a matriz do pai: `M_braço = M_base · T(0,h_base,0) · Rz(α)`; `M_antebraço = M_braço · T(L_braço,0,0) · Rz(−β)`.
- Girar a base arrasta tudo; girar o antebraço só ele.
- **Grafo de cena** = grafo acíclico de nós/arcos que guarda objetos + transformações. Primitivas **unitárias** (cubo/cilindro de lado 1) viram peças por escala + translação de metade do comprimento.

