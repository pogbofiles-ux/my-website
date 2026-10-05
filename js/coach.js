/* =========================================================
   AI COACH — chat assistant that builds a personalized routine.
   Works 100% in the browser (rule-based planner over the exercise
   database), so it is free, instant and works offline.
   ========================================================= */
(function () {
  const I = window.I18N;
  const t = (k, v) => I.t(k, v);

  /* ---------- Day templates: slots in priority order ---------- */
  const S = (k, ...c) => ({ k, c });
  const TPL = {
    fullA: [S('c', 'back-squat', 'goblet-squat', 'leg-press', 'air-squat'), S('c', 'barbell-bench-press', 'dumbbell-bench-press', 'machine-chest-press', 'push-up'),
      S('c', 'barbell-row', 'seated-cable-row', 'one-arm-dumbbell-row', 'lat-pulldown'), S('c', 'romanian-deadlift', 'dumbbell-rdl', 'glute-bridge'),
      S('a', 'seated-dumbbell-press', 'overhead-press', 'lateral-raise', 'diamond-push-up'), S('a', 'dumbbell-curl', 'barbell-curl', 'hammer-curl'),
      S('a', 'rope-pushdown', 'overhead-dumbbell-extension', 'bench-dip', 'diamond-push-up'), S('a', 'plank', 'crunch')],
    fullB: [S('c', 'deadlift', 'romanian-deadlift', 'dumbbell-rdl', 'hip-thrust', 'glute-bridge'), S('c', 'pull-up', 'lat-pulldown', 'chin-up', 'one-arm-dumbbell-row'),
      S('c', 'incline-dumbbell-press', 'incline-barbell-press', 'push-up'), S('c', 'leg-press', 'bulgarian-split-squat', 'lunge', 'goblet-squat', 'air-squat'),
      S('a', 'lateral-raise', 'cable-lateral-raise'), S('a', 'face-pull', 'reverse-fly', 'reverse-pec-deck'),
      S('a', 'triceps-pushdown', 'skull-crusher', 'overhead-dumbbell-extension', 'bench-dip'), S('a', 'hanging-knee-raise', 'lying-leg-raise')],
    fullC: [S('c', 'front-squat', 'goblet-squat', 'hack-squat', 'lunge', 'air-squat'), S('c', 'dumbbell-bench-press', 'chest-dip', 'push-up'),
      S('c', 'seated-cable-row', 'one-arm-dumbbell-row', 'barbell-row'), S('c', 'hip-thrust', 'glute-bridge'),
      S('a', 'arnold-press', 'seated-dumbbell-press', 'lateral-raise'), S('a', 'incline-dumbbell-curl', 'hammer-curl', 'dumbbell-curl'),
      S('a', 'pallof-press', 'side-plank', 'russian-twist'), S('a', 'standing-calf-raise', 'seated-calf-raise')],
    push: [S('c', 'barbell-bench-press', 'dumbbell-bench-press', 'machine-chest-press', 'push-up'), S('c', 'overhead-press', 'seated-dumbbell-press', 'arnold-press'),
      S('c', 'incline-dumbbell-press', 'incline-barbell-press', 'diamond-push-up'), S('a', 'lateral-raise', 'cable-lateral-raise'),
      S('a', 'cable-crossover', 'pec-deck', 'dumbbell-fly', 'push-up'), S('a', 'rope-pushdown', 'triceps-pushdown', 'bench-dip'),
      S('a', 'overhead-dumbbell-extension', 'overhead-cable-extension', 'skull-crusher'), S('a', 'chest-dip', 'diamond-push-up')],
    pull: [S('c', 'pull-up', 'lat-pulldown', 'chin-up'), S('c', 'barbell-row', 'seated-cable-row', 'one-arm-dumbbell-row', 't-bar-row'),
      S('c', 'one-arm-dumbbell-row', 'seated-cable-row', 'close-grip-pulldown'), S('a', 'face-pull', 'reverse-fly', 'reverse-pec-deck'),
      S('a', 'barbell-curl', 'dumbbell-curl', 'cable-curl'), S('a', 'hammer-curl', 'incline-dumbbell-curl'),
      S('a', 'straight-arm-pulldown', 'dumbbell-pullover'), S('a', 'barbell-shrug', 'dumbbell-shrug', 'farmers-walk')],
    legs: [S('c', 'back-squat', 'goblet-squat', 'front-squat', 'hack-squat', 'air-squat'), S('c', 'romanian-deadlift', 'dumbbell-rdl', 'good-morning', 'glute-bridge'),
      S('c', 'leg-press', 'bulgarian-split-squat', 'lunge'), S('a', 'lying-leg-curl', 'seated-leg-curl', 'nordic-curl'),
      S('a', 'leg-extension', 'step-up', 'lunge'), S('a', 'hip-thrust', 'glute-bridge'),
      S('a', 'standing-calf-raise', 'machine-calf-raise', 'seated-calf-raise'), S('a', 'hanging-leg-raise', 'lying-leg-raise', 'plank')],
    upper: [S('c', 'barbell-bench-press', 'dumbbell-bench-press', 'push-up'), S('c', 'barbell-row', 'one-arm-dumbbell-row', 'seated-cable-row'),
      S('c', 'seated-dumbbell-press', 'overhead-press', 'diamond-push-up'), S('c', 'lat-pulldown', 'pull-up', 'chin-up', 'dumbbell-pullover'),
      S('a', 'lateral-raise', 'cable-lateral-raise'), S('a', 'dumbbell-curl', 'barbell-curl', 'hammer-curl'),
      S('a', 'rope-pushdown', 'overhead-dumbbell-extension', 'bench-dip'), S('a', 'face-pull', 'reverse-fly')],
    lower: [S('c', 'back-squat', 'goblet-squat', 'leg-press', 'air-squat'), S('c', 'romanian-deadlift', 'dumbbell-rdl', 'glute-bridge'),
      S('c', 'bulgarian-split-squat', 'lunge', 'step-up'), S('a', 'lying-leg-curl', 'seated-leg-curl', 'nordic-curl'),
      S('a', 'hip-thrust', 'glute-bridge'), S('a', 'leg-extension', 'goblet-squat', 'step-up'),
      S('a', 'standing-calf-raise', 'seated-calf-raise'), S('a', 'plank', 'crunch', 'cable-crunch')],
  };
  const FOCUS = {
    upper: ['lateral-raise', 'dumbbell-curl', 'rope-pushdown', 'incline-dumbbell-press', 'face-pull', 'diamond-push-up', 'push-up'],
    lower: ['hip-thrust', 'bulgarian-split-squat', 'lying-leg-curl', 'standing-calf-raise', 'glute-bridge', 'lunge', 'air-squat'],
    core: ['plank', 'hanging-knee-raise', 'pallof-press', 'cable-crunch', 'side-plank', 'russian-twist', 'lying-leg-raise'],
  };
  const SPLITS = {
    2: { name: 'sp_full', days: ['fullA', 'fullB'] },
    3: { name: 'sp_full', days: ['fullA', 'fullB', 'fullC'] },
    '3x': { name: 'sp_ppl', days: ['push', 'pull', 'legs'] },
    4: { name: 'sp_ul', days: ['upper', 'lower', 'upper', 'lower'] },
    5: { name: 'sp_pplul', days: ['push', 'pull', 'legs', 'upper', 'lower'] },
    6: { name: 'sp_ppl', days: ['push', 'pull', 'legs', 'push', 'pull', 'legs'] },
  };
  const DAYNAME = { fullA: 'd_fullA', fullB: 'd_fullB', fullC: 'd_fullC', push: 'd_push', pull: 'd_pull', legs: 'd_legs', upper: 'd_upper', lower: 'd_lower' };

  function plan(a) {
    const { EX } = window.GR_DATA;
    const { canDoWith, getGym, ALL_EQ } = window.GR;
    const eqSet = a.equip === 'full' ? new Set(ALL_EQ) : a.equip === 'mygym' ? getGym() : a.equip === 'home' ? new Set(['dumbbells', 'bench']) : new Set();
    const maxLvl = a.level === 1 || a.age >= 60 ? 2 : 3;
    const ok = (id) => { const e = window.GR.exById(id); return e && canDoWith(e, eqSet) && e.lvl <= maxLvl; };
    const split = SPLITS[a.days === 3 && a.level >= 2 ? '3x' : a.days];
    const nEx = { 30: 4, 45: 5, 60: 6, 75: 7, 90: 8 }[a.time] || 6;
    const seen = {};
    const days = split.days.map((key, di) => {
      const v = seen[key] = (seen[key] == null ? 0 : seen[key] + 1); // repeated day type → pick a different variant
      const used = new Set();
      const items = [];
      const pick = (cands, role) => {
        const order = cands.slice(v % cands.length).concat(cands.slice(0, v % cands.length));
        let id = order.find((x) => ok(x) && !used.has(x)) || cands.find((x) => ok(x) && !used.has(x));
        if (!id) { // fallback: any exercise of the same muscle available
          const m = (window.GR.exById(cands[0]) || {}).m;
          const alt = EX.find((e) => e.m === m && ok(e.id) && !used.has(e.id));
          id = alt && alt.id;
        }
        if (id) { used.add(id); items.push(prescribe(id, role, a)); }
      };
      TPL[key].forEach((slot) => { if (items.length < nEx) pick(slot.c, slot.k); });
      if (a.focus !== 'none') {
        const f = FOCUS[a.focus].slice(di % 3).concat(FOCUS[a.focus]).find((x) => ok(x) && !used.has(x));
        if (f) { if (items.length >= nEx) items.pop(); items.splice(Math.min(2, items.length), 0, prescribe(f, 'a', a)); used.add(f); }
      }
      return { name: t(DAYNAME[key]), items };
    });
    return { split: t(split.name), days, notes: notes(a) };
  }

  function prescribe(id, role, a) {
    const e = window.GR.exById(id);
    const timed = /\bs\b|\bm\b|\(|per\s/.test(e.reps.split('×')[1] || '');
    const P = {
      strength: role === 'c' ? [5, '3-5', 180] : [3, '8-10', 90],
      muscle: role === 'c' ? [4, '6-10', 120] : [3, '10-15', 75],
      fat: role === 'c' ? [3, '10-12', 60] : [3, '12-15', 45],
      fit: role === 'c' ? [3, '8-12', 90] : [3, '10-15', 60],
    }[a.goal];
    let [sets, reps, rest] = P;
    if (a.level === 1 || a.age >= 55) sets = Math.max(2, sets - 1);
    if (a.age >= 55 && a.goal === 'strength') reps = '6-8';
    if (timed) reps = e.reps.split('×')[1].trim();
    return { id, sets, reps, rest };
  }

  function notes(a) {
    const out = [];
    const h = a.height / 100, bmi = a.weight / (h * h);
    const cat = bmi < 18.5 ? 'bmi_low' : bmi < 25 ? 'bmi_ok' : bmi < 30 ? 'bmi_high' : 'bmi_vhigh';
    out.push(t('ai_bmi', { b: bmi.toFixed(1), c: t(cat) }));
    const p = { muscle: 1.8, strength: 1.8, fat: 2.0, fit: 1.4 }[a.goal];
    out.push(t('ai_protein', { g: Math.round(a.weight * p), p }));
    out.push(t('ai_water', { l: (a.weight * 0.035).toFixed(1) }));
    out.push(t({ muscle: 'adv_muscle', strength: 'adv_strength', fat: 'adv_fat', fit: 'adv_fit' }[a.goal]));
    if (a.level === 1) out.push(t('adv_beginner'));
    if (a.age >= 50) out.push(t('adv_older'));
    if (a.age < 16) out.push(t('adv_young'));
    return out;
  }

  /* ---------- UI ---------- */
  const ROBOT = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="10" width="20" height="15" rx="5"/><path d="M16 5v5M12 17h.01M20 17h.01M12.5 21h7M3 16v4M29 16v4"/><circle cx="16" cy="4" r="1.5" fill="currentColor"/></svg>';
  const root = document.createElement('div');
  root.className = 'coach';
  root.innerHTML = `
    <button class="coach-fab" aria-label="AI"><span class="ring"></span><span class="ring r2"></span>${ROBOT}</button>
    <div class="coach-bubble" hidden><button class="cb-x" aria-label="x">✕</button><b class="cb-name"></b><p class="cb-msg"></p><button class="btn red cb-go"></button></div>
    <div class="coach-panel" hidden role="dialog">
      <div class="cp-head"><span class="cp-av">${ROBOT}</span><div><b class="cp-name"></b><small class="cp-status"></small></div><button class="cp-x" aria-label="x">✕</button></div>
      <div class="cp-msgs"></div>
      <form class="cp-input" hidden><input type="number" inputmode="numeric"><button class="btn red" type="submit">➤</button></form>
      <div class="cp-foot"></div>
    </div>`;
  document.body.appendChild(root);
  const $ = (s) => root.querySelector(s);
  const fab = $('.coach-fab'), bubble = $('.coach-bubble'), panel = $('.coach-panel'), msgs = $('.cp-msgs'), form = $('.cp-input'), inp = form.querySelector('input');

  function texts() {
    fab.setAttribute('aria-label', t('ai_open'));
    $('.cb-name').textContent = t('ai_name');
    $('.cb-msg').textContent = t('ai_bubble');
    $('.cb-go').textContent = t('ai_bubble_btn');
    $('.cp-name').textContent = t('ai_name');
    $('.cp-status').textContent = t('ai_status');
    $('.cp-foot').textContent = t('ai_disclaimer');
    inp.placeholder = t('type_ph');
  }

  let A = {}, step = 0, token = 0;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const scroll = () => { msgs.scrollTop = msgs.scrollHeight; };
  async function bot(html, delay) {
    const my = token;
    const typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typing); scroll();
    await sleep(delay == null ? 650 : delay);
    if (my !== token) return null;
    typing.remove();
    const m = document.createElement('div');
    m.className = 'msg bot';
    m.innerHTML = html;
    msgs.appendChild(m); scroll();
    return m;
  }
  function user(text) {
    const m = document.createElement('div');
    m.className = 'msg user';
    m.textContent = text;
    msgs.appendChild(m); scroll();
  }
  function options(list, cb) {
    const wrap = document.createElement('div');
    wrap.className = 'msg-opts';
    list.forEach(([val, label]) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.onclick = () => { wrap.remove(); user(label); cb(val); };
      wrap.appendChild(b);
    });
    msgs.appendChild(wrap); scroll();
  }
  function ask(min, max, cb) {
    form.hidden = false;
    inp.value = ''; inp.min = min; inp.max = max;
    setTimeout(() => inp.focus(), 50);
    form.onsubmit = async (ev) => {
      ev.preventDefault();
      const v = parseFloat(String(inp.value).replace(',', '.'));
      if (!(v >= min && v <= max)) { await bot(t('ai_invalid', { a: min, b: max }), 300); return; }
      form.hidden = true;
      user(String(v));
      cb(v);
    };
  }

  const FLOW = [
    async () => { await bot(t('q_goal')); options([['muscle', t('g_muscle')], ['fat', t('g_fat')], ['strength', t('g_strength')], ['fit', t('g_fit')]], (v) => next('goal', v)); },
    async () => { await bot(t('q_level')); options([[1, t('l1')], [2, t('l2')], [3, t('l3')]], (v) => next('level', v)); },
    async () => { await bot(t('q_age')); ask(12, 90, (v) => next('age', Math.round(v))); },
    async () => { await bot(t('q_weight')); ask(30, 250, (v) => next('weight', v)); },
    async () => { await bot(t('q_height')); ask(120, 230, (v) => next('height', v)); },
    async () => { await bot(t('q_days')); options([2, 3, 4, 5, 6].map((n) => [n, t('days_n', { n })]), (v) => next('days', v)); },
    async () => { await bot(t('q_time')); options([30, 45, 60, 75, 90].map((n) => [n, t('min_n', { n })]), (v) => next('time', v)); },
    async () => { await bot(t('q_equip')); options([['full', t('e_full')], ['mygym', t('e_mygym')], ['home', t('e_home')], ['body', t('e_body')]], (v) => next('equip', v)); },
    async () => { await bot(t('q_focus')); options([['none', t('f_none')], ['upper', t('f_upper')], ['lower', t('f_lower')], ['core', t('f_core')]], (v) => next('focus', v)); },
    result,
  ];
  function next(k, v) { A[k] = v; step++; FLOW[step](); }

  async function result() {
    const my = token;
    await bot(`<span class="thinking">${t('thinking')}</span>`, 500);
    await sleep(900);
    if (my !== token) return;
    const P = plan(A);
    const { esc, exById } = window.GR;
    const goalLabel = { muscle: t('g_muscle'), fat: t('g_fat'), strength: t('g_strength'), fit: t('g_fit') }[A.goal].replace(/^\S+\s/, '');
    const html = `<b>${t('ai_done')}</b><div class="plan-split">${t('ai_split', { x: P.split })}</div>
      ${P.days.map((d) => `<div class="plan-day"><b>${esc(d.name)}</b><ol>${d.items.map((it) => `<li><a href="#/e/${it.id}">${esc(I.ex(exById(it.id), 'n'))}</a><span><bdi dir="ltr">${it.sets} × ${esc(I.reps(String(it.reps)))}</bdi></span></li>`).join('')}</ol></div>`).join('')}
      <ul class="plan-notes">${P.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`;
    await bot(html, 300);
    const wrap = document.createElement('div');
    wrap.className = 'msg-opts';
    const save = document.createElement('button');
    save.className = 'primary';
    save.textContent = t('ai_save');
    save.onclick = async () => {
      const r = window.GRRoutines.create(t('ai_routine_name', { g: goalLabel }), P.days);
      r.meta = { ai: true, answers: A, notes: P.notes };
      window.GRRoutines.persist();
      wrap.remove();
      await bot(t('ai_saved'), 300);
      setTimeout(() => { location.hash = '#/r/' + r.id; if (innerWidth < 760) close(); }, 600);
    };
    const again = document.createElement('button');
    again.textContent = t('ai_restart');
    again.onclick = start;
    wrap.append(save, again);
    msgs.appendChild(wrap); scroll();
  }

  async function start() {
    token++;
    A = {}; step = 0;
    msgs.innerHTML = '';
    form.hidden = true;
    await bot(t('ai_hello'), 400);
    FLOW[0]();
  }
  function open() {
    clearTimeout(bubbleTimer);
    hideBubble(true);
    panel.hidden = false;
    root.classList.add('open');
    if (!msgs.children.length) start();
  }
  function close() { panel.hidden = true; root.classList.remove('open'); }
  function hideBubble(remember) {
    bubble.hidden = true;
    if (remember) try { sessionStorage.setItem('gr_coach_seen', '1'); } catch (e) { /* no storage */ }
  }
  fab.onclick = () => (panel.hidden ? open() : close());
  $('.cp-x').onclick = close;
  $('.cb-x').onclick = () => hideBubble(true);
  $('.cb-go').onclick = open;

  let bubbleTimer = null;
  window.addEventListener('pagechange', (ev) => {
    clearTimeout(bubbleTimer);
    root.classList.toggle('docked', ev.detail !== 'home');
    let seen = false;
    try { seen = sessionStorage.getItem('gr_coach_seen') === '1'; } catch (e) { /* no storage */ }
    if (ev.detail === 'home' && !seen && panel.hidden) bubbleTimer = setTimeout(() => { if (panel.hidden) bubble.hidden = false; }, 1200);
    else bubble.hidden = true;
  });
  window.addEventListener('langchange', () => { texts(); if (!panel.hidden || msgs.children.length) { msgs.innerHTML = ''; if (!panel.hidden) start(); } });
  texts();

  window.GRCoach = { open, close, plan };
})();
