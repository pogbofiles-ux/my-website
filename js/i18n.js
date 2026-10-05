/* =========================================================
   I18N ENGINE — The Gym Rat Bible
   English is the base language (default). Other languages live in
   js/i18n/<code>.js and are loaded on demand.
   ========================================================= */
(function () {
  const LANGS = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ar', name: 'العربية', rtl: true },
  ];

  const EN = {
    // header / footer
    logo_small: 'VISUAL EXERCISE GUIDE', search_ph: 'Search exercise…  ( / )', my_gym: 'My gym', my_routines: 'My routines', language: 'Language',
    footer1: 'train with technique, not ego.', footer2: 'See a professional if you have injuries. Always warm up before training.',
    // home
    kicker: '● Visual exercise guide', hero1: 'THE GYM RAT', hero2: 'BIBLE',
    hero_p: 'Pick a body area, tap a muscle and watch exactly how every exercise is done with its animated figure, plus a step-by-step proper form guide. Filter by what your gym has and build your own routine.',
    stat_ex: 'Exercises', stat_mus: 'Muscles', stat_zones: 'Zones & heads', stat_anim: 'Animations',
    n_ex: '{n} exercises', enter: 'Enter {x}',
    step1_t: 'Pick the area', step1_d: 'Upper, Lower or Core.',
    step2_t: 'Tap the muscle', step2_d: 'On the body map or the cards.',
    step3_t: 'Filter by head & gear', step3_d: 'E.g. triceps → long head → cable.',
    step4_t: 'Build your routine', step4_d: 'Add exercises or let the AI coach create it for you.',
    // category / muscle
    home: 'Home', front: 'Front', back: 'Back', tap_muscle: 'Tap a <b>highlighted</b> muscle',
    zone: 'Zone', equipment: 'Equipment', level: 'Level', all: 'All',
    res_one: '{n} exercise', res_other: '{n} exercises', for_zone: ' for <b>{z}</b>',
    hidden_gym: ' · {n} hidden by your gym settings', na_gym: ' · {n} not available in your gym', all_avail: ' · all available in your gym',
    no_match: 'No exercises match these filters. Try removing one or check "My gym".', not_available: 'Not available in your gym',
    side_view: 'Side view', front_view: 'Front view', or: ' or ',
    // exercise sheet
    target_muscle: 'Target muscle', pause: '❚❚ Pause', play: '▶ Play', missing_eq: '⚠ Your gym is missing some of the equipment needed',
    sets_reps: 'Sets × reps', proper_form: 'Proper form', step_by_step: 'Step by step', form_tips: 'Form tips', mistakes: 'Common mistakes',
    also_works: 'Also works', alternatives: 'Alternatives', close: 'Close', add_to_routine: '+ Add to routine', added: '✓ Added to {r}',
    // my gym
    gym_title: 'My gym', gym_desc: 'Tick what your gym has. Exercises you cannot do will be dimmed (or you can hide them).',
    hide_na: "Hide the ones I can't do", select_all: 'Select all', save: 'Save', no_results: 'No results',
    // routines
    rt_title: 'My routines', rt_desc: 'Create your routines, organize them by days and adjust sets, reps and rest. They are saved on this device.',
    rt_new: '+ New routine', rt_ai: '🤖 Create with AI coach', rt_empty: 'You have no routines yet. Create one or let the AI coach build it for you.',
    rt_default: 'My routine', rt_day: 'Day {n}', rt_add_day: '+ Add day', rt_add_ex: '+ Add exercise', rt_delete: 'Delete routine',
    rt_confirm_del: 'Delete this routine? This cannot be undone.', rt_sets: 'Sets', rt_reps: 'Reps', rt_rest: 'Rest (s)', rt_weight: 'Weight (kg)', rt_print: 'Print / PDF',
    rt_days: '{n} days', rt_exs: '{n} exercises', rt_no_ex: 'No exercises yet — tap "+ Add exercise".', rt_choose: 'Add to which routine?',
    rt_create_new: '+ Create new routine', rt_remove_day: 'Remove day', rt_back: '← My routines', rt_pick_title: 'Add exercise',
    rt_open: 'Open', rt_name: 'Routine name', rt_day_name: 'Day name', rt_total: '≈ {m} min per session',
    // AI coach
    ai_name: 'Gym Rat Coach', ai_status: 'AI assistant · online', ai_bubble: 'Hi! 👋 Need help? I can build your perfect routine in 1 minute.',
    ai_bubble_btn: "Let's go", ai_hello: "Hey! I'm your Gym Rat Coach 🤖💪 Answer a few quick questions and I'll build a routine made just for you.",
    q_goal: 'What is your main goal?', g_muscle: '💪 Build muscle', g_fat: '🔥 Lose fat', g_strength: '🏋️ Get stronger', g_fit: '❤️ Get fit & healthy',
    q_level: 'How much training experience do you have?', l1: 'Beginner (< 6 months)', l2: 'Intermediate (6 months – 2 years)', l3: 'Advanced (2+ years)',
    q_age: 'How old are you?', q_weight: 'How much do you weigh? (kg)', q_height: 'And your height? (cm)',
    q_days: 'How many days a week can you train?', days_n: '{n} days', q_time: 'How long can each session be?', min_n: '{n} min',
    q_equip: 'Where do you train?', e_full: '🏢 Full gym', e_mygym: '⚙️ Use my "My gym" settings', e_home: '🏠 Home with dumbbells', e_body: '🤸 Bodyweight only',
    q_focus: 'Any area you want to prioritize?', f_none: '⚖️ Balanced', f_upper: '💪 Upper body', f_lower: '🍑 Legs & glutes', f_core: '🧱 Core',
    thinking: 'Building your routine…', ai_done: 'Here is your plan! 🔥', ai_split: 'Split: {x}', ai_bmi: 'BMI: {b} ({c})',
    bmi_low: 'underweight', bmi_ok: 'healthy range', bmi_high: 'overweight', bmi_vhigh: 'high',
    ai_protein: 'Protein: aim for about {g} g per day ({p} g per kg).', ai_water: 'Water: about {l} L per day.',
    adv_fat: 'Add 2–3 cardio sessions of 20–30 min and keep a moderate calorie deficit.', adv_muscle: 'Eat in a small calorie surplus and sleep 7–9 hours.',
    adv_strength: 'Rest 2–3 minutes between heavy sets and add weight little by little.', adv_fit: 'Try to walk 8,000–10,000 steps a day.',
    adv_older: 'Warm up for 10 minutes and use a slow, controlled tempo.', adv_young: 'Focus on technique before heavy weight, ideally with a coach.',
    adv_beginner: 'Start with weights that leave 2–3 reps in reserve and learn each exercise from its page.',
    ai_save: '💾 Save to My routines', ai_saved: 'Saved! Opening your routine…', ai_restart: '↺ Start over', ai_invalid: 'Please enter a valid number ({a}–{b}).',
    type_ph: 'Type a number…', send: 'Send', ai_disclaimer: 'Guidance only — not medical advice.', ai_routine_name: 'AI plan — {g}',
    sp_full: 'Full body', sp_ul: 'Upper / Lower', sp_ppl: 'Push / Pull / Legs', sp_pplul: 'Push / Pull / Legs + Upper / Lower',
    d_fullA: 'Full body A', d_fullB: 'Full body B', d_fullC: 'Full body C', d_upper: 'Upper', d_lower: 'Lower', d_push: 'Push', d_pull: 'Pull', d_legs: 'Legs',
    ai_open: 'Open AI coach',
  };

  const I = (window.I18N = {
    LANGS, lang: 'en', packs: { en: { ui: EN } },
    P() { return this.packs[this.lang] || {}; },
    t(k, v) {
      const ui = this.P().ui || {};
      let s = ui[k] != null ? ui[k] : EN[k] != null ? EN[k] : k;
      if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]);
      return s;
    },
    cat(id, f) { const c = (this.P().cats || {})[id]; return (c && c[f]) || window.GR_DATA.CATS[id][f]; },
    mus(id, f) { const m = (this.P().muscles || {})[id]; const D = window.GR_DATA.MUSCLES[id]; return f === 'desc' ? (m && m[1]) || D.desc : (m && m[0]) || D.name; },
    zone(zid, f) {
      const z = (this.P().zones || {})[zid];
      if (z) return f === 'desc' ? z[1] : z[0];
      const M = window.GR_DATA.MUSCLES;
      for (const m in M) if (M[m].zones[zid]) return M[m].zones[zid][f === 'desc' ? 1 : 0];
      return zid;
    },
    eq(id) { return (this.P().equip || {})[id] || window.GR_DATA.EQUIP[id]; },
    lvl(n) { return (this.P().levels || {})[n] || { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }[n]; },
    sec(s) { return (this.P().secs || {})[s] || s; },
    reps(s) { (this.P().repsMap || []).forEach(([a, b]) => { s = s.split(a).join(b); }); return s; },
    ex(e, f) {
      const x = (this.P().ex || {})[e.id];
      const key = { n: 'n', form: 'f', steps: 's', tips: 't', err: 'e' }[f];
      return (x && x[key]) || e[f];
    },
    load(code) {
      if (this.packs[code]) return Promise.resolve();
      return new Promise((res) => {
        const s = document.createElement('script');
        s.src = 'js/i18n/' + code + '.js';
        s.onload = res; s.onerror = res;
        document.head.appendChild(s);
      });
    },
    async set(code) {
      if (!LANGS.some((l) => l.code === code)) code = 'en';
      await this.load(code);
      if (!this.packs[code]) code = 'en';
      this.lang = code;
      try { localStorage.setItem('gr_lang', code); } catch (e) { /* no storage */ }
      const L = LANGS.find((l) => l.code === code);
      document.documentElement.lang = code;
      document.documentElement.dir = L.rtl ? 'rtl' : 'ltr';
      document.querySelectorAll('[data-i18n]').forEach((el) => { el.innerHTML = this.t(el.dataset.i18n); });
      document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = this.t(el.dataset.i18nPh); });
      document.querySelectorAll('[data-i18n-label]').forEach((el) => { el.setAttribute('aria-label', this.t(el.dataset.i18nLabel)); });
      window.dispatchEvent(new CustomEvent('langchange', { detail: code }));
    },
  });

  let saved = 'en';
  try { saved = localStorage.getItem('gr_lang') || 'en'; } catch (e) { /* no storage */ }
  I.ready = I.set(saved);
})();
