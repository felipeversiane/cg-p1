#!/usr/bin/env python3
"""Calculadora MVP (mesma convenção da planilha MVP_Excel_corrigido.xlsx).

Convenção: OpenGL, vetores coluna, MVP = P · V · M, com M = T · S · R
(rotação primeiro, depois escala, depois deslocamento). NDC em [-1, 1].

Uso rápido:  python3 tools/mvp.py --demo      (reproduz o estado atual da planilha)
Como módulo: from mvp import run; run(pontos, rot=..., escala=..., ...)
"""
import math, sys

def mat_mul(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(4)) for j in range(4)] for i in range(4)]

def mat_vec(m, v):
    return [sum(m[i][k] * v[k] for k in range(4)) for i in range(4)]

def ident():
    return [[1.0 if i == j else 0.0 for j in range(4)] for i in range(4)]

def T(dx, dy, dz):
    m = ident(); m[0][3], m[1][3], m[2][3] = dx, dy, dz; return m

def S(sx, sy, sz):
    m = ident(); m[0][0], m[1][1], m[2][2] = sx, sy, sz; return m

def R(eixo, graus):
    c, s = math.cos(math.radians(graus)), math.sin(math.radians(graus))
    m = ident()
    if eixo == "X":
        m[1][1], m[1][2], m[2][1], m[2][2] = c, -s, s, c
    elif eixo == "Y":
        m[0][0], m[0][2], m[2][0], m[2][2] = c, s, -s, c
    elif eixo == "Z":
        m[0][0], m[0][1], m[1][0], m[1][1] = c, -s, s, c
    return m

def centro(pts):
    n = len(pts)
    return [sum(p[i] for p in pts) / n for i in range(3)]

def em_torno_de(c, m):
    """T(+c) · m · T(-c): aplica m com pivô em c."""
    return mat_mul(T(*c), mat_mul(m, T(-c[0], -c[1], -c[2])))

def sub(a, b): return [a[i] - b[i] for i in range(3)]
def cross(a, b): return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
def norm(a):
    n = math.sqrt(sum(x*x for x in a)); return [x / n for x in a]

def view(eye, target, up):
    f = norm(sub(target, eye))
    s = norm(cross(f, up))
    u = cross(s, f)
    m = ident()
    m[0][:3], m[1][:3], m[2][:3] = s, u, [-x for x in f]
    m[0][3] = -sum(s[i]*eye[i] for i in range(3))
    m[1][3] = -sum(u[i]*eye[i] for i in range(3))
    m[2][3] = sum(f[i]*eye[i] for i in range(3))
    return m

def perspective(fov, largura, altura, near, far, tipo="Vertical"):
    asp = largura / altura
    t = 1 / math.tan(math.radians(fov) / 2)
    if tipo == "Vertical":
        fx, fy = t / asp, t
    else:
        fx, fy = t, t * asp
    m = [[0.0]*4 for _ in range(4)]
    m[0][0], m[1][1] = fx, fy
    m[2][2] = -(far + near) / (far - near)
    m[2][3] = -2 * far * near / (far - near)
    m[3][2] = -1
    return m

def oclusao(a, b, n=400):
    """Oclusão entre dois triângulos já projetados (resultados de run()).

    Amostra o plano (x_ndc, y_ndc); onde os dois cobrem o mesmo ponto, vence o de MENOR z_ndc
    (Z-buffer). Só vale para vértices com w > 0 (use depois de recortar/ajustar a câmera).
    Devolve fração da área de cada triângulo que está coberta pelo outro."""
    def bary(p, t):
        (x1, y1), (x2, y2), (x3, y3) = [(q[0], q[1]) for q in t]
        d = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3)
        if abs(d) < 1e-12: return None
        l1 = ((y2 - y3) * (p[0] - x3) + (x3 - x2) * (p[1] - y3)) / d
        l2 = ((y3 - y1) * (p[0] - x3) + (x1 - x3) * (p[1] - y3)) / d
        l3 = 1 - l1 - l2
        return (l1, l2, l3) if min(l1, l2, l3) >= -1e-9 else None
    ta, tb = a["ndc"], b["ndc"]
    if None in ta or None in tb or any(c[3] <= 0 for c in a["clip"] + b["clip"]):
        return {"aplicavel": False, "motivo": "há vértice com w ≤ 0 (atrás da câmera): recorte antes"}
    xs = [q[0] for q in ta + tb]; ys = [q[1] for q in ta + tb]
    x0, x1, y0, y1 = max(-1, min(xs)), min(1, max(xs)), max(-1, min(ys)), min(1, max(ys))
    cnt_a = cnt_b = a_ocl = b_ocl = sobre = 0
    for i in range(n):
        for j in range(n):
            p = (x0 + (x1 - x0) * (i + .5) / n, y0 + (y1 - y0) * (j + .5) / n)
            ba, bb = bary(p, ta), bary(p, tb)
            if ba: cnt_a += 1
            if bb: cnt_b += 1
            if ba and bb:
                sobre += 1
                za = sum(l * q[2] for l, q in zip(ba, ta)); zb = sum(l * q[2] for l, q in zip(bb, tb))
                if za < zb: b_ocl += 1     # a está na frente → oculta b
                else: a_ocl += 1
    return {"aplicavel": True, "sobreposicao": sobre > 0,
            "A_ocultado": a_ocl / cnt_a if cnt_a else 0, "B_ocultado": b_ocl / cnt_b if cnt_b else 0}

def descreve_oclusao(r, nome_a="T", nome_b="U"):
    if not r["aplicavel"]: return "Oclusão não avaliável: " + r["motivo"]
    if not r["sobreposicao"]: return "Sem sobreposição na tela: nenhum oculta o outro."
    def f(n, v): return (f"{n}: totalmente oculto" if v > .999 else f"{n}: parcialmente oculto ({v*100:.0f}% da área)" if v > .001 else f"{n}: não oculto")
    return f(nome_a, r["A_ocultado"]) + " · " + f(nome_b, r["B_ocultado"])

ESCALA_PIVO = None   # 'Origem' | 'Centro' | None (usa o do preset)

def fmt(m):
    return "\n".join("  [" + "  ".join(f"{x:9.4f}" for x in r) + "]" for r in m)

def run(pts, rot=("Nenhuma", 0, "Origem"), escala=(1, "Centro"), desloc=(0, 0, 0),
        eye=(0, 0, 5), target="Origem", up=(0, 1, 0),
        fov=45, largura=1024, altura=768, near=1, far=10, tipo="Vertical", verbose=True):
    eixo, ang, pivo = rot
    c0 = centro(pts)
    MR = ident() if eixo == "Nenhuma" else R(eixo, ang)
    if eixo != "Nenhuma" and pivo == "Centro":
        MR = em_torno_de(c0, MR)
    pts_r = [mat_vec(MR, list(p) + [1])[:3] for p in pts]
    fator, pivo_s = escala
    if ESCALA_PIVO:
        pivo_s = ESCALA_PIVO
    cs = centro(pts_r) if pivo_s == "Centro" else [0, 0, 0]
    MS = em_torno_de(cs, S(fator, fator, fator))
    MT = T(*desloc)
    M = mat_mul(MT, mat_mul(MS, MR))
    pts_w = [mat_vec(M, list(p) + [1])[:3] for p in pts]
    tgt = {"Origem": [0, 0, 0], "Centro": centro(pts_w)}.get(target, target) if isinstance(target, str) else list(target)
    V = view(eye, tgt, up)
    P = perspective(fov, largura, altura, near, far, tipo)
    MVP = mat_mul(P, mat_mul(V, M))
    clip = [mat_vec(MVP, list(p) + [1]) for p in pts]
    ndc = [[c[i] / c[3] for i in range(3)] if c[3] != 0 else None for c in clip]
    # Recorte do triângulo (Sutherland-Hodgman) contra os 6 planos em espaço de recorte:
    # x+w>=0, w-x>=0, y+w>=0, w-y>=0, z+w>=0, w-z>=0
    planos = [(0, 1), (0, -1), (1, 1), (1, -1), (2, 1), (2, -1)]
    poly, mudou = [list(c) for c in clip], False
    for eixo_i, sg in planos:
        d = lambda p: p[3] + sg * p[eixo_i]
        saida = []
        for i, a in enumerate(poly):
            b = poly[(i + 1) % len(poly)]
            da, db = d(a), d(b)
            if da >= -1e-9: saida.append(a)
            if (da >= -1e-9) != (db >= -1e-9):
                t = da / (da - db)
                saida.append([a[k] + t * (b[k] - a[k]) for k in range(4)])
        if len(saida) != len(poly) or any(abs(x - y) > 1e-9 for p, q in zip(saida, poly) for x, y in zip(p, q)):
            mudou = True
        poly = saida
        if not poly: break
    if not poly: estado = "FORA do volume (nada aparece)"
    elif not mudou: estado = "DENTRO do volume (visível por inteiro)"
    else: estado = "PARCIALMENTE no volume (será recortado)"
    if verbose:
        print("M = T·S·R:"); print(fmt(M))
        print("View:"); print(fmt(V))
        print("Projection:"); print(fmt(P))
        print("MVP = P·V·M:"); print(fmt(MVP))
        print("Pontos no mundo:", [[round(x, 4) for x in p] for p in pts_w])
        print("Target usado:", [round(x, 4) for x in tgt])
        for n, c, d in zip("ABC", clip, ndc):
            print(f"  {n}: clip=({', '.join(f'{x:.4f}' for x in c)})  NDC=" +
                  (f"({', '.join(f'{x:.4f}' for x in d)})" if d else "w=0"))
        print("Estado:", estado)
    return dict(M=M, V=V, P=P, MVP=MVP, clip=clip, ndc=ndc, estado=estado, mundo=pts_w)

MATRICULA_PADRAO = "20221060140130"   # matrícula do aluno (padrão quando --matricula não é dada)

def digitos(matricula):
    """Último e penúltimo dígitos de uma matrícula (string ou int)."""
    d = [c for c in str(matricula) if c.isdigit()]
    if len(d) < 2:
        raise SystemExit("matrícula precisa ter ao menos 2 dígitos")
    return int(d[-1]), int(d[-2])

def prova_2024_estudo(ultimo, penultimo, **kw):
    X, Y = ultimo, penultimo
    print(f"== 2024 Estudo | X={X} Y={Y}")
    return run([(-2.5, -2.5, 2), (X, Y, 2), (-2.5, 2.5, 2)], rot=("Z", 60, "Centro"),
               escala=(2, "Centro"), eye=(3, 32, 1), target="Centro", up=(0, 1, 0),
               fov=60, tipo="Vertical", largura=800, altura=600, near=1, far=25, **kw)

def prova_2024_p1(ultimo, penultimo, **kw):
    X, Y = ultimo, penultimo
    print(f"== 2024 P1 | X={X} Y={Y}")
    return run([(2, 3, Y), (-2, X, Y), (-3, -2, Y)], rot=("Z", 60, "Centro"),
               escala=(2, "Centro"), eye=(3, 0, 15), target="Centro", up=(0, 1, 0),
               fov=120, tipo="Horizontal", largura=2048, altura=1024, near=1, far=10, **kw)

def prova_2025_p1(ultimo, penultimo, **kw):
    Y = ultimo % 5 + 2          # enunciado: último dígito, mod 5, +2
    X = 8 - Y
    cam = dict(eye=(0, -0.5, -5), target="Origem", up=(0, 1, 0), fov=45, tipo="Vertical",
               largura=1024, altura=768, near=1, far=6)
    cam.update(kw.pop("cam", {}))
    print(f"== 2025 P1 | Y={Y} X={X}  (matrícula: último dígito {ultimo})")
    print("-- Triângulo T"); t = run([(Y, X, 3), (X, 3, Y), (3, Y, X)], rot=("Z", 45, "Origem"),
                                      escala=(0.5, "Origem"), **cam, **kw)
    print("-- Triângulo U"); u = run([(-3, -X, -Y), (-X, -Y, -3), (-Y, -3, -X)], rot=("X", -60, "Centro"),
                                      escala=(2, "Centro"), desloc=(2, 0, 0), **cam, **kw)
    return t, u

PROVAS = {"2024estudo": prova_2024_estudo, "2024p1": prova_2024_p1, "2025p1": prova_2025_p1}

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="MVP do triângulo com X/Y vindos da matrícula (convenção OpenGL).")
    ap.add_argument("--prova", choices=PROVAS, help="enunciado a resolver")
    ap.add_argument("--matricula", help="matrícula completa (padrão: %s)" % MATRICULA_PADRAO)
    ap.add_argument("--ultimo", type=int, help="último dígito (alternativa a --matricula)")
    ap.add_argument("--penultimo", type=int, help="penúltimo dígito (alternativa a --matricula)")
    ap.add_argument("--demo", action="store_true", help="reproduz o estado atual da planilha")
    ap.add_argument("--escala-pivo", choices=["Origem", "Centro"], help="força o pivô da escala")
    ap.add_argument("--oclusao", action="store_true", help="2025p1: avalia oclusão entre T e U")
    ap.add_argument("--olho", nargs=3, type=float, metavar=("X", "Y", "Z"), help="2025p1: sobrescreve o olho")
    ap.add_argument("--far", type=float, help="2025p1: sobrescreve o far")
    ap.add_argument("--ambos", action="store_true", help="roda as duas leituras do pivô da escala e compara")
    a = ap.parse_args()
    ESCALA_PIVO = a.escala_pivo
    if a.demo:
        run([(2, 3, 6), (-2, 6, 6), (-3, -2, 6)], rot=("Z", 45, "Origem"), escala=(0.5, "Centro"),
            eye=(0, -0.5, -5), fov=45, largura=1024, altura=768, near=1, far=6)
    elif a.prova:
        if a.ultimo is not None and a.penultimo is not None:
            ult, pen = a.ultimo, a.penultimo
        else:
            ult, pen = digitos(a.matricula or MATRICULA_PADRAO)
        if a.ambos:
            import io, contextlib
            for piv in ("Origem", "Centro"):
                ESCALA_PIVO = piv
                buf = io.StringIO()
                with contextlib.redirect_stdout(buf):
                    PROVAS[a.prova](ult, pen)
                est = [l for l in buf.getvalue().splitlines() if l.startswith(("==", "--", "Estado"))]
                print(f"[escala em torno de {piv}]"); print("\n".join("  " + l for l in est))
        elif a.prova == "2025p1" and (a.oclusao or a.olho or a.far):
            cam = {}
            if a.olho: cam["eye"] = tuple(a.olho)
            if a.far: cam["far"] = a.far
            t, u = prova_2025_p1(ult, pen, cam=cam)
            if a.oclusao:
                print("== Oclusão (T × U) ==")
                print(" ", t["estado"], "| T"); print(" ", u["estado"], "| U")
                print(" ", descreve_oclusao(oclusao(t, u)))
        else:
            PROVAS[a.prova](ult, pen)
    else:
        ap.print_help()
