/* ============================================================
   ResearchBridge — APP LOGIC
============================================================ */

/* ---------------- STATE ---------------- */
const S = { screen: 'home', example: null, abstract: '', audience: null, objective: null };

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
   EXAMPLE RESEARCH SUMMARIES (Step 1)
============================================================ */
// Guided example: pre-fills the summary AND the audience/objective, then opens Step 1.
function loadDemo(id) {
  const d = DEMOS[id];
  S.example = id; S.abstract = d.abstract; S.audience = d.audience; S.objective = d.objective;
  reflectExample(id);
  selAud(d.audience, false);
  buildObjs(d.audience);
  setTimeout(() => selObj(d.objective), 40);
  go('input');
}

// Constrained Step 1: choosing an example sets only the summary; the user picks audience/objective.
function pickExample(id) {
  const d = DEMOS[id];
  S.example = id; S.abstract = d.abstract;
  reflectExample(id);
  saveState();
}

// Highlight the chosen example card, show its abstract, enable Continue.
function reflectExample(id) {
  document.querySelectorAll('.ex-card').forEach(c => { c.classList.remove('sel'); c.setAttribute('aria-pressed','false'); });
  const c = document.getElementById('ex-' + id);
  if (c) { c.classList.add('sel'); c.setAttribute('aria-pressed','true'); }
  const prev = document.getElementById('ex-preview');
  const abs = document.getElementById('ex-abstract');
  if (DEMOS[id] && prev && abs) { abs.textContent = DEMOS[id].abstract; prev.style.display = ''; }
  const btn = document.getElementById('btn-in-next');
  if (btn) btn.disabled = !S.abstract;
}

function isDemoAbstract(text) {
  const t = (text||'').trim();
  return Object.values(DEMOS).some(d => d.abstract.trim() === t);
}

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
  const ex = RECS[S.example];
  if (ex && ex[S.audience] && ex[S.audience][S.objective]) return ex[S.audience][S.objective];
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

  // Key message (lead → support → ask) as a content-filled visual + prerequisites
  document.getElementById('rp1-body').innerHTML =
    `<p class="rp-note">Your message in three parts — lead with the impact, support it with evidence, then make the ask.</p>`
    + `<div class="diagram-wrap">${buildDiagram(r)}</div>`
    + renderPrereq(r.prereq);

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

/* ---------- Key-message diagram (survey R3/R4/R9) ----------
   Content-filled stacked tiers (lead → support → ask). HTML so the
   actual message text wraps and prints cleanly in the brief. */
function buildDiagram(r) {
  const defs = ['Lead with', 'Support with', 'The ask'];
  const cls = ['kp-lead', 'kp-support', 'kp-ask'];
  const widths = [82, 91, 100];
  const tiers = (r.msg || []).slice(0, 3).map((m, i) => ({
    cap: m.l || defs[i], txt: m.t, cls: cls[i], w: widths[i]
  })).filter(t => t.txt);
  return `<div class="keypyr">` + tiers.map(t =>
    `<div class="kp-tier ${t.cls}" style="width:${t.w}%">
       <div class="kp-cap">${esc(t.cap)}</div>
       <div class="kp-txt">${esc(t.txt)}</div>
     </div>`).join('') + `</div>`;
}
function esc(s) { return (s || '').replace(/[&<>]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c])); }

/* ============================================================
   EXPORT
============================================================ */
function buildExport(r) {
  LAST_R = r;
  const prereq = (r.prereq && r.prereq.length)
    ? `<div class="brief-sec"><h4>What they need to know first</h4><p>${r.prereq.map(esc).join(' · ')}</p></div>`
    : '';
  document.getElementById('exp-preview').innerHTML = `
    <div class="brief-lbl">${EXP_LABELS[S.audience]||'RESEARCH SUMMARY'}</div>
    <div class="brief-h">${esc(exportTitle())}<span class="brief-for"> — for ${esc(AUD_LABELS[S.audience]||'your audience')}</span></div>
    <div class="diagram-wrap" style="margin:20px 0;">${buildDiagram(r)}</div>
    <div class="divider"></div>
    <div class="brief-sec"><h4>Supporting data</h4>
      <p>${r.data.map(d => `<strong>${d.n}</strong> — ${(d.l||'').replace(/\n/g,' ')}`).join(' · ')}</p>
    </div>
    ${prereq}
    <div class="brief-sec">
      <h4>Plain language note</h4>
      <p style="font-size:12px;color:var(--muted);">Generated by ResearchBridge · Based on the selected research summary · For review before distribution.</p>
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
   EXPORT ACTIONS (real, dependency-free)
============================================================ */
let LAST_R = null; // most recently rendered recommendation set

function flash(btn, msg, ms = 2200) {
  const orig = btn.textContent;
  btn.textContent = msg;
  btn.disabled = true;
  setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, ms);
}

function exportTitle() {
  const t = S.example && DEMOS[S.example] ? DEMOS[S.example].title : 'Research summary';
  return t;
}

// Plain-text version of the brief (for clipboard + .txt)
function buildExportText(r) {
  if (!r) return '';
  const L = [];
  L.push((EXP_LABELS[S.audience] || 'RESEARCH SUMMARY') + ' — ' + r.al + ' · ' + r.ol);
  L.push('Topic: ' + exportTitle());
  L.push('');
  L.push(r.msg[0].t);
  L.push('');
  if (r.msg[1]) { L.push(r.msg[1].l.toUpperCase()); L.push(r.msg[1].t); L.push(''); }
  L.push('SUPPORTING DATA');
  L.push(r.data.map(d => `• ${d.n} — ${(d.l||'').replace(/\n/g,' ')}`).join('\n'));
  L.push('');
  if (r.msg[2]) { L.push(r.msg[2].l.toUpperCase()); L.push(r.msg[2].t); L.push(''); }
  if (r.prereq && r.prereq.length) { L.push('WHAT THEY NEED TO KNOW FIRST'); r.prereq.forEach(p => L.push('• ' + p)); L.push(''); }
  L.push('— Prepared with ResearchBridge');
  return L.join('\n');
}

// Markdown slide outline
function buildSlideOutline(r) {
  if (!r) return '';
  const L = [];
  L.push('# ' + exportTitle());
  L.push('_For ' + (AUD_LABELS[S.audience] || 'your audience') + ' · ' + r.ol + '_');
  L.push('');
  L.push('## Key message');
  L.push('- ' + r.msg[0].t);
  if (r.prereq && r.prereq.length) { L.push(''); L.push('## What they need to know first'); r.prereq.forEach(p => L.push('- ' + p)); }
  L.push(''); L.push('## Data to highlight');
  r.data.forEach(d => L.push(`- **${d.n}** — ${(d.l||'').replace(/\n/g,' ')}`));
  if (r.msg[1]) { L.push(''); L.push('## ' + r.msg[1].l); L.push('- ' + r.msg[1].t); }
  if (r.msg[2]) { L.push(''); L.push('## ' + r.msg[2].l); L.push('- ' + r.msg[2].t); }
  if (r.qa && r.qa.length) { L.push(''); L.push('## Likely questions'); r.qa.forEach(x => L.push(`- **${x.q}** ${x.a}`)); }
  L.push(''); L.push('---'); L.push('_Prepared with ResearchBridge_');
  return L.join('\n');
}

function downloadFile(name, text, mime) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function slug() { return (exportTitle() || 'researchbridge').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

// Download as PDF → browser print dialog (Save as PDF); print CSS shows only the brief.
function exportPdf(e) {
  const b = e.currentTarget;
  flash(b, '🖨 Opening print…', 1200);
  setTimeout(() => window.print(), 250);
}

function exportSlides(e) {
  downloadFile(slug() + '-slide-outline.md', buildSlideOutline(LAST_R), 'text/markdown');
  flash(e.currentTarget, '✓ Outline downloaded');
}

function copyText(e) {
  const text = buildExportText(LAST_R);
  const b = e.currentTarget;
  const ok = () => flash(b, '✓ Copied to clipboard');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(ok).catch(() => { legacyCopy(text); ok(); });
  } else { legacyCopy(text); ok(); }
}

function shareLink(e) {
  const link = 'https://researchbridge-prototype.vercel.app/?example=' + (S.example || '') + '&audience=' + (S.audience || '') + '&objective=' + (S.objective || '');
  const b = e.currentTarget;
  const ok = () => flash(b, '✓ Share link copied');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(ok).catch(() => { legacyCopy(link); ok(); });
  } else { legacyCopy(link); ok(); }
}

function legacyCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (err) {}
  ta.remove();
}

/* ============================================================
   RESET
============================================================ */
function reset() {
  S.example = null; S.abstract = ''; S.audience = null; S.objective = null;
  document.querySelectorAll('.ex-card, .aud-card').forEach(c => { c.classList.remove('sel'); c.setAttribute('aria-pressed','false'); });
  const prev = document.getElementById('ex-preview'); if (prev) prev.style.display = 'none';
  const btn = document.getElementById('btn-in-next'); if (btn) btn.disabled = true;
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
if (S.example && DEMOS[S.example]) { reflectExample(S.example); }
go('home');
