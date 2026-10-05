/* =========================================================
   STICK-FIGURE ENGINE — The Gym Rat Bible
   SVG stick figure animated with keyframes (A <-> B).
   Angle convention: 0 = down, 90 = forward/outward,
   180 = up, -90 = backward. dir(θ) = (sin θ, cos θ).
   ========================================================= */
(function () {
  const L = { T: 48, N: 5, HR: 9, UA: 27, FA: 25, TH: 38, SH: 38, SHW: 16, HW: 8, FT: 12, HD: 7 };
  const GROUND = 186;
  const NS = 'http://www.w3.org/2000/svg';
  const rad = (d) => (d * Math.PI) / 180;
  const dirv = (deg, len) => [Math.sin(rad(deg)) * len, Math.cos(rad(deg)) * len];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];

  function ik(root, target, a, b, bend) {
    let dx = target[0] - root[0], dy = target[1] - root[1];
    let d = Math.hypot(dx, dy);
    const maxD = a + b - 0.3, minD = Math.abs(a - b) + 0.5;
    if (d < 1e-6) { dx = 0; dy = 1; d = 1; }
    if (d > maxD) { const k = maxD / d; dx *= k; dy *= k; d = maxD; }
    if (d < minD) { const k = minD / d; dx *= k; dy *= k; d = minD; }
    const base = Math.atan2(dx, dy);
    const c = (a * a + d * d - b * b) / (2 * a * d);
    const alpha = Math.acos(Math.max(-1, Math.min(1, c)));
    const ang = base + bend * alpha;
    return [[root[0] + Math.sin(ang) * a, root[1] + Math.cos(ang) * a], [root[0] + dx, root[1] + dy]];
  }

  /* resuelve objetivos relativos: ['sc',dx,dy] / ['hip',dx,dy] */
  function resolve(tg, ref) {
    if (!tg) return null;
    if (typeof tg[0] === 'string') { const r = ref[tg[0]]; return [r[0] + tg[1], r[1] + tg[2]]; }
    return tg;
  }

  function limb(root, target, a1, a2, l1, l2, bend, mirror) {
    if (target) return ik(root, target, l1, l2, bend);
    const s = mirror ? -1 : 1;
    const j = add(root, dirv(s * (a1 || 0), l1));
    return [j, add(j, dirv(s * (a2 || 0), l2))];
  }

  function pose(f, view) {
    const hip = f.hip;
    const t = f.t || 0;
    const u = [Math.sin(rad(t)), -Math.cos(rad(t))];
    const TL = L.T * (f.tl || 1);
    const sc = [hip[0] + u[0] * TL, hip[1] + u[1] * TL - (f.su || 0)];
    const ht = t + (f.nk || 0);
    const head = [sc[0] + Math.sin(rad(ht)) * (L.N + L.HR), sc[1] - Math.cos(rad(ht)) * (L.N + L.HR) + (f.su || 0) * 0.3];
    const mid = [hip[0] + u[0] * TL * 0.5, hip[1] + u[1] * TL * 0.5];
    const THL = L.TH * (f.thl || 1);
    const P = { hip, sc, head, mid, u, t, view };
    const ref = { sc, hip, head, mid };
    const armAdd = f.ar ? t : 0;

    if (view === 'front') {
      const r = [Math.cos(rad(t)), Math.sin(rad(t))];
      P.shR = [sc[0] + r[0] * L.SHW, sc[1] + r[1] * L.SHW];
      P.shL = [sc[0] - r[0] * L.SHW, sc[1] - r[1] * L.SHW];
      P.hipR = [hip[0] + r[0] * L.HW, hip[1] + r[1] * L.HW];
      P.hipL = [hip[0] - r[0] * L.HW, hip[1] - r[1] * L.HW];
      const mx = hip[0];
      const mir = (p) => (p ? [2 * mx - p[0], p[1]] : null);
      const eb = f.eb != null ? f.eb : 1, kb = f.kb != null ? f.kb : 1;
      const hR = resolve(f.hand, ref);
      const hL = f.hand2 ? resolve(f.hand2, ref) : mir(hR);
      [P.elbow, P.hand] = limb(P.shR, hR, f.ua, f.fa, L.UA, L.FA, eb, false);
      [P.elbow2, P.hand2] = limb(P.shL, hL, f.ua2 != null ? f.ua2 : f.ua, f.fa2 != null ? f.fa2 : f.fa, L.UA, L.FA, -eb, true);
      const fR = resolve(f.foot, ref);
      const fL = f.foot2 ? resolve(f.foot2, ref) : mir(fR);
      [P.knee, P.foot] = limb(P.hipR, fR, f.th, f.sh, THL, L.SH, kb, false);
      [P.knee2, P.foot2] = limb(P.hipL, fL, f.th2 != null ? f.th2 : f.th, f.sh2 != null ? f.sh2 : f.sh, THL, L.SH, -kb, true);
    } else {
      P.shR = P.shL = sc;
      const eb = f.eb != null ? f.eb : -1, kb = f.kb != null ? f.kb : 1;
      const h1 = resolve(f.hand, ref);
      const h2 = f.hand2 ? resolve(f.hand2, ref) : (f.ua2 != null ? null : h1);
      [P.elbow, P.hand] = limb(sc, h1, (f.ua || 0) + armAdd, (f.fa || 0) + armAdd, L.UA, L.FA, eb, false);
      [P.elbow2, P.hand2] = limb(sc, h2, (f.ua2 != null ? f.ua2 : f.ua || 0) + armAdd, (f.fa2 != null ? f.fa2 : f.fa || 0) + armAdd, L.UA, L.FA, f.eb2 != null ? f.eb2 : eb, false);
      const ft1 = resolve(f.foot, ref);
      const ft2 = f.foot2 ? resolve(f.foot2, ref) : (f.th2 != null ? null : ft1);
      [P.knee, P.foot] = limb(hip, ft1, f.th, f.sh, L.TH, L.SH, kb, false);
      [P.knee2, P.foot2] = limb(hip, ft2, f.th2 != null ? f.th2 : f.th, f.sh2 != null ? f.sh2 : f.sh, L.TH, L.SH, f.kb2 != null ? f.kb2 : kb, false);
      const fa = f.ft || 0, fa2 = f.ft2 != null ? f.ft2 : fa;
      P.toe = add(P.foot, [Math.cos(rad(fa)) * L.FT, Math.sin(rad(fa)) * L.FT]);
      P.toe2 = add(P.foot2, [Math.cos(rad(fa2)) * L.FT, Math.sin(rad(fa2)) * L.FT]);
    }
    if (f.wa != null) {
      P.fing = add(P.hand, dirv(f.wa, L.HD));
      P.fing2 = add(P.hand2, dirv(f.wa, L.HD));
    }
    return P;
  }

  function lerpVal(a, b, k) {
    if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * k;
    if (Array.isArray(a) && Array.isArray(b)) return a.map((v, i) => lerpVal(v, b[i], k));
    return a;
  }
  function lerpFrame(A, B, k) {
    const out = {};
    for (const key in A) out[key] = key in B ? lerpVal(A[key], B[key], k) : A[key];
    for (const key in B) if (!(key in out)) out[key] = B[key];
    return out;
  }
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  /* ---------- props (equipamiento que se mueve) ---------- */
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  const PROP = {
    barbell: {
      make(g, view) {
        if (view === 'front') {
          return { bar: el('line', { class: 'pr-bar' }, g), p1: el('rect', { class: 'pr-plate', width: 6, height: 26, rx: 2 }, g), p2: el('rect', { class: 'pr-plate', width: 6, height: 26, rx: 2 }, g) };
        }
        return { c: el('circle', { class: 'pr-plate', r: 13 }, g), d: el('circle', { class: 'pr-hub', r: 3 }, g) };
      },
      draw(o, a, b, view) {
        if (view === 'front') {
          const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
          const e1 = [a[0] - ux * 26, a[1] - uy * 26], e2 = [b[0] + ux * 26, b[1] + uy * 26];
          set(o.bar, { x1: e1[0], y1: e1[1], x2: e2[0], y2: e2[1] });
          const q1 = [a[0] - ux * 20, a[1] - uy * 20], q2 = [b[0] + ux * 20, b[1] + uy * 20];
          set(o.p1, { x: q1[0] - 3, y: q1[1] - 13 }); set(o.p2, { x: q2[0] - 3, y: q2[1] - 13 });
        } else { set(o.c, { cx: a[0], cy: a[1] }); set(o.d, { cx: a[0], cy: a[1] }); }
      },
    },
    ez: {
      make(g, view) { return PROP.barbell.make(g, view); },
      draw(o, a, b, view) { PROP.barbell.draw(o, a, b, view); if (view !== 'front') o.c.setAttribute('r', 10); },
    },
    dumbbell: {
      make(g, view) {
        const mk = () => ({ h: el('line', { class: 'pr-bar thin' }, g), a: el('rect', { class: 'pr-plate', width: 5, height: 11, rx: 1.5 }, g), b: el('rect', { class: 'pr-plate', width: 5, height: 11, rx: 1.5 }, g) });
        if (view === 'front') return { d1: mk(), d2: mk() };
        return { c: el('circle', { class: 'pr-plate', r: 6.5 }, g), d: el('circle', { class: 'pr-hub', r: 2 }, g) };
      },
      draw(o, a, b, view) {
        if (view === 'front') {
          [[o.d1, a], [o.d2, b]].forEach(([d, p]) => {
            set(d.h, { x1: p[0] - 8, y1: p[1], x2: p[0] + 8, y2: p[1] });
            set(d.a, { x: p[0] - 10, y: p[1] - 5.5 }); set(d.b, { x: p[0] + 5, y: p[1] - 5.5 });
          });
        } else { set(o.c, { cx: a[0], cy: a[1] }); set(o.d, { cx: a[0], cy: a[1] }); }
      },
    },
    dumbbell1: { // una sola mancuerna (mano derecha)
      make(g) { return { c: el('circle', { class: 'pr-plate', r: 6.5 }, g), d: el('circle', { class: 'pr-hub', r: 2 }, g) }; },
      draw(o, a) { set(o.c, { cx: a[0], cy: a[1] }); set(o.d, { cx: a[0], cy: a[1] }); },
    },
    kettlebell: {
      make(g) { return { c: el('circle', { class: 'pr-plate', r: 7 }, g), h: el('path', { class: 'pr-bar thin', fill: 'none' }, g) }; },
      draw(o, a, b) {
        const m = b ? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] : a;
        set(o.c, { cx: m[0], cy: m[1] + 9 });
        o.h.setAttribute('d', `M${m[0] - 5},${m[1] + 4} Q${m[0]},${m[1] - 5} ${m[0] + 5},${m[1] + 4}`);
      },
    },
    plate: {
      make(g) { return { c: el('circle', { class: 'pr-plate', r: 11 }, g), d: el('circle', { class: 'pr-hub', r: 3 }, g) }; },
      draw(o, a, b) { const m = b ? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] : a; set(o.c, { cx: m[0], cy: m[1] }); set(o.d, { cx: m[0], cy: m[1] }); },
    },
    handle: {
      make(g, view) { return view === 'front' ? { l: el('line', { class: 'pr-bar' }, g) } : { c: el('circle', { class: 'pr-hub big', r: 3.5 }, g) }; },
      draw(o, a, b, view) {
        if (view === 'front') { const s = a[0] >= b[0] ? 1 : -1; set(o.l, { x1: a[0] + 7 * s, y1: a[1], x2: b[0] - 7 * s, y2: b[1] }); }
        else set(o.c, { cx: a[0], cy: a[1] });
      },
    },
    wheel: {
      make(g) { return { c: el('circle', { class: 'pr-plate', r: 9 }, g), d: el('circle', { class: 'pr-hub', r: 2.5 }, g) }; },
      draw(o, a) { set(o.c, { cx: a[0], cy: a[1] + 2 }); set(o.d, { cx: a[0], cy: a[1] + 2 }); },
    },
    grip: {
      make(g) { return { c: el('circle', { class: 'pr-hub big', r: 3.5 }, g) }; },
      draw(o, a) { set(o.c, { cx: a[0], cy: a[1] }); },
    },
    pad: {
      make(g) { return { c: el('circle', { class: 'pr-pad', r: 5.5 }, g) }; },
      draw(o, a) { set(o.c, { cx: a[0], cy: a[1] }); },
    },
    platform: {
      make(g) { return { l: el('line', { class: 'pr-bar plat' }, g) }; },
      draw(o, a) { set(o.l, { x1: a[0] - 12 + 4, y1: a[1] - 12 - 4, x2: a[0] + 12 + 4, y2: a[1] + 12 - 4 }); },
    },
    tbar: {
      make(g) { return { l: el('line', { class: 'pr-bar' }, g), c: el('circle', { class: 'pr-plate', r: 11 }, g) }; },
      draw(o, a) { set(o.l, { x1: 22, y1: GROUND, x2: a[0] + 8, y2: a[1] - 3 }); set(o.c, { cx: a[0] - 6, cy: a[1] + 2 }); },
    },
  };
  function set(e, attrs) { for (const k in attrs) e.setAttribute(k, typeof attrs[k] === 'number' ? attrs[k].toFixed(2) : attrs[k]); }

  /* ---------- registro de animaciones ---------- */

  const SEG_HL = {
    chest: ['tU'], back: ['tU', 'tL'], shoulders: ['shJ'], biceps: ['ua'], triceps: ['ua'], forearms: ['fa'], traps: ['neck', 'shJ'],
    quads: ['th'], hamstrings: ['th'], glutes: ['hipJ', 'th'], calves: ['sh'], adductors: ['th'],
    abs: ['tL', 'tU'], obliques: ['tL'], lowerback: ['tL'],
  };

  const instances = new Set();
  let rafOn = false;

  function Figure(container, spec, opts) {
    opts = opts || {};
    const name = typeof spec === 'string' ? spec : spec.p;
    const pat = (window.GR_PATTERNS || {})[name];
    if (!pat) { container.innerHTML = '<div class="fig-missing">Animation unavailable</div>'; return null; }
    this.pat = pat;
    this.view = pat.view || 'side';
    this.w = (spec && spec.w) || pat.w;
    this.speed = 1;
    this.playing = true;
    this.phase = Math.random();
    this.dur = (pat.dur || 2.8) * 1000;
    this.visible = true;
    const hlSet = new Set(SEG_HL[opts.muscle] || []);

    const svg = el('svg', { viewBox: '0 0 200 200', class: 'fig-svg' + (this.view === 'front' ? ' front' : '') });
    const gid = 'g' + Math.random().toString(36).slice(2, 8);
    svg.innerHTML = `<defs><filter id="${gid}" filterUnits="userSpaceOnUse" x="-60" y="-60" width="320" height="320"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
    el('line', { x1: 0, y1: GROUND + 1, x2: 200, y2: GROUND + 1, class: 'fig-floor' }, svg);
    const scene = el('g', { class: 'fig-scene' }, svg);
    (pat.scene || []).forEach(([tag, attrs]) => el(tag, attrs, scene));

    const back = el('g', { class: 'fig-back' }, svg);
    const propsBack = el('g', { class: 'fig-props' }, svg);
    const body = el('g', { class: 'fig-body', filter: `url(#${gid})` }, svg);
    const propsG = el('g', { class: 'fig-props', filter: `url(#${gid})` }, svg);

    const L2 = (cls, g) => el('line', { class: cls }, g);
    const front = this.view === 'front';
    const hl = (k) => (hlSet.has(k) ? ' hl' : '');
    const E = {};
    // extremidades traseras (izquierdas en vista frontal)
    E.th2 = L2('lb back' + hl('th'), back); E.sh2 = L2('lb back' + hl('sh'), back); E.ft2 = L2('lb back foot', back);
    E.ua2 = L2('lb back' + hl('ua'), back); E.fa2 = L2('lb back' + hl('fa'), back); E.wr2 = L2('lb back thin', back);
    if (front) { E.shoulders = L2('lb torso' + hl('tU'), body); E.hips = L2('lb torso' + hl('tL'), body); }
    E.tL = L2('lb torso' + hl('tL'), body); E.tU = L2('lb torso' + hl('tU'), body);
    E.neck = L2('lb neck' + hl('neck'), body);
    E.head = el('circle', { r: L.HR, class: 'head' }, body);
    E.eye = el('circle', { r: 1.7, class: 'eye' }, body);
    if (front) E.eye2 = el('circle', { r: 1.7, class: 'eye' }, body);
    E.th = L2('lb' + hl('th'), body); E.sh = L2('lb' + hl('sh'), body); E.ft = L2('lb foot', body);
    E.ua = L2('lb' + hl('ua'), body); E.fa = L2('lb' + hl('fa'), body); E.wr = L2('lb thin', body);
    E.shJ = el('circle', { r: hlSet.has('shJ') ? 5.5 : 3, class: 'joint' + hl('shJ') }, body);
    if (front) E.shJ2 = el('circle', { r: hlSet.has('shJ') ? 5.5 : 3, class: 'joint' + hl('shJ') }, body);
    E.hipJ = el('circle', { r: hlSet.has('hipJ') ? 6 : 3, class: 'joint' + hl('hipJ') }, body);
    if (front && hlSet.has('hipJ')) E.hipJ2 = el('circle', { r: 6, class: 'joint hl' }, body);
    E.kn = el('circle', { r: 2.6, class: 'joint minor' }, body); E.el = el('circle', { r: 2.6, class: 'joint minor' }, body);

    // props
    this.props = (pat.props || []).map((p) => {
      let k = p.k === 'W' ? this.w : p.k;
      if (!k) return null;
      const g = p.back ? propsBack : propsG;
      if (p.k === 'cable' || k === 'cable') {
        return { p, k: 'cable', o: { l: el('line', { class: 'pr-cable' }, propsBack), l2: front && p.at === 'hands' ? el('line', { class: 'pr-cable' }, propsBack) : null, pul: el('circle', { class: 'pr-hub big', r: 4, cx: p.anchor[0], cy: p.anchor[1] }, propsBack) } };
      }
      const def = PROP[k];
      if (!def) return null;
      return { p, k, o: def.make(g, this.view) };
    }).filter(Boolean);

    this.E = E;
    this.svg = svg;
    container.innerHTML = '';
    container.appendChild(svg);
    this.container = container;
    this.render(this.phase);
    instances.add(this);
    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver((ents) => ents.forEach((e) => (this.visible = e.isIntersecting)));
      this.io.observe(container);
    }
    startLoop();
  }

  Figure.prototype.frameAt = function (ph) {
    const p = this.pat;
    const A = Object.assign({}, p.base, p.a), B = Object.assign({}, p.base, p.b);
    // 0-.12 pausa en A, .12-.5 hacia B, .5-.62 pausa en B, .62-1 vuelta
    let k;
    if (ph < 0.12) k = 0; else if (ph < 0.5) k = ease((ph - 0.12) / 0.38); else if (ph < 0.62) k = 1; else k = 1 - ease((ph - 0.62) / 0.38);
    return lerpFrame(A, B, k);
  };

  Figure.prototype.render = function (ph) {
    const f = this.frameAt(ph);
    const P = pose(f, this.view);
    const E = this.E;
    const ln = (e, a, b) => set(e, { x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
    const front = this.view === 'front';
    const shR = P.shR, shL = P.shL;
    if (front) {
      ln(E.shoulders, shL, shR); ln(E.hips, P.hipL, P.hipR);
      ln(E.th2, P.hipL, P.knee2); ln(E.sh2, P.knee2, P.foot2); ln(E.ft2, P.foot2, [P.foot2[0] - 7, P.foot2[1]]);
      ln(E.th, P.hipR, P.knee); ln(E.sh, P.knee, P.foot); ln(E.ft, P.foot, [P.foot[0] + 7, P.foot[1]]);
      ln(E.ua2, shL, P.elbow2); ln(E.fa2, P.elbow2, P.hand2);
      ln(E.ua, shR, P.elbow); ln(E.fa, P.elbow, P.hand);
      set(E.shJ, { cx: shR[0], cy: shR[1] }); set(E.shJ2, { cx: shL[0], cy: shL[1] });
      set(E.hipJ, { cx: P.hipR[0], cy: P.hipR[1] });
      if (E.hipJ2) set(E.hipJ2, { cx: P.hipL[0], cy: P.hipL[1] });
      const r = [Math.cos(rad(P.t)), Math.sin(rad(P.t))];
      set(E.eye, { cx: P.head[0] + r[0] * 3.2, cy: P.head[1] + r[1] * 3.2 - 1 });
      set(E.eye2, { cx: P.head[0] - r[0] * 3.2, cy: P.head[1] - r[1] * 3.2 - 1 });
    } else {
      ln(E.th2, P.hip, P.knee2); ln(E.sh2, P.knee2, P.foot2); ln(E.ft2, P.foot2, P.toe2);
      ln(E.th, P.hip, P.knee); ln(E.sh, P.knee, P.foot); ln(E.ft, P.foot, P.toe);
      ln(E.ua2, P.sc, P.elbow2); ln(E.fa2, P.elbow2, P.hand2);
      ln(E.ua, P.sc, P.elbow); ln(E.fa, P.elbow, P.hand);
      set(E.shJ, { cx: P.sc[0], cy: P.sc[1] });
      set(E.hipJ, { cx: P.hip[0], cy: P.hip[1] });
      const fdir = [Math.cos(rad(P.t + (f.nk || 0))), Math.sin(rad(P.t + (f.nk || 0)))];
      set(E.eye, { cx: P.head[0] + fdir[0] * 4.5 + P.u[0] * 1.5, cy: P.head[1] + fdir[1] * 4.5 + P.u[1] * 1.5 });
    }
    if (P.fing) { ln(E.wr, P.hand, P.fing); ln(E.wr2, P.hand2, P.fing2); }
    else { ln(E.wr, P.hand, P.hand); ln(E.wr2, P.hand2, P.hand2); }
    ln(E.tL, P.hip, P.mid); ln(E.tU, P.mid, P.sc);
    const nb = [P.sc[0] + (P.head[0] - P.sc[0]) * 0.35, P.sc[1] + (P.head[1] - P.sc[1]) * 0.35];
    ln(E.neck, P.sc, nb);
    set(E.head, { cx: P.head[0], cy: P.head[1] });
    set(E.kn, { cx: P.knee[0], cy: P.knee[1] });
    set(E.el, { cx: P.elbow[0], cy: P.elbow[1] });

    const pts = {
      hand: P.fing || P.hand, hand2: P.fing2 || P.hand2, sc: P.sc, hip: P.hip, foot: P.foot, foot2: P.foot2, knee: P.knee, knee2: P.knee2, head: P.head, elbow: P.elbow, mid: P.mid,
    };
    this.props.forEach(({ p, k, o }) => {
      const off = p.off || [0, 0];
      let a, b;
      if (p.at === 'hands') { a = pts.hand; b = front ? pts.hand2 : null; }
      else if (p.at === 'mid') { a = [(pts.hand[0] + pts.hand2[0]) / 2, (pts.hand[1] + pts.hand2[1]) / 2]; }
      else a = pts[p.at];
      a = [a[0] + off[0], a[1] + off[1]];
      if (b) b = [b[0] + off[0], b[1] + off[1]];
      if (k === 'cable') {
        const tgt = p.at === 'hands' && front ? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] : a;
        if (o.l2) { set(o.l, { x1: p.anchor[0], y1: p.anchor[1], x2: a[0], y2: a[1] }); const an2 = p.anchor2 || [200 - p.anchor[0], p.anchor[1]]; set(o.l2, { x1: an2[0], y1: an2[1], x2: b[0], y2: b[1] }); }
        else set(o.l, { x1: p.anchor[0], y1: p.anchor[1], x2: tgt[0], y2: tgt[1] });
        return;
      }
      PROP[k].draw(o, a, b, this.view);
    });
  };

  Figure.prototype.destroy = function () { instances.delete(this); if (this.io) this.io.disconnect(); };

  let last = 0;
  function loop(ts) {
    const dt = last ? Math.min(ts - last, 100) : 16;
    last = ts;
    instances.forEach((f) => {
      if (!f.container.isConnected) { f.destroy(); return; }
      if (!f.playing || !f.visible) return;
      f.phase = (f.phase + (dt * f.speed) / f.dur) % 1;
      f.render(f.phase);
    });
    if (instances.size) requestAnimationFrame(loop); else { rafOn = false; last = 0; }
  }
  function startLoop() { if (!rafOn) { rafOn = true; requestAnimationFrame(loop); } }

  window.GRFigure = Figure;
  window.GR_GROUND = GROUND;
})();
