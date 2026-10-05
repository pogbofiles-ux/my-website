/* =========================================================
   APP — The Gym Rat Bible
   Hash router:  #/  ·  #/c/upper  ·  #/m/triceps  ·  #/e/skull-crusher
                 #/routines  ·  #/r/<routineId>
   ========================================================= */
(function () {
  const { EQUIP, CATS, MUSCLES, EX } = window.GR_DATA;
  const I = window.I18N;
  const t = (k, v) => I.t(k, v);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const app = $('#app');
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------------- My gym (available equipment) ---------------- */
  const ALL_EQ = Object.keys(EQUIP).filter((k) => k !== 'bodyweight');
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* no storage available */ } },
  };
  let gym = new Set(store.get('gr_gym_en', ALL_EQ));
  let hideNA = store.get('gr_hide', false);
  const gymCustom = () => gym.size < ALL_EQ.length;
  const canDoWith = (e, set) => e.eq.every((item) => item.split('/').some((x) => x === 'bodyweight' || set.has(x)));
  const canDo = (e) => canDoWith(e, gym);
  const eqLabel = (item) => item.split('/').map((x) => I.eq(x)).join(t('or'));
  const exFor = (mid) => EX.filter((e) => e.m === mid || e.also.includes(mid));
  const exById = (id) => EX.find((x) => x.id === id);

  /* ---------------- SVG body map ---------------- */
  const SIL = `
    <ellipse cx="100" cy="38" rx="19" ry="23"/>
    <rect x="90" y="56" width="20" height="20" rx="6"/>
    <path d="M60,82 Q100,68 140,82 L148,120 Q143,170 133,204 L130,234 L70,234 L67,204 Q57,170 52,120 Z"/>
    <g><rect x="35" y="84" width="22" height="82" rx="11" transform="rotate(9 46 125)"/>
    <rect x="25" y="160" width="19" height="76" rx="9.5" transform="rotate(7 34 198)"/>
    <ellipse cx="29" cy="246" rx="8" ry="11"/>
    <path d="M70,232 L100,238 L97,332 L76,332 Q64,282 70,232 Z"/>
    <path d="M76,336 L96,336 L94,398 L82,398 Q71,366 76,336 Z"/>
    <ellipse cx="87" cy="406" rx="11" ry="6"/></g>`;
  const MAP = {
    front: [
      ['traps', '<path d="M82,76 L100,71 L118,76 L126,84 L74,84 Z"/>', false],
      ['shoulders', '<ellipse cx="61" cy="93" rx="14" ry="15"/>', true],
      ['chest', '<path d="M99,92 L99,125 Q85,131 71,124 Q63,112 69,97 Q83,88 99,92 Z"/>', true],
      ['biceps', '<ellipse cx="47" cy="128" rx="9" ry="22" transform="rotate(9 47 128)"/>', true],
      ['forearms', '<ellipse cx="35" cy="192" rx="8" ry="26" transform="rotate(7 35 192)"/>', true],
      ['abs', '<rect x="88" y="134" width="11" height="22" rx="4"/><rect x="88" y="159" width="11" height="22" rx="4"/><rect x="88" y="184" width="11" height="26" rx="4"/>', true],
      ['obliques', '<path d="M70,140 Q65,172 74,202 L85,208 L85,140 Z"/>', true],
      ['quads', '<ellipse cx="83" cy="283" rx="12" ry="42"/>', true],
      ['adductors', '<ellipse cx="95.5" cy="262" rx="4" ry="22"/>', true],
      ['calves', '<ellipse cx="81" cy="362" rx="5" ry="22"/>', true],
    ],
    back: [
      ['traps', '<path d="M100,70 L124,84 L112,98 L100,142 L88,98 L76,84 Z"/>', false],
      ['shoulders', '<ellipse cx="61" cy="93" rx="14" ry="15"/>', true],
      ['back', '<path d="M73,104 Q64,142 79,182 L97,172 L96,112 Z"/>', true],
      ['triceps', '<ellipse cx="47" cy="128" rx="9" ry="22" transform="rotate(9 47 128)"/>', true],
      ['forearms', '<ellipse cx="35" cy="192" rx="8" ry="26" transform="rotate(7 35 192)"/>', true],
      ['lowerback', '<rect x="89" y="178" width="22" height="40" rx="8"/>', false],
      ['glutes', '<ellipse cx="86" cy="248" rx="15" ry="18"/>', true],
      ['hamstrings', '<ellipse cx="84" cy="298" rx="11" ry="33"/>', true],
      ['calves', '<ellipse cx="84" cy="362" rx="10" ry="23"/>', true],
    ],
  };
  function bodySVG(side, opts) {
    const zones = opts.zones || new Set(), hot = opts.hot;
    let mus = '';
    MAP[side].forEach(([mid, shape, mirror]) => {
      const cls = 'bm-m ' + (mid === hot ? 'zone hot' : zones.has(mid) ? 'zone' : 'off');
      mus += `<g class="${cls}" data-m="${mid}">${shape}${mirror ? `<g transform="matrix(-1 0 0 1 200 0)">${shape}</g>` : ''}</g>`;
    });
    const face = side === 'front' ? '<circle cx="93" cy="36" r="2" fill="#ff1f3d"/><circle cx="107" cy="36" r="2" fill="#ff1f3d"/>' : '';
    return `<svg viewBox="0 0 200 420" role="img" aria-label="${side}" direction="ltr">
      <g class="bm-sil">${SIL}<g transform="matrix(-1 0 0 1 200 0)">${SIL}</g></g>${face}${mus}</svg>`;
  }

  /* ---------------- Figures ---------------- */
  function mountFigs(root) {
    $$('[data-fig]', root).forEach((el) => {
      const e = exById(el.dataset.fig);
      if (!e) return;
      el._fig = new window.GRFigure(el, { p: e.anim, w: e.w }, { muscle: el.dataset.mus || e.m });
    });
  }
  const lvlDots = (l, label) => `<span class="lvl-dots">${[1, 2, 3].map((i) => `<i class="${i <= l ? 'on' : ''}"></i>`).join('')}${label ? `<em>${I.lvl(l)}</em>` : ''}</span>`;
  const viewOf = (e) => ((window.GR_PATTERNS[e.anim] || {}).view === 'front' ? t('front_view') : t('side_view'));
  const resN = (n) => t(n === 1 ? 'res_one' : 'res_other', { n });

  function exCard(e, mid) {
    const na = !canDo(e);
    return `<button class="ecard ${na ? 'dim' : ''}" data-open="${e.id}" data-mus="${mid}">
      <div class="stage"><div class="fig" data-fig="${e.id}" data-mus="${mid}"></div>
        <div class="lvl">${lvlDots(e.lvl)}</div><div class="view">${viewOf(e)}</div>
        ${na ? `<div class="na"><span class="tag">${t('not_available')}</span></div>` : ''}</div>
      <div class="body"><h4>${esc(I.ex(e, 'n'))}</h4>
        <div class="tags">${e.z.filter((z) => !mid || MUSCLES[mid].zones[z]).map((z) => `<span class="tag red">${I.zone(z)}</span>`).join('')}</div>
        <div class="eq">${ICON.dumb} ${e.eq.map(eqLabel).join(' · ')}</div></div></button>`;
  }
  const ICON = {
    dumb: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/></svg>',
  };

  /* ---------------- VIEWS ---------------- */
  function viewHome() {
    const card = (k, i, fig) => {
      const c = CATS[k];
      const n = new Set(c.muscles.flatMap((m) => exFor(m).map((e) => e.id))).size;
      return `<a class="cat" href="#/c/${k}"><span class="num">0${i} — ${t('n_ex', { n })}</span><h2>${I.cat(k, 'name')}</h2>
        <span class="mus">${c.muscles.map((m) => I.mus(m)).join(' · ')}</span>
        <div class="fig" data-fig="${fig[0]}" data-mus="${fig[1]}"></div>
        <div class="go"><span>${t('enter', { x: I.cat(k, 'full').toLowerCase() })}</span><span class="arrow">→</span></div></a>`;
    };
    app.innerHTML = `<section class="page"><div class="hero">
        <span class="kicker">${t('kicker')}</span>
        <h1><span class="neon">${t('hero1')}</span><br><span class="stroke">${t('hero2')}</span></h1>
        <p>${t('hero_p')}</p>
        <div class="hero-cta"><a class="btn red" href="#/c/upper">${I.cat('upper', 'full')} →</a><button class="btn" data-coach>${t('rt_ai')}</button></div>
        <div class="stats"><div><b>${EX.length}</b><span>${t('stat_ex')}</span></div><div><b>${Object.keys(MUSCLES).length}</b><span>${t('stat_mus')}</span></div><div><b>${Object.values(MUSCLES).reduce((a, m) => a + Object.keys(m.zones).length, 0)}</b><span>${t('stat_zones')}</span></div><div><b>${Object.keys(window.GR_PATTERNS).length}</b><span>${t('stat_anim')}</span></div></div>
      </div>
      <div class="cats">${card('upper', 1, ['overhead-press', 'shoulders'])}${card('lower', 2, ['back-squat', 'quads'])}${card('core', 3, ['hanging-leg-raise', 'abs'])}</div>
      <div class="steps">
        <div class="step"><b>01</b><h4>${t('step1_t')}</h4><p>${t('step1_d')}</p></div>
        <div class="step"><b>02</b><h4>${t('step2_t')}</h4><p>${t('step2_d')}</p></div>
        <div class="step"><b>03</b><h4>${t('step3_t')}</h4><p>${t('step3_d')}</p></div>
        <div class="step"><b>04</b><h4>${t('step4_t')}</h4><p>${t('step4_d')}</p></div>
      </div></section>`;
    mountFigs(app);
  }

  function viewCat(k) {
    const c = CATS[k];
    if (!c) return viewHome();
    const zones = new Set(c.muscles);
    app.innerHTML = `<section class="page">
      <div class="crumbs"><a href="#/">${t('home')}</a><i>/</i><span>${I.cat(k, 'name')}</span></div>
      <div class="ph"><div><h1>${I.cat(k, 'full').replace(/(\S+)$/, '<em>$1</em>')}</h1><p>${I.cat(k, 'desc')}</p></div></div>
      <div class="cat-layout">
        <div class="bodymap"><div class="bm-toggle"><button data-side="front" class="on">${t('front')}</button><button data-side="back">${t('back')}</button></div>
          <div class="bm-svg"></div><div class="bm-hint">${t('tap_muscle')}</div></div>
        <div class="mgrid">${c.muscles.map((m) => `<a class="mcard" href="#/m/${m}" data-m="${m}"><span class="count">${t('n_ex', { n: exFor(m).length })}</span><h3>${I.mus(m)}</h3><p>${I.mus(m, 'desc')}</p>
            <div class="zones">${Object.keys(MUSCLES[m].zones).map((z) => `<span class="tag">${I.zone(z)}</span>`).join('')}</div></a>`).join('')}</div></div></section>`;
    const holder = $('.bm-svg', app), hint = $('.bm-hint', app);
    const sideHas = (side) => MAP[side].some(([m]) => zones.has(m));
    let side = sideHas('front') ? 'front' : 'back';
    const draw = () => {
      holder.innerHTML = bodySVG(side, { zones });
      $$('.bm-toggle button', app).forEach((b) => b.classList.toggle('on', b.dataset.side === side));
    };
    draw();
    $$('.bm-toggle button', app).forEach((b) => (b.onclick = () => { side = b.dataset.side; draw(); }));
    holder.addEventListener('click', (ev) => { const g = ev.target.closest('.bm-m.zone'); if (g) location.hash = '#/m/' + g.dataset.m; });
    const hl = (m) => {
      $$('.mcard', app).forEach((x) => x.classList.toggle('hot', x.dataset.m === m));
      $$('.bm-m', holder).forEach((x) => x.classList.toggle('hot', x.dataset.m === m && zones.has(m)));
      hint.innerHTML = m && zones.has(m) ? `<b>${I.mus(m)}</b> · ${t('n_ex', { n: exFor(m).length })}` : t('tap_muscle');
    };
    holder.addEventListener('mouseover', (ev) => { const g = ev.target.closest('.bm-m'); hl(g ? g.dataset.m : null); });
    holder.addEventListener('mouseleave', () => hl(null));
    $$('.mcard', app).forEach((x) => {
      x.onmouseenter = () => {
        const m = x.dataset.m;
        if (!MAP[side].some(([mm]) => mm === m)) { side = side === 'front' ? 'back' : 'front'; draw(); }
        hl(m);
      };
      x.onmouseleave = () => hl(null);
    });
  }

  const filterState = {};
  function viewMuscle(mid) {
    const M = MUSCLES[mid];
    if (!M) return viewHome();
    const list = exFor(mid);
    const fs = filterState[mid] || (filterState[mid] = { zone: null, eq: null, lvl: null });
    const eqs = [...new Set(list.flatMap((e) => e.eq.flatMap((i) => i.split('/'))))].filter((x) => EQUIP[x]);
    const inFront = MAP.front.some(([m]) => m === mid), inBack = MAP.back.some(([m]) => m === mid);
    app.innerHTML = `<section class="page">
      <div class="crumbs"><a href="#/">${t('home')}</a><i>/</i><a href="#/c/${M.cat}">${I.cat(M.cat, 'name')}</a><i>/</i><span>${I.mus(mid)}</span></div>
      <div class="mus-head">
        <div class="mus-info"><span class="tag red">${I.cat(M.cat, 'full')}</span>
          <div class="ph" style="margin:12px 0 0"><div><h1>${I.mus(mid)}</h1><p>${I.mus(mid, 'desc')}</p></div></div>
          <div class="zl">${Object.keys(M.zones).map((zid) => `<div class="zbox"><b>${I.zone(zid)}</b><span>${I.zone(zid, 'desc')}</span></div>`).join('')}</div></div>
        <div class="mus-map">${inFront ? bodySVG('front', { hot: mid }) : ''}${inBack ? bodySVG('back', { hot: mid }) : ''}</div>
      </div>
      <div class="filters">
        <div class="frow"><span>${t('zone')}</span><button class="chip" data-f="zone" data-v="">${t('all')}</button>${Object.keys(M.zones).map((zid) => `<button class="chip" data-f="zone" data-v="${zid}">${I.zone(zid)}</button>`).join('')}</div>
        <div class="frow"><span>${t('equipment')}</span><button class="chip" data-f="eq" data-v="">${t('all')}</button>${eqs.map((q) => `<button class="chip" data-f="eq" data-v="${q}">${I.eq(q)}</button>`).join('')}</div>
        <div class="frow"><span>${t('level')}</span><button class="chip" data-f="lvl" data-v="">${t('all')}</button>${[1, 2, 3].map((l) => `<button class="chip" data-f="lvl" data-v="${l}">${I.lvl(l)}</button>`).join('')}</div>
      </div>
      <div class="result-n"></div><div class="egrid"></div></section>`;
    const grid = $('.egrid', app), rn = $('.result-n', app);
    function render() {
      $$('.chip', app).forEach((c) => c.classList.toggle('on', String(fs[c.dataset.f] || '') === c.dataset.v));
      let r = list.filter((e) => (!fs.zone || e.z.includes(fs.zone)) && (!fs.eq || e.eq.some((i) => i.split('/').includes(fs.eq))) && (!fs.lvl || e.lvl === +fs.lvl));
      const nNA = r.filter((e) => !canDo(e)).length;
      if (hideNA) r = r.filter(canDo);
      r.sort((a, b) => (a.m === mid ? 0 : 1) - (b.m === mid ? 0 : 1) || (canDo(b) - canDo(a)) || a.lvl - b.lvl);
      rn.innerHTML = resN(r.length).replace(/^(\d+)/, '<b>$1</b>') + (fs.zone ? t('for_zone', { z: I.zone(fs.zone) }) : '') +
        (gymCustom() ? (hideNA ? t('hidden_gym', { n: nNA }) : nNA ? t('na_gym', { n: nNA }) : t('all_avail')) : '');
      grid.innerHTML = r.length ? r.map((e) => exCard(e, mid)).join('') : `<div class="empty-state">${t('no_match')}</div>`;
      mountFigs(grid);
    }
    $$('.chip', app).forEach((c) => (c.onclick = () => { fs[c.dataset.f] = c.dataset.v || null; render(); }));
    app._rerender = render;
    render();
  }

  /* ---------------- EXERCISE MODAL ---------------- */
  const modal = $('#exModal');
  let modalFig = null, lastFocus = null, modalCtx = null;
  function openEx(id, ctxMus) {
    const e = exById(id);
    if (!e) return;
    const mid = ctxMus && (e.m === ctxMus || e.also.includes(ctxMus)) ? ctxMus : e.m;
    modalCtx = { id, mid };
    const alts = EX.filter((x) => x.id !== e.id && (x.m === mid || x.also.includes(mid)) && x.z.some((z) => e.z.includes(z)))
      .sort((a, b) => canDo(b) - canDo(a)).slice(0, 6);
    const list = (arr) => arr.map((s) => `<li>${esc(s)}</li>`).join('');
    $('.box', modal).innerHTML = `<button class="x" aria-label="${t('close')}">✕</button><div class="ex">
      <div class="ex-left"><div class="ex-stage"><div class="fig" id="bigFig"></div><span class="view">${viewOf(e)}</span><span class="legend"><i></i> ${t('target_muscle')}</span></div>
        <div class="ctrls"><button class="btn" id="pp">${t('pause')}</button>
          <div class="seg" id="spd"><button data-s="0.5">0.5×</button><button data-s="1" class="on">1×</button><button data-s="1.6">1.6×</button></div>
          <button class="btn red" id="addRt">${t('add_to_routine')}</button></div>
        <div class="rt-pop" id="rtPop" hidden></div>
        ${!canDo(e) ? `<p class="tag" style="margin-top:14px">${t('missing_eq')}</p>` : ''}</div>
      <div class="ex-right"><span class="tag solid">${I.mus(e.m)}</span>
        <h2>${esc(I.ex(e, 'n'))}</h2><div class="tags">${e.z.map((z) => `<span class="tag red">${I.zone(z)}</span>`).join('')}${e.also.map((m) => `<span class="tag">${I.mus(m)}</span>`).join('')}</div>
        <div class="ex-meta"><div><span>${t('sets_reps')}</span><b><bdi dir="ltr">${esc(I.reps(e.reps))}</bdi></b></div><div><span>${t('level')}</span><b>${I.lvl(e.lvl)}</b></div><div><span>${t('equipment')}</span><b>${e.eq.map(eqLabel).join(' + ')}</b></div></div>
        <div class="ex-sec"><h5>${t('proper_form')}</h5><p class="ex-form">${esc(I.ex(e, 'form'))}</p></div>
        <div class="ex-sec"><h5>${t('step_by_step')}</h5><ol class="ex-steps">${list(I.ex(e, 'steps'))}</ol></div>
        <div class="ex-sec"><h5>${t('form_tips')}</h5><ul class="ex-list ok">${list(I.ex(e, 'tips'))}</ul></div>
        <div class="ex-sec"><h5>${t('mistakes')}</h5><ul class="ex-list bad">${list(I.ex(e, 'err'))}</ul></div>
        ${e.sec.length ? `<div class="ex-sec"><h5>${t('also_works')}</h5><div class="tags">${e.sec.map((s) => `<span class="tag">${esc(I.sec(s))}</span>`).join('')}</div></div>` : ''}
        ${alts.length ? `<div class="ex-sec"><h5>${t('alternatives')}</h5><div class="alts">${alts.map((a) => `<button class="alt" data-alt="${a.id}"><div class="mini"><div class="fig" data-fig="${a.id}" data-mus="${mid}"></div></div><b>${esc(I.ex(a, 'n'))}</b></button>`).join('')}</div></div>` : ''}
      </div></div>`;
    if (!modal.classList.contains('show')) lastFocus = document.activeElement;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    $('.box', modal).scrollTop = 0;
    modalFig = new window.GRFigure($('#bigFig'), { p: e.anim, w: e.w }, { muscle: mid });
    mountFigs($('.alts', modal) || document.createElement('div'));
    $('.x', modal).onclick = closeEx;
    $('.x', modal).focus();
    $('#pp').onclick = () => { modalFig.playing = !modalFig.playing; $('#pp').textContent = modalFig.playing ? t('pause') : t('play'); };
    $$('#spd button').forEach((b) => (b.onclick = () => { modalFig.speed = +b.dataset.s; $$('#spd button').forEach((x) => x.classList.toggle('on', x === b)); }));
    $$('.alt', modal).forEach((b) => (b.onclick = () => go('#/e/' + b.dataset.alt + '?m=' + mid)));
    $('#addRt').onclick = () => window.GRRoutines.addPopover($('#rtPop'), e.id);
  }
  function closeEx() {
    if (!modal.classList.contains('show')) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
    $('.box', modal).innerHTML = '';
    modalCtx = null;
    if (location.hash.startsWith('#/e/')) {
      history.replaceState(null, '', modal._back || '#/');
      if (!app.children.length) route();
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('.ov', modal).onclick = closeEx;

  /* ---------------- MY GYM ---------------- */
  const gymModal = $('#gymModal');
  function openGym() {
    const box = $('.box', gymModal);
    box.innerHTML = `<button class="x" aria-label="${t('close')}">✕</button><h2>${t('gym_title')}</h2>
      <p>${t('gym_desc')}</p>
      <div class="eq-grid">${ALL_EQ.map((k) => `<button class="eq-item ${gym.has(k) ? 'on' : ''}" data-k="${k}"><span class="ck"></span>${I.eq(k)}</button>`).join('')}</div>
      <div class="gym-opts"><label class="switch"><input type="checkbox" id="hideNA" ${hideNA ? 'checked' : ''}><i></i> ${t('hide_na')}</label>
        <div style="display:flex;gap:8px"><button class="btn" id="gAll">${t('select_all')}</button><button class="btn red" id="gOk">${t('save')}</button></div></div>`;
    gymModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    $$('.eq-item', box).forEach((b) => (b.onclick = () => b.classList.toggle('on')));
    $('#gAll', box).onclick = () => $$('.eq-item', box).forEach((b) => b.classList.add('on'));
    $('.x', box).onclick = closeGym;
    $('#gOk', box).onclick = () => {
      gym = new Set($$('.eq-item.on', box).map((b) => b.dataset.k));
      hideNA = $('#hideNA', box).checked;
      store.set('gr_gym_en', [...gym]); store.set('gr_hide', hideNA);
      updateGymBtn(); closeGym();
      if (app._rerender) app._rerender();
    };
  }
  function closeGym() { gymModal.classList.remove('show'); document.body.style.overflow = ''; }
  $('.ov', gymModal).onclick = closeGym;
  function updateGymBtn() { $('#gymBtn .dot').style.display = gymCustom() ? '' : 'none'; }
  $('#gymBtn').onclick = openGym;
  updateGymBtn();

  /* ---------------- LANGUAGE PICKER ---------------- */
  const langBtn = $('#langBtn'), langMenu = $('#langMenu');
  function drawLang() {
    $('#langCode').textContent = I.lang.toUpperCase();
    langMenu.innerHTML = I.LANGS.map((l) => `<button data-l="${l.code}" class="${l.code === I.lang ? 'on' : ''}"><b>${l.code.toUpperCase()}</b> ${l.name}</button>`).join('');
  }
  langBtn.onclick = (ev) => { ev.stopPropagation(); langMenu.classList.toggle('show'); };
  langMenu.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-l]');
    if (!b) return;
    langMenu.classList.remove('show');
    I.set(b.dataset.l);
  });
  document.addEventListener('click', (ev) => { if (!ev.target.closest('.lang')) langMenu.classList.remove('show'); });

  /* ---------------- SEARCH ---------------- */
  const sIn = $('#q'), sRes = $('#sres');
  let sel = 0, hits = [];
  function search() {
    const q = norm(sIn.value.trim());
    if (!q) { sRes.classList.remove('show'); return; }
    const terms = q.split(/\s+/);
    hits = EX.filter((e) => {
      const hay = norm([I.ex(e, 'n'), e.n, I.mus(e.m), e.z.map((z) => I.zone(z)).join(' '), e.also.map((m) => I.mus(m)).join(' ')].join(' '));
      return terms.every((x) => hay.includes(x));
    }).slice(0, 12);
    sel = 0;
    sRes.innerHTML = hits.length ? hits.map((e, i) => `<a href="#/e/${e.id}" class="${i === 0 ? 'act' : ''}">${esc(I.ex(e, 'n'))}<span>${I.mus(e.m)}</span></a>`).join('') : `<div class="empty">${t('no_results')}</div>`;
    sRes.classList.add('show');
  }
  sIn.addEventListener('input', search);
  sIn.addEventListener('focus', search);
  sIn.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      sel = (sel + (ev.key === 'ArrowDown' ? 1 : -1) + hits.length) % (hits.length || 1);
      $$('a', sRes).forEach((a, i) => a.classList.toggle('act', i === sel));
    } else if (ev.key === 'Enter' && hits[sel]) { go('#/e/' + hits[sel].id); sIn.blur(); sRes.classList.remove('show'); }
    else if (ev.key === 'Escape') { sIn.blur(); sRes.classList.remove('show'); }
  });
  document.addEventListener('click', (ev) => { if (!ev.target.closest('.search')) sRes.classList.remove('show'); else if (ev.target.closest('#sres a')) sRes.classList.remove('show'); });

  /* ---------------- ROUTER ---------------- */
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  let lastPage = '';
  function route(force) {
    const h = location.hash || '#/';
    const [path, qs] = h.slice(1).split('?');
    const parts = path.split('/').filter(Boolean);
    $('.nav').classList.remove('open');
    if (parts[0] === 'e') {
      const e = exById(parts[1]);
      if (!e) { location.hash = '#/'; return; }
      const ctx = new URLSearchParams(qs || '').get('m');
      const mid = ctx && (e.m === ctx || e.also.includes(ctx)) ? ctx : e.m;
      const page = '#/m/' + mid;
      const onRoutines = lastPage === '#/routines' || lastPage.startsWith('#/r/');
      if (!lastPage || !app.children.length) { lastPage = page; renderPage(page); }
      else if (!modal.classList.contains('show') && lastPage !== page && !onRoutines) { lastPage = page; renderPage(page); }
      modal._back = lastPage;
      openEx(e.id, mid);
      return;
    }
    if (modal.classList.contains('show')) { modal.classList.remove('show'); document.body.style.overflow = ''; $('.box', modal).innerHTML = ''; }
    if (h === lastPage && app.children.length && !force) return;
    lastPage = h;
    window.scrollTo(0, 0);
    renderPage(h);
  }
  function renderPage(h) {
    const parts = h.slice(1).split('?')[0].split('/').filter(Boolean);
    app._rerender = null;
    if (parts[0] === 'c') { viewCat(parts[1]); setNav(parts[1]); }
    else if (parts[0] === 'm') { viewMuscle(parts[1]); setNav(MUSCLES[parts[1]] && MUSCLES[parts[1]].cat); }
    else if (parts[0] === 'routines') { window.GRRoutines.viewList(app); setNav('routines'); }
    else if (parts[0] === 'r') { window.GRRoutines.viewOne(app, parts[1]); setNav('routines'); }
    else { viewHome(); setNav(null); }
    window.dispatchEvent(new CustomEvent('pagechange', { detail: parts[0] || 'home' }));
  }
  function setNav(cat) {
    $$('.nav a').forEach((a) => a.classList.toggle('on', a.dataset.cat === cat));
    $$('.nav a[data-cat]').forEach((a) => { if (CATS[a.dataset.cat]) a.textContent = I.cat(a.dataset.cat, 'name'); });
  }

  app.addEventListener('click', (ev) => {
    const c = ev.target.closest('[data-open]');
    if (c) go('#/e/' + c.dataset.open + '?m=' + c.dataset.mus);
  });
  document.addEventListener('click', (ev) => { if (ev.target.closest('[data-coach]')) window.GRCoach && window.GRCoach.open(); });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { closeEx(); closeGym(); }
    if (ev.key === '/' && document.activeElement !== sIn && !/input|textarea/i.test(document.activeElement.tagName)) { ev.preventDefault(); sIn.focus(); }
  });
  $('.menu-btn').onclick = () => $('.nav').classList.toggle('open');
  window.addEventListener('hashchange', () => route());
  window.addEventListener('langchange', () => {
    drawLang();
    const ctx = modalCtx;
    renderPage(lastPage || '#/');
    if (ctx) openEx(ctx.id, ctx.mid);
    if (sIn.value) search();
  });
  window.addEventListener('routineschange', () => {
    const n = window.GRRoutines.count();
    const b = $('#rtCount');
    b.textContent = n; b.style.display = n ? '' : 'none';
    if (lastPage === '#/routines' || lastPage.startsWith('#/r/')) { if (!modal.classList.contains('show')) renderPage(lastPage); }
  });

  window.GR = { $, $$, esc, t, canDo, canDoWith, eqLabel, exFor, exById, mountFigs, lvlDots, go, ALL_EQ, getGym: () => gym, store, closeEx };

  I.ready.then(() => {
    drawLang();
    window.dispatchEvent(new Event('routineschange'));
    route();
  });
})();
