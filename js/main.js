/* =========================================================
 * main.js — 渲染与交互逻辑
 * 依赖：i18n.js（window.I18N）、data.js（window.SITE_DATA）
 * ========================================================= */

(function () {
  "use strict";

  var DATA = window.SITE_DATA || {};
  var I18N = window.I18N || {};

  /* ---------- 语言状态 ---------- */
  var LANG_KEY = "site_lang";
  var lang = "zh";
  try { lang = localStorage.getItem(LANG_KEY) === "en" ? "en" : "zh"; } catch (e) { /* 隐私模式下忽略 */ }

  /* ---------- 工具：抗脏数据取值 ---------- */
  function t(field) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object") return field[lang] || field.zh || "";
    return String(field);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* =========================================================
   * 渲染
   * ========================================================= */

  function renderStatic() {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";

    $all("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var dict = I18N[lang] || I18N.zh || {};
      if (dict[key]) el.textContent = dict[key];
    });

    var profile = DATA.profile || {};
    $("#heroName").textContent = t(profile.name);
    $("#heroTagline").textContent = t(profile.tagline);
    $("#heroIntro").textContent = t(profile.intro);
    if (profile.avatar) {
      var av = $("#heroAvatar");
      if (av) av.src = profile.avatar;
    }
    /* 页脚署名：中文名后直接跟英文名（王馨妍 April），不拆开中文名 */
    $("#footerName").textContent = lang === "en" ? "April Wang" : "王馨妍 April";
    var mascot = $("#mascotBubble");
    if (mascot) mascot.textContent = t((DATA.mascot || {}).bubble);
    document.title = lang === "en"
      ? "Xinyan Wang · VR Well-being Researcher & Founder"
      : "王馨妍 Xinyan Wang · VR 情绪疗愈研究者";
    $("#langBtn").textContent = lang === "en" ? "中" : "EN";
  }

  /* 首页三个浮动数据卡 */
  function renderStats() {
    var stats = DATA.stats || [];
    ["stat1", "stat2", "stat3"].forEach(function (id, i) {
      var el = document.getElementById(id);
      var s = stats[i];
      if (!el || !s) { if (el) el.style.display = "none"; return; }
      el.innerHTML =
        "<strong>" + esc(s.num) + "</strong>" +
        "<small>" + esc(t(s.label)) + "</small>" +
        "<em>" + esc(t(s.note)) + "</em>";
    });
  }

  /* 首屏兴趣标签 */
  function renderInterests() {
    var box = $("#heroInterests");
    if (!box) return;
    var items = (DATA.profile && DATA.profile.interests) || [];
    box.innerHTML = items.map(function (item) {
      return '<li class="interest-tag">' + esc(t(item)) + "</li>";
    }).join("");
    if (!items.length) box.style.display = "none";
  }

  /* 文章列表（标题与封面卡均可点击 → 新标签页打开原文） */
  function renderPapers() {
    var box = $("#paperList");
    if (!box) return;
    var dict = I18N[lang] || I18N.zh;
    box.innerHTML = (DATA.publications || []).map(function (p) {
      var link = p.doi || p.link || "";
      var img = p.cover
        ? '<img class="paper-cover__img" src="' + esc(p.cover) + '" alt="' + esc(dict["writing.coverAlt"] || "") + '" loading="lazy" onerror="this.style.display=\'none\'">'
        : "";
      var inner =
        '<div class="paper-cover">' + img +
          '<span class="paper-year">' + esc(p.year || "") + "</span>" +
        "</div>" +
        '<div class="paper-body">' +
          '<span class="paper-venue">' + esc(t(p.venue)) + "</span>" +
          '<h3 class="paper-title">' + esc(t(p.title)) +
            '<svg class="paper-ext" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
            '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</h3>" +
          '<p class="paper-note">' + esc(t(p.note)) + "</p>" +
          '<div class="paper-foot">' +
            /* 作者信息：仅在有收录标识（如 SSCI/SCIE）时显示，不再展示第几作者 */
            (t(p.authorship) ? '<span class="paper-author">' + esc(t(p.authorship)) + "</span>" : "") +
            '<span class="paper-cta">' + esc(dict["writing.read"] || "") + " →</span>" +
          "</div>" +
        "</div>";
      return link
        ? '<a class="paper-card tilt" data-tilt="8" href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">' + inner + "</a>"
        : '<article class="paper-card tilt" data-tilt="8">' + inner + "</article>";
    }).join("");
  }

  /* 时间线 */
  function renderTimeline() {
    var box = $("#timeline");
    if (!box) return;
    box.innerHTML = (DATA.timeline || []).map(function (item) {
      return (
        '<div class="tl-item">' +
          '<div><span class="tl-tag">' + esc(t(item.tag)) + '</span>' +
          '<span class="tl-time">' + esc(item.time || "") + "</span></div>" +
          '<h3 class="tl-title">' + esc(t(item.title)) + "</h3>" +
          '<p class="tl-desc">' + esc(t(item.desc)) + "</p>" +
        "</div>"
      );
    }).join("");
  }

  /* 技能（不做等级评分，用一句话真实描述） */
  function renderSkills() {
    var box = $("#skillList");
    if (!box) return;
    box.innerHTML = (DATA.skills || []).map(function (s) {
      return (
        '<li class="skill-item">' +
          '<span class="skill-name">' + esc(lang === "en" && s.en ? s.en : s.name) + "</span>" +
          '<span class="skill-note">' + esc(t(s.note)) + "</span>" +
        "</li>"
      );
    }).join("");
  }

  /* 项目经历（不再展示指导 / 参与者身份徽章） */
  function renderProjects() {
    var box = $("#expList");
    if (!box) return;
    box.innerHTML = (DATA.projects || []).map(function (p) {
      return (
        '<article class="exp-card glass tilt" data-tilt="6">' +
          '<div class="exp-head">' +
            '<span class="exp-level exp-level--' + esc(p.level || "university") + '">' +
              esc(levelLabel(p.level)) + "</span>" +
            '<span class="exp-period">' + esc(p.period || "") + "</span>" +
          "</div>" +
          '<h3 class="exp-title">' + esc(t(p.title)) + "</h3>" +
          '<p class="exp-meta">' + esc(t(p.meta)) + "</p>" +
          '<ul class="exp-points">' +
            (p.points || []).map(function (pt) { return "<li>" + esc(t(pt)) + "</li>"; }).join("") +
          "</ul>" +
        "</article>"
      );
    }).join("");
  }
  function levelLabel(level) {
    var map = {
      zh: { national: "国家级", municipal: "省市级", university: "校级" },
      en: { national: "National", municipal: "Municipal", university: "University" },
    };
    return (map[lang] || map.zh)[level || "university"] || "";
  }

  /* 荣誉与奖项：同类聚合分组展示 */
  function renderAwards() {
    var box = $("#awardsList");
    if (!box) return;
    box.innerHTML = (DATA.awardGroups || []).map(function (g) {
      return (
        '<section class="award-group' + (g.wide ? " award-group--wide" : "") + '">' +
          '<h4 class="award-group__title">' + esc(t(g.title)) +
            '<span class="award-group__count">' + (g.items || []).length + "</span>" +
          "</h4>" +
          '<div class="award-group__items">' +
            (g.items || []).map(function (a) {
              return (
                '<div class="award-item tilt" data-tilt="6">' +
                  '<span class="award-year">' + esc(a.year || "") + "</span>" +
                  '<span class="award-text">' + esc(t(a.text)) + "</span>" +
                "</div>"
              );
            }).join("") +
          "</div>" +
        "</section>"
      );
    }).join("");
  }

  /* 作品集 */
  /* 作品集：分区展示 + 扁平化索引（灯箱用） */
  var WORKS_FLAT = [];
  function flattenWorks() {
    WORKS_FLAT = [];
    (DATA.workSections || []).forEach(function (s) {
      (s.items || []).forEach(function (w) { if (w.type !== "app") WORKS_FLAT.push(w); });
    });
    return WORKS_FLAT;
  }

  /* 成果叙事轴：分区 → 章节号（01 品牌形象为 HTML 静态章头；学术根基不放序号） */
  var CHAPTER_META = { product: "2", stickers: "3", ip: "4", certificates: "5", apps: "6" };
  function chapterHeadHTML(no) {
    var dict = I18N[lang] || I18N.zh || {};
    return (
      '<header class="chapter-head" data-chapter="' + no + '">' +
        '<span class="chapter-head__no">0' + no + "</span>" +
        '<div class="chapter-head__meta">' +
          '<span class="chapter-head__tag">' + esc(dict["chapter.c" + no + "tag"] || "") + "</span>" +
          '<h3 class="chapter-head__title">' + esc(dict["chapter.c" + no + "title"] || "") + "</h3>" +
          '<p class="chapter-head__line">' + esc(dict["chapter.c" + no + "line"] || "") + "</p>" +
        "</div>" +
      "</header>"
    );
  }

  function workCardHTML(w, i) {
    var fitClass = w.fit === "contain" ? ' class="work-img--contain"' : "";
    var poster = w.type === "video" && w.poster
      ? '<img src="' + esc(w.poster) + '" alt="' + esc(t(w.title)) + '" loading="lazy" width="1200" height="900">'
      : '<img' + fitClass + ' src="' + esc(w.src) + '" alt="' + esc(t(w.title)) + '" loading="lazy" width="1200" height="900" onerror="this.style.display=\'none\'">';
    var play = w.type === "video"
      ? '<span class="work-play"><span><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M6 4.5v11l9-5.5-9-5.5z"/></svg></span></span>'
      : "";
    var link = w.link || "";
    var dict = I18N[lang] || I18N.zh;
    /* 有原文链接的卡片：整卡可点击打开原文；右上角保留「预览」进灯箱 */
    var preview = link
      ? '<span class="work-preview" data-preview="' + i + '" role="button" tabindex="0" aria-label="' +
        esc(dict["work.preview"] || "预览") + '">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
        "</span>"
      : "";
    var body =
      '<div class="work-thumb' + (w.type === "video" ? " work-thumb--video" : "") + '">' + poster + play + preview + "</div>" +
      '<div class="work-info">' +
        '<h3 class="work-title">' + esc(t(w.title)) +
          (link ? '<svg class="work-ext" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : "") +
        "</h3>" +
        '<div class="work-tags">' +
          (w.tags || []).map(function (tag) { return '<span class="work-tag">' + esc(tag) + "</span>"; }).join("") +
        "</div>" +
      "</div>";
    return link
      ? '<a class="work-card work-card--link tilt" data-tilt="9" href="' + esc(link) + '" target="_blank" rel="noopener noreferrer" data-index="' + i + '">' + body + "</a>"
      : '<figure class="work-card tilt" data-tilt="9" data-index="' + i + '" tabindex="0" role="button" aria-label="' + esc(t(w.title)) + '">' + body + "</figure>";
  }

  /* 小程序卡片：优先使用自定义图标（data 里配 icon 字段），无图时用地球图标占位；整卡可点击跳转外链 */
  function appCardHTML(w) {
    var link = w.link || "";
    var iconInner = w.icon
      ? '<img src="' + esc(w.icon) + '" alt="' + esc(t(w.title)) + '" loading="lazy">'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    var body =
      '<span class="app-card__icon' + (w.icon ? " app-card__icon--img" : "") + '" aria-hidden="true">' + iconInner + "</span>" +
      '<div class="app-card__body">' +
        '<h3 class="app-card__title">' + esc(t(w.title)) +
          '<svg class="work-ext" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</h3>" +
        '<p class="app-card__desc">' + esc(t(w.desc)) + "</p>" +
        '<div class="work-tags">' +
          (w.tags || []).map(function (tag) { return '<span class="work-tag">' + esc(tag) + "</span>"; }).join("") +
        "</div>" +
      "</div>";
    return '<a class="app-card tilt" data-tilt="4" href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">' + body + "</a>";
  }

  function renderWorks() {
    var box = $("#workGrid");
    if (!box) return;
    flattenWorks();
    var open = lang === "en" ? " (" : "（";
    var close = lang === "en" ? ")" : "）";
    box.innerHTML = (DATA.workSections || []).map(function (s) {
      var items = s.items || [];
      var ch = CHAPTER_META[s.id] ? chapterHeadHTML(CHAPTER_META[s.id]) : "";
      var head =
        '<h3 class="work-section__title">' + esc(t(s.title)) +
          '<span class="work-section__count">' + items.length + "</span>" +
        "</h3>";
      /* 纯文字奖项列表：比赛名称（年份）+ 奖项徽章 */
      if (s.type === "list") {
        return (
          '<div class="work-section">' + head +
            '<ul class="award-plain-list">' +
              items.map(function (a) {
                return (
                  '<li class="apl-item">' +
                    '<span class="apl-name">' + esc(t(a.name)) + open + esc(a.year || "") + close + "</span>" +
                    '<span class="apl-prize">' + esc(t(a.prize)) + "</span>" +
                  "</li>"
                );
              }).join("") +
            "</ul>" +
          "</div>"
        );
      }
      /* 表情包卡片墙：无文字说明，点击进灯箱放大 */
      if (s.type === "stickers") {
        return (
          ch +
          '<div class="work-section">' + head +
            '<div class="sticker-grid">' +
              items.map(function (w) {
                return (
                  '<figure class="sticker-card tilt" data-tilt="8" data-index="' + WORKS_FLAT.indexOf(w) +
                    '" tabindex="0" role="button" aria-label="' + esc(t(w.title)) + '">' +
                    '<img src="' + esc(w.src) + '" alt="' + esc(t(w.title)) + '" loading="lazy">' +
                  "</figure>"
                );
              }).join("") +
            "</div>" +
          "</div>"
        );
      }
      /* 小程序：图标卡，整卡点击跳转外链 */
      if (s.type === "apps") {
        return (
          ch +
          '<div class="work-section">' + head +
            '<div class="app-grid">' +
              items.map(function (w) { return appCardHTML(w); }).join("") +
            "</div>" +
          "</div>"
        );
      }
      /* 默认：图文卡片 */
      return (
        ch +
        '<div class="work-section">' + head +
          '<div class="work-grid">' +
            items.map(function (w) { return workCardHTML(w, WORKS_FLAT.indexOf(w)); }).join("") +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  /* 联系方式 */
  function renderContact() {
    var box = $("#contactGrid");
    if (!box) return;
    var icons = {
      mail: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      chat: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 12a8 8 0 0 1-8 8c-1.4 0-2.7-.3-3.9-.9L4 20l1-4.4A8 8 0 1 1 21 12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    };
    var profile = DATA.profile || {};
    var cards = (DATA.contactCards || []).map(function (c) {
      var value = c.value != null ? c.value : t(profile[c.key]);
      if (!value) return "";
      var label = (I18N[lang] || I18N.zh)["contact." + c.key] || c.key;
      var inner =
        '<span class="contact-icon">' + (icons[c.icon] || icons.mail) + "</span>" +
        "<div><div class=\"contact-label\">" + esc(label) + "</div>" +
        '<div class="contact-value">' + esc(value) + "</div></div>";
      return c.href
        ? '<a class="contact-card glass tilt" data-tilt="6" href="' + esc(c.href) + '">' + inner + "</a>"
        : '<div class="contact-card glass tilt" data-tilt="6">' + inner + "</div>";
    });
    /* 社交链接：data.js 里 socials 留空数组时自动不出现 */
    (profile.socials || []).forEach(function (s) {
      if (!s.url) return;
      cards.push(
        '<a class="contact-card glass" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="contact-icon">' + icons.chat + "</span>" +
          "<div><div class=\"contact-label\">" + esc((I18N[lang] || I18N.zh)["contact.social"]) + "</div>" +
          '<div class="contact-value">' + esc(s.label || s.url) + "</div></div>" +
        "</a>"
      );
    });
    box.innerHTML = cards.filter(Boolean).join("");
  }

  /* =========================================================
   * 灯箱（图片 / 视频 + 左右切换 + 键盘）
   * ========================================================= */

  var lightbox = $("#lightbox");
  var lbStage = $("#lightboxStage");
  var lbCaption = $("#lightboxCaption");
  var lbIndex = 0;

  function openLightbox(i) {
    var works = WORKS_FLAT.length ? WORKS_FLAT : flattenWorks();
    if (!lightbox || !works.length) return;
    lbIndex = (i + works.length) % works.length;
    var w = works[lbIndex];

    lbStage.innerHTML = "";
    if (w.type === "video") {
      var v = document.createElement("video");
      v.src = w.src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.style.maxWidth = "100%";
      lbStage.appendChild(v);
    } else {
      var img = document.createElement("img");
      img.src = w.src;
      img.alt = t(w.title);
      lbStage.appendChild(img);
    }
    var dict = I18N[lang] || I18N.zh;
    var counter = (dict["lightbox.counter"] || "")
      .replace("{i}", lbIndex + 1).replace("{n}", works.length);
    lbCaption.innerHTML =
      "<strong>" + esc(t(w.title)) + "</strong>" +
      "<span>" + esc(t(w.desc)) + (counter ? " · " + esc(counter) : "") + "</span>";

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    $("#lightboxClose").focus();
  }
  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lbStage.innerHTML = ""; // 停掉视频
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  /* =========================================================
   * 3D 视觉交互：立体倾斜卡片 + 视差滚动
   * ========================================================= */

  /* 卡片 3D 翻转跟随鼠标 + 镜面高光 */
  function initTilt() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) return; /* 触屏跳过 */
    $all("[data-tilt]").forEach(function (el) {
      var max = parseFloat(el.getAttribute("data-tilt")) || 10;
      var lift = -4;
      el.addEventListener("mouseenter", function () {
        el.style.transition = "transform 0.12s ease-out, box-shadow 0.3s ease";
      });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--gx", ((px + 0.5) * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", ((py + 0.5) * 100).toFixed(1) + "%");
        el.style.transform =
          "perspective(900px) rotateY(" + (px * max).toFixed(2) + "deg)" +
          " rotateX(" + (-py * max).toFixed(2) + "deg)" +
          " translateY(" + lift + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease";
        el.style.transform = "";
      });
    });
  }

  /* 视差滚动：基于「元素中心相对视口中心」的有界偏移制造景深。
   * 修复说明：旧实现 offset = scrollY × 速率 会随滚动无限累积，
   * 导致深处元素（如作品集桉塔塔）被推出原位、压到后续内容之下；
   * 新实现元素只在自己位置附近小幅漂移，离开视口后偏移不再可见。 */
  function initParallax() {
    var els = $all("[data-parallax]");
    if (!els.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* 元素文档位置（沿 offsetParent 链累积，不受 transform 影响） */
    function docTop(el) {
      var top = 0;
      while (el) { top += el.offsetTop; el = el.offsetParent; }
      return top;
    }
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var y = window.scrollY || window.pageYOffset || 0;
      var vc = y + vh / 2; /* 视口中心的世界坐标 */
      els.forEach(function (el) {
        var sp = parseFloat(el.getAttribute("data-parallax")) || 0;
        var c = docTop(el) + el.offsetHeight / 2;
        var rel = c - vc; /* 元素中心相对视口中心（有界） */
        el.style.transform = "translate3d(0, " + (-rel * sp).toFixed(1) + "px, 0)";
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* =========================================================
   * V14 滚动活力系统：入场波浪 / 章节点亮 / 数字计数
   * （均在 renderAll 之后调用，可重复执行、幂等）
   * ========================================================= */

  /* 入场动画：自动为内容列表子项加 reveal，容器内按序 stagger（波浪式浮现） */
  function initReveal() {
    /* 减少动效偏好：交由 CSS 兜底直接显示，不挂观察器 */
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var GROUPS = ".exp-list > *, .paper-list > *, .work-grid > *, .sticker-grid > *, .app-grid > *, " +
                 ".contact-grid > *, .awards > *, .award-plain-list > *, .chapter-head";
    $all(GROUPS).forEach(function (el) { el.classList.add("reveal"); });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("is-in");
        obs.unobserve(el);
        /* 入场完成后清掉 stagger 延迟，避免拖慢后续 hover 过渡 */
        setTimeout(function () { el.style.transitionDelay = ""; }, 1200);
      });
    }, { threshold: 0.1 });
    $all(".reveal").forEach(function (el) {
      var p = el.parentElement;
      if (p) {
        var sibs = Array.prototype.filter.call(p.children, function (c) {
          return c.classList.contains("reveal");
        });
        var idx = sibs.indexOf(el);
        if (idx > 0) el.style.transitionDelay = Math.min(idx * 70, 420) + "ms";
      }
      obs.observe(el);
    });
  }

  /* 成果叙事轴：章节头滚动到达即点亮（累积式，呼应「成果逐步积累」） */
  var activeChapters = {};
  function initChapters() {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var no = en.target.getAttribute("data-chapter");
        if (no) activeChapters[no] = true;
        en.target.classList.add("is-active");
        obs.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    $all(".chapter-head").forEach(function (el) {
      if (el.classList.contains("is-active")) return;
      if (activeChapters[el.getAttribute("data-chapter")]) { el.classList.add("is-active"); return; }
      obs.observe(el);
    });
  }

  /* 首屏浮动卡数字：进入视口后从 0 滚动计数到目标（easeOutCubic） */
  function initCounters() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        obs.unobserve(el);
        var m = (el.textContent || "").match(/^(\d+)(.*)$/);
        if (!m) return;
        var num = parseInt(m[1], 10), suffix = m[2];
        var t0 = performance.now(), dur = 1100;
        (function tick(now) {
          var k = Math.min(1, (now - t0) / dur);
          k = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(num * k) + suffix;
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.5 });
    $all(".float-card strong").forEach(function (el) { obs.observe(el); });
  }

  /* =========================================================
   * 交互绑定
   * ========================================================= */

  function bind() {
    /* 语言切换 */
    $("#langBtn").addEventListener("click", function () {
      lang = lang === "zh" ? "en" : "zh";
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
      renderAll();
    });

    /* 导航滚动背景 + 滚动进度条 + 首屏箭头淡出 */
    var nav = $("#nav");
    var progress = $("#scrollProgress");
    var heroScroll = $(".hero__scroll");
    function onScroll() {
      var y = window.scrollY || window.pageYOffset || 0;
      nav.classList.toggle("is-scrolled", y > 24);
      if (progress) {
        var doc = document.documentElement;
        var max = (doc.scrollHeight || 0) - window.innerHeight;
        if (max > 0) progress.style.transform = "scaleX(" + Math.min(1, y / max).toFixed(4) + ")";
      }
      if (heroScroll) {
        heroScroll.classList.toggle("is-faded", y > window.innerHeight * 0.45);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* 移动端抽屉 */
    var burger = $("#navBurger");
    var drawer = $("#drawer");
    var mask = $("#drawerMask");
    function setDrawer(open) {
      burger.classList.toggle("is-open", open);
      drawer.classList.toggle("is-open", open);
      mask.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
      drawer.setAttribute("aria-hidden", String(!open));
    }
    burger.addEventListener("click", function () {
      setDrawer(!drawer.classList.contains("is-open"));
    });
    mask.addEventListener("click", function () { setDrawer(false); });
    $all(".drawer__link").forEach(function (a) {
      a.addEventListener("click", function () { setDrawer(false); });
    });

    /* 滚动高亮当前区块 */
    var sections = $all("section[id]");
    var links = $all(".nav__link");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });

    /* 入场动画由 initReveal 统一处理（见 V14 滚动活力系统） */

    /* 作品卡 → 灯箱（点击 + 键盘 Enter/Space） */
    var grid = $("#workGrid");
    function isLink(card) { return card && card.classList.contains("work-card--link"); }

    grid.addEventListener("click", function (e) {
      var pv = e.target.closest(".work-preview");
      var card = e.target.closest(".work-card, .sticker-card");
      if (pv) { // 预览按钮 → 灯箱，不触发外链跳转
        e.preventDefault();
        e.stopPropagation();
        openLightbox(Number(pv.getAttribute("data-preview")) || 0);
        return;
      }
      if (card && !isLink(card)) openLightbox(Number(card.getAttribute("data-index")) || 0);
      /* 有原文链接的卡片：不拦截，浏览器直接新标签页打开 */
    });

    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var pv = e.target.closest(".work-preview");
      if (pv) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(Number(pv.getAttribute("data-preview")) || 0);
        return;
      }
      var card = e.target.closest(".work-card, .sticker-card");
      if (card && !isLink(card)) { e.preventDefault(); openLightbox(Number(card.getAttribute("data-index")) || 0); }
    });

    /* 灯箱控制 */
    $("#lightboxClose").addEventListener("click", closeLightbox);
    $("#lightboxPrev").addEventListener("click", function () { openLightbox(lbIndex - 1); });
    $("#lightboxNext").addEventListener("click", function () { openLightbox(lbIndex + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
      if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
    });

    /* 3D：立体倾斜卡片 + 视差滚动 */
    initTilt();
    initParallax();

    /* 卡片呼吸 + 点击选中：仅纯展示类卡片（不拦截文章外链 / 作品灯箱 / 联系跳转） */
    var SELECTABLE_CARD = ".exp-card, .award-item, .apl-item, .skill-card, .mascot-showcase";
    document.addEventListener("click", function (e) {
      var card = e.target.closest(SELECTABLE_CARD);
      if (!card) return;
      /* 命中卡片内的链接 / 按钮时，交给其自身处理 */
      if (e.target.closest("a, button")) return;
      card.classList.toggle("is-selected");
    });
  }

  /* ---------- 总渲染 ---------- */
  function renderAll() {
    renderStatic();
    renderInterests();
    renderStats();
    renderPapers();
    renderTimeline();
    renderSkills();
    renderProjects();
    renderAwards();
    renderWorks();
    renderContact();
    /* V14：渲染后重建入场观察 / 章节轴 / 数字计数（幂等，语言切换安全） */
    initReveal();
    initChapters();
    initCounters();
  }

  renderAll();
  bind();
})();
