/* =========================================================
   MOVEMENT PATTERNS — keyframes A (start) and B (end)
   view: side (facing right) | front
   Keys: hip, t (torso lean), ua/fa (upper arm/forearm),
   th/sh (thigh/shin), hand/foot (IK targets),
   eb/kb (elbow/knee bend side), su (shrug), wa (wrist)
   ========================================================= */
(function () {
  const G = 186;
  // ---- scenery ----
  const pad = (x1, y1, x2, y2, w) => ['line', { x1, y1, x2, y2, class: 'sc-pad', 'stroke-width': w || 7 }];
  const eq = (x1, y1, x2, y2) => ['line', { x1, y1, x2, y2, class: 'sc-eq' }];
  const bench = (x1, x2, y) => [pad(x1, y + 3, x2, y + 3), eq(x1 + 12, y + 6, x1 + 12, G), eq(x2 - 12, y + 6, x2 - 12, G)];
  const tower = (x, top) => [eq(x, top || 6, x, G), ['rect', { x: x - 5, y: 130, width: 10, height: 40, class: 'sc-stack' }]];
  const pullBar = (y, x1, x2) => [['line', { x1, y1: y, x2, y2: y, class: 'sc-bar' }], eq(x1 + 4, y, x1 + 4, G), eq(x2 - 4, y, x2 - 4, G)];
  const seat = (x1, x2, y) => [pad(x1, y, x2, y, 6), eq((x1 + x2) / 2, y + 3, (x1 + x2) / 2, G)];
  const backrestFront = (y1, y2) => [['rect', { x: 84, y: y1, width: 32, height: y2 - y1, rx: 5, class: 'sc-padfill' }]];
  const seatFront = (y) => [['rect', { x: 72, y, width: 56, height: 7, rx: 3, class: 'sc-padfill' }], eq(100, y + 7, 100, G)];

  const stand = { hip: [100, 111], foot: [100, 186], t: 2 };
  const standF = { hip: [100, 111], th: 4, sh: 0 };
  const lying = { hip: [110, 133], t: -90, foot: [148, 186] };

  const P = {};

  /* ===================== CHEST ===================== */
  P.benchPress = { view: 'side', w: 'barbell', base: Object.assign({}, lying, { eb: -1 }), a: { hand: [64, 81] }, b: { hand: [70, 118] },
    props: [{ k: 'W', at: 'hand' }], scene: [...bench(35, 135, 135), eq(52, 70, 52, G), eq(48, 76, 56, 76)] };
  P.inclinePress = { view: 'side', w: 'barbell', base: { hip: [100, 140], t: -55, foot: [140, 186], eb: -1 }, a: { hand: [62, 62] }, b: { hand: [72, 100] },
    props: [{ k: 'W', at: 'hand' }], scene: [pad(97, 145, 51, 113), pad(96, 146, 126, 146, 6), eq(102, 148, 102, G), eq(60, 118, 60, G)] };
  P.declinePress = { view: 'side', w: 'barbell', base: { hip: [100, 122], t: -110, foot: [138, 152], eb: -1 }, a: { hand: [56, 86] }, b: { hand: [63, 128] },
    props: [{ k: 'W', at: 'hand' }], scene: [pad(102, 128, 49, 148), eq(75, 140, 75, G), eq(110, 128, 120, G), ['circle', { cx: 141, cy: 156, r: 5, class: 'sc-padfill' }], eq(141, 160, 141, G)] };
  P.flyDb = { view: 'front', w: 'dumbbell', base: { hip: [100, 120], foot: [112, 186] }, a: { ua: 92, fa: 100 }, b: { ua: 42, fa: -60 },
    props: [{ k: 'W', at: 'hands' }], scene: backrestFront(46, 150) };
  P.pecDeck = { view: 'front', base: { hip: [100, 130], foot: [116, 186] }, a: { ua: 95, fa: 175 }, b: { ua: 50, fa: -105 },
    props: [{ k: 'grip', at: 'hand' }, { k: 'grip', at: 'hand2' }], scene: [...backrestFront(60, 132), ...seatFront(132), eq(30, 20, 30, G), eq(170, 20, 170, G), eq(30, 20, 170, 20)] };
  P.cableCross = { view: 'front', base: { hip: [100, 111], foot: [114, 186] }, a: { ua: 122, fa: 112 }, b: { ua: 28, fa: -48 },
    props: [{ k: 'cable', at: 'hands', anchor: [188, 20], anchor2: [12, 20] }, { k: 'grip', at: 'hand' }, { k: 'grip', at: 'hand2' }], scene: [eq(188, 10, 188, G), eq(12, 10, 12, G)] };
  P.pushup = { view: 'side', base: { foot: [34, 176], ft: 60, hand: [146, 184], eb: -1 }, a: { hip: [102, 152], t: 65 }, b: { hip: [108, 173], t: 82 }, dur: 2.4 };
  P.dipsChest = { view: 'side', base: { eb: -1, th: 10, sh: -70, hand: [104, 100] }, a: { hip: [85.6, 95.1], t: 20 }, b: { hip: [70.6, 124.7], t: 32 },
    scene: [['line', { x1: 78, y1: 100, x2: 140, y2: 100, class: 'sc-bar' }], eq(132, 100, 132, G), eq(84, 100, 84, G)] };
  P.chestMachine = { view: 'side', base: { hip: [70, 145], t: -5, foot: [108, 186], eb: -1 }, a: { hand: ['sc', 14, 8] }, b: { hand: ['sc', 51, 6] },
    props: [{ k: 'grip', at: 'hand' }], scene: [pad(62, 150, 58, 92), ...seat(52, 92, 150), eq(150, 60, 150, G), eq(128, 104, 150, 104)] };
  P.pullover = { view: 'side', w: 'dumbbell', base: Object.assign({}, lying), a: { ua: 182, fa: 184 }, b: { ua: 262, fa: 266 },
    props: [{ k: 'W', at: 'hand' }], scene: bench(35, 135, 135) };

  /* ===================== BACK ===================== */
  P.pullup = { view: 'front', base: { hand: [132, 22], eb: -1, th: 4, sh: -2 }, a: { hip: [100, 119] }, b: { hip: [100, 82] }, dur: 2.6,
    scene: pullBar(22, 30, 170) };
  P.chinup = { view: 'front', base: { hand: [112, 22], eb: -1, th: 4, sh: -2 }, a: { hip: [100, 119] }, b: { hip: [100, 82] }, scene: pullBar(22, 30, 170) };
  P.deadHang = { view: 'front', base: { hand: [134, 22], eb: -1, th: 3, sh: 0 }, a: { hip: [100, 119], su: 0 }, b: { hip: [100, 117], su: 3 }, dur: 4, scene: pullBar(22, 30, 170) };
  P.latPulldown = { view: 'front', base: { hip: [100, 135], foot: [118, 186], eb: -1 }, a: { hand: [142, 34] }, b: { hand: [140, 90] },
    props: [{ k: 'cable', at: 'mid', anchor: [100, 6] }, { k: 'handle', at: 'hands' }], scene: [eq(60, 6, 140, 6), ...seatFront(135), ['circle', { cx: 100, cy: 120, r: 0 }]] };
  P.closePulldown = { view: 'front', base: { hip: [100, 135], foot: [118, 186], eb: -1 }, a: { hand: [110, 34] }, b: { hand: [110, 96] },
    props: [{ k: 'cable', at: 'mid', anchor: [100, 6] }, { k: 'handle', at: 'hands' }], scene: [eq(60, 6, 140, 6), ...seatFront(135)] };
  P.seatedRow = { view: 'side', base: { hip: [70, 150], foot: [135, 165], eb: -1 }, a: { t: 16, hand: [130, 125] }, b: { t: -6, hand: [94, 124] },
    props: [{ k: 'cable', at: 'hand', anchor: [178, 162] }, { k: 'grip', at: 'hand' }], scene: [...seat(42, 98, 154), eq(140, 148, 140, 180), eq(180, 110, 180, G)] };
  P.bbRow = { view: 'side', w: 'barbell', base: { hip: [82, 116], foot: [100, 186], t: 70, eb: -1 }, a: { hand: [127, 150] }, b: { hand: [108, 122] },
    props: [{ k: 'W', at: 'hand' }] };
  P.dbRow = { view: 'side', w: 'dumbbell', base: { hip: [78, 118], foot: [96, 186], t: 72, eb: -1, hand2: [150, 140] }, a: { hand: [124, 152] }, b: { hand: [104, 122] },
    props: [{ k: 'dumbbell1', at: 'hand' }], scene: bench(128, 196, 140) };
  P.tbarRow = { view: 'side', base: { hip: [82, 116], foot: [100, 186], t: 66, eb: -1 }, a: { hand: [126, 150] }, b: { hand: [110, 124] },
    props: [{ k: 'tbar', at: 'hand' }] };
  P.straightArm = { view: 'side', base: { hip: [90, 112], foot: [100, 186], t: 24 }, a: { ua: 112, fa: 116 }, b: { ua: 8, fa: 8 },
    props: [{ k: 'cable', at: 'hand', anchor: [180, 14] }, { k: 'grip', at: 'hand' }], scene: [eq(184, 8, 184, G)] };
  P.deadlift = { view: 'side', w: 'barbell', base: { foot: [100, 186], eb: -1 }, a: { hip: [70, 148], t: 50, hand: [110, 170] }, b: { hip: [97, 112], t: -2, hand: [97, 120] },
    props: [{ k: 'W', at: 'hand' }], dur: 3 };
  P.rdl = { view: 'side', w: 'barbell', base: { foot: [100, 186], eb: -1 }, a: { hip: [97, 112], t: -2, hand: [97, 120] }, b: { hip: [72, 120], t: 74, hand: [112, 155] },
    props: [{ k: 'W', at: 'hand' }], dur: 3 };
  P.goodMorning = { view: 'side', w: 'barbell', base: { foot: [100, 186], hand: ['sc', 4, 8] }, a: { hip: [98, 111], t: 2 }, b: { hip: [78, 116], t: 80 },
    props: [{ k: 'W', at: 'sc', off: [-3, -4] }], dur: 3 };
  P.hyperext = { view: 'side', base: { hip: [100, 120], foot: [48, 172], ar: 1, ua: 30, fa: 160 }, a: { t: 150 }, b: { t: 45 },
    scene: [pad(98, 132, 112, 118, 8), ['circle', { cx: 50, cy: 180, r: 5, class: 'sc-padfill' }], eq(52, G, 120, 132)] };
  P.shrug = { view: 'front', w: 'barbell', base: Object.assign({}, standF, { ua: 5, fa: 3 }), a: { su: 0 }, b: { su: 8 }, dur: 2,
    props: [{ k: 'W', at: 'hands' }] };

  /* ===================== SHOULDERS ===================== */
  P.ohp = { view: 'front', w: 'barbell', base: { hip: [100, 111], th: 5, sh: 0, eb: -1 }, a: { hand: [134, 62] }, b: { hand: [126, 12] },
    props: [{ k: 'W', at: 'hands' }] };
  P.dbPress = { view: 'front', w: 'dumbbell', base: { hip: [100, 130], foot: [118, 186], eb: -1 }, a: { hand: [140, 80] }, b: { hand: [124, 30] },
    props: [{ k: 'W', at: 'hands' }], scene: [...backrestFront(58, 132), ...seatFront(132)] };
  P.arnold = { view: 'front', w: 'dumbbell', base: { hip: [100, 130], foot: [118, 186] }, a: { ua: 6, fa: 178 }, b: { ua: 172, fa: 180 },
    props: [{ k: 'W', at: 'hands' }], scene: [...backrestFront(58, 132), ...seatFront(132)] };
  P.lateralRaise = { view: 'front', w: 'dumbbell', base: Object.assign({}, standF), a: { ua: 8, fa: 12 }, b: { ua: 88, fa: 96 },
    props: [{ k: 'W', at: 'hands' }] };
  P.cableLateral = { view: 'front', base: Object.assign({}, standF, { ua2: 28, fa2: -60 }), a: { ua: -14, fa: -18 }, b: { ua: 88, fa: 94 },
    props: [{ k: 'cable', at: 'hand', anchor: [40, 182] }, { k: 'grip', at: 'hand' }], scene: [eq(34, 60, 34, G)] };
  P.frontRaise = { view: 'side', w: 'dumbbell', base: Object.assign({}, stand), a: { ua: 4, fa: 4 }, b: { ua: 96, fa: 96 },
    props: [{ k: 'W', at: 'hand' }] };
  P.rearFly = { view: 'front', w: 'dumbbell', base: { hip: [100, 112], th: 4, sh: 0, tl: 0.45 }, a: { ua: 6, fa: 4 }, b: { ua: 92, fa: 96 },
    props: [{ k: 'W', at: 'hands' }] };
  P.reverseDeck = { view: 'front', base: { hip: [100, 130], foot: [116, 186] }, a: { ua: 50, fa: -105 }, b: { ua: 96, fa: 100 },
    props: [{ k: 'grip', at: 'hand' }, { k: 'grip', at: 'hand2' }], scene: [...backrestFront(60, 132), ...seatFront(132)] };
  P.facePull = { view: 'side', base: { hip: [100, 111], foot: [100, 186], t: -4, eb: 1 }, a: { hand: ['sc', 51, -4] }, b: { hand: ['sc', 4, -13] },
    props: [{ k: 'cable', at: 'hand', anchor: [178, 52] }, { k: 'grip', at: 'hand' }], scene: [eq(184, 8, 184, G)] };
  P.uprightRow = { view: 'front', w: 'barbell', base: Object.assign({}, standF), a: { ua: -8, fa: -12 }, b: { ua: 105, fa: -75 },
    props: [{ k: 'W', at: 'hands' }] };

  /* ===================== BICEPS / FOREARMS ===================== */
  P.curl = { view: 'side', w: 'dumbbell', base: Object.assign({}, stand, { ua: 0 }), a: { ua: 0, fa: 0 }, b: { ua: 12, fa: 158 },
    props: [{ k: 'W', at: 'hand' }], dur: 2.4 };
  P.cableCurl = { view: 'side', base: Object.assign({}, stand), a: { ua: 0, fa: 2 }, b: { ua: 12, fa: 158 },
    props: [{ k: 'cable', at: 'hand', anchor: [150, 182] }, { k: 'grip', at: 'hand' }], scene: [eq(156, 120, 156, G)] };
  P.preacher = { view: 'side', w: 'ez', base: { hip: [70, 148], foot: [110, 186], t: 12, ua: 50 }, a: { fa: 58 }, b: { fa: 165 },
    props: [{ k: 'W', at: 'hand' }], scene: [pad(77, 106, 102, 126, 8), eq(96, 128, 96, G), ...seat(50, 86, 150)] };
  P.inclineCurl = { view: 'side', w: 'dumbbell', base: { hip: [100, 142], t: -35, foot: [140, 186], ua: 0 }, a: { fa: 0 }, b: { fa: 150 },
    props: [{ k: 'W', at: 'hand' }], scene: [pad(95, 146, 64, 101), pad(96, 147, 126, 147, 6), eq(104, 150, 104, G), eq(70, 112, 70, G)] };
  P.concentration = { view: 'side', w: 'dumbbell', base: { hip: [80, 148], t: 38, foot: [118, 186], ua: 12, ua2: 60, fa2: 70 }, a: { fa: 4 }, b: { fa: 168 },
    props: [{ k: 'dumbbell1', at: 'hand' }], scene: seat(50, 96, 151) };
  P.wristCurl = { view: 'side', w: 'dumbbell', base: { hip: [70, 148], t: 40, th: 90, sh: 0, ua: -20, fa: 88 }, a: { wa: 40 }, b: { wa: 150 }, dur: 1.8,
    props: [{ k: 'W', at: 'hand' }], scene: seat(40, 86, 151) };
  P.revWristCurl = { view: 'side', w: 'barbell', base: { hip: [70, 148], t: 40, th: 90, sh: 0, ua: -20, fa: 88 }, a: { wa: 20 }, b: { wa: 135 }, dur: 1.8,
    props: [{ k: 'W', at: 'hand' }], scene: seat(40, 86, 151) };
  P.farmer = { view: 'side', w: 'dumbbell', base: { hip: [100, 111], ua: 2, fa: 2, t: 2 }, a: { th: 22, sh: 8, th2: -20, sh2: -14 }, b: { th: -20, sh: -14, th2: 22, sh2: 8 }, dur: 1.6,
    props: [{ k: 'W', at: 'hand' }] };

  /* ===================== TRICEPS ===================== */
  P.pushdown = { view: 'side', base: { hip: [96, 111], foot: [100, 186], t: 12, ua: -6 }, a: { fa: 150 }, b: { fa: 4 },
    props: [{ k: 'cable', at: 'hand', anchor: [128, 10] }, { k: 'grip', at: 'hand' }], scene: [eq(142, 4, 142, G), eq(126, 6, 142, 6)], dur: 2.4 };
  P.overheadDb = { view: 'side', w: 'dumbbell', base: Object.assign({}, stand, { ua: 168 }), a: { fa: -38 }, b: { fa: -192 },
    props: [{ k: 'W', at: 'hand' }] };
  P.overheadCable = { view: 'side', base: { hip: [98, 114], foot: [118, 186], foot2: [72, 186], t: 30, ua: 150 }, a: { fa: -60 }, b: { fa: -200 },
    props: [{ k: 'cable', at: 'hand', anchor: [16, 50] }, { k: 'grip', at: 'hand' }], scene: [eq(12, 6, 12, G)] };
  P.skull = { view: 'side', w: 'ez', base: Object.assign({}, lying, { ua: 195 }), a: { fa: 188 }, b: { fa: 268 },
    props: [{ k: 'W', at: 'hand' }], scene: bench(35, 135, 135) };
  P.dipsTri = { view: 'side', base: { eb: -1, th: 10, sh: -70, hand: [104, 100] }, a: { hip: [95.8, 97.8], t: 5 }, b: { hip: [83.7, 129.3], t: 10 },
    scene: [['line', { x1: 78, y1: 100, x2: 140, y2: 100, class: 'sc-bar' }], eq(132, 100, 132, G), eq(84, 100, 84, G)] };
  P.benchDips = { view: 'side', base: { hand: [66, 140], foot: [130, 182], eb: -1, t: -5 }, a: { hip: [72, 137] }, b: { hip: [74, 166] },
    scene: bench(22, 72, 140) };
  P.kickback = { view: 'side', w: 'dumbbell', base: { hip: [84, 116], foot: [100, 186], t: 65, ua: -65 }, a: { fa: 0 }, b: { fa: -65 },
    props: [{ k: 'W', at: 'hand' }] };

  /* ===================== QUADS / LEGS ===================== */
  P.squat = { view: 'side', w: 'barbell', base: { foot: [100, 186], hand: ['sc', 4, 8] }, a: { hip: [98, 111], t: 6 }, b: { hip: [72, 150], t: 40 },
    props: [{ k: 'W', at: 'sc', off: [-4, -4] }], dur: 3 };
  P.frontSquat = { view: 'side', base: { foot: [100, 186], ua: 88, fa: -98 }, a: { hip: [99, 111], t: 3 }, b: { hip: [76, 152], t: 22 },
    props: [{ k: 'barbell', at: 'sc', off: [7, -3] }], dur: 3 };
  P.gobletSquat = { view: 'side', base: { foot: [100, 186], ua: 14, fa: 166 }, a: { hip: [99, 111], t: 4 }, b: { hip: [74, 152], t: 24 },
    props: [{ k: 'kettlebell', at: 'hand', off: [2, -6] }], dur: 3 };
  P.hackSquat = { view: 'side', base: { foot: [104, 180], hand: ['sc', 6, 4] }, a: { hip: [96, 108], t: 22 }, b: { hip: [72, 146], t: 32 },
    props: [{ k: 'pad', at: 'sc', off: [-3, -6] }], scene: [eq(18, G, 82, 30), eq(26, G, 90, 30), pad(96, 182, 124, 176, 6)], dur: 3 };
  P.legPress = { view: 'side', base: { hip: [78, 140], t: -60, eb: -1, kb: 1, hand: [88, 152] }, a: { foot: [120, 96] }, b: { foot: [140, 78] },
    props: [{ k: 'platform', at: 'foot' }], scene: [pad(75, 145, 28, 118), pad(75, 146, 100, 146, 6), eq(95, 172, 192, 62), eq(88, 150, 88, G), eq(30, 125, 30, G)], dur: 3 };
  P.legExt = { view: 'side', base: { hip: [78, 140], t: -8, th: 88, hand: [92, 146] }, a: { sh: -8 }, b: { sh: 86 },
    props: [{ k: 'pad', at: 'foot', off: [3, 1] }], scene: [...seat(55, 118, 144), pad(66, 146, 60, 90)] };
  P.bulgarian = { view: 'side', w: 'dumbbell', base: { foot: [134, 186], foot2: [42, 138], ft2: 180, ua: 2, fa: 2 }, a: { hip: [104, 116], t: 5 }, b: { hip: [96, 148], t: 12 },
    props: [{ k: 'W', at: 'hand' }], scene: bench(14, 64, 140), dur: 3 };
  P.lunge = { view: 'side', w: 'dumbbell', base: { foot: [124, 186], foot2: [60, 180], ft2: 40, ua: 2, fa: 2, t: 4 }, a: { hip: [92, 118] }, b: { hip: [90, 150] },
    props: [{ k: 'W', at: 'hand' }], dur: 2.8 };
  P.stepUp = { view: 'side', w: 'dumbbell', base: { foot: [125, 160], ua: 2, fa: 2, t: 6 }, a: { hip: [96, 124], foot2: [82, 186] }, b: { hip: [119, 88], foot2: [112, 160] },
    props: [{ k: 'W', at: 'hand' }], scene: [['rect', { x: 104, y: 160, width: 56, height: 26, rx: 3, class: 'sc-box' }]] };
  P.sumoSquat = { view: 'front', base: { foot: [126, 186], hand: ['sc', 3, 30], eb: 1 }, a: { hip: [100, 113] }, b: { hip: [100, 150] },
    props: [{ k: 'kettlebell', at: 'mid' }], dur: 3 };

  /* ===================== HAMSTRINGS / GLUTES ===================== */
  P.lyingCurl = { view: 'side', base: { hip: [92, 128], t: 88, th: -90, ua: 40, fa: 5 }, a: { sh: -92 }, b: { sh: -170 },
    props: [{ k: 'pad', at: 'foot', off: [0, 0] }], scene: [pad(40, 136, 168, 136, 8), eq(60, 140, 60, G), eq(150, 140, 150, G)] };
  P.seatedCurl = { view: 'side', base: { hip: [72, 140], t: -12, th: 90, hand: [80, 150] }, a: { sh: 84 }, b: { sh: -14 },
    props: [{ k: 'pad', at: 'foot', off: [0, 0] }], scene: [...seat(50, 112, 145), pad(64, 146, 56, 92), pad(84, 132, 108, 132, 6)] };
  P.nordic = { view: 'side', base: { sh: -90, ft: 180 }, a: { hip: [90, 146], t: 0, th: 0, ua: 10, fa: 10 }, b: { hip: [121, 162], t: 55, th: -55, ua: 80, fa: 60 },
    scene: [['circle', { cx: 50, cy: 178, r: 5, class: 'sc-padfill' }]], dur: 3.4 };
  P.hipThrust = { view: 'side', w: 'barbell', base: { foot: [130, 186], hand: ['hip', 2, -9] }, a: { hip: [80, 163], t: -40 }, b: { hip: [94, 127], t: -88 },
    props: [{ k: 'W', at: 'hip', off: [0, -10] }], scene: bench(4, 54, 128) };
  P.gluteBridge = { view: 'side', base: { foot: [120, 186], hand: [64, 184] }, a: { hip: [88, 178], t: -90 }, b: { hip: [80, 153], t: -122 } };
  P.cableKickback = { view: 'side', base: { hip: [96, 114], foot2: [100, 186], t: 28, hand: [150, 92] }, a: { th: 12, sh: -6 }, b: { th: -48, sh: -58 },
    props: [{ k: 'cable', at: 'foot', anchor: [20, 182] }], scene: [eq(14, 60, 14, G), eq(158, 60, 158, G), eq(146, 92, 158, 92)] };
  P.abductor = { view: 'front', base: { hip: [100, 128], thl: 0.55, ua: 22, fa: -8 }, a: { th: 30, sh: 4 }, b: { th: 80, sh: 25 },
    props: [{ k: 'pad', at: 'knee', off: [5, 0] }, { k: 'pad', at: 'knee2', off: [-5, 0] }], scene: [...backrestFront(58, 130), ['rect', { x: 70, y: 130, width: 60, height: 6, rx: 3, class: 'sc-padfill' }]] };
  P.adductor = { view: 'front', base: { hip: [100, 128], thl: 0.55, ua: 22, fa: -8 }, a: { th: 80, sh: 25 }, b: { th: 30, sh: 4 },
    props: [{ k: 'pad', at: 'knee', off: [-5, 0] }, { k: 'pad', at: 'knee2', off: [5, 0] }], scene: [...backrestFront(58, 130), ['rect', { x: 70, y: 130, width: 60, height: 6, rx: 3, class: 'sc-padfill' }]] };

  /* ===================== CALVES ===================== */
  P.calfRaise = { view: 'side', w: 'dumbbell', base: { ua: 2, fa: 2, t: 2 }, a: { hip: [100, 111], foot: [100, 184], ft: 0 }, b: { hip: [103, 102], foot: [103, 175.6], ft: 40 }, dur: 1.8,
    props: [{ k: 'W', at: 'hand' }] };
  P.calfMachine = { view: 'side', base: { ua: 30, fa: 175, t: 2 }, a: { hip: [100, 111], foot: [100, 184], ft: 0 }, b: { hip: [103, 102], foot: [103, 175.6], ft: 40 }, dur: 1.8,
    props: [{ k: 'pad', at: 'sc', off: [0, -4] }], scene: [eq(80, 10, 80, G)] };
  P.seatedCalf = { view: 'side', base: { hip: [70, 146], t: -4, ua: 30, fa: 80 }, a: { foot: [108, 184], ft: 0 }, b: { foot: [111, 175], ft: 40 }, dur: 1.8,
    props: [{ k: 'pad', at: 'knee', off: [0, -6] }], scene: seat(44, 92, 150) };

  /* ===================== CORE ===================== */
  P.crunch = { view: 'side', base: { hip: [100, 180], foot: [132, 186], hand: ['head', -2, -2] }, a: { t: -90 }, b: { t: -58 }, dur: 2 };
  P.cableCrunch = { view: 'side', base: { th: 0, sh: -90, ft: 180, hand: ['head', 6, -4], hip: [100, 146] }, a: { t: 18, nk: 0 }, b: { t: 82, nk: 20 },
    props: [{ k: 'cable', at: 'hand', anchor: [126, 8] }], scene: [eq(140, 4, 140, G), eq(124, 6, 140, 6)] };
  P.hangingRaise = { view: 'side', base: { hand: [104, 22], hip: [100, 120], t: 0 }, a: { th: 2, sh: 2 }, b: { th: 96, sh: 96 }, scene: pullBar(22, 50, 160) };
  P.kneeRaise = { view: 'side', base: { hand: [104, 22], hip: [100, 120], t: 0 }, a: { th: 2, sh: 2 }, b: { th: 112, sh: 14 }, scene: pullBar(22, 50, 160) };
  P.legRaise = { view: 'side', base: { hip: [100, 180], t: -90, ua: 90, fa: 90 }, a: { th: 88, sh: 88 }, b: { th: 178, sh: 178 } };
  P.plank = { view: 'side', base: { foot: [26, 178], ft: 60, ua: 0, fa: 90 }, a: { hip: [99, 167.5], t: 77.4 }, b: { hip: [99, 165], t: 76 }, dur: 3.6 };
  P.abWheel = { view: 'side', base: { sh: -90, ft: 180, eb: -1 }, a: { hip: [81, 147.5], th: -16.8, t: 55, hand: [122, 168] }, b: { hip: [100, 160], th: -51.3, t: 80, hand: [180, 174] },
    props: [{ k: 'wheel', at: 'hand' }], dur: 3.2 };
  P.russianTwist = { view: 'front', base: { hip: [100, 176], thl: 0.45, th: 40, sh: 100 }, a: { t: 8, hand: [128, 150], hand2: [112, 154] }, b: { t: -8, hand: [88, 154], hand2: [72, 150] },
    props: [{ k: 'plate', at: 'mid' }], dur: 2 };
  P.sidePlank = { view: 'front', base: { th: -75, sh: -75, th2: 75, sh2: 75, ua: 0, fa: 90, ua2: 180, fa2: 180 }, a: { hip: [84, 160], t: 72 }, b: { hip: [84, 152], t: 71 }, dur: 3 };
  P.woodchop = { view: 'front', base: { foot: [118, 186], eb: 1 }, a: { hip: [100, 111], t: -6, hand: [150, 40], hand2: [140, 48] }, b: { hip: [100, 114], t: 8, hand: [62, 142], hand2: [54, 134] },
    props: [{ k: 'cable', at: 'mid', anchor: [188, 12] }, { k: 'grip', at: 'mid' }], scene: [eq(190, 6, 190, G)] };
  P.pallof = { view: 'side', base: { hip: [100, 111], foot: [100, 186], t: 0, eb: -1 }, a: { hand: ['sc', 14, 16] }, b: { hand: ['sc', 50, 12] },
    props: [{ k: 'cable', at: 'hand', anchor: [46, 92] }, { k: 'grip', at: 'hand' }], scene: [eq(40, 40, 40, G)], dur: 3 };
  P.sideBend = { view: 'front', base: { hip: [100, 111], th: 4, sh: 0, ua: 0, fa: 0, ua2: 150, fa2: -110 }, a: { t: -16 }, b: { t: 14 },
    props: [{ k: 'dumbbell1', at: 'hand' }] };
  P.birdDog = { view: 'side', base: { hip: [80, 146], t: 75.5, sh: -90, ft: 180, ua2: 0, fa2: 0, th2: 0, sh2: -90 }, a: { ua: 0, fa: 0, th: 0 }, b: { ua: 100, fa: 100, th: -88 }, dur: 3 };

  window.GR_PATTERNS = P;
})();
