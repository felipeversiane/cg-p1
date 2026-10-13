---
description: Resolve a questão MVP (matrizes nomeadas, posição final, visibilidade) com a matrícula
argument-hint: "<2024p1|2024estudo|2025p1|livre> <matrícula>  — ou cole o enunciado"
---
Resolva a questão MVP. Entrada: $ARGUMENTS

1. Identifique a prova e a matrícula. Se faltar a matrícula ou o enunciado for novo, **pergunte**.
2. Aplique os PEGAS (inclusive **pivô da escala**: mostre as duas leituras e diga se muda a conclusão) do `CLAUDE.md` (FOV, pivô, sentido, ordem, target, up, near/far) e declare as suposições.
3. Calcule com o script, nunca de cabeça:
   - preset: `python3 -I tools/mvp.py --prova <prova> --matricula <matrícula>`
   - **pivô da escala não dito → compare as duas leituras:** acrescente `--ambos` (ou `--escala-pivo Origem|Centro` para uma só)
   - enunciado novo: `python3 -I -c "import sys; sys.path.insert(0,'tools'); from mvp import run; run([...pontos...], rot=('Z',60,'Centro'), escala=(2,'Centro'), desloc=(0,0,0), eye=(...), target='Centro', up=(0,1,0), fov=..., tipo='Vertical', largura=..., altura=..., near=..., far=...)"`
4. Responda no formato de MVP do `CLAUDE.md`: parâmetros → matrizes nomeadas (arredonde a 4 casas) → M, V, P, MVP → pontos no mundo e NDC → dentro/parcial/fora e qual plano falha.
5. Se pedirem para ajustar a câmera, teste a correção com o script e mostre o novo resultado.
6. Diga **como conferir na planilha** (células de `docs/impressao/tutorial-planilha.md`).
