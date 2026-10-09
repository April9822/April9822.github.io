/* =========================================================
 * hero3d.js — V11 · 全站「雾紫心流」叙事 + 情绪/心理主题形态
 * ---------------------------------------------------------
 * 本次优化（主题色全站联动 + 平滑过渡）：
 *   · 主题从单一 rgb 扩展为「主色/深色/浅色/背景/雾色」全套
 *     和谐配色——深色由主题定义而非纯数学推导，保证樱粉等
 *     主题的深色「纯正、不脏」。
 *   · 粒子色板（PALETTE）、体积光斑、深度雾、脑电波、呼吸光环
 *     全部改为随主题派生，并在帧循环里逐帧 lerp，切换平滑。
 *   · 全站 CSS 变量（含背景/雾色）由 applyThemeCSS 写入，
 *     配合 CSS 的 @property + transition 实现平滑换色。
 * 实现：Canvas 2D，零依赖；尊重 prefers-reduced-motion。
 * ========================================================= */
(function () {
  "use strict";

  var canvas = document.getElementById("scene3d");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  var W = 0, H = 0;
  var FOV = 720;

  /* =========================================================
   * 主题色（光标 / 光晕 / 呼吸环 / 点缀粒子 / 全站强调色）
   * 每个主题定义一整套和谐配色，而非纯数学推导：
   *   rgb   主色（光标、强调）
   *   deep  深色（标题渐变、标签底色、深色文字，白字可读）
   *   light 浅色（柔光、浅标签）
   *   bg    全站背景底色
   *   mist  区块雾色（section--mist / 占位缩略图底）
   * ========================================================= */
  var THEMES = [
    { name: "樱粉",   rgb: [244, 167, 160], deep: [200, 82, 96],   light: [251, 227, 224], bg: [253, 246, 246], mist: [247, 230, 228] },
    { name: "暖金",   rgb: [244, 199, 128], deep: [190, 120, 40],  light: [251, 233, 200], bg: [253, 250, 242], mist: [248, 236, 215] },
    { name: "青蓝",   rgb: [122, 209, 235], deep: [30, 120, 158],  light: [205, 238, 248], bg: [244, 250, 252], mist: [223, 240, 246] },
    { name: "霓虹紫", rgb: [181, 132, 255], deep: [110, 62, 190],  light: [227, 209, 255], bg: [248, 245, 253], mist: [236, 227, 250] },
    { name: "薄荷绿", rgb: [141, 222, 180], deep: [34, 140, 96],   light: [211, 243, 227], bg: [243, 251, 246], mist: [223, 240, 230] }
  ];

  /* 由主题派生「5 槽位渲染色板」：0主色 1浅 2更浅 3深 4更深 */
  function paletteFor(t) {
    var light2 = t.light.map(function (v) { return Math.round(v + (255 - v) * 0.5); });
    var deep2 = t.deep.map(function (v) { return Math.round(v * 0.78); });
    return [t.rgb.slice(), t.light.slice(), light2, t.deep.slice(), deep2];
  }

  var ACCENT = THEMES[0].rgb.slice();       /* 当前渲染用（逐帧向目标 lerp，平滑） */
  var ACCENT_TGT = THEMES[0].rgb.slice();
  var PALETTE_CUR = paletteFor(THEMES[0]);
  var PALETTE_TGT = paletteFor(THEMES[0]);
  var ACCENT_IDX = 0;

  /* 默认主题（陌生人 / 首次访问、localStorage 无记录时）：
     霓虹紫 THEMES[3]。访客一旦手动切换过主题，会记住其选择；
     其余主题仍可通过导航栏色点切换，配色保持可配置。 */
  var DEFAULT_ACCENT = 3;

  function loadAccent() {
    var idx = DEFAULT_ACCENT;
    try {
      var stored = localStorage.getItem("hero_accent");
      if (stored != null && !isNaN(parseInt(stored, 10))) idx = parseInt(stored, 10);
    } catch (e) {}
    /* 支持 ?accent=樱粉 / 暖金 / ... / 0-4 */
    try {
      var m = location.search.match(/[?&]accent=([^&]+)/);
      if (m) {
        var v = decodeURIComponent(m[1]);
        if (!isNaN(parseInt(v, 10))) idx = parseInt(v, 10);
        else THEMES.forEach(function (t, i) { if (t.name === v) idx = i; });
      }
    } catch (e) {}
    idx = ((idx % THEMES.length) + THEMES.length) % THEMES.length;
    setAccent(idx, true);
  }
  function toHex(c) {
    return "#" + c.map(function (v) {
      return ("0" + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2);
    }).join("");
  }
  /* 主题色 → 全站 CSS 变量：让背景、按钮、导航、标题、标签、光晕等
     强调色随主题联动（而非仅光标 / 箭头颜色）。 */
  function applyThemeCSS() {
    var t = THEMES[ACCENT_IDX];
    var st = document.documentElement.style;
    st.setProperty("--iris", toHex(t.rgb));
    st.setProperty("--iris-deep", toHex(t.deep));
    st.setProperty("--accent-rgb", t.rgb.join(","));
    st.setProperty("--accent-deep-rgb", t.deep.join(","));
    st.setProperty("--accent-light-rgb", t.light.join(","));
    st.setProperty("--bg-rgb", t.bg.join(","));
    st.setProperty("--mist-rgb", t.mist.join(","));
    st.setProperty("--bg", toHex(t.bg));
    st.setProperty("--mist", toHex(t.mist));
  }
  function setAccent(idx, silent) {
    idx = ((idx % THEMES.length) + THEMES.length) % THEMES.length;
    ACCENT_IDX = idx;
    ACCENT_TGT = THEMES[idx].rgb.slice();
    PALETTE_TGT = paletteFor(THEMES[idx]);
    applyThemeCSS();
    try { localStorage.setItem("hero_accent", String(idx)); } catch (e) {}
    if (!silent && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("heroaccent", { detail: { idx: idx } }));
    }
  }
  /* 逐帧把当前色板向目标色板 lerp：背景粒子/光斑/雾/波带平滑换色 */
  function updatePalette() {
    var changed = false;
    for (var i = 0; i < PALETTE_CUR.length; i++) {
      for (var k = 0; k < 3; k++) {
        var c = PALETTE_CUR[i][k], t = PALETTE_TGT[i][k];
        if (Math.abs(c - t) > 0.5) { PALETTE_CUR[i][k] = c + (t - c) * 0.08; changed = true; }
        else PALETTE_CUR[i][k] = t;
      }
    }
    for (var k2 = 0; k2 < 3; k2++) {
      var a = ACCENT[k2], t2 = ACCENT_TGT[k2];
      if (Math.abs(a - t2) > 0.5) { ACCENT[k2] = a + (t2 - a) * 0.08; changed = true; }
      else ACCENT[k2] = t2;
    }
    return changed;
  }
  /* 对外暴露：控制面板 / 光标层 / 音乐引擎调用 */
  window.Hero3D = {
    themes: THEMES,
    getAccent: function () { return ACCENT_IDX; },
    getAccentRGB: function () { return ACCENT; },   /* 平滑过渡中的当前色 */
    setAccent: setAccent
  };

  function prand(i) {
    var x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  /* =========================================================
   * 第 2–6 章形态库（世界坐标）
   * ========================================================= */
  /* 正念曼陀罗：同心环 + 放射花瓣，随「呼吸」脉动。
     象征从军旅的纪律走向内在的秩序与平静（正念冥想意象）。 */
  function shapeMandala(i, n, time) {
    var rings = 5;
    var perRing = Math.max(1, Math.floor(n / rings));
    var ring = i % rings;
    var idx = Math.floor(i / rings);
    var ang = (idx / perRing) * Math.PI * 2 + prand(i) * 0.35;
    var breath = 1 + Math.sin(time * 0.0007) * 0.045;
    var R = (80 + ring * 92) * breath;
    var petals = 8;
    var petal = 0.5 + 0.5 * Math.cos(ang * petals + ring * 0.7);
    var rr = R * (1 + petal * 0.22);
    var x = Math.cos(ang) * rr;
    var y = Math.sin(ang) * rr;
    var z = (prand(i + 5) - 0.5) * 72 * (ring / rings);
    return [x, y, z];
  }

  function shapeEEG(i, n, time) {
    var rows = 4;
    var row = i % rows;
    var u = Math.floor(i / rows) / Math.ceil(n / rows);
    var amp = 42 + prand(i) * 34;
    var y = (row - (rows - 1) / 2) * 92 +
      Math.sin(u * Math.PI * 5.2 + time * 0.0016 + row * 1.9) * amp +
      Math.sin(u * Math.PI * 13 + time * 0.0024 + row) * amp * 0.32;
    return [(u - 0.5) * 1000, y, (prand(i + 2) - 0.5) * 150];
  }

  /* 星宿星座：多个星点簇连线成「思想星图」，
     象征把零散的研究点连成一张网（呼应水瓶座星象）。 */
  function shapeConstellation(i, n, time) {
    var CL = [
      [-380, -150, -70], [-130, 130, 80], [30, -150, -130],
      [210, 90, 150], [400, -60, -40], [120, 230, 60], [-250, 80, 170]
    ];
    var c = CL[i % CL.length];
    var a = prand(i) * Math.PI * 2;
    var b = Math.acos(prand(i + 1) * 2 - 1);
    var r = 16 + prand(i + 2) * 66;
    var tw = Math.sin(time * 0.0008 + i * 1.1) * 6;
    return [
      c[0] + r * Math.sin(b) * Math.cos(a) + tw,
      c[1] + r * Math.sin(b) * Math.sin(a) * 0.82,
      c[2] + r * Math.cos(b) * 0.85
    ];
  }

  /* 颂钵：碗口环 + 向外扩散的声波涟漪。
     颂钵是声音疗愈/情绪调节的经典物件，敲击后的涟漪扩散
     象征 HUG「用科技接住情绪」——VR 是新的颂钵。 */
  function shapeSingingBowl(i, n, time) {
    if (i % 4 === 0) {
      var wave = (time * 0.0005 + (i * 0.13)) % 1;
      var wr = 60 + wave * 430;
      var wa = prand(i + 3) * Math.PI * 2;
      var wx = Math.cos(wa) * wr;
      var wy = Math.sin(wa) * wr * 0.52;
      var wz = (prand(i + 5) - 0.5) * 40;
      return [wx, wy, wz];
    }
    var u = prand(i) * Math.PI * 2;
    var v = prand(i + 1) * Math.PI * 2;
    var R = 250, r = 30;
    var x = (R + r * Math.cos(v)) * Math.cos(u);
    var z = (R + r * Math.cos(v)) * Math.sin(u);
    var y = r * Math.sin(v) * 0.55;
    var tilt = -0.45;
    var y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
    var z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
    return [x, y2, z2];
  }

  /* 水瓶座星流：沿「持水者倒水」折线的流动星图。
     水瓶座象征流动、理想主义与人道关怀，对应「走向更大舞台、
     用科技关怀更多人」的愿景；星点沿水流折线闪烁连成星座。 */
  var AQ_PATH = [
    [-430, 190], [-300, 80], [-140, 150], [20, 50],
    [160, 130], [320, 30], [440, 110]
  ];
  function shapeAquarius(i, n, time) {
    var seg = AQ_PATH.length - 1;
    var u = prand(i);
    var fi = u * seg;
    var si = Math.min(seg - 1, Math.floor(fi));
    var t = fi - si;
    var p0 = AQ_PATH[si], p1 = AQ_PATH[si + 1];
    var x = p0[0] + (p1[0] - p0[0]) * t;
    var y = p0[1] + (p1[1] - p0[1]) * t;
    var sa = prand(i + 2) * Math.PI * 2;
    var spread = prand(i + 3) * 24;
    x += Math.cos(sa) * spread + Math.sin(time * 0.001 + i) * 5;
    y += Math.sin(sa) * spread * 0.7;
    var z = (prand(i + 4) - 0.5) * 160;
    return [x, y, z];
  }

  var SECTIONS = [
    { id: "home", shape: null },
    { id: "about", shape: shapeMandala },
    { id: "experience", shape: shapeEEG },
    { id: "writings", shape: shapeConstellation },
    { id: "portfolio", shape: shapeSingingBowl },
    { id: "contact", shape: shapeAquarius }
  ];
  var curSec = SECTIONS[0];

  function detectSection() {
    var mid = (window.scrollY || 0) + window.innerHeight * 0.5;
    var pick = SECTIONS[0];
    for (var i = 0; i < SECTIONS.length; i++) {
      var el = document.getElementById(SECTIONS[i].id);
      if (el && el.offsetTop <= mid) pick = SECTIONS[i];
    }
    return pick;
  }
  function onScroll() {
    curSec = detectSection();
    if (reduce) placeStatic();
  }

  /* ---------- 形态粒子（世界坐标） ---------- */
  var shapeParticles = [];
  function buildShapeParticles() {
    var count;
    if (W < 640) count = 96;
    else if (W < 1024) count = 144;
    else count = 224;
    shapeParticles = [];
    for (var i = 0; i < count; i++) {
      var accent = prand(i + 9) < 0.14;
      shapeParticles.push({
        x: 0, y: 0, z: 0,
        accent: accent,
        cIdx: accent ? -1 : ((prand(i + 11) * PALETTE_CUR.length) | 0),
        s: accent ? 2.2 + prand(i + 12) * 1.4 : 0.9 + prand(i + 13) * 1.9,
        tw: prand(i + 14) * Math.PI * 2,
        tws: 0.4 + prand(i + 15) * 1.1
      });
    }
  }

  /* ---------- 情绪粒子（首屏，屏幕坐标） ---------- */
  var emotions = [];
  function buildEmotions() {
    var count = W < 640 ? 58 : (W < 1024 ? 84 : 116);
    emotions = [];
    for (var i = 0; i < count; i++) {
      var accent = prand(i + 21) < 0.16;
      emotions.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.26,
        vy: -(0.10 + Math.random() * 0.28),
        accent: accent,
        cIdx: accent ? -1 : ((prand(i + 31) * PALETTE_CUR.length) | 0),
        s: accent ? 2.1 + Math.random() * 1.5 : 1.0 + Math.random() * 1.8,
        tw: Math.random() * Math.PI * 2,
        tws: 0.4 + Math.random() * 1.1,
        depth: 0.5 + Math.random() * 0.5
      });
    }
  }

  function colorOf(p) { return p.accent ? ACCENT : PALETTE_CUR[p.cIdx]; }

  /* ---------- 光标 & 头像 ---------- */
  var cursor = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false, speed: 0 };
  var avatar = { cx: W / 2, cy: H / 2, r: 160 };
  var avatarEl = document.querySelector(".avatar-ring");
  function locateAvatar() {
    if (avatarEl) {
      var r = avatarEl.getBoundingClientRect();
      avatar.cx = r.left + r.width / 2;
      avatar.cy = r.top + r.height / 2;
      avatar.r = r.width / 2;
    }
  }

  function project(x, y, z, rx, ry) {
    var cosY = Math.cos(ry), sinY = Math.sin(ry);
    var x1 = x * cosY + z * sinY;
    var z1 = -x * sinY + z * cosY;
    var cosX = Math.cos(rx), sinX = Math.sin(rx);
    var y1 = y * cosX - z1 * sinX;
    var z2 = y * sinX + z1 * cosX;
    var f = FOV / (FOV + z2);
    if (f <= 0) return null;
    return { sx: (W / 2) + x1 * f, sy: (H / 2) + y1 * f, z: z2, f: f };
  }

  var ROT_BASE = -0.12;

  /* =========================================================
   * 氛围层（全站统一）
   * ========================================================= */

  /* 深度雾：中心亮、四周淡，营造纵深（颜色随主题） */
  function drawFog() {
    var c1 = PALETTE_CUR[1], c3 = PALETTE_CUR[3];
    var g = ctx.createRadialGradient(W / 2, H * 0.47, 0, W / 2, H * 0.47, Math.max(W, H) * 0.62);
    g.addColorStop(0, "rgba(" + c1[0] + "," + c1[1] + "," + c1[2] + ",0.17)");
    g.addColorStop(0.5, "rgba(" + c3[0] + "," + c3[1] + "," + c3[2] + ",0.06)");
    g.addColorStop(1, "rgba(247,247,252,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* 体积光斑：缓慢漂移的柔光团（全站统一，颜色随主题色板） */
  var ORBS = [
    { x: 0.18, y: 0.24, r: 260, ci: 1, a: 0.20, sp: 0.00010, ph: 0 },
    { x: 0.82, y: 0.18, r: 220, ci: 2, a: 0.16, sp: 0.00014, ph: 2.1 },
    { x: 0.72, y: 0.72, r: 300, ci: 3, a: 0.14, sp: 0.00008, ph: 4.0 },
    { x: 0.28, y: 0.80, r: 240, ci: 0, a: 0.12, sp: 0.00012, ph: 5.2 }
  ];
  function drawVolumetricOrbs(time) {
    for (var i = 0; i < ORBS.length; i++) {
      var o = ORBS[i];
      var c = PALETTE_CUR[o.ci];
      var ox = o.x * W + Math.sin(time * o.sp + o.ph) * 46;
      var oy = o.y * H + Math.cos(time * o.sp * 0.8 + o.ph) * 34;
      var rr = o.r * (1 + Math.sin(time * 0.0004 + o.ph) * 0.06);
      var g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rr);
      g.addColorStop(0, "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + o.a.toFixed(3) + ")");
      g.addColorStop(1, "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ox, oy, rr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* 脑电波带：首页明显，其余章节淡化作统一氛围（颜色随主题深色） */
  function drawEEGWave(time, strength) {
    if (strength <= 0.02) return;
    var baseY = H * 0.6;
    var amp = (15 + Math.min(cursor.speed, 40) * 0.4) * strength;
    var c3 = PALETTE_CUR[3];
    ctx.save();
    for (var w = 0; w < 2; w++) {
      ctx.beginPath();
      var off = w * 0.5;
      var steps = 88;
      for (var k = 0; k <= steps; k++) {
        var u = k / steps;
        var x = u * W;
        var y = baseY + w * 15
          + Math.sin(u * Math.PI * 6 + time * 0.0013 + off) * amp
          + Math.sin(u * Math.PI * 13 + time * 0.002 + off) * amp * 0.3
          + Math.sin(u * Math.PI * 2.4 + time * 0.0007) * amp * 0.55;
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(" + c3[0] + "," + c3[1] + "," + c3[2] + "," + ((w === 0 ? 0.3 : 0.17) * strength).toFixed(3) + ")";
      ctx.lineWidth = w === 0 ? 1.6 : 1.1;
      ctx.shadowColor = "rgba(" + c3[0] + "," + c3[1] + "," + c3[2] + ",0.45)";
      ctx.shadowBlur = (w === 0 ? 9 : 5);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* =========================================================
   * 首屏「心流」—— 情绪光点
   * ========================================================= */
  function updateEmotions(time) {
    var EMB = 170, SW = 0.42;
    for (var i = 0; i < emotions.length; i++) {
      var p = emotions[i];
      p.x += p.vx + Math.sin(time * 0.0006 + p.tw) * 0.12;
      p.y += p.vy;
      if (cursor.active) {
        var dx = cursor.x - p.x, dy = cursor.y - p.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < EMB && d > 0.5) {
          var f = 1 - d / EMB;
          var ux = dx / d, uy = dy / d;
          p.x += ux * f * f * 0.95;
          p.y += uy * f * f * 0.95;
          p.x += -uy * f * SW;
          p.y += ux * f * SW;
        }
      }
      if (p.x < -40) p.x = W + 40; else if (p.x > W + 40) p.x = -40;
      if (p.y < -40) p.y = H + 40; else if (p.y > H + 40) p.y = -40;
    }
  }

  function drawEmotions(time) {
    var LINK = 96;
    var c3 = PALETTE_CUR[3];
    ctx.lineWidth = 1;
    for (var i = 0; i < emotions.length; i++) {
      var a = emotions[i];
      for (var j = i + 1; j < emotions.length; j++) {
        var b = emotions[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d2 = dx * dx + dy * dy;
        if (d2 > LINK * LINK) continue;
        var d = Math.sqrt(d2);
        var la = (1 - d / LINK) * 0.15 * a.depth * b.depth;
        if (la <= 0.01) continue;
        ctx.strokeStyle = "rgba(" + c3[0] + "," + c3[1] + "," + c3[2] + "," + la.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    for (i = 0; i < emotions.length; i++) {
      var p = emotions[i];
      var tw = 0.72 + Math.sin(time * 0.001 * p.tws + p.tw) * 0.28;
      var alpha = 0.32 + p.depth * 0.5;
      var col = colorOf(p);
      ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (alpha * 0.14).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.4, p.s * 3.2 * p.depth), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (alpha * tw).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.6, p.s * p.depth), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* =========================================================
   * 首屏「心流」—— 呼吸光晕（围绕头像，缓慢呼吸，无脉冲）
   * ========================================================= */
  function drawBreathHalo(time) {
    locateAvatar();
    var ax = avatar.cx, ay = avatar.cy, r = avatar.r;
    if (!r) return;
    var breath = 0.5 + 0.5 * Math.sin(time * 0.0007); /* 0..1 周期约 9s */
    var c1 = PALETTE_CUR[1];
    ctx.save();
    var g = ctx.createRadialGradient(ax, ay, r * 0.7, ax, ay, r * 1.5);
    g.addColorStop(0, "rgba(" + c1[0] + "," + c1[1] + "," + c1[2] + ",0)");
    g.addColorStop(1, "rgba(" + ACCENT[0] + "," + ACCENT[1] + "," + ACCENT[2] + "," + (0.05 + breath * 0.10).toFixed(3) + ")");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(ax, ay, r * 1.5, 0, Math.PI * 2);
    ctx.fill();
    var rr = r * (1.0 + breath * 0.03);
    ctx.beginPath();
    ctx.arc(ax, ay, rr, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(" + ACCENT[0] + "," + ACCENT[1] + "," + ACCENT[2] + "," + (0.14 + breath * 0.16).toFixed(3) + ")";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(" + ACCENT[0] + "," + ACCENT[1] + "," + ACCENT[2] + ",0.6)";
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();
  }

  /* =========================================================
   * 第 2–6 章形态（增强 3D 渲染）
   * 注：光标暖光已移入顶层 cursor.js 独立图层，本文件只负责
   *     背景层粒子被光标点亮（见 drawShape 中的 cursor.active 判断）。
   * ========================================================= */
  function updateShape(time) {
    var n = shapeParticles.length;
    for (var i = 0; i < n; i++) {
      var p = shapeParticles[i];
      var tgt = curSec.shape(i, n, time);
      p.x += (tgt[0] - p.x) * 0.045;
      p.y += (tgt[1] - p.y) * 0.045;
      p.z += (tgt[2] - p.z) * 0.045;
    }
  }

  function mix(a, b, t) {
    return [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t
    ];
  }

  function drawShape(time) {
    var px = cursor.active ? (cursor.x / W - 0.5) * 2 : 0;
    var py = cursor.active ? (cursor.y / H - 0.5) * 2 : 0;
    /* 呼吸式缓摆：用慢正弦往复取代匀速自转（樱粉→薄荷各章节奏统一放缓），
       鼠标视差灵敏度同步降低，整体更舒缓、不激烈 */
    var rx = ROT_BASE + py * 0.16 + Math.sin(time * 0.00009 + 1.7) * 0.05;
    var ry = px * 0.2 + Math.sin(time * 0.00012) * 0.26;
    var c3 = PALETTE_CUR[3];
    var n = shapeParticles.length;
    var pts = [];
    for (var i = 0; i < n; i++) {
      var p = shapeParticles[i];
      var pr = project(p.x, p.y, p.z, rx, ry);
      if (!pr) { pts.push(null); continue; }
      var depth = 1 - (pr.z + 560) / 1120;
      var alpha = 0.3 + depth * 0.66;
      var tw = 0.75 + Math.sin(time * 0.001 * p.tws + p.tw) * 0.25;
      pts.push({ sx: pr.sx, sy: pr.sy, p: p, size: p.s * pr.f * tw, alpha: alpha, depth: depth });
    }

    /* 星座连线 */
    var LD = Math.min(W, H) < 700 ? 125 : 160;
    ctx.lineWidth = 1;
    for (i = 0; i < pts.length; i++) {
      var a = pts[i]; if (!a) continue;
      for (var j = i + 1; j < pts.length; j++) {
        var b = pts[j]; if (!b) continue;
        var dx = a.sx - b.sx, dy = a.sy - b.sy;
        var d2 = dx * dx + dy * dy;
        if (d2 > LD * LD) continue;
        var la = (1 - Math.sqrt(d2) / LD) * 0.34 * Math.min(a.alpha, b.alpha);
        if (la <= 0.012) continue;
        ctx.strokeStyle = "rgba(" + c3[0] + "," + c3[1] + "," + c3[2] + "," + la.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }
    }

    /* 粒子（含景深分级 + 光标点亮 + 近景发光色散） */
    for (i = 0; i < pts.length; i++) {
      var q = pts[i]; if (!q) continue;
      var col = colorOf(q.p);
      var alpha = q.alpha;

      /* 光标附近：点亮 + 向强调色靠拢 */
      if (cursor.active) {
        var cd = Math.hypot(q.sx - cursor.x, q.sy - cursor.y);
        if (cd < 150) {
          var glow = 1 - cd / 150;
          col = mix(col, ACCENT, glow * 0.65);
          alpha = Math.min(1, alpha + glow * 0.3);
        }
      }

      var near = q.depth > 0.72; /* 近景：发光 + 色散 */
      var colStr = Math.round(col[0]) + "," + Math.round(col[1]) + "," + Math.round(col[2]);

      /* 外层光晕 */
      ctx.fillStyle = "rgba(" + colStr + "," + (alpha * 0.16).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(q.sx, q.sy, Math.max(1.2, q.size * 3.2), 0, Math.PI * 2);
      ctx.fill();

      if (near) {
        /* 色散：红/蓝轻微偏移（棱镜感） */
        ctx.fillStyle = "rgba(" + colStr + ",0.28)";
        ctx.beginPath();
        ctx.arc(q.sx - 1.4, q.sy, Math.max(0.5, q.size) + 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(" + colStr + ",0.28)";
        ctx.beginPath();
        ctx.arc(q.sx + 1.4, q.sy, Math.max(0.5, q.size) + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      /* 核心粒子 */
      ctx.fillStyle = "rgba(" + colStr + "," + alpha.toFixed(3) + ")";
      if (near) {
        ctx.shadowColor = "rgba(" + colStr + ",0.8)";
        ctx.shadowBlur = 10;
      }
      ctx.beginPath();
      ctx.arc(q.sx, q.sy, Math.max(0.5, q.size), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawHome(time) {
    drawEmotions(time);
    drawBreathHalo(time);
  }

  /* =========================================================
   * 主循环
   * ========================================================= */
  function draw(time) {
    ctx.clearRect(0, 0, W, H);
    drawFog();
    drawVolumetricOrbs(time);
    /* 脑电波：首页强度 1，其余章节 0.32（统一氛围） */
    var waveStrength = curSec.id === "home" ? 1 : 0.32;
    drawEEGWave(time, waveStrength);
    if (curSec.id === "home") drawHome(time);
    else drawShape(time);
  }

  function update(time) {
    updatePalette();
    cursor.x += (cursor.tx - cursor.x) * 0.22;
    cursor.y += (cursor.ty - cursor.y) * 0.22;
    cursor.speed *= 0.92;
    if (curSec.id === "home") updateEmotions(time);
    else updateShape(time);
  }

  function loop(time) {
    if (!document.hidden) {
      if (!reduce) update(time || 0);
      draw(time || 0);
    }
    requestAnimationFrame(loop);
  }

  function placeStatic() {
    if (curSec.shape) {
      var n = shapeParticles.length;
      for (var i = 0; i < n; i++) {
        var t0 = curSec.shape(i, n, 0);
        shapeParticles[i].x = t0[0];
        shapeParticles[i].y = t0[1];
        shapeParticles[i].z = t0[2];
      }
    }
    draw(0);
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildShapeParticles();
    buildEmotions();
    locateAvatar();
  }

  window.addEventListener("resize", function () {
    resize();
    if (reduce) placeStatic();
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("mousemove", function (e) {
    var nx = e.clientX, ny = e.clientY;
    if (!cursor.active) { cursor.active = true; cursor.x = nx; cursor.y = ny; cursor.tx = nx; cursor.ty = ny; }
    cursor.speed = Math.min(40, cursor.speed + Math.hypot(nx - cursor.tx, ny - cursor.ty) * 0.6);
    cursor.tx = nx;
    cursor.ty = ny;
  }, { passive: true });
  window.addEventListener("mouseleave", function () { cursor.active = false; }, { passive: true });

  loadAccent();
  resize();
  onScroll();
  if (reduce) { /* 静态帧已由 onScroll → placeStatic 绘制 */ } else { requestAnimationFrame(loop); }
})();
