/* =========================================================
 * cursor.js — 顶层光标特效层（始终位于最上层，滚动持续可见）
 * ---------------------------------------------------------
 * 交互状态切换：
 *   · 拖拽移动中 → 效果 B「仙气星尘」：少量柔光粒子缓缓向后
 *     上浮飘散，轻盈如雾、不凌乱。
 *   · 静止不动   → 效果 A「呼吸涟漪」：柔光晕 + 向外缓慢漾开的
 *     涟漪环 + 中心光点轻微「果冻」脉动。
 * 过渡衔接：
 *   · 用连续「活跃度系数 activity」做 A/B 交叉淡化，不做硬切换；
 *   · 进入拖拽快、回静止慢，粒子自然衰减完、涟漪缓缓浮现；
 *   · 双阈值 + 迟滞防抖，抑制手抖 / 触控板余振；
 *   · 主题色随 window.Hero3D 实时同步；尊重 prefers-reduced-motion。
 * 指针：pointer-events: none，不拦截滚动与点击。
 * ========================================================= */
(function () {
  "use strict";

  var canvas = document.getElementById("cursorLayer");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;

  var cur = {
    x: -9999, y: -9999, tx: -9999, ty: -9999,
    px: -9999, py: -9999,
    active: false,
    smSpeed: 0,
    activity: 0,                    /* 0 = 静止(A)  1 = 拖拽(B) */
    moving: false
  };

  var particles = [];
  var MAX_PARTICLES = 42;           /* 减量：避免与背景叠加凌乱 */
  var REDUCED = false;
  try {
    REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  var ENTER = 0.8;
  var EXIT = 0.28;
  var RAMP_IN = 0.3;                /* 进入拖拽 */
  var RAMP_OUT = 0.05;              /* 回静止更慢，过渡更自然 */

  function accent() {
    try {
      /* 优先读平滑过渡中的当前色，换主题时光标颜色渐变而非跳变 */
      if (window.Hero3D && typeof window.Hero3D.getAccentRGB === "function") {
        var c = window.Hero3D.getAccentRGB();
        if (c) return c;
      }
      if (window.Hero3D && window.Hero3D.themes) {
        var t = window.Hero3D.themes[window.Hero3D.getAccent()];
        if (t) return t.rgb;
      }
    } catch (e) {}
    return [244, 167, 160];
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  /* 发射仙气粒子：更少、更柔、缓慢上浮 */
  function emit(x, y, vx, vy, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var sp = 0.2 + Math.random() * 0.7;
      particles.push({
        x: x + (Math.random() - 0.5) * 5,
        y: y + (Math.random() - 0.5) * 5,
        vx: -vx * 0.14 + Math.cos(a) * sp,
        vy: -vy * 0.14 + Math.sin(a) * sp - 0.16,   /* 微微上浮，如雾 */
        r: 0.8 + Math.random() * 1.6,
        life: 0,
        maxLife: 0.9 + Math.random() * 0.6
      });
    }
    if (particles.length > MAX_PARTICLES) {
      particles.splice(0, particles.length - MAX_PARTICLES);
    }
  }

  /* 效果 A：呼吸涟漪（柔光 + 向外漾开的涟漪环） */
  function drawA(alpha) {
    var a = accent();
    var str = a[0] + "," + a[1] + "," + a[2];
    var x = cur.x, y = cur.y;
    var t = performance.now() / 1000;

    /* 柔光晕（加深）：中心更浓、范围略扩，让停留位置清晰可辨 */
    var g = ctx.createRadialGradient(x, y, 0, x, y, 82);
    g.addColorStop(0, "rgba(" + str + "," + (0.36 * alpha).toFixed(3) + ")");
    g.addColorStop(0.5, "rgba(" + str + "," + (0.17 * alpha).toFixed(3) + ")");
    g.addColorStop(1, "rgba(" + str + ",0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 82, 0, Math.PI * 2);
    ctx.fill();

    /* 三道涟漪环：约 4.5s 周期向外漾开、逐渐淡出，更醒目 */
    var amp = REDUCED ? 0 : 1;
    for (var k = 0; k < 3; k++) {
      var ph = (t * 0.22 + k * 0.333) % 1;
      var R = 8 + ph * 40 * amp;
      var al = (1 - ph) * (0.62 * alpha) * amp;
      if (al <= 0.01) continue;
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(" + str + "," + al.toFixed(3) + ")";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  /* 效果 B：仙气星尘（柔光小点 + 淡光晕，轻盈如雾） */
  function drawB(alpha) {
    var a = accent();
    var str = a[0] + "," + a[1] + "," + a[2];
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var k = 1 - p.life / p.maxLife;
      var rr = p.r * (0.5 + 0.5 * k);
      /* 外层淡光晕 */
      ctx.fillStyle = "rgba(" + str + "," + (0.14 * k * alpha).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, rr * 3.2, 0, Math.PI * 2);
      ctx.fill();
      /* 核心柔点 */
      ctx.fillStyle = "rgba(" + str + "," + (0.45 * k * alpha).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* 中心光点：果冻般轻微脉动（恒定绘制，过渡不消失） */
  function drawDot() {
    var a = accent();
    var str = a[0] + "," + a[1] + "," + a[2];
    var x = cur.x, y = cur.y;
    var t = performance.now() / 1000;
    var jp = REDUCED ? 0 : 1.4;
    var r = 5 + Math.sin(t * 1.6) * jp;      /* 果冻脉动 */
    ctx.fillStyle = "rgba(" + str + ",0.95)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.arc(x, y, r * 0.46, 0, Math.PI * 2);
    ctx.fill();
  }

  function update(dt) {
    var vx = cur.x - cur.px, vy = cur.y - cur.py;
    cur.px = cur.x;
    cur.py = cur.y;
    var fs = Math.hypot(vx, vy);
    cur.smSpeed += (fs - cur.smSpeed) * 0.18;

    if (cur.smSpeed > ENTER) cur.moving = true;
    else if (cur.smSpeed < EXIT) cur.moving = false;

    if (cur.moving) cur.activity += (1 - cur.activity) * RAMP_IN;
    else cur.activity -= cur.activity * RAMP_OUT;

    if (cur.activity > 0.03) {
      var n = Math.min(3, Math.round(fs * 0.55));
      if (n > 0) emit(cur.x, cur.y, vx, vy, REDUCED ? 1 : n);
    }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (!cur.active) return;
    var A = 1 - cur.activity, B = cur.activity;
    if (A > 0.01) drawA(A);
    if (B > 0.01) drawB(B);
    drawDot();
  }

  var last = performance.now();
  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    cur.x += (cur.tx - cur.x) * 0.22;
    cur.y += (cur.ty - cur.y) * 0.22;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function onMove(nx, ny) {
    if (!cur.active) {
      cur.active = true;
      cur.x = nx; cur.y = ny; cur.tx = nx; cur.ty = ny;
      cur.px = nx; cur.py = ny;
      return;
    }
    cur.tx = nx;
    cur.ty = ny;
  }

  window.addEventListener("mousemove", function (e) {
    onMove(e.clientX, e.clientY);
  }, { passive: true });
  window.addEventListener("touchmove", function (e) {
    if (e.touches && e.touches.length) onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener("mouseleave", function () { cur.active = false; }, { passive: true });
  window.addEventListener("touchend", function () { cur.active = false; }, { passive: true });
  window.addEventListener("resize", resize);

  resize();
  requestAnimationFrame(loop);
})();
