/* Estudo CG — app estático. Lê os .md de ../docs e renderiza. Sem build. */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem('cg.' + k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem('cg.' + k, JSON.stringify(v)),
};
const DOCS = '../docs/';
const NAV = [
  ['Começar', [['doc/README.md', 'Plano de estudo'], ['doc/escopo-e-prioridade.md', 'Escopo e prioridade']]],
  ['Treinar', [['cards', 'Cards'], ['provas', 'Provas'], ['mvp', 'Calculadora MVP']]],
  ['Resumos', [['doc/resumos/cap02-conceitos-fundamentais.md', 'Cap. 2 — Conceitos'], ['doc/resumos/cap03-transformacoes-geometricas.md', 'Cap. 3 — Transformações'],
    ['doc/resumos/cap05-processamento-geometrico.md', 'Cap. 5 — Proc. geométrico'], ['doc/resumos/cap07-iluminacao-sombreamento.md', 'Cap. 7 — Iluminação'],
    ['doc/resumos/cap08-discretizacao-texturas.md', 'Cap. 8 — Texturas']]],
  ['Imprimir', [['doc/impressao/resumo-teorico.md', 'Resumo teórico'], ['doc/impressao/tutorial-planilha.md', 'Tutorial da planilha (MVP)']]],
  ['Referência', [['doc/mvp-passo-a-passo.md', 'MVP passo a passo'], ['doc/provas.md', 'Provas (texto)'], ['doc/classificacao-cards.md', 'Classificação dos cards']]],
];
const ALL_DOCS = ['README.md', 'escopo-e-prioridade.md', 'mvp-passo-a-passo.md', 'provas.md', 'cards.md',
  'resumos/cap02-conceitos-fundamentais.md', 'resumos/cap03-transformacoes-geometricas.md', 'resumos/cap05-processamento-geometrico.md',
  'resumos/cap07-iluminacao-sombreamento.md', 'resumos/cap08-discretizacao-texturas.md'];
const PDF = { '2024 Estudo': 'Prova2024Estudo.pdf', '2024 P1': 'prova2024p1.pdf', '2025 P1': 'prova2025p1.pdf' };

const cache = {};
async function load(path) {
  if (cache[path] == null) {
    const r = await fetch(DOCS + path);
    if (!r.ok) throw new Error(path + ' → ' + r.status);
    cache[path] = await r.text();
  }
  return cache[path];
}
const md = t => marked.parse(t, { gfm: true, breaks: false });
const hash = s => { let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return 'h' + (h >>> 0).toString(36); };
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ---------- filtro de escopo ----------
const filtro = () => ({ apoio: $('#f-apoio').checked, fora: $('#f-fora').checked });
function initFiltro() {
  const f = store.get('filtro', { apoio: false, fora: false });
  $('#f-apoio').checked = f.apoio; $('#f-fora').checked = f.fora;
  for (const id of ['#f-apoio', '#f-fora']) $(id).addEventListener('change', () => { store.set('filtro', filtro()); route(); });
}

// ---------- navegação ----------
function buildNav(cur) {
  $('#nav').innerHTML = NAV.map(([t, items]) => `<h4>${t}</h4>` + items.map(([h, l]) =>
    `<a href="#/${h}" class="${cur === h ? 'on' : ''}">${l}</a>`).join('')).join('');
}

// ---------- documentos ----------
function fixLinks(root, base) {
  root.querySelectorAll('a[href]').forEach(a => {
    const h = a.getAttribute('href');
    if (/^(https?:|#|mailto:)/.test(h)) return;
    const m = h.match(/^(.*\.md)(#.*)?$/);
    if (m) {
      const parts = (base + m[1]).split('/'), out = [];
      for (const p of parts) { if (p === '..') out.pop(); else if (p && p !== '.') out.push(p); }
      a.setAttribute('href', '#/doc/' + out.join('/'));
    }
  });
}
function aplicaFiltroDoc(root) {
  const f = filtro();
  // anexo "fora do escopo" no fim dos resumos
  root.querySelectorAll('h2').forEach(h => {
    if (/Anexo\s*🚫/.test(h.textContent) && !f.fora) {
      let n = h; const rm = [];
      while (n) { rm.push(n); n = n.nextElementSibling; }
      rm.forEach(x => x.remove());
    }
  });
  root.querySelectorAll('li, p').forEach(e => {
    if (!f.fora && /^🚫/.test(e.textContent.trim())) e.remove();
  });
}
async function viewDoc(path) {
  const t = await load(path);
  $('#view').innerHTML = `<article>${md(t)}</article>`;
  const base = path.includes('/') ? path.replace(/[^/]*$/, '') : '';
  fixLinks($('#view'), base);
  aplicaFiltroDoc($('#view'));
}

// ---------- cards ----------
const NIVEL_OK = '🔴🟠🟡⚪';
function parseCards(t) {
  const out = []; let grupo = '', nivel = '';
  const re = /^## (.+)$|<details><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gm;
  let m;
  while ((m = re.exec(t))) {
    if (m[1]) { grupo = m[1]; nivel = (m[1].match(/[🔴🟠🟡⚪🔗🚫]/u) || [''])[0]; }
    else out.push({ id: hash(m[2].trim()), q: m[2].trim(), a: m[3].trim(), grupo, nivel });
  }
  return out;
}
const sess = { fila: [], i: 0, mostra: false };
async function viewCards() {
  const all = parseCards(await load('cards.md')), f = filtro();
  const prog = store.get('prog', {});
  const niveis = store.get('niveis', ['🔴', '🟠', '🟡', '⚪']);
  const modo = store.get('modo', 'pendentes'), emb = store.get('emb', false);
  const visivel = c => (NIVEL_OK.includes(c.nivel) ? niveis.includes(c.nivel) : c.nivel === '🔗' ? f.apoio : f.fora);
  const base = all.filter(visivel);
  const st = c => prog[c.id] || 'novo';
  const filtrado = base.filter(c => modo === 'todos' || (modo === 'erros' ? st(c) === 'erro' : st(c) !== 'ok'));
  const cnt = k => base.filter(c => st(c) === k).length;
  if (!sess.fila.length || sess.sig !== JSON.stringify([niveis, modo, emb, f, filtrado.length])) {
    sess.fila = filtrado.slice(); if (emb) sess.fila.sort(() => Math.random() - .5);
    sess.i = 0; sess.mostra = false; sess.sig = JSON.stringify([niveis, modo, emb, f, filtrado.length]);
  }
  const c = sess.fila[sess.i];
  $('#view').innerHTML = `
    <h1>Cards</h1>
    <div class="bar">${['🔴', '🟠', '🟡', '⚪'].map(n => `<label class="chip"><input type="checkbox" data-n="${n}" ${niveis.includes(n) ? 'checked' : ''}> ${n}</label>`).join('')}
      <select id="modo"><option value="pendentes">pendentes</option><option value="erros">só erros</option><option value="todos">todos</option></select>
      <label class="chip"><input type="checkbox" id="emb" ${emb ? 'checked' : ''}> embaralhar</label>
      <button class="b" id="zera">zerar progresso</button></div>
    <div class="stat">${base.length} cards no filtro · ✔ ${cnt('ok')} · ✘ ${cnt('erro')} · novos ${cnt('novo')} · fila: ${sess.fila.length ? sess.i + 1 + '/' + sess.fila.length : '0'}</div>
    ${c ? `<div class="card"><div class="stat">${esc(c.grupo)}</div><div class="q">${md(c.q).replace(/^<p>|<\/p>\n?$/g, '')}</div>
      ${sess.mostra ? `<div class="a">${md(c.a)}</div>` : ''}</div>
      <div class="bar">${sess.mostra ? `<button class="b er" id="er">✘ Errei (2)</button><button class="b ok" id="ok">✔ Acertei (1)</button>`
        : `<button class="b" id="show">Mostrar resposta (espaço)</button>`}
        <button class="b" id="pula">pular →</button></div>`
      : `<div class="card">Nada na fila com esse filtro. 🎉 Mude o modo para <em>todos</em> ou inclua mais níveis.</div>`}`;
  $('#modo').value = modo;
  $('#modo').onchange = e => { store.set('modo', e.target.value); route(); };
  $('#emb').onchange = e => { store.set('emb', e.target.checked); sess.fila = []; route(); };
  document.querySelectorAll('[data-n]').forEach(el => el.onchange = () => {
    store.set('niveis', [...document.querySelectorAll('[data-n]')].filter(x => x.checked).map(x => x.dataset.n)); sess.fila = []; route(); });
  $('#zera').onclick = () => { if (confirm('Zerar todo o progresso de cards e provas?')) { store.set('prog', {}); sess.fila = []; route(); } };
  const next = () => { sess.i++; sess.mostra = false; if (sess.i >= sess.fila.length) { sess.fila = []; } route(); };
  const marca = v => { prog[c.id] = v; store.set('prog', prog); next(); };
  if ($('#show')) $('#show').onclick = () => { sess.mostra = true; route(); };
  if ($('#ok')) $('#ok').onclick = () => marca('ok');
  if ($('#er')) $('#er').onclick = () => marca('erro');
  if ($('#pula')) $('#pula').onclick = next;
  viewCards.keys = e => {
    if (!c || e.target.matches('input,select,textarea')) return;
    if (e.key === ' ' && !sess.mostra) { e.preventDefault(); sess.mostra = true; route(); }
    else if (e.key === '1' && sess.mostra) marca('ok');
    else if (e.key === '2' && sess.mostra) marca('erro');
    else if (e.key === 'ArrowRight') next();
  };
}
document.addEventListener('keydown', e => { if (location.hash === '#/cards' && viewCards.keys) viewCards.keys(e); });

// ---------- provas ----------
async function viewProvas() {
  const t = await load('provas.md'), prog = store.get('prog', {});
  const exames = []; let ex = null, q = null;
  for (const linha of t.split('\n')) {
    let m;
    if ((m = linha.match(/^## (2024 Estudo|2024 P1|2025 P1)/))) { ex = { nome: m[1], qs: [] }; exames.push(ex); q = null; }
    else if (/^## /.test(linha)) { ex = null; q = null; }
    else if (ex && (m = linha.match(/^### (.+)$/))) { q = { titulo: m[1].trim(), corpo: [] }; ex.qs.push(q); }
    else if (q) q.corpo.push(linha);
  }
  $('#view').innerHTML = '<h1>Provas — modo treino</h1><p class="stat">Leia o enunciado no PDF, responda <strong>antes</strong> de revelar, e marque como foi.</p>' +
    exames.map(e => `<h2>${e.nome} <a class="stat" target="_blank" href="../moodle/provas/${PDF[e.nome]}">abrir enunciado (PDF)</a></h2>` +
      e.qs.map(qq => {
        const id = hash(e.nome + qq.titulo), st = prog[id] || '';
        const corpo = qq.corpo.join('\n').trim();
        const meta = (corpo.match(/^\*Seção do livro:[^\n]*\*/) || [''])[0];
        const resto = corpo.replace(meta, '').replace(/^\s*---\s*$/gm, '').trim();
        return `<div class="q-item ${st}" data-id="${id}"><h3>${md(qq.titulo).replace(/^<p>|<\/p>\n?$/g, '')}</h3>
          <div class="stat">${meta ? md(meta).replace(/<\/?p>/g, '') : ''}</div>
          <details><summary>Revelar resposta-modelo</summary>${md(resto)}
            <div class="bar"><button class="b ok" data-v="ok">✔ acertei</button><button class="b er" data-v="er">✘ errei</button></div></details></div>`;
      }).join('')).join('');
  document.querySelectorAll('.q-item [data-v]').forEach(b => b.onclick = () => {
    const it = b.closest('.q-item'); prog[it.dataset.id] = b.dataset.v; store.set('prog', prog);
    it.className = 'q-item ' + b.dataset.v;
  });
}

// ---------- calculadora MVP ----------
const fmt = x => { const s = (Math.abs(x) < 5e-9 ? 0 : x).toFixed(4); return s.replace(/\.?0+$/, '') || '0'; };
const matHTML = (nome, m) => `<div class="mat"><div class="t">${esc(nome)}</div><table>${m.map(r => '<tr>' + r.map(x => `<td>${fmt(x)}</td>`).join('') + '</tr>').join('')}</table></div>`;
const vec = v => v.map(fmt).join(', ');
function viewMVP() {
  const st = store.get('mvp', { prova: '2025p1', mat: '20221060140130' });
  $('#view').innerHTML = `<h1>Calculadora MVP</h1>
    <p class="stat">Convenção OpenGL · <code>MVP = P·V·M</code> · <code>M = T·S·R</code>. Os campos abaixo são editáveis; o preset recalcula X/Y a partir da matrícula.</p>
    <div class="form">
      <div><label>Prova</label><select id="prova">${Object.entries(MVP.PRESETS).map(([k, p]) => `<option value="${k}">${p.nome}</option>`).join('')}<option value="livre">Livre (sem preset)</option></select></div>
      <div><label>Matrícula (digite; usa último e penúltimo dígitos)</label><input id="mat" inputmode="numeric" value="${esc(st.mat)}" placeholder="20221060140130"></div>
    </div><p id="xy" class="stat"></p><div id="out"></div>`;
  $('#prova').value = st.prova;
  const render = () => {
    const prova = $('#prova').value, mat = $('#mat').value; store.set('mvp', { prova, mat });
    const d = MVP.digitos(mat) || (mat.replace(/\D/g, '') ? [+mat.replace(/\D/g, '').slice(-1), 0] : null);
    const p = MVP.PRESETS[prova];
    let casos;
    if (p && d) { casos = p.build(d[0], d[1]); $('#xy').textContent = `Último dígito = ${d[0]}, penúltimo = ${d[1]} · ${p.xy}` +
      (prova === '2025p1' ? ` → Y = ${d[0] % 5 + 2}, X = ${8 - (d[0] % 5 + 2)}` : ` → X = ${d[0]}, Y = ${d[1]}`); }
    else if (p) { casos = null; $('#xy').textContent = 'Digite a matrícula (≥ 2 dígitos) para calcular X e Y.'; }
    else { casos = [MVP.PRESETS['2024p1'].build(0, 0)[0]]; $('#xy').textContent = 'Modo livre: edite os campos.'; }
    $('#out').innerHTML = casos ? casos.map((c, i) => caso(c, i)).join('') : '';
    document.querySelectorAll('.caso').forEach(el => el.addEventListener('input', () => calc(el)));
    document.querySelectorAll('.caso').forEach(el => calc(el));
  };
  $('#prova').onchange = render; $('#mat').oninput = render; render();
}
function caso(c, i) {
  const inp = (id, label, v) => `<div><label>${label}</label><input data-k="${id}" value="${v}"></div>`;
  const sel = (id, label, opts, v) => `<div><label>${label}</label><select data-k="${id}">${opts.map(o => `<option ${o === v ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;
  return `<section class="caso" data-i="${i}"><h2>${esc(c.rotulo)}</h2><div class="form">
    ${['A', 'B', 'C'].map((n, k) => inp('p' + k, `Vértice ${n} (x, y, z)`, c.pts[k].map(fmt).join(', '))).join('')}
    ${sel('reixo', 'Rotação — eixo', ['Nenhuma', 'X', 'Y', 'Z'], c.rot.eixo)}${inp('rang', 'Ângulo (°)', c.rot.ang)}${sel('rpivo', 'Pivô da rotação', ['Origem', 'Centro'], c.rot.pivo)}
    ${inp('sf', 'Escala (fator)', c.escala.fator)}${sel('spivo', 'Pivô da escala', ['Origem', 'Centro'], c.escala.pivo)}${inp('d', 'Deslocamento (x, y, z)', c.desloc.join(', '))}
    ${inp('eye', 'Olho (x, y, z)', c.eye.join(', '))}${inp('tgt', 'Target: Origem | Centro | x, y, z', c.target === 'Origem' || c.target === 'Centro' ? c.target : c.target.join(', '))}${inp('up', 'Up (x, y, z)', c.up.join(', '))}
    ${inp('fov', 'FOV (°)', c.fov)}${sel('tipo', 'FOV é', ['Vertical', 'Horizontal'], c.tipo)}${inp('W', 'Largura da janela', c.W)}${inp('H', 'Altura da janela', c.H)}
    ${inp('near', 'Near', c.near)}${inp('far', 'Far', c.far)}</div><div class="res"></div></section>`;
}
function calc(el) {
  const g = k => el.querySelector(`[data-k="${k}"]`).value.trim();
  const v3 = k => g(k).split(/[,\s;]+/).filter(Boolean).map(Number);
  const out = el.querySelector('.res');
  try {
    const t = g('tgt'), pts = [0, 1, 2].map(k => v3('p' + k));
    const c = { pts, rot: { eixo: g('reixo'), ang: +g('rang'), pivo: g('rpivo') }, escala: { fator: +g('sf'), pivo: g('spivo') },
      desloc: v3('d'), eye: v3('eye'), up: v3('up'), target: /^(Origem|Centro)$/i.test(t) ? (t[0].toUpperCase() + t.slice(1).toLowerCase()) : v3('tgt'),
      fov: +g('fov'), tipo: g('tipo'), W: +g('W'), H: +g('H'), near: +g('near'), far: +g('far') };
    const bad = [...pts, c.desloc, c.eye, c.up].some(v => v.length !== 3 || v.some(isNaN));
    if (bad || [c.fov, c.W, c.H, c.near, c.far, c.escala.fator, c.rot.ang].some(isNaN)) throw new Error('Valores inválidos');
    if (!(c.near > 0 && c.far > c.near && c.fov > 0 && c.fov < 180)) throw new Error('Exige 0 < near < far e 0 < FOV < 180');
    const r = MVP.run(c);
    const rot = { dentro: 'Dentro do volume — visível por inteiro', parcial: 'Parcialmente no volume — será recortado', fora: 'Fora do volume — nada aparece' }[r.estado];
    out.innerHTML = `<p><span class="badge est-${r.estado}">${rot}</span></p>
      ${r.dicas.length ? '<ul>' + r.dicas.map(d => `<li>${esc(d)}</li>`).join('') + '</ul>' : ''}
      <h3>Matrizes intermediárias (com nome)</h3>${r.passos.map(([n, m]) => matHTML(n, m)).join('')}
      <h3>Pontos</h3><table><tr><th></th><th>Mundo (M·p)</th><th>Clip (x, y, z, w)</th><th>NDC (÷w)</th></tr>
      ${r.mundo.map((m, i) => `<tr><td><strong>${'ABC'[i]}</strong></td><td>${vec(m)}</td><td>${vec(r.clip[i])}</td><td>${r.ndc[i] ? vec(r.ndc[i]) : 'w = 0'}</td></tr>`).join('')}</table>
      <p class="stat">Target usado: (${vec(r.target)}) · dentro ⇔ −w ≤ x, y, z ≤ w (NDC em [−1, 1]).</p>`;
  } catch (e) { out.innerHTML = `<p class="stat">⚠ ${esc(e.message)}</p>`; }
}

// ---------- busca ----------
async function viewBusca(q) {
  const nq = norm(q); const hits = [];
  $('#view').innerHTML = `<h1>Busca: “${esc(q)}”</h1><p class="stat">procurando…</p>`;
  for (const f of ALL_DOCS) {
    const t = await load(f), linhas = t.split('\n');
    let n = 0;
    linhas.forEach((l, i) => { if (n < 4 && norm(l).includes(nq)) { n++; hits.push({ f, l: l.trim().slice(0, 220), i }); } });
  }
  const rota = f => f === 'cards.md' ? '#/cards' : f === 'provas.md' ? '#/provas' : '#/doc/' + f;
  const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  $('#view').innerHTML = `<h1>Busca: “${esc(q)}”</h1><p class="stat">${hits.length} resultado(s)</p>` +
    hits.map(h => `<div class="hit"><a href="${rota(h.f)}">${h.f}</a><br>${esc(h.l).replace(re, '<mark>$1</mark>')}</div>`).join('');
}

// ---------- roteador ----------
async function route() {
  const h = decodeURIComponent(location.hash.replace(/^#\//, '')) || 'doc/README.md';
  buildNav(h);
  $('#nav').classList.remove('open');
  try {
    if (h === 'cards') await viewCards();
    else if (h === 'provas') await viewProvas();
    else if (h === 'mvp') viewMVP();
    else if (h.startsWith('busca/')) await viewBusca(h.slice(6));
    else if (h.startsWith('doc/')) await viewDoc(h.slice(4));
    else $('#view').innerHTML = '<p>Página não encontrada.</p>';
  } catch (e) {
    $('#view').innerHTML = `<p>⚠ ${esc(e.message)}</p><p class="stat">Sirva a partir da raiz do repositório: <code>python3 -m http.server</code> e abra <code>http://localhost:8000/app/</code>.</p>`;
  }
  if (!h.startsWith('busca/')) window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
$('#print-btn').onclick = () => window.print();
$('#menu-btn').onclick = () => $('#nav').classList.toggle('open');
let tmr;
$('#busca').addEventListener('input', e => { clearTimeout(tmr); tmr = setTimeout(() => {
  const q = e.target.value.trim(); location.hash = q.length >= 2 ? '#/busca/' + encodeURIComponent(q) : '#/doc/README.md'; }, 250); });
initFiltro(); route();
