# Resultados com a minha matrícula — 20221060140130

Último dígito **0**, penúltimo **3**. Convenção OpenGL. Gerado com `make mvp PROVA=… [--ambos]` (`tools/mvp.py`).

| Prova | Regra | Valores |
|---|---|---|
| 2024 Estudo e 2024 P1 | X = último, Y = penúltimo | **X = 0, Y = 3** |
| 2025 P1 | `Y = (último mod 5) + 2`, `X = 8 − Y` | **Y = 2, X = 6** |

## Pontos e visibilidade (câmera do enunciado)
| Prova | Pontos | Escala em torno de **Origem** | Escala em torno de **Centro** | Diagnóstico |
|---|---|---|---|---|
| **2024 Estudo** | A(−2.5,−2.5,2) B(0,3,2) C(−2.5,2.5,2) | **Fora** | **Fora** | z_ndc ≈ 1.00–1.03 → além do far (25); w máx ≈ 35 |
| **2024 P1** | A(2,3,3) B(−2,0,3) C(−3,−2,3) | **Parcial** | **Fora** | z_ndc ≈ 1.03–1.06 → além do far (10); w máx ≈ 13 |
| **2025 P1 — T** | A(2,6,3) B(6,3,2) C(3,2,6) | Fora | Fora | z_ndc ≈ 1.02–1.11 → além do far (6) |
| **2025 P1 — U** | A(−3,−6,−2) B(−6,−2,−3) C(−2,−3,−6) | Fora | Fora | w ≤ 0 em B e C (atrás da câmera); A com y_ndc < −1 |

⚠ **A 2024 P1 muda de conclusão conforme o pivô da escala** (parcial × fora). Calcule as duas leituras, declare a suposição e recomende Centro ("aumento do **objeto**"). Os números das matrizes também mudam.

## Correção da câmera (testada com o script)
| Prova | Ajuste mínimo | Resultado |
|---|---|---|
| 2024 Estudo | **far ≥ 36** (mantendo o resto) | Dentro, nas duas leituras de pivô |
| 2024 P1 | **far ≥ 14** (mantendo o resto) | Dentro (Origem já em far = 12) |
| 2025 P1 | **recuar a câmera**, ex.: olho (0,0,−25) e far = 40 (só aumentar o far não resolve U) | T e U dentro |

## Pegas específicos desta matrícula
- Último dígito **0**: em 2025, `0 mod 5 = 0` → **Y = 2**, X = 6 (não confundir com o 2024, em que Y = 3).
- Em 2024, **X = 0** deixa B = (0, 3, 2) na prova Estudo e B = (−2, 0, 3) na P1: confira onde X e Y entram.
- 2024 Estudo: olho (3, 32, 1) quase paralelo ao Up (0,1,0); o lookAt funciona, mas diga que o Up está quase alinhado.
