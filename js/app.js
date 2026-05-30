/* ============================================================
   ResearchBridge — APP LOGIC
============================================================ */

/* ---------------- STATE ---------------- */
const S = { screen: 'home', abstract: '', audience: null, objective: null };

/* sessionStorage persistence (survives a mid-test refresh) */
function saveState() { try { sessionStorage.setItem('rb', JSON.stringify(S)); } catch(e){} }
function loadState() {
  try {
    const raw = sessionStorage.getItem('rb');
    if (!raw) return;
    const o = JSON.parse(raw);
    Object.assign(S, o);
  } catch(e){}
}

/* ============================================================
   NAVIGATION
============================================================ */
function go(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');
  S.screen = screen;
  updateNav(screen);
  saveState();
  window.scrollTo(0,0);
}

function updateNav(screen) {
  const steps = ['input','audience','objective','recommendations'];
  const ns = document.getElementById('nav-steps');
  const ha = document.getElementById('nav-home-area');
  const idx = steps.indexOf(screen);
  if (screen === 'home' || screen === 'export') {
    ns.style.display = 'none';
    ha.style.display = (screen === 'home') ? '' : 'none';
  } else {
    ns.style.display = 'flex';
    ha.style.display = 'none';
    steps.forEach((_, i) => {
      const d = document.getElementById('d'+(i+1));
      if (d) d.className = 'sd' + (i < idx ? ' done' : i === idx ? ' now' : '');
    });
    const lbls = ['Input','Audience','Objective','Recommendations'];
    document.getElementById('nav-step-label').textContent = (idx+1)+'/4 — '+(lbls[idx]||'');
  }
}

/* Keyboard activation for div-based controls (a11y) */
function onKeyActivate(e, fn) {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    fn();
  }
}

/* ============================================================
   DEMOS
============================================================ */
function loadDemo(id) {
  const d = DEMOS[id];
  S.abstract = d.abstract; S.audience = d.audience; S.objective = d.objective;
  document.getElementById('ta').value = d.abstract;
  onTaInput();
  selAud(d.audience, false);
  buildObjs(d.audience);
  setTimeout(() => selObj(d.objective), 40);
  go('input');
}

function fillDemo(id) {
  const d = DEMOS[id];
  document.getElementById('ta').value = d.abstract;
  S.abstract = d.abstract;
  onTaInput();
  S.audience = d.audience; S.objective = d.objective;
  selAud(d.audience, false);
  buildObjs(d.audience);
  setTimeout(() => selObj(d.objective), 40);
}

function isDemoAbstract(text) {
  const t = (text||'').trim();
  return Object.values(DEMOS).some(d => d.abstract.trim() === t);
}

/* ============================================================
   TEXTAREA
============================================================ */
function onTaInput() {
  const v = document.getElementById('ta').value.trim();
  S.abstract = v;
  const w = v ? v.split(/\s+/).length : 0;
  document.getElementById('wc').textContent = w + (w===1?' word':' words');
  document.getElementById('btn-in-next').disabled = w < 5;
  saveState();
}
function clearTa() { document.getElementById('ta').value = ''; onTaInput(); }

/* ============================================================
   AUDIENCE
============================================================ */
function selAud(aud, rebuild = true) {
  document.querySelectorAll('.aud-card').forEach(c => { c.classList.remove('sel'); c.setAttribute('aria-pressed','false'); });
  const c = document.getElementById('a-'+aud);
  if (c) { c.classList.add('sel'); c.setAttribute('aria-pressed','true'); }
  S.audience = aud;
  document.getElementById('btn-aud-next').disabled = false;
  if (rebuild) { S.objective = null; buildObjs(aud); }
  saveState();
}

/* ============================================================
   OBJECTIVES
============================================================ */
function buildObjs(aud) {
  const objs = OBJS[aud] || [];
  const list = document.getElementById('obj-list');
  list.innerHTML = '';
  document.getElementById('obj-sub').textContent = `Choose your communication goal for ${AUD_LABELS[aud]||'your audience'}.`;
  objs.forEach(o => {
    const d = document.createElement('div');
    d.className = 'obj-card' + (S.objective === o.id ? ' sel' : '');
    d.id = 'o-' + o.id;
    d.setAttribute('role','button');
    d.setAttribute('tabindex','0');
    d.setAttribute('aria-pressed', S.objective === o.id ? 'true' : 'false');
    d.onclick = () => selObj(o.id);
    d.onkeydown = (e) => onKeyActivate(e, () => selObj(o.id));
    d.innerHTML = `<div class="obj-icon">${o.icon}</div><div><h4>${o.h}</h4><p>${o.p}</p></div>`;
    list.appendChild(d);
  });
  document.getElementById('btn-obj-next').disabled = !S.objective;
}
function selObj(id) {
  document.querySelectorAll('.obj-card').forEach(c => { c.classList.remove('sel'); c.setAttribute('aria-pressed','false'); });
  const c = document.getElementById('o-'+id);
  if (c) { c.classList.add('sel'); c.setAttribute('aria-pressed','true'); }
  S.objective = id;
  document.getElementById('btn-obj-next').disabled = false;
  saveState();
}

/* ============================================================
   RULE-BASED ABSTRACT ANALYSIS
   Scans the pasted text for jargon (JARGON_DICT) and extracts
   notable numbers. Deterministic, client-side — NOT an LLM.
============================================================ */
function analyzeAbstract(text, audience) {
  const out = { jargon: [], numbers: [] };
  if (!text) return out;
  const seen = new Set();
  JARGON_DICT.forEach(j => {
    if (j.re.test(text) && !seen.has(j.p)) {
      seen.add(j.p);
      out.jargon.push({ o: j.o, p: j.p });
    }
  });
  out.jargon = out.jargon.slice(0, 6);

  // Number extraction: percentages, large counts, time/units
  const picks = [];
  const push = (n, l) => { if (picks.length < 3 && !picks.some(p => p.n === n)) picks.push({ n, l, detected:true }); };
  (text.match(/\d[\d.,]*\s?%/g) || []).forEach(m => push(m.replace(/\s/g,''), 'highlighted in your abstract'));
  (text.match(/\b\d{1,3}(?:[.,]\d{3})+\b/g) || []).forEach(m => push(m, 'figure from your abstract'));
  (text.match(/\b\d+\s?(?:hours?|h|ms|years?|yr|min)\b/gi) || []).forEach(m => push(m.replace(/\s/g,''), 'metric from your abstract'));
  out.numbers = picks;
  return out;
}

/* ============================================================
   GENERATE RECOMMENDATIONS
============================================================ */
function showRecs() {
  document.getElementById('loading').classList.add('on');
  setTimeout(() => {
    document.getElementById('loading').classList.remove('on');
    renderRecs();
    go('recommendations');
  }, 1200);
}

function getRecs() {
  const ar = RECS[S.audience];
  if (ar && ar[S.objective]) return ar[S.objective];
  return fallbackRecs();
}

function fallbackRecs() {
  return {
    al: fmt(S.audience), ol: fmt(S.objective),
    msg:[
      { l:'Key finding', t:'Identify your single most important finding for this audience and state it in one sentence.' },
      { l:'Supporting evidence', t:'Select 2–3 specific numbers or outcomes that reinforce your key message.' },
      { l:'Call to action', t:'End with a clear, specific ask or recommendation.' }
    ],
    data:[
      { n:'?', l:'Your primary\noutcome metric' },
      { n:'?', l:'Sample size or\npopulation covered' },
      { n:'?', l:'Effect size or\npractical impact' }
    ],
    jargon:[
      { o:'Statistical significance', p:'reliable finding' },
      { o:'p < 0.05', p:'→ remove or explain in footnote' },
      { o:'Confidence interval', p:'→ remove from main text' }
    ],
    fmt:[
      { i:'📄', h:'Keep it to one page', p:'Most non-academic audiences will not read beyond the first page.' },
      { i:'💡', h:'Lead with impact, not method', p:'Start with what you found, not how you found it.' }
    ],
    prereq:[
      'State the one concept your audience must grasp before your main point lands.',
      'Name any term you use that they may not share.'
    ],
    qa:[
      { q:'Anticipate the obvious challenge', a:'Write the single hardest question this audience will ask — and your one-line answer.' }
    ]
  };
}

function renderRecs() {
  const r = getRecs();
  const custom = S.abstract && !isDemoAbstract(S.abstract);

  document.getElementById('rb-aud').textContent = r.al;
  document.getElementById('rb-obj').textContent = r.ol;

  // Audience profile card
  renderProfile(S.audience);

  // Hybrid jargon + data for custom abstracts
  let jargonList = r.jargon;
  let dataList = r.data;
  let dataNote = 'These are the numbers most likely to resonate with your audience. Lead with them.';
  if (custom) {
    const an = analyzeAbstract(S.abstract, S.audience);
    if (an.jargon.length) jargonList = an.jargon;
    if (an.numbers.length) { dataList = an.numbers; dataNote = 'Detected directly in your abstract — verify and lead with the strongest.'; }
  }

  // Message + prerequisite concepts + diagram
  document.getElementById('rp1-body').innerHTML =
    r.msg.map(m => `<div class="msg-item"><div class="msg-lbl">${m.l}</div><div class="msg-txt">${m.t}</div></div>`).join('')
    + renderPrereq(r.prereq)
    + `<div class="diagram-wrap">${buildDiagram(r)}</div>`;

  // Data
  document.getElementById('rp2-body').innerHTML =
    `<p class="rp-note">${dataNote}</p>
    <div class="data-grid">${dataList.map(d =>
      `<div class="dc${d.detected?' detected':''}"><div class="dc-num">${d.n}</div><div class="dc-lbl">${(d.l||'').replace(/\n/g,'<br>')}</div>${d.detected?'<span class="dc-flag">detected</span>':''}</div>`
    ).join('')}</div>`;

  // Jargon
  document.getElementById('rp3-body').innerHTML =
    `<p class="rp-note">${custom && jargonList!==r.jargon ? 'Technical terms found in <strong>your</strong> abstract — replace or remove for this audience.' : 'Replace or remove technical terms that your audience will not understand.'}</p>
    ${jargonList.length ? jargonList.map(j =>
      `<div class="jargon-row"><div class="jo">${j.o}</div><div class="ja">→</div><div class="jp">${j.p}</div></div>`
    ).join('') : '<p class="rp-note">No common jargon detected — nice. Still read aloud to catch terms specific to your field.</p>'}`;

  // Format
  document.getElementById('rp4-body').innerHTML =
    `<div class="fmt-list">${r.fmt.map(f =>
      `<div class="fmt-item"><div class="fmt-ico">${f.i}</div><div><h5>${f.h}</h5><p>${f.p}</p></div></div>`
    ).join('')}</div>`;

  // Q&A
  renderQA(r.qa);

  buildExport(r);
}

/* ---------- Prerequisite concepts (survey R5) ---------- */
function renderPrereq(prereq) {
  if (!prereq || !prereq.length) return '';
  return `<div class="prereq-box">
    <div class="prereq-h">What they need to know first</div>
    <ul class="prereq-list">${prereq.map(p => `<li>${p}</li>`).join('')}</ul>
  </div>`;
}

/* ---------- Audience profile (survey R11) ---------- */
function renderProfile(aud) {
  const p = AUD_PROFILE[aud];
  const el = document.getElementById('profile-card');
  if (!p || !el) { if (el) el.style.display = 'none'; return; }
  el.style.display = '';
  el.innerHTML = `
    <div class="profile-top">
      <div class="profile-emoji">${p.emoji}</div>
      <div><div class="profile-title">Audience profile — ${p.title}</div><div class="profile-sub">${p.sub} · ${p.attention}</div></div>
    </div>
    <div class="profile-grid">
      <div class="profile-item"><h6>What they care about</h6><p>${p.cares}</p></div>
      <div class="profile-item"><h6>Prior knowledge</h6><p>${p.knows}</p></div>
      <div class="profile-item"><h6>What convinces them</h6><p>${p.evidence}</p></div>
      <div class="profile-item"><h6>Red flags to avoid</h6><p>${p.avoid}</p></div>
    </div>`;
}

/* ---------- Q&A panel (survey R8) ---------- */
function renderQA(qa) {
  const el = document.getElementById('rp5-body');
  if (!el) return;
  if (!qa || !qa.length) { el.innerHTML = '<p class="rp-note">No anticipated questions for this combination.</p>'; return; }
  el.innerHTML = `<p class="rp-note">Rehearse these before you present — being ready for the hard question builds confidence.</p>`
    + qa.map(x => `<div class="qa-item"><div class="qa-q">${x.q}</div><div class="qa-a">${x.a}</div></div>`).join('');
}

/* ---------- SVG key-message diagram (survey R3/R4/R9) ---------- */
function buildDiagram(r) {
  const labels = r.msg.slice(0,3).map(m => m.l);
  const tiers = [
    { w:200, txt: labels[0] || 'Lead' },
    { w:320, txt: labels[1] || 'Support' },
    { w:440, txt: labels[2] || 'Ask' }
  ];
  const W = 480, rowH = 46, gap = 10, cx = W/2;
  const H = tiers.length * (rowH + gap) + 28;
  let y = 14;
  const blocks = tiers.map((t,i) => {
    const x = cx - t.w/2;
    const fill = i === 0 ? '#E86C2F' : (i === 1 ? '#2d4070' : '#1B2A4A');
    const b = `<g>
      <rect x="${x}" y="${y}" width="${t.w}" height="${rowH}" rx="6" fill="${fill}"></rect>
      <text x="${cx}" y="${y + rowH/2 + 4}" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="13" font-weight="600" fill="#ffffff">${escapeXml(t.txt)}</text>
    </g>`;
    const arrow = i < tiers.length-1
      ? `<path d="M${cx} ${y+rowH} L${cx} ${y+rowH+gap}" stroke="#D8D4CE" stroke-width="2" marker-end="url(#arr)"></path>` : '';
    y += rowH + gap;
    return b + arrow;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Key message structure diagram">
    <defs><marker id="arr" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L8 4 L0 8 z" fill="#D8D4CE"></path></marker></defs>
    ${blocks}
  </svg>`;
}
function escapeXml(s){ return (s||'').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])); }

/* ============================================================
   EXPORT
============================================================ */
function buildExport(r) {
  const secs = [];
  // Use the real message labels rather than hardcoded headers
  if (r.msg[1]) secs.push(`<div class="brief-sec"><h4>${r.msg[1].l}</h4><p>${r.msg[1].t}</p></div>`);
  secs.push(`<div class="brief-sec"><h4>Supporting data</h4>
      <p>${r.data.map(d => `<strong>${d.n}</strong> — ${(d.l||'').replace(/\n/g,' ')}`).join(' · ')}</p>
    </div>`);
  if (r.msg[2]) secs.push(`<div class="brief-sec"><h4>${r.msg[2].l}</h4><p>${r.msg[2].t}</p></div>`);

  document.getElementById('exp-preview').innerHTML = `
    <div class="brief-lbl">${EXP_LABELS[S.audience]||'RESEARCH SUMMARY'}</div>
    <div class="brief-h">${r.msg[0].t}</div>
    <div class="diagram-wrap" style="margin:18px 0;">${buildDiagram(r)}</div>
    <div class="divider"></div>
    ${secs.join('')}
    <div class="brief-sec">
      <h4>Plain language note</h4>
      <p style="font-size:12px;color:var(--muted);">Generated by ResearchBridge · Based on abstract provided by researcher · For review before distribution.</p>
    </div>`;
}

/* ============================================================
   PANEL TOGGLE
============================================================ */
function toggleRp(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
  const hdr = el.querySelector('.rp-hdr');
  if (hdr) hdr.setAttribute('aria-expanded', el.classList.contains('open') ? 'true' : 'false');
}

/* ============================================================
   EXPORT ACTIONS (simulated) — explicit event param (no global)
============================================================ */
function simDl(type, e) {
  const b = e.currentTarget;
  const orig = b.textContent;
  b.textContent = '✓ Download started';
  b.disabled = true;
  setTimeout(() => { b.textContent = orig; b.disabled = false; }, 2200);
}
function simCopy(e) {
  const b = e.currentTarget;
  b.textContent = '✓ Copied to clipboard!';
  setTimeout(() => { b.textContent = '📋 Copy text'; }, 2200);
}
function simShare(e) {
  const b = e.currentTarget;
  b.textContent = '✓ Link: researchbridge.app/share/demo-001';
  setTimeout(() => { b.textContent = '🔗 Share link'; }, 3000);
}

/* ============================================================
   RESET
============================================================ */
function reset() {
  S.abstract = ''; S.audience = null; S.objective = null;
  document.getElementById('ta').value = '';
  onTaInput();
  document.querySelectorAll('.aud-card').forEach(c => { c.classList.remove('sel'); c.setAttribute('aria-pressed','false'); });
  saveState();
  go('home');
}

function fmt(s) {
  if (!s) return '';
  return s.replace(/-/g,' ').replace(/\b\w/g, l => l.toUpperCase());
}

/* ============================================================
   INIT
============================================================ */
loadState();
if (S.abstract) { document.getElementById('ta').value = S.abstract; onTaInput(); }
go('home');
