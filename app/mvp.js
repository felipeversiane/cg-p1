// Port de tools/mvp.py (convenção OpenGL, vetores coluna, MVP = P·V·M, M = T·S·R).
// Funciona no navegador (window.MVP) e no node (module.exports) para teste.
(function (root) {
  const I = () => [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
  const mul = (a, b) => a.map((_, i) => b[0].map((_, j) => a[i].reduce((s, _, k) => s + a[i][k] * b[k][j], 0)));
  const apply = (m, v) => m.map(r => r.reduce((s, x, k) => s + x * v[k], 0));
  const T = (x, y, z) => { const m = I(); m[0][3] = x; m[1][3] = y; m[2][3] = z; return m; };
  const S = (x, y, z) => { const m = I(); m[0][0] = x; m[1][1] = y; m[2][2] = z; return m; };
  const R = (eixo, g) => {
    const c = Math.cos(g * Math.PI / 180), s = Math.sin(g * Math.PI / 180), m = I();
    if (eixo === 'X') { m[1][1] = c; m[1][2] = -s; m[2][1] = s; m[2][2] = c; }
    if (eixo === 'Y') { m[0][0] = c; m[0][2] = s; m[2][0] = -s; m[2][2] = c; }
    if (eixo === 'Z') { m[0][0] = c; m[0][1] = -s; m[1][0] = s; m[1][1] = c; }
    return m;
  };
  const centro = p => [0, 1, 2].map(i => p.reduce((s, q) => s + q[i], 0) / p.length);
  const sub = (a, b) => a.map((x, i) => x - b[i]);
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  const norm = a => { const n = Math.hypot(...a); return a.map(x => x / n); };

  function view(eye, target, up) {
    const f = norm(sub(target, eye)), s = norm(cross(f, up)), u = cross(s, f), m = I();
    m[0] = [...s, -dot(s, eye)]; m[1] = [...u, -dot(u, eye)]; m[2] = [-f[0], -f[1], -f[2], dot(f, eye)];
    return m;
  }
  function perspective(fov, W, H, n, f, tipo) {
    const asp = W / H, t = 1 / Math.tan(fov * Math.PI / 360);
    const fx = tipo === 'Vertical' ? t / asp : t, fy = tipo === 'Vertical' ? t : t * asp;
    return [[fx,0,0,0],[0,fy,0,0],[0,0,-(f+n)/(f-n),-2*f*n/(f-n)],[0,0,-1,0]];
  }
  function recorta(clip) { // Sutherland-Hodgman contra os 6 planos em clip space
    let poly = clip.map(c => c.slice()), mudou = false;
    for (const [e, sg] of [[0,1],[0,-1],[1,1],[1,-1],[2,1],[2,-1]]) {
      const d = p => p[3] + sg * p[e], out = [];
      poly.forEach((a, i) => {
        const b = poly[(i + 1) % poly.length], da = d(a), db = d(b);
        if (da >= -1e-9) out.push(a);
        if ((da >= -1e-9) !== (db >= -1e-9)) { const t = da / (da - db); out.push(a.map((x, k) => x + t * (b[k] - x))); }
      });
      if (out.length !== poly.length || out.some((p, i) => p.some((x, k) => Math.abs(x - poly[i][k]) > 1e-9))) mudou = true;
      poly = out; if (!poly.length) break;
    }
    return !poly.length ? 'fora' : (mudou ? 'parcial' : 'dentro');
  }

  // p: {pts, rot:{eixo,ang,pivo}, escala:{fator,pivo}, desloc:[x,y,z], eye, target:'Origem'|'Centro'|[x,y,z], up,
  //     fov, tipo, W, H, near, far}
  function run(p) {
    const n3 = v => [v[0], v[1], v[2]];
    const c0 = centro(p.pts), nomes = [], passos = [];
    let MR = I();
    if (p.rot.eixo !== 'Nenhuma') {
      const Rm = R(p.rot.eixo, p.rot.ang);
      if (p.rot.pivo === 'Centro') {
        const a = T(-c0[0], -c0[1], -c0[2]), b = T(...c0);
        passos.push(['T(−c) — leva o centro à origem', a], [`R${p.rot.eixo}(${p.rot.ang}°)`, Rm], ['T(+c) — devolve o centro', b]);
        MR = mul(b, mul(Rm, a));
      } else { passos.push([`R${p.rot.eixo}(${p.rot.ang}°) — em torno da origem`, Rm]); MR = Rm; }
    }
    passos.push(['M_rot (conjunto da rotação)', MR]);
    const ptsR = p.pts.map(q => n3(apply(MR, [...q, 1])));
    const cs = p.escala.pivo === 'Centro' ? centro(ptsR) : [0, 0, 0], f = p.escala.fator;
    const Sm = S(f, f, f);
    if (p.escala.pivo === 'Centro') {
      const a = T(-cs[0], -cs[1], -cs[2]), b = T(...cs);
      passos.push(['T(−c′) — centro após a rotação', a], [`S(${f})`, Sm], ['T(+c′)', b]);
      var MS = mul(b, mul(Sm, a));
    } else { passos.push([`S(${f}) — em torno da origem`, Sm]); var MS = Sm; }
    passos.push(['M_esc (conjunto da escala)', MS]);
    const Tm = T(...p.desloc); passos.push(['T(deslocamento)', Tm]);
    const M = mul(Tm, mul(MS, MR)); passos.push(['M = T · M_esc · M_rot', M]);
    const mundo = p.pts.map(q => n3(apply(M, [...q, 1])));
    const tgt = p.target === 'Origem' ? [0,0,0] : p.target === 'Centro' ? centro(mundo) : p.target;
    const V = view(p.eye, tgt, p.up), P = perspective(p.fov, p.W, p.H, p.near, p.far, p.tipo);
    passos.push(['V — View (lookAt)', V], ['P — Projection', P]);
    const MVP = mul(P, mul(V, M)); passos.push(['MVP = P · V · M', MVP]);
    const clip = p.pts.map(q => apply(MVP, [...q, 1]));
    const ndc = clip.map(c => c[3] === 0 ? null : [c[0]/c[3], c[1]/c[3], c[2]/c[3]]);
    const upLixo = Math.hypot(...cross(norm(sub(tgt, p.eye)), p.up)) < 1e-3;
    const dicas = [];
    clip.forEach((c, i) => {
      const n = 'ABC'[i];
      if (c[3] <= 0) dicas.push(`${n}: w ≤ 0 → atrás da câmera.`);
      else {
        if (c[2]/c[3] > 1) dicas.push(`${n}: z_ndc = ${(c[2]/c[3]).toFixed(3)} > 1 → além do far.`);
        if (c[2]/c[3] < -1) dicas.push(`${n}: z_ndc < −1 → antes do near.`);
        if (Math.abs(c[0]/c[3]) > 1) dicas.push(`${n}: |x_ndc| > 1 → fora dos lados.`);
        if (Math.abs(c[1]/c[3]) > 1) dicas.push(`${n}: |y_ndc| > 1 → fora em cima/embaixo.`);
      }
    });
    if (upLixo) dicas.push('Atenção: a direção de visão é (quase) paralela ao Up → lookAt degenerado.');
    return { passos, M, V, P, MVP, mundo, clip, ndc, target: tgt, estado: recorta(clip), dicas };
  }

  // Presets das provas (X,Y vêm da matrícula)
  const digitos = m => { const d = String(m).replace(/\D/g, ''); return d.length < 2 ? null : [+d.slice(-1), +d.slice(-2, -1)]; };
  const PRESETS = {
    '2024p1': { nome: '2024 P1 — Q3 (5,0)', xy: 'X = último dígito, Y = penúltimo',
      build: (u, pn) => [{ rotulo: 'Triângulo', pts: [[2,3,pn],[-2,u,pn],[-3,-2,pn]],
        rot: { eixo: 'Z', ang: 60, pivo: 'Centro' }, escala: { fator: 2, pivo: 'Centro' }, desloc: [0,0,0],
        eye: [3,0,15], target: 'Centro', up: [0,1,0], fov: 120, tipo: 'Horizontal', W: 2048, H: 1024, near: 1, far: 10 }] },
    '2024estudo': { nome: '2024 Estudo — Q3', xy: 'X = último dígito, Y = penúltimo',
      build: (u, pn) => [{ rotulo: 'Triângulo', pts: [[-2.5,-2.5,2],[u,pn,2],[-2.5,2.5,2]],
        rot: { eixo: 'Z', ang: 60, pivo: 'Centro' }, escala: { fator: 2, pivo: 'Centro' }, desloc: [0,0,0],
        eye: [3,32,1], target: 'Centro', up: [0,1,0], fov: 60, tipo: 'Vertical', W: 800, H: 600, near: 1, far: 25 }] },
    '2025p1': { nome: '2025 P1 — Q6 (triângulos T e U)', xy: 'Y = (último dígito mod 5) + 2; X = 8 − Y',
      build: (u) => { const Y = u % 5 + 2, X = 8 - Y;
        const cam = { eye: [0,-0.5,-5], target: 'Origem', up: [0,1,0], fov: 45, tipo: 'Vertical', W: 1024, H: 768, near: 1, far: 6 };
        return [
          { rotulo: 'Triângulo T', pts: [[Y,X,3],[X,3,Y],[3,Y,X]], rot: { eixo: 'Z', ang: 45, pivo: 'Origem' },
            escala: { fator: 0.5, pivo: 'Origem' }, desloc: [0,0,0], ...cam },
          { rotulo: 'Triângulo U', pts: [[-3,-X,-Y],[-X,-Y,-3],[-Y,-3,-X]], rot: { eixo: 'X', ang: -60, pivo: 'Centro' },
            escala: { fator: 2, pivo: 'Centro' }, desloc: [2,0,0], ...cam }]; } },
  };
  const api = { run, digitos, PRESETS, mul, apply };
  if (typeof module !== 'undefined') module.exports = api; else root.MVP = api;
})(typeof window !== 'undefined' ? window : globalThis);
