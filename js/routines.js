/* =========================================================
   MY ROUTINES — saved in the browser (localStorage), no database needed
   Routine: { id, name, created, meta?, days: [{ name, items: [{ id, sets, reps, rest }] }] }
   ========================================================= */
(function () {
  const KEY = 'gr_routines';
  const I = window.I18N;
  const t = (k, v) => I.t(k, v);
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  let RT = load();
  const persist = (silent) => {
    try { localStorage.setItem(KEY, JSON.stringify(RT)); } catch (e) { /* no storage available */ }
    if (!silent) window.dispatchEvent(new Event('routineschange'));
  };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const get = (id) => RT.find((r) => r.id === id);

  function parseReps(str) {
    const m = /^(\d+)(?:-\d+)?\s*×\s*(.+)$/.exec(str || '');
    return m ? { sets: +m[1], reps: m[2] } : { sets: 3, reps: '10-12' };
  }
  function itemFor(exId) {
    const e = window.GR.exById(exId);
    const p = parseReps(e && e.reps);
    return { id: exId, sets: p.sets, reps: p.reps, rest: e && e.lvl >= 2 && p.sets >= 4 ? 120 : 75 };
  }
  function create(name, days) {
    const r = { id: uid(), name: name || t('rt_default'), created: Date.now(), days: days || [{ name: t('rt_day', { n: 1 }), items: [] }] };
    RT.unshift(r);
    persist();
    return r;
  }
  function addItem(rid, di, exId) {
    const r = get(rid);
    if (!r) return;
    r.days[di].items.push(itemFor(exId));
    persist();
  }
  // session length estimate: ~40 s per set + rest
  const estMin = (day) => Math.round(day.items.reduce((a, it) => a + (+it.sets || 0) * (40 + (+it.rest || 0)), 0) / 60);

  /* ---------- "Add to routine" popover (exercise sheet) ---------- */
  function addPopover(el, exId) {
    if (!el.hidden) { el.hidden = true; return; }
    const esc = window.GR.esc;
    el.innerHTML = `<b class="rt-pop-t">${t('rt_choose')}</b>
      ${RT.map((r) => r.days.map((d, di) => `<button data-r="${r.id}" data-d="${di}"><span>${esc(r.name)}</span><em>${esc(d.name)}</em></button>`).join('')).join('')}
      <button data-new="1" class="new">${t('rt_create_new')}</button><div class="rt-pop-ok" hidden></div>`;
    el.hidden = false;
    el.onclick = (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      let r;
      if (b.dataset.new) { r = create(t('rt_default')); addItem(r.id, 0, exId); }
      else { r = get(b.dataset.r); addItem(r.id, +b.dataset.d, exId); }
      const ok = el.querySelector('.rt-pop-ok');
      el.querySelectorAll('button').forEach((x) => (x.hidden = true));
      el.querySelector('.rt-pop-t').hidden = true;
      ok.hidden = false;
      ok.innerHTML = `${t('added', { r: esc(r.name) })} · <a href="#/r/${r.id}">${t('rt_open')} →</a>`;
      setTimeout(() => { el.hidden = true; }, 2600);
    };
  }

  /* ---------- Routine list ---------- */
  function viewList(app) {
    const { esc, mountFigs } = window.GR;
    app.innerHTML = `<section class="page">
      <div class="crumbs"><a href="#/">${t('home')}</a><i>/</i><span>${t('rt_title')}</span></div>
      <div class="ph"><div><h1>${t('rt_title').replace(/(\S+)$/, '<em>$1</em>')}</h1><p>${t('rt_desc')}</p></div>
        <div class="ph-actions"><button class="btn" data-coach>${t('rt_ai')}</button><button class="btn red" id="rtNew">${t('rt_new')}</button></div></div>
      ${RT.length ? `<div class="rt-grid">${RT.map((r) => {
        const exs = r.days.flatMap((d) => d.items);
        return `<a class="rt-card" href="#/r/${r.id}">
          <div class="rt-figs">${exs.slice(0, 3).map((it) => `<div class="fig" data-fig="${it.id}"></div>`).join('') || '<div class="rt-figs-empty">+</div>'}</div>
          <div class="rt-card-b"><h3>${esc(r.name)}</h3>
          <div class="tags"><span class="tag red">${t('rt_days', { n: r.days.length })}</span><span class="tag">${t('rt_exs', { n: exs.length })}</span>${r.meta && r.meta.ai ? '<span class="tag">🤖 AI</span>' : ''}</div></div></a>`;
      }).join('')}</div>` : `<div class="empty-state rt-empty"><div class="rt-empty-ico">📋</div><p>${t('rt_empty')}</p>
        <div class="ph-actions" style="justify-content:center"><button class="btn" data-coach>${t('rt_ai')}</button><button class="btn red" id="rtNew2">${t('rt_new')}</button></div></div>`}
    </section>`;
    const mk = () => { const r = create(t('rt_default')); location.hash = '#/r/' + r.id; };
    const b1 = app.querySelector('#rtNew'), b2 = app.querySelector('#rtNew2');
    if (b1) b1.onclick = mk;
    if (b2) b2.onclick = mk;
    mountFigs(app);
  }

  /* ---------- One routine ---------- */
  function viewOne(app, id) {
    const r = get(id);
    if (!r) { location.hash = '#/routines'; return; }
    const { esc, mountFigs, exById, canDo } = window.GR;
    app.innerHTML = `<section class="page rt-page">
      <div class="crumbs"><a href="#/">${t('home')}</a><i>/</i><a href="#/routines">${t('rt_title')}</a><i>/</i><span>${esc(r.name)}</span></div>
      <div class="rt-head">
        <input class="rt-name" id="rtName" value="${esc(r.name)}" aria-label="${t('rt_name')}" maxlength="60">
        <div class="ph-actions"><button class="btn" id="rtAddDay">${t('rt_add_day')}</button><button class="btn" id="rtPrint">${t('rt_print')}</button><button class="btn danger" id="rtDel">${t('rt_delete')}</button></div>
      </div>
      ${r.meta && r.meta.notes ? `<div class="rt-notes">${r.meta.notes.map((n) => `<p>${esc(n)}</p>`).join('')}</div>` : ''}
      <div class="rt-days">${r.days.map((d, di) => `
        <div class="rt-day" data-d="${di}">
          <div class="rt-day-h"><span class="rt-day-n">${String(di + 1).padStart(2, '0')}</span>
            <input class="rt-day-name" value="${esc(d.name)}" data-d="${di}" aria-label="${t('rt_day_name')}" maxlength="40">
            <span class="rt-est">${d.items.length ? t('rt_total', { m: estMin(d) }) : ''}</span>
            ${r.days.length > 1 ? `<button class="icon-btn" data-rmday="${di}" title="${t('rt_remove_day')}">✕</button>` : ''}</div>
          ${d.items.length ? `<div class="rt-cols"><span></span><span></span><span>${t('rt_sets')}</span><span>${t('rt_reps')}</span><span>${t('rt_weight')}</span><span>${t('rt_rest')}</span><span></span></div>` : ''}
          <div class="rt-items">${d.items.map((it, ii) => {
            const e = exById(it.id);
            if (!e) return '';
            return `<div class="rt-item ${canDo(e) ? '' : 'dim'}">
              <div class="rt-mini" data-open="${e.id}" data-mus="${e.m}"><div class="fig" data-fig="${e.id}"></div></div>
              <button class="rt-ex" data-open="${e.id}" data-mus="${e.m}"><b>${esc(I.ex(e, 'n'))}</b><span>${I.mus(e.m)}</span></button>
              <input type="number" min="1" max="10" value="${it.sets}" data-f="sets" data-d="${di}" data-i="${ii}" aria-label="${t('rt_sets')}">
              <input type="text" value="${esc(I.reps(String(it.reps)))}" data-f="reps" data-d="${di}" data-i="${ii}" aria-label="${t('rt_reps')}" maxlength="24">
              <input type="number" min="0" max="999" step="0.5" value="${it.kg != null ? it.kg : ''}" placeholder="—" data-f="kg" data-d="${di}" data-i="${ii}" aria-label="${t('rt_weight')}">
              <input type="number" min="0" max="600" step="15" value="${it.rest}" data-f="rest" data-d="${di}" data-i="${ii}" aria-label="${t('rt_rest')}">
              <div class="rt-act"><button class="icon-btn" data-mv="-1" data-d="${di}" data-i="${ii}" ${ii === 0 ? 'disabled' : ''}>↑</button><button class="icon-btn" data-mv="1" data-d="${di}" data-i="${ii}" ${ii === d.items.length - 1 ? 'disabled' : ''}>↓</button><button class="icon-btn" data-rm="1" data-d="${di}" data-i="${ii}">✕</button></div>
            </div>`;
          }).join('') || `<p class="rt-none">${t('rt_no_ex')}</p>`}</div>
          <button class="btn rt-add" data-add="${di}">${t('rt_add_ex')}</button>
        </div>`).join('')}</div>
    </section>`;
    mountFigs(app);
    const q = (s) => app.querySelector(s);
    q('#rtName').oninput = (ev) => { r.name = ev.target.value || t('rt_default'); persist(true); };
    q('#rtAddDay').onclick = () => { r.days.push({ name: t('rt_day', { n: r.days.length + 1 }), items: [] }); persist(); };
    q('#rtPrint').onclick = () => window.print();
    q('#rtDel').onclick = () => { if (confirm(t('rt_confirm_del'))) { RT = RT.filter((x) => x.id !== r.id); persist(true); location.hash = '#/routines'; window.dispatchEvent(new Event('routineschange')); } };
    app.querySelectorAll('.rt-day-name').forEach((inp) => (inp.oninput = () => { r.days[+inp.dataset.d].name = inp.value; persist(true); }));
    app.querySelectorAll('.rt-item input').forEach((inp) => (inp.onchange = () => {
      const it = r.days[+inp.dataset.d].items[+inp.dataset.i];
      const f = inp.dataset.f;
      if (f === 'reps') it.reps = inp.value;
      else if (f === 'kg') it.kg = inp.value === '' ? null : Math.max(0, parseFloat(String(inp.value).replace(',', '.')) || 0);
      else it[f] = Math.max(0, +inp.value || 0);
      persist(true);
      const day = app.querySelector(`.rt-day[data-d="${inp.dataset.d}"] .rt-est`);
      if (day) day.textContent = t('rt_total', { m: estMin(r.days[+inp.dataset.d]) });
    }));
    app.querySelectorAll('[data-mv]').forEach((b) => (b.onclick = () => {
      const items = r.days[+b.dataset.d].items, i = +b.dataset.i, j = i + +b.dataset.mv;
      [items[i], items[j]] = [items[j], items[i]];
      persist();
    }));
    app.querySelectorAll('[data-rm]').forEach((b) => (b.onclick = () => { r.days[+b.dataset.d].items.splice(+b.dataset.i, 1); persist(); }));
    app.querySelectorAll('[data-rmday]').forEach((b) => (b.onclick = () => { r.days.splice(+b.dataset.rmday, 1); persist(); }));
    app.querySelectorAll('[data-add]').forEach((b) => (b.onclick = () => openPicker(r, +b.dataset.add)));
  }

  /* ---------- Exercise picker ---------- */
  function openPicker(r, di) {
    const { esc, canDo } = window.GR;
    const { EX, MUSCLES } = window.GR_DATA;
    const m = document.getElementById('pickModal');
    const box = m.querySelector('.box');
    let mus = null;
    box.innerHTML = `<button class="x" aria-label="${t('close')}">✕</button><h2>${t('rt_pick_title')}</h2>
      <p class="pick-sub">${esc(r.name)} · ${esc(r.days[di].name)}</p>
      <input class="pick-q" type="search" placeholder="${t('search_ph').replace(/\s*\(.*\)/, '')}">
      <div class="pick-chips"><button class="chip on" data-m="">${t('all')}</button>${Object.keys(MUSCLES).map((k) => `<button class="chip" data-m="${k}">${I.mus(k)}</button>`).join('')}</div>
      <div class="pick-list"></div>`;
    const list = box.querySelector('.pick-list'), inp = box.querySelector('.pick-q');
    const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const draw = () => {
      const q = norm(inp.value.trim());
      const res = EX.filter((e) => (!mus || e.m === mus || e.also.includes(mus)) && (!q || norm(I.ex(e, 'n') + ' ' + e.n + ' ' + I.mus(e.m)).includes(q)))
        .sort((a, b) => canDo(b) - canDo(a));
      list.innerHTML = res.map((e) => `<button class="pick-row ${canDo(e) ? '' : 'dim'}" data-id="${e.id}"><span><b>${esc(I.ex(e, 'n'))}</b><em>${I.mus(e.m)} · ${I.lvl(e.lvl)}</em></span><i>+</i></button>`).join('') || `<p class="rt-none">${t('no_results')}</p>`;
    };
    draw();
    inp.oninput = draw;
    box.querySelectorAll('.chip').forEach((c) => (c.onclick = () => { mus = c.dataset.m || null; box.querySelectorAll('.chip').forEach((x) => x.classList.toggle('on', x === c)); draw(); }));
    list.onclick = (ev) => {
      const b = ev.target.closest('.pick-row');
      if (!b) return;
      r.days[di].items.push(itemFor(b.dataset.id));
      persist(true);
      b.classList.add('added');
      b.querySelector('i').textContent = '✓';
    };
    const close = () => { m.classList.remove('show'); document.body.style.overflow = ''; window.dispatchEvent(new Event('routineschange')); };
    box.querySelector('.x').onclick = close;
    m.querySelector('.ov').onclick = close;
    m.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => inp.focus(), 50);
  }

  window.GRRoutines = { count: () => RT.length, all: () => RT, get, create, addItem, itemFor, addPopover, viewList, viewOne, persist };
})();
