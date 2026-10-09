/* =========================================================
 * ambient.js — 氛围音效引擎 V9（Web Audio 合成自然声，零依赖）
 * ---------------------------------------------------------
 * 本轮调整（去掉乐器、改用大自然音效，节奏缓慢不嘈杂）：
 *   · 5 个主题色 → 5 种自然声景，颜色与声景直观对应：
 *       樱粉   → 温柔溪流（低通水流声 + 偶发水滴）
 *       暖金   → 清晨鸟鸣（极轻的晨间空气 + 随机鸟啁啾）
 *       青蓝   → 海浪细语（缓慢起伏的潮声）
 *       霓虹紫 → 夏夜虫鸣（极轻夜气 + 蟋蟀短促鸣叫）
 *       薄荷绿 → 林间微风（风掠过树叶 + 偶发叶响）
 *   · 每一声景 = 「连续噪声床（带慢速起伏 LFO）」+「稀疏随机事件」，
 *     音量低、节奏慢，靠呼吸 LFO 缓缓起伏，营造静谧氛围。
 * 说明：不依赖外部音频文件、无版权风险、可离线播放；
 *      因浏览器自动播放策略，默认关闭，首次由用户点击手势触发，
 *      需要时显现、不需要时保持静默。
 * ========================================================= */
(function () {
  "use strict";

  var ctx = null;
  var master = null;
  var noiseBuffer = null;
  var trackGain = null;
  var trackStops = null;      /* 当前声景的停止函数集合 */
  var playing = false;
  var currentTrack = 0;

  var BREATH_RATE = 0.42;
  var BREATH_HZ = BREATH_RATE / (Math.PI * 2);

  /* ---------- 自然声景（颜色 → 声景） ---------- */
  var TRACKS = [
    {
      label: "樱粉 · 温柔溪流",
      bed: { type: "lowpass", freq: 900, q: 0.5, gain: 0.10, lfoHz: 0.12, freqDepth: 260, gainDepth: 0.25 },
      events: { type: "droplet", min: 2200, max: 4600, vol: 1 }
    },
    {
      label: "暖金 · 清晨鸟鸣",
      bed: { type: "lowpass", freq: 420, q: 0.6, gain: 0.05, lfoHz: 0.08, freqDepth: 120, gainDepth: 0.3 },
      events: { type: "chirp", min: 1300, max: 3300, vol: 1 }
    },
    {
      label: "青蓝 · 海浪细语",
      bed: { type: "lowpass", freq: 520, q: 0.4, gain: 0.13, lfoHz: 0.07, freqDepth: 320, gainDepth: 0.55 },
      events: null
    },
    {
      label: "霓虹紫 · 夏夜虫鸣",
      bed: { type: "bandpass", freq: 2800, q: 1.0, gain: 0.03, lfoHz: 0.05, freqDepth: 300, gainDepth: 0.3 },
      events: { type: "cricket", min: 1600, max: 3400, vol: 1 }
    },
    {
      label: "薄荷绿 · 林间微风",
      bed: { type: "bandpass", freq: 620, q: 0.6, gain: 0.09, lfoHz: 0.1, freqDepth: 380, gainDepth: 0.45 },
      events: { type: "rustle", min: 3400, max: 6400, vol: 1 }
    }
  ];

  /* =========================================================
   * 一、自然声合成
   * ========================================================= */

  function ensureCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.8;
      master.connect(ctx.destination);

      /* 呼吸 LFO：整体音量随慢正弦轻轻起伏 */
      var lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = BREATH_HZ;
      var lg = ctx.createGain();
      lg.gain.value = 0.1;
      lfo.connect(lg);
      lg.connect(master.gain);
      lfo.start();

      /* 共享白噪声缓冲（4 秒，可无缝循环） */
      var len = ctx.sampleRate * 4;
      noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = noiseBuffer.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  /* 连续噪声床：过滤噪声 + 慢速起伏 LFO，返回停止函数 */
  function makeBed(c, dest, cfg) {
    var src = c.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;
    var f = c.createBiquadFilter();
    f.type = cfg.type;
    f.frequency.value = cfg.freq;
    f.Q.value = cfg.q;
    var g = c.createGain();
    g.gain.value = cfg.gain;

    var lfo = c.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = cfg.lfoHz;
    var lg = c.createGain();
    lg.gain.value = cfg.freqDepth;
    lfo.connect(lg);
    lg.connect(f.frequency);

    var lfo2 = c.createOscillator();
    lfo2.type = "sine";
    lfo2.frequency.value = cfg.lfoHz * 0.5;
    var lg2 = c.createGain();
    lg2.gain.value = cfg.gain * cfg.gainDepth;
    lfo2.connect(lg2);
    lg2.connect(g.gain);

    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start();
    lfo.start();
    lfo2.start();
    return function () { try { src.stop(); lfo.stop(); lfo2.stop(); } catch (e) {} };
  }

  /* 水滴：正弦 + 快速指数衰减 */
  function droplet(c, dest, when, vol) {
    var f0 = 700 + Math.random() * 700;
    var osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f0;
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vol * 0.18, when + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.5);
    osc.connect(g);
    g.connect(dest);
    osc.start(when);
    osc.stop(when + 0.55);
  }

  /* 鸟啁啾：2–3 个短促滑音 */
  function chirp(c, dest, when, vol) {
    var notes = 2 + ((Math.random() * 2) | 0);
    for (var i = 0; i < notes; i++) {
      var t0 = when + i * 0.09;
      var f0 = 2200 + Math.random() * 800;
      var f1 = f0 + (Math.random() * 900 - 200);
      var osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f0, t0);
      osc.frequency.linearRampToValueAtTime(f1, t0 + 0.08);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol * 0.16, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
      osc.connect(g);
      g.connect(dest);
      osc.start(t0);
      osc.stop(t0 + 0.15);
    }
  }

  /* 蟋蟀：3–4 个短促高频脉冲 */
  function cricket(c, dest, when, vol) {
    var pulses = 3 + ((Math.random() * 2) | 0);
    for (var i = 0; i < pulses; i++) {
      var t0 = when + i * 0.07;
      var osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 3600 + Math.random() * 500;
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol * 0.08, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
      osc.connect(g);
      g.connect(dest);
      osc.start(t0);
      osc.stop(t0 + 0.07);
    }
  }

  /* 叶响：短促高频带通噪声 */
  function rustle(c, dest, when, vol) {
    var src = c.createBufferSource();
    src.buffer = noiseBuffer;
    var f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 2600 + Math.random() * 1400;
    f.Q.value = 0.8;
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vol * 0.04, when + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.5);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(when);
    src.stop(when + 0.55);
  }

  var EVENT_FNS = { droplet: droplet, chirp: chirp, cricket: cricket, rustle: rustle };

  /* 随机事件调度（递归 setTimeout，稀疏触发），返回停止函数 */
  function scheduleEvents(c, dest, cfg) {
    if (!cfg) return null;
    var stopped = false;
    var timer;
    (function tick() {
      timer = setTimeout(function () {
        if (stopped || !playing) return;
        EVENT_FNS[cfg.type](c, dest, c.currentTime + 0.02, cfg.vol);
        tick();
      }, cfg.min + Math.random() * (cfg.max - cfg.min));
    })();
    return function () { stopped = true; clearTimeout(timer); };
  }

  /* =========================================================
   * 二、生命周期
   * ========================================================= */

  function build(idx) {
    var c = ensureCtx();
    if (!c) return false;
    var t = TRACKS[idx];
    var tg = c.createGain();
    tg.gain.value = 0;
    tg.connect(master);
    trackGain = tg;
    var stops = [];
    if (t.bed) stops.push(makeBed(c, tg, t.bed));
    var evStop = scheduleEvents(c, tg, t.events);
    trackStops = { bed: stops, events: evStop };
    tg.gain.linearRampToValueAtTime(1, c.currentTime + 1.5);
    currentTrack = idx;
    playing = true;
    return true;
  }

  function release(cb) {
    if (trackStops) {
      trackStops.bed.forEach(function (s) { s(); });
      if (trackStops.events) trackStops.events();
      trackStops = null;
    }
    if (trackGain && ctx) {
      var tg = trackGain;
      trackGain = null;
      var now = ctx.currentTime;
      tg.gain.cancelScheduledValues(now);
      tg.gain.setValueAtTime(tg.gain.value, now);
      tg.gain.linearRampToValueAtTime(0, now + 0.8);
      setTimeout(function () {
        try { tg.disconnect(); } catch (e) {}
        if (cb) cb();
      }, 860);
    } else {
      if (cb) cb();
    }
  }

  function switchTrack(idx) {
    idx = ((idx % TRACKS.length) + TRACKS.length) % TRACKS.length;
    if (idx === currentTrack && playing) return;
    currentTrack = idx;
    if (!playing) return;
    release(function () {
      if (playing && currentTrack === idx) build(idx);
    });
  }

  function stop() {
    playing = false;
    release();
  }

  function toggle() {
    if (playing) { stop(); return false; }
    return build(currentTrack);
  }

  function start() {
    if (!playing) return build(currentTrack);
    return true;
  }

  /* 颜色主题切换 → 自动切换声景 */
  window.addEventListener("heroaccent", function (e) {
    var idx = e.detail && e.detail.idx;
    if (typeof idx === "number") switchTrack(idx);
  });

  try {
    if (window.Hero3D && typeof window.Hero3D.getAccent === "function") {
      currentTrack = window.Hero3D.getAccent();
    }
  } catch (e) {}

  window.Ambient = {
    tracks: TRACKS.map(function (t) { return t.label; }),
    get playing() { return playing; },
    getTrackLabel: function () { return TRACKS[currentTrack].label; },
    toggle: toggle,
    start: start,
    stop: stop,
    switchTrack: switchTrack
  };
})();
