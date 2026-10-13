# Classificação dos cards (aplicação da regra)

Regra em [escopo-e-prioridade.md](escopo-e-prioridade.md) §2. Colunas: *seção* do livro · *escopo* · *tema que precisa do card* · *freq.* (nº de provas em que o tema caiu) · *no livro?* · *nível final*.

| Card | Seção | Escopo | Tema que precisa do card | Freq. | No livro? | Nível |
|---|---|---|---|---|---|---|
| 📘 Por que usar coordenadas homogêneas? | 3.3 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Ordem da composição: aplicar T₁, depois T₂, depois T₃ — qual é M? | 3.5 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Matriz para rodar em torno de um ponto C? | 3.5.1 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Escreva Rz(θ), T(dx,dy,dz), S(s). | 3.3–3.4 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 O que é MVP e em que ordem se multiplica? | 5.3–5.5 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Parâmetros da câmara virtual simples? | 5.2 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Como se calcula a base da câmera (lookAt)? | 5.2.1, 5.4 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Matriz de projeção perspetiva (OpenGL)? | 5.5.3 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Por que w ≠ 1 depois da projeção e o que é a divisão perspetiva? | 5.5.3 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Condição de visibilidade em clip space? | 5.5.3.4 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Por que recortar o plano near antes da divisão perspetiva? | 5.5.3.4 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Relação FOV, janela e distância? | 5.2.2 | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘 Exercício 5.1: fov vertical 90°, d=20, aspect 4/3. | 5.2.2 (ex. 5.1) | dentro | MVP do triângulo | 3/3 | sim | 🔴 |
| 📘📝 O que é mipmapping, e o que é trilinear? | 8.3.4.2 | dentro | Filtragem de textura | 3/3 | sim | 🔴 |
| 📝⚠ Magnificação × minificação? | 8.3.4.2 | dentro | Filtragem de textura | 3/3 | sim | 🔴 |
| 📘📝 Como se define a coordenada de textura (s,t) de um vértice? | 8.3.4.1 | dentro | Coordenadas de textura (UV) | 3/3 | sim | 🔴 |
| 📝⚠ Qual o defeito do mipmapping e a solução? | 8.3.4.2 (anisotrópico: fora do livro) | dentro | Filtragem de textura | 3/3 | **não** | 🟠 |
| 📝⚠ Por que atlas de textura exige vértices duplicados? | 8.3.4.1 (vértices duplicados: fora do livro) | dentro | Coordenadas de textura (UV) | 3/3 | **não** | 🟠 |
| 📘📝 Constante × Gouraud × Phong? | 7.3.1–7.3.3, 8.3.1–8.3.3 | dentro | Gouraud × Phong | 2/3 | sim | 🟠 |
| 📝⚠ Por que "1 verde + 5 vermelhos" gera degradê? | 8.3.2 (+ 8.2) | dentro | Gouraud × Phong (cor interpolada) | 2/3 | sim | 🟠 |
| 📝⚠ O que acontece com (s,t) fora de [0,1] — e como repetir a textura? | (não está no livro) | dentro | Coordenadas de textura (UV) | 3/3 | **não** | 🟠 |
| 📘 Limitações do shading interpolado (cite 2). | 7.3.4 | dentro | Distorção em perspetiva (2025 Q2a) | 1/3 | sim | 🟡 |
| 📝⚠ Qual o sentido do vetor L (luz) no Lambert? | 7.2.2 | dentro | Lambert (2025 Q3) | 1/3 | sim | 🟡 |
| 📝⚠ Cubo com arestas vivas: normais por vértice ou por face? | 7.3.1 | dentro | Lambert (2025 Q3) | 1/3 | sim | 🟡 |
| 📘 Bump mapping × environment mapping? | 8.3.4.3–8.3.4.4 | dentro | Bump mapping (2025 Q4a) | 1/3 | sim | 🟡 |
| 📘 Inversas de T, S e R? | 3.4 | dentro | (nenhum: não usada nas contas) | 0/3 | sim | ⚪ |
| 📘 Que transformações preservam ângulos e comprimentos? | 3.2 | dentro | (nenhum: teoria) | 0/3 | sim | ⚪ |
| 📘 Por que near > 0 e far finito? | 5.2.2 | dentro | (nenhum: teoria) | 0/3 | sim | ⚪ |
| 📘 Ortográfica × perspetiva (volume)? | 5.2.2 | dentro | (nenhum: provas só usam perspetiva) | 0/3 | sim | ⚪ |
| 📘 Por que a projeção usa 4×4 invertível (preserva z)? | 5.5 | dentro | (nenhum: teoria) | 0/3 | sim | ⚪ |
| 📘 Transformação de viewport? | 5.6 | dentro | (nenhum: MVP termina em clip/NDC) | 0/3 | sim | ⚪ |
| 📘 Mapeamento direto × inverso? | 8.3.4.1 | dentro | (nenhum: base conceitual do UV) | 0/3 | sim | ⚪ |
| 📝⚠ Por que a normal precisa da normal matrix? | (não está no livro) | dentro | Lambert (2025 Q3) | 1/3 | **não** | ⚪ |
| 📝⚠ Por que a interpolação linear de UV no ecrã distorce? | 7.3.4 (correção: fora do livro) | dentro | Distorção em perspetiva (2025 Q2a) | 1/3 | **não** | ⚪ |
| 📝⚠ Normal mapping em espaço tangente: o que é TBN e onde se monta? | (não está no livro) | dentro | Bump mapping (2025 Q4a) | 1/3 | **não** | ⚪ |
| 📘 Liste a ordem dos andares do pipeline de visualização. | 2.6 | dentro | (nenhum: teoria) | 0/3 | sim | ⚪ |
| 📘 Que blocos formam o pipeline gráfico 3D e qual é o gargalo? | 2.6 | dentro | (nenhum: teoria) | 0/3 | sim | ⚪ |
| 📘 Diferença entre janela de visualização e viewport? | 2.5.2 | dentro | (nenhum: teoria) | 0/3 | sim | ⚪ |
| 📘 Quais são os 3 blocos da placa gráfica raster? | 2.2 | dentro | (nenhum: teoria) | 0/3 | sim | ⚪ |
| 📘 True color × cor indexada (1280×1024)? | 2.2.2 | dentro | (nenhum: teoria) | 0/3 | sim | ⚪ |
| 📘 Pipeline × ray tracing? | 2.5.3 | dentro | (nenhum: teoria) | 0/3 | sim | ⚪ |
| 📘 Para que serve a componente ambiente? | 7.2.1 | dentro | (nenhum: base de Lambert/Phong) | 0/3 | sim | ⚪ |
| 📘 Brilho (shininess) alto significa…? | 7.2.3 | dentro | (nenhum: base de Phong) | 0/3 | sim | ⚪ |
| 📘 O que são bandas de Mach? | 7.3.1 | dentro | (nenhum: teoria) | 0/3 | sim | ⚪ |
| 🔗 📘 Fórmula de Blinn-Phong. | 7.2.4 | 🔗 apoio | base do Gouraud × Phong | — | sim | 🔗 |
| 🔗 📘📝 O que é aliasing? Como minimizar? | 8.5 | 🔗 apoio | base da filtragem 8.3.4.2 | — | sim | 🔗 |
| 🔗 📘 O que é um fragmento e como os atributos dos vértices chegam a ele? | 8.2 (só a ideia) | 🔗 apoio | base de 8.3 (Gouraud, Phong, textura) | — | sim | 🔗 |
| 📘 RGB × CMY × HSV × YCbCr × CIE — para que serve cada um? | 2.7 | 🚫 fora | — | — | sim | 🚫 |
| 📘 O que é grafo de cena / modelação hierárquica? | 3.6 | 🚫 fora | — | — | sim | 🚫 |
| 📘 O que é a aproximação de Blinn e qual a vantagem? | 7.2.5 | 🚫 fora | — | — | sim | 🚫 |
| 📘 Algoritmo do Z-buffer. | 8.4 | 🚫 fora | — | — | sim | 🚫 |
| 📘 Como tratar transparência? | 8.4.2 | 🚫 fora | — | — | sim | 🚫 |
| 📘 Bresenham: por que é melhor que o incremental? | 8.2.1 | 🚫 fora | — | — | sim | 🚫 |
| 📘 Bresenham: valores iniciais. | 8.2.1 | 🚫 fora | — | — | sim | 🚫 |
| 📘 Rasterização de polígonos: passos. | 8.2.2 | 🚫 fora | — | — | sim | 🚫 |
