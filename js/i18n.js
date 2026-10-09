/* =========================================================
 * i18n.js — 界面文案集中管理（中 / 英）
 * ---------------------------------------------------------
 * 用法：
 *   1. 静态骨架文案 → 在 HTML 元素上加 data-i18n="key"
 *   2. 动态内容（时间线/经历/作品等）→ 由 data.js 提供
 *      zh / en 双字段，main.js 按当前语言取值
 *   3. 新增文案：在 zh 和 en 里加同名 key 即可
 * ========================================================= */

window.I18N = {
  zh: {
    "nav.home": "首页",
    "nav.about": "关于我",
    "nav.experience": "经历",
    "nav.portfolio": "作品集",
    "nav.writings": "文章",
    "nav.contact": "联系",

    "hero.greet": "你好，我是",
    "hero.ctaWork": "看看我的作品",
    "hero.ctaContact": "联系我",
    "hero.scroll": "继续了解",

    "about.title": "关于我",
    "about.sub": "军人、心理学者、创业者——三段经历，一个方向",
    "about.skills": "技能",

    "exp.title": "项目与竞赛经历",
    "exp.sub": "从 0 到 1，一条贯穿始终的主线",
    "exp.awardsTitle": "荣誉与奖项",

    "writing.title": "文章",
    "writing.read": "阅读原文",
    "writing.coverAlt": "文章封面",

    "chapter.rootsTag": "ACADEMIC ROOTS",
    "chapter.rootsTitle": "学术根基",
    "chapter.c1tag": "BRAND IP",
    "chapter.c1title": "品牌形象",
    "chapter.c1line": "把「被接住」的感觉，变成一个看得见、抱得到的形象——桉塔塔。",
    "chapter.c2tag": "PRODUCT",
    "chapter.c2title": "产品与落地",
    "chapter.c2line": "从实验室走进校园与社区：635 名真实用户的使用现场。",
    "chapter.c3tag": "EMOTIONAL REACH",
    "chapter.c3title": "情感触达",
    "chapter.c3line": "表情包让心理科普变轻——每一次转发，都是一次被需要。",
    "chapter.c4tag": "OFFICIAL PROOF",
    "chapter.c4title": "官方认证",
    "chapter.c4line": "专利、软著与商标：这条路上每一步，都被正式记录。",
    "chapter.c5tag": "CERTIFICATES",
    "chapter.c5title": "结业证书",
    "chapter.c5line": "每一项结题，都是一份走完闭环的证明。",
    "chapter.c6tag": "MINI PROGRAMS",
    "chapter.c6title": "小程序",
    "chapter.c6line": "用 AI 与新技术，继续探索人与人的交互。",

    "work.title": "作品集",
    "work.sub": "论文、专利、软著与产品——点击查看详情",
    "work.preview": "预览",

    "contact.title": "联系我",
    "contact.sub": "诚邀研究合作与学术交流，欢迎随时联系探讨",
    "contact.email": "邮箱",
    "contact.wechat": "微信",
    "contact.social": "社交",

    "footer.line": "用科技接住每一份情绪",

    "lightbox.counter": "第 {i} 项，共 {n} 项",
  },

  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.portfolio": "Portfolio",
    "nav.writings": "Writing",
    "nav.contact": "Contact",

    "hero.greet": "Hello, I'm",
    "hero.ctaWork": "View my work",
    "hero.ctaContact": "Get in touch",
    "hero.scroll": "Scroll to explore",

    "about.title": "About Me",
    "about.sub": "Soldier, psychology researcher, founder — three paths, one direction",
    "about.skills": "Skills",

    "exp.title": "Projects & Competitions",
    "exp.sub": "From zero to one, one thread all the way through",
    "exp.awardsTitle": "Honors & Awards",

    "writing.title": "Publications",
    "writing.read": "Read paper",
    "writing.coverAlt": "Paper cover",

    "chapter.rootsTag": "ACADEMIC ROOTS",
    "chapter.rootsTitle": "The Research Foundation",
    "chapter.c1tag": "BRAND IP",
    "chapter.c1title": "The Mascot",
    "chapter.c1line": "Turning \"being held\" into a character you can see and hug — Antata.",
    "chapter.c2tag": "PRODUCT",
    "chapter.c2title": "Product & Implementation",
    "chapter.c2line": "From the lab into schools and communities — 635 real users.",
    "chapter.c3tag": "EMOTIONAL REACH",
    "chapter.c3title": "Emotional Reach",
    "chapter.c3line": "Lightening psychology outreach, one sticker at a time.",
    "chapter.c4tag": "OFFICIAL PROOF",
    "chapter.c4title": "Official Recognition",
    "chapter.c4line": "Patents, copyrights and trademarks — every step on record.",
    "chapter.c5tag": "CERTIFICATES",
    "chapter.c5title": "Completion Certificates",
    "chapter.c5line": "Each completed project is proof of a closed loop.",
    "chapter.c6tag": "MINI PROGRAMS",
    "chapter.c6title": "Mini Programs",
    "chapter.c6line": "Exploring human interaction with AI and new tech.",

    "work.title": "Portfolio",
    "work.sub": "Papers, patents, software copyrights and the product — click for details",
    "work.preview": "Preview",

    "contact.title": "Contact",
    "contact.sub": "Open to research collaboration and professional exchange — feel free to reach out",
    "contact.email": "Email",
    "contact.wechat": "WeChat",
    "contact.social": "Social",

    "footer.line": "Catching every unspoken emotion with technology",

    "lightbox.counter": "Item {i} of {n}",
  }
};
