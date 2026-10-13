# Cap. 7 — Iluminação e sombreamento (livro p. 65–84 do PDF)

> **Escopo da prova: 7.1, 7.2.1–7.2.3 e 7.3.** 🔗 Apoio: 7.2.4. 🚫 Fora: 7.2.5–7.2.8 (no anexo, fim do arquivo).
> Apareceu em prova: 2024 Estudo Q1' (dois planos, Gouraud × Phong), 2025 Q3 (Lambert, vetor de luz).

## 1. Fontes de luz (7.1)
| Tipo | Posição | Atenuação c/ distância | Direção |
|---|---|---|---|
| **Ambiente** | não tem | não | não tem; intensidade constante |
| **Direcional** | no infinito (raios paralelos) | não | sim (ex.: Sol) |
| **Pontual** | sim | **sim** | todas as direções |
| **Spotlight** | sim | sim | cone de abertura θ; atenuação radial ~cos^p φ |

## 2. Modelo local de reflexão (7.2.1–7.2.3)
Modelo **local**: só a luz que vem direto das fontes; **sem** sombras nem reflexões múltiplas (isso é iluminação global / ray tracing). A **luz ambiente** aproxima as reflexões múltiplas — sem ela, o que não recebe luz direta fica preto (fig. 7.4).

- `n` normal unitária; `l` vetor **da superfície PARA a luz**; `v` para o observador; `r` reflexo perfeito de `l`.
- **Ambiente (7.2.1):** `Ia = ka·La` — uniforme, sem direção.
- **Difusa / Lambert (7.2.2):** `Id = kd·Ld·cosθ = kd·Ld·max(n·l, 0)` — **independe do observador**; `max` evita luz "por baixo" do horizonte. kd alto = clara, kd baixo = escura.
- **Especular (7.2.3):** `Is = ks·Ls·max(r·v, 0)^α` — depende do observador. **α (brilho)** alto = feixe estreito, brilho pequeno e intenso (metal polido 100–500); α baixo = brilho grande e difuso. Especular perfeita = α → ∞.
- 🔗 **7.2.4 (apoio):** `I = ka·La + kd·Ld·max(n·l,0) + ks·Ls·max(r·v,0)^α` — é isto que Gouraud calcula nos vértices e Phong em cada fragmento.

## 3. Sombreamento (7.3) — como colorir os fragmentos
| | **Constante (flat)** | **Gouraud** | **Phong** |
|---|---|---|---|
| Iluminação calculada | 1× por polígono | **por vértice** | **por fragmento** |
| Interpola | nada | **cor** (dupla interpolação linear: arestas e depois linha de varrimento) | **normal** (renormalizar) |
| Normal | do polígono | média das normais dos polígonos que partilham o vértice | interpolada |
| Custo | menor | médio | maior |
| Resultado | facetado, **bandas de Mach** | liso; **perde/alarga brilho especular** | brilhos corretos |

- **Bandas de Mach:** inibição lateral do olho realça as fronteiras entre polígonos de intensidade diferente.
- Gouraud erra o especular porque só enxerga cores nos vértices: o *hot spot* no meio do polígono some (fig. 7.20).
- **Limitações (7.3.4):** silhueta poligonal; **distorção de perspetiva** (interpola linearmente no espaço do ecrã, não no do mundo); a orientação do polígono altera o resultado; vértices não partilhados; normais de vértice incorretas (falso alisamento). Remédio comum: subdividir/tesselar.

## 4. Ligações com o que caiu em prova (não está no livro → só a ideia)
- **Sentido de `l`:** da superfície para a luz (7.2.2). Invertido ⇒ `n·l < 0` ⇒ `max` zera ⇒ faces pretas.
- **Cubo com arestas vivas:** normal da face em cada vértice (flat, 7.3.1) é o correto; normais médias arredondam.
- **Normal ao girar o objeto:** transformar também as normais (normal matrix) e renormalizar.

---
## Anexo 🚫 fora do escopo (7.2.5–7.2.8)
- **7.2.5 Aproximação de Blinn:** `h = (l+v)/|l+v|`, usa `(n·h)^β` no lugar de `(r·v)^α` (evita calcular `r`); β ≈ 4α dá brilho parecido.
- **7.2.6 Atenuação:** dividir difusa+especular por `a + b·d + c·d²`; ambiente **não** atenua. ≠ *depth cueing* (cap. 8).
- **7.2.7 Luz/materiais cromáticos:** aplicar o modelo em cada canal RGB.
- **7.2.8 Várias fontes:** somar as contribuições (luz é aditiva).
