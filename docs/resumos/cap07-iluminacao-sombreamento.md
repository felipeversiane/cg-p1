# Cap. 7 — Iluminação e sombreamento (livro p. 65–84 do PDF)

> **Escopo da prova: 7.1, 7.2.1–7.2.3 e 7.3.** **🔗 Apoio:** 7.2.4 (soma dos 3 termos). **🚫 Fora:** 7.2.5–7.2.8 (aproximação de Blinn, atenuação, luz cromática, múltiplas fontes) — as linhas correspondentes abaixo estão marcadas.

> Aparece na prova teórica (2024 Estudo Q1 "dois planos", 2025 Q3 "cubo aberração", Phong × Gouraud).

## 1. Fontes de luz
| Tipo | Posição | Atenuação c/ distância | Direção |
|---|---|---|---|
| **Ambiente** | não tem | não | não tem; intensidade constante |
| **Direcional** | no infinito (raios paralelos) | não | sim (ex.: Sol) |
| **Pontual** | sim | **sim** | todas as direções |
| **Spotlight** | sim | sim | cone de abertura θ; atenuação radial ~cos^p φ |

## 2. Modelo local de Blinn-Phong
Modelo **local**: só luz direta das fontes; **sem** sombras, reflexões múltiplas (isso é iluminação global/ray tracing). A **luz ambiente** aproxima as reflexões múltiplas (sem ela, partes não iluminadas ficam pretas).

```
I = ka·La  +  kd·Ld·max(n·l, 0)  +  ks·Ls·max(r·v, 0)^α      (🔗 7.2.4: soma dos 3 termos)
(β e h = versão de Blinn, 🚫 fora)
```
- `n` normal (unitária); `l` vetor **da superfície PARA a luz**; `v` para o observador; `r` reflexo perfeito.
- **Ambiente**: `Ia = ka La` — uniforme.
- **Difusa (Lambert)**: `Id = kd Ld cosθ = kd Ld max(n·l,0)` — **independe do observador**; max evita luz "por baixo" do horizonte.
- **Especular**: `Is = ks Ls max(r·v,0)^α` — depende do observador; **α (brilho/shininess)** alto = brilho pequeno e concentrado (metal polido 100–500).
- 🚫 *(fora: 7.2.5)* **Aproximação de Blinn**: halfway `h = (l+v)/|l+v|`, usa `(n·h)^β` (evita calcular r). β ≠ α (β ≈ 4α) para ter brilho parecido.
- 🚫 *(fora: 7.2.6)* **Atenuação**: dividir termos difuso+especular por `a + b·d + c·d²` (ambiente **não** atenua). ≠ *depth cueing* (atenuação atmosférica, cap. 8).
- 🚫 *(fora: 7.2.7–7.2.8)* **RGB**: aplica-se o modelo a cada canal (k e L por canal). **Várias luzes**: soma (luz é aditiva).

## 3. Sombreamento (shading) — como colorir os fragmentos
| | **Constante (flat)** | **Gouraud** | **Phong** |
|---|---|---|---|
| Cálculo de iluminação | 1× por polígono | **por vértice** | **por fragmento** |
| Interpola | nada | **cor** (dupla interpolação linear) | **normal** (renormalizar) |
| Normal usada | do polígono | média das normais dos polígonos que partilham o vértice | interpolada |
| Custo | menor | médio | maior |
| Qualidade | facetado, **bandas de Mach** | liso; **perde/espalha brilho especular** | brilhos corretos |

- **Bandas de Mach**: inibição lateral do olho realça contornos entre polígonos de intensidade diferente.
- Gouraud erra o especular porque só vê as cores nos vértices (brilho no meio do polígono some; ou alarga demais).
- **Limitações (dos interpolados)**: silhueta poligonal; **distorção de perspetiva** (interpola linearmente no espaço do ecrã, não no do mundo); orientação do polígono altera o resultado; vértices não partilhados; normais de vértice incorretas (falso alisamento → subdividir).

## 4. ⚠ Fora do livro, mas caiu em prova (2025 Q3, Q4)
- **Normal por face × por vértice**: cubo com arestas vivas → 24 vértices (4 por face), cada um com a normal da **face** (flat). Se partilha 8 vértices com normal média → cubo "arredondado".
- **Normal Matrix**: ao rodar/escalar o objeto, a normal se transforma por `transpose(inverse(mat3(Model)))` (e renormaliza). Esquecer = iluminação errada ao girar.
- **Sinal do vetor de luz**: `L = normalize(lightPos − fragPos)`. Invertido ⇒ `n·L<0` em metade das faces ⇒ preto/"pirâmide".
- **Fragment shader**: normais interpoladas precisam de `normalize()`.
