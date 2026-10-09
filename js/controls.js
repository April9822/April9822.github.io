/* =========================================================
 * controls.js — 氛围控制面板（音乐开关 + 光标颜色主题）
 * 依赖：window.Ambient（ambient.js）、window.Hero3D（hero3d.js）
 * ========================================================= */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- 音乐开关 ---------- */
  var musicBtn = $("#musicBtn");
  function setMusic(on) {
    musicBtn.classList.toggle("is-playing", on);
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? "暂停氛围音乐" : "播放氛围音乐");
  }
  if (musicBtn) {
    musicBtn.addEventListener("click", function () {
      var on = window.Ambient ? window.Ambient.toggle() : false;
      setMusic(!!on);
    });
  }

  /* ---------- 光标颜色主题 ---------- */
  var box = $("#accentThemes");
  function rgb(r) { return "rgb(" + r[0] + "," + r[1] + "," + r[2] + ")"; }
  function renderDots() {
    if (!box || !window.Hero3D) return;
    var themes = window.Hero3D.themes || [];
    var cur = window.Hero3D.getAccent();
    box.innerHTML = themes.map(function (t, i) {
      return '<button class="accent-dot' + (i === cur ? " is-active" : "") + '" data-idx="' + i +
        '" style="background:' + rgb(t.rgb) + '" aria-label="光标颜色：' + t.name + '" title="' + t.name + '" type="button"></button>';
    }).join("");
  }
  if (box) {
    box.addEventListener("click", function (e) {
      var btn = e.target.closest(".accent-dot");
      if (!btn || !window.Hero3D) return;
      var idx = parseInt(btn.getAttribute("data-idx"), 10);
      window.Hero3D.setAccent(idx);
      $all(".accent-dot", box).forEach(function (d) {
        d.classList.toggle("is-active", parseInt(d.getAttribute("data-idx"), 10) === idx);
      });
    });
    /* 外部（URL 参数等）触发主题变化时同步高亮 */
    window.addEventListener("heroaccent", function (e) {
      var idx = e.detail && e.detail.idx;
      $all(".accent-dot", box).forEach(function (d) {
        d.classList.toggle("is-active", parseInt(d.getAttribute("data-idx"), 10) === idx);
      });
      /* 颜色 → 音乐联动：更新音乐按钮提示为当前曲目 */
      if (musicBtn && window.Ambient && typeof window.Ambient.getTrackLabel === "function") {
        musicBtn.setAttribute("title", "氛围音乐 · " + window.Ambient.getTrackLabel());
      }
    });
  }

  renderDots();
})();
