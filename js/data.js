/* =========================================================
 * data.js — 网站全部内容数据（★ 内容更新接口）
 * ---------------------------------------------------------
 * 想更新网站内容，只需要改这个文件：
 *   - 加一条经历 → 往 projects 数组里加一个对象
 *   - 加一个作品 → 往 works 数组里加一个对象（图片放进
 *     assets/images/portfolio/，文件名用英文小写+连字符）
 *   - 文案支持中英双语：t: { zh: "...", en: "..." }
 *   - 改完保存刷新页面即可生效，无需动其他代码
 * ========================================================= */

window.SITE_DATA = {

  /* ---------- 基本信息 ---------- */
  profile: {
    name:  { zh: "王馨妍", en: "王馨妍" },
    nameEn: "Xinyan Wang",
    tagline: {
      zh: "穿过军装，也深耕心理，想用科技力量，接住每一份没说出口的情绪。",
      en: "From military uniform to psychology labs — I use technology to catch every unspoken emotion."
    },
    /* 第一人称自述（首屏副文案下方，可随意改） */
    intro: {
      zh: "我是一名退役女兵，也是心理学研究者、HUG 项目创始人。19 岁前，我在部队服役；退役后进入西南大学，主修应用心理学，辅修播音主持艺术。长期以来，我聚焦虚拟人际交互与虚拟情感接触方向，研究情绪调节机制，重点关注负面情绪的调节与风险预防。我尝试把心理学理论与VR/AI技术结合，打造有温度的数字产品，并独立开发了「知间」和「一起咔嚓」两款小程序。接下来，我将赴香港科技大学（广州）攻读计算媒体与艺术硕士，继续深耕情感交互领域。",
      en: "I'm a retired woman soldier, a psychology researcher, and the founder of HUG. Before nineteen I served in the military; after leaving the army I entered Southwest University, majoring in Applied Psychology and minoring in Broadcasting & Hosting Arts. Over the years I've focused on virtual interpersonal interaction and virtual affective contact, studying emotion regulation mechanisms with a particular focus on regulation and risk prevention for negative emotions. I combine psychology theory with VR/AI technology to build warm digital products, and I independently developed two mini-programs, 'Zhijian' and 'Yiqikacha'. Next, I'm heading to HKUST (Guangzhou) for a master's in Computational Media and Arts, continuing to deepen my work in affective interaction."
    },
    /* 兴趣 / 个人标签 */
    interests: [
      { zh: "HUG 创始人", en: "HUG Founder" },
      { zh: "退伍军人", en: "Army veteran" },
      { zh: "VR 情绪疗愈", en: "VR well-being" },
      { zh: "群舞编导", en: "Choreography" },
      { zh: "演出策划", en: "Show Producing" },
    ],
    // 头像：已替换为你设计的形象图。想再换：改这一行路径即可
    avatar: "assets/images/avatar-character.jpg",
    email: "792189323@qq.com",
    wechat: "PXSK202405",
    location: { zh: "重庆 · 北碚", en: "Beibei, Chongqing" },
    // 社交链接：填了就会自动显示，留空数组则整块隐藏
    // 例：{ label: "GitHub", url: "https://github.com/你的ID" }
    socials: [],
  },

  /* ---------- 首页数据亮点（3 个浮动卡片） ---------- */
  stats: [
    { num: "4",  label: { zh: "学术论文", en: "Papers" },        note: { zh: "3 篇一作 · 含 SSCI Q1", en: "3 first-author · incl. SSCI Q1" } },
    { num: "20+", label: { zh: "奖项荣誉", en: "Awards" },       note: { zh: "国家级 / 省市级 / 校级", en: "National / municipal / university" } },
    { num: "3",  label: { zh: "知识产权", en: "IP Assets" },     note: { zh: "2 软著 + 1 发明专利", en: "2 copyrights + 1 patent" } },
  ],

  /* ---------- 文章列表（★ 标题与封面卡均可点击 → 新标签页打开原文） ----------
   * link：文章原文地址。可以是本地 PDF（assets/files/xxx.pdf），
   *       也可以换成期刊页面或 DOI，例如 "https://doi.org/10.1111/aphw.70007"
   * cover：封面图（可省略，省略时自动生成蓝紫渐变封面）
   * 更新文章：往数组里加/改对象即可，图片放 assets/images/portfolio/ */
  publications: [
    {
      year: "2016", venue: { zh: "校园心理 14(6): 396-398", en: "Campus Psychology 14(6): 396-398" },
      title: {
        zh: "高中学生考前心理压力影响因素研究",
        en: "Factors Influencing Pre-Exam Stress Among High School Students"
      },
      note: { zh: "一切的开始——早在高中，我就在系统地研究「压力」这件事。", en: "Where it started — I was studying stress systematically back in high school." },
      /* 封面替换方法同上：改 cover 路径即可 */
      cover: "assets/images/portfolio/paper-2016-cover.jpg",
      link: "assets/files/paper-2016-exam-stress.pdf",
    },
    {
      year: "2024", venue: { zh: "心理学进展 14(6): 343-355", en: "Advances in Psychology 14(6): 343-355" },
      title: {
        zh: "虚拟接触对负性情绪的干预效果研究",
        en: "Intervention Effects of Virtual Contact on Negative Emotions"
      },
      note: { zh: "两项被试内实验，考察虚拟拥抱的调节效果与拥抱对象的作用。", en: "Two within-subjects experiments on virtual hugging and the role of the hug partner." },
      cover: "assets/images/portfolio/paper-psy-2024.jpg",
      link: "assets/files/paper-2024-virtual-contact.pdf",
    },
    {
      year: "2025", venue: { zh: "Applied Psychology: Health and Well-Being 17(1)", en: "Applied Psychology: Health and Well-Being 17(1)" },
      title: {
        zh: "Sadness is reduced by virtual hugging（虚拟拥抱可以缓解悲伤）",
        en: "Sadness is reduced by virtual hugging"
      },
      authorship: { zh: "SSCI/SCIE Q1", en: "SSCI/SCIE Q1" },
      note: { zh: "虚拟拥抱的核心实证研究，被 JCR Q1 期刊收录。", en: "The core empirical study of virtual hugging, published in a JCR Q1 journal." },
      cover: "assets/images/portfolio/paper-ssci-q1.jpg",
      link: "assets/files/paper-2025-virtual-hugging.pdf",
      // doi: "https://doi.org/10.1111/aphw.70007"   ← 有 DOI 时填这里，会自动优先使用
    },
    {
      year: "2026", venue: { zh: "心理学进展 16(6)", en: "Advances in Psychology 16(6)" },
      title: {
        zh: "VR 虚拟拥抱干预负性情绪的数字疗愈——基于视知觉色彩与社会存在影响调适效果的实证研究",
        en: "Digital Healing through VR Virtual Hugging — The Impact of Visual Color and Social Presence"
      },
      /* authorship：仅保留 SSCI/SCIE 等收录标识，不再显示第几作者 */
      note: { zh: "考察 VR 场景中的色彩与社会存在如何调适干预效果。", en: "Examines how visual color and social presence tune intervention effects in VR." },
      /* 封面替换方法：把新图片放进 assets/images/portfolio/（英文小写命名），
         然后把下面 cover 的路径改成新文件即可；留空 "" 则自动生成蓝紫渐变封面 */
      cover: "assets/images/portfolio/paper-2026-cover.jpg",
      link: "assets/files/paper-2026-digital-healing.pdf",
    },
  ],

  /* ---------- 关于我 · 时间线 ---------- */
  timeline: [
    {
      time: "2018.09 – 2020.09", tag: { zh: "服役", en: "Service" },
      title: { zh: "中国人民解放军 · 义务兵", en: "PLA · Conscript" },
      desc: { zh: "服役于辽宁大连，文艺轻骑兵成员；参与集团军文艺晚会 4 场、基层慰问演出 30 余场。", en: "Stationed in Dalian, Liaoning; member of the art troupe — 4 army galas and 30+ grassroots performances." },
    },
    {
      time: "2020.09 – 2024.07", tag: { zh: "本科", en: "B.A." },
      title: { zh: "西南大学 · 应用心理学", en: "Southwest University · Applied Psychology" },
      desc: { zh: "辅修播音与主持艺术双学位（排名 2/51）；毕业即带着国家级大创成果走向创业。", en: "Second degree in Broadcasting & Hosting (ranked 2/51); graduated straight into entrepreneurship with a national-level project." },
    },
    {
      time: "2023.12 – 2024.03", tag: { zh: "实习", en: "Internship" },
      title: { zh: "搜狐畅游 · 用户研究实习生", en: "Sohu Changyou · User Research Intern" },
      desc: { zh: "主导《天龙八部：荣耀》留存与流失研究：编码 165 份深访、构建用户分层模型、产出 300+ 买量素材方向。", en: "Led retention/churn research for a flagship game: coded 165 in-depth interviews, built a user segmentation model, informed 300+ ad creatives." },
    },
    {
      time: "2024.05 – 至今", tag: { zh: "创业", en: "Founder" },
      title: { zh: "平行时空软件科技（重庆）有限公司 · 创始人兼 CEO", en: "Parallels Software Technology (Chongqing) · Founder & CEO" },
      desc: { zh: "将经 EEG/HRV 验证的科研成果产品化为 HUG，团队 24 人；MVP 7 个月上线，落地 3 个校区、1 个村社，服务 635 名用户。", en: "Turning EEG/HRV-validated research into the HUG product with a 24-person team; MVP launched in 7 months, serving 635 users across 3 campuses and 1 village community." },
    },
    {
      time: "2027.09", tag: { zh: "未来规划", en: "Next" },
      title: { zh: "香港科技大学（广州）", en: "HKUST (Guangzhou)" },
      desc: { zh: "拟攻读计算媒体与艺术（CMA）硕士，把 VR 情绪疗愈研究带向更大的舞台。", en: "Incoming master's in Computational Media and Arts (CMA), taking VR emotion research further." },
    },
  ],

  /* ---------- 技能（名称 + 一句话真实描述，不做等级评分） ---------- */
  skills: [
    { name: "VR 开发", en: "VR Dev", note: "用 Unity / Vizard 主导 HUG 的场景与交互实现" },
    { name: "实验设计", en: "Experiment Design", note: "独立完成从立项、设计到数据采集的完整流程" },
    { name: "生理信号", en: "Physiological Signals", note: "采集与分析 EEG / HRV / EDA 多模态数据" },
    { name: "数据分析", en: "Data Analysis", note: "用 SPSS、M-plus、EEGLAB 处理行为与脑电数据" },
    { name: "用户研究", en: "User Research", note: "深访编码与用户分层，完成 165 份深访分析" },
    { name: "AI 应用实践", en: "AI in Practice", note: "用 WorkBuddy、Cloud Code 独立开发小程序（知间、一起咔嚓），持续探索中" },
    { name: "主持表达", en: "Hosting & Expression", note: "播音主持双学位，多次舞台与现场主持经验" },
  ],

  /* ---------- 项目经历 ---------- */
  projects: [
    {
      period: "2021.12 – 2025.06", level: "national",
      title: { zh: "全国教育科学规划国家青年课题", en: "National Youth Program of Educational Science Planning" },
      meta: { zh: "全国教育科学规划课题 · 编号 CBA210236", en: "National Educational Science Planning Program · No. CBA210236" },
      points: [
        { zh: "承担课题的行为实验实施与数据采集分析，支持课题按期高质量结项。", en: "Conducted behavioral experiments, data collection and analysis through completion." },
        { zh: "结项鉴定等级：良好。", en: "Final review rated Good." },
      ],
    },
    {
      period: "2022.03 – 2022.12", level: "university",
      title: { zh: "虚拟人际交互对负性情绪调节的作用", en: "Virtual Interpersonal Interaction in Regulating Negative Emotions" },
      meta: { zh: "校级大学生创新训练项目 · 编号 X202210635039", en: "University Innovation Training Program · No. X202210635039" },
      points: [
        { zh: "独立完成立项、实验设计、VR 程序开发与数据采集全链路，提前 3 个月结项，完成概念验证。", en: "Single-handedly completed the full pipeline — proposal, design, VR development, data collection — 3 months ahead of schedule." },
        { zh: "研究成果获第八届「含弘杯」学生课外学术科技作品竞赛一等奖。", en: "Won First Prize at the 8th \u201CHonghong Cup\u201D Academic Science & Technology Competition." },
        { zh: "结项评级：合格。", en: "Rated Pass on completion." },
      ],
    },
    {
      period: "2023.03 – 2024.05", level: "national",
      title: { zh: "来自 VR 世界的抱抱——虚拟情感接触调节负性情绪的效果及认知神经机制研究", en: "A Hug from the VR World — Effects and Cognitive Mechanisms of Virtual Affective Contact" },
      meta: { zh: "国家级大学生创新训练项目 · 编号 202310635010", en: "National Innovation Training Program · No. 202310635010" },
      points: [
        { zh: "组建覆盖 7 个学院的 13 人团队、划分 4 个部门，带领完成 3 个维度共 4 项行为实验。", en: "Built a 13-member team across 7 colleges in 4 departments; led 4 behavioral experiments in 3 dimensions." },
        { zh: "产出第一作者论文 2 篇（含 SSCI/SCIE Q1 期刊 APHWB）、发明专利 1 项、软件著作权 1 项。", en: "Produced 2 first-author papers (incl. SSCI Q1 journal APHWB), 1 invention patent, 1 software copyright." },
        { zh: "结项评级：优秀。", en: "Rated Excellent on completion." },
      ],
    },
    {
      period: "2024.05 – 2025.06", level: "municipal",
      title: { zh: "HUG——基于 VR 的负性情绪调节平台", en: "HUG — A VR-Based Negative-Emotion Regulation Platform" },
      meta: { zh: "省市级大学生创业训练项目 · 编号 S202410635119X", en: "Municipal Entrepreneurship Training Program · No. S202410635119X" },
      points: [
        { zh: "带领团队完成立项、推进与结项验收全流程，统筹 VR 情绪调节产品的功能迭代与落地验证。", en: "Led the team through proposal, execution and completion, steering product iteration and field validation." },
        { zh: "推动产品在广东省信宜中学、西南大学落地 2 处应用试点，产出软件著作权 2 项。", en: "Deployed 2 pilots (Xinyi Middle School, Guangdong & SWU) and delivered 2 software copyrights." },
        { zh: "结项评级：合格。", en: "Rated Pass on completion." },
      ],
    },
    {
      period: "2025.03 – 2026.05", level: "national",
      title: { zh: "\u201CHUG\u201D——一款基于 VR 的负性情绪调适软件", en: "\u201CHUG\u201D — A VR-based Negative-Emotion Regulation Software" },
      meta: { zh: "国家级大学生创业训练项目 · 编号 202510635008X", en: "National Entrepreneurship Training Program · No. 202510635008X" },
      points: [
        { zh: "带领 7 人团队推进 HUG 产品迭代与落地：将心理学实验结论转化为产品需求与验证方案，完善情绪调适核心功能。", en: "Led a 7-member team iterating the HUG product: translating experimental findings into product requirements and validation plans." },
        { zh: "结项评级：优秀。", en: "Rated Excellent on completion." },
      ],
    },
    {
      period: "2025.03 – 2026.06", level: "national",
      title: { zh: "VR 虚拟拥抱干预负性情绪的多感官环境优化——基于 EEG 的负性情绪干预效果研究", en: "Multi-Sensory Optimization of VR Hugging for Negative Emotions — An EEG Study" },
      meta: { zh: "国家级大学生创新训练项目 · 编号 202510635042", en: "National Innovation Training Program · No. 202510635042" },
      points: [
        { zh: "带领 4 人团队围绕视觉、听觉等感官通道设计系列实验，同步采集 EEG/HRV/EDA 多模态数据。", en: "Led a 4-member team designing multi-sensory experiments with concurrent EEG/HRV/EDA data collection." },
        { zh: "相关论文发表于《心理学进展》（2026）。", en: "A resulting paper was published in Advances in Psychology (2026)." },
        { zh: "结项评级：合格。", en: "Rated Pass on completion." },
      ],
    },
  ],

  /* ---------- 桉塔塔（HUG IP 形象）· 展示于「产品与落地」分区 ---------- */
  mascot: {
    bubble: {
      zh: "嗨，我是桉塔塔——HUG 的 IP 形象，线上陪我聊天，线下找我拥抱！",
      en: "Hi, I'm Antata, HUG's mascot — chat with me online, hug me offline!",
    },
  },

  /* ---------- 荣誉与奖项（同类聚合分组） ----------
   * awardGroups：每组一个 { id, title, items, wide } 对象；
   * wide: true = 该组独占一整行（条目多时用）。追加条目直接往 items 里加。 */
  awardGroups: [
    {
      id: "competition", wide: true,
      title: { zh: "竞赛获奖", en: "Competitions" },
      items: [
        { year: "2022", text: { zh: "第八届「含弘杯」学生课外学术科技作品竞赛一等奖", en: "First Prize, 8th \u201CHonghong Cup\u201D Academic S&T Competition" } },
        { year: "2023", text: { zh: "中国国际「互联网+」大学生创新创业大赛 · 校内选拔赛优秀奖", en: "Merit Award, \u201CInternet+\u201D Innovation Competition campus round" } },
        { year: "2024", text: { zh: "中国国际大学生创新大赛 · 重庆赛区金奖", en: "Gold Award, China International Innovation Competition (Chongqing)" } },
        { year: "2025", text: { zh: "长三角 G60 科创走廊暨「海聚英才」重庆分赛区优胜奖", en: "Merit Award, G60 Innovation Corridor / Haiju Talent Chongqing" } },
        { year: "2025", text: { zh: "重庆高校智能机器人创意大赛 · 重庆赛区三等奖", en: "Third Prize, Chongqing Robot Creativity Contest" } },
        { year: "2025", text: { zh: "中国国际大学生创新大赛 · 校内选拔赛铜奖", en: "Bronze, China International Innovation Competition campus round" } },
        { year: "2025", text: { zh: "全国高校心理学专业本科生创新创业论坛 · 心理学产品设计分论坛一等奖", en: "First Prize, Psychology Product Design Forum" } },
        { year: "2025", text: { zh: "青少年创业创新项目投融资系列活动（第 2 期）第一名 · 重庆市青年创新创业促进会", en: "1st Place, Youth Innovation & Entrepreneurship Investment Series · Chongqing" } },
        { year: "2026", text: { zh: "第六届「含弘杯」大学生创业计划竞赛银奖", en: "Silver, 6th \u201CHonghong Cup\u201D Business Plan Competition" } },
      ],
    },
    {
      id: "sports",
      title: { zh: "体育获奖", en: "Sports" },
      items: [
        { year: "2023", text: { zh: "西南大学「太阳杯」排球联赛 · 女子组第二名", en: "2nd Place, SWU \u201CSun Cup\u201D Volleyball League (Women)" } },
        { year: "2024", text: { zh: "西南大学「太阳杯」排球联赛 · 女子组第一名", en: "1st Place, SWU \u201CSun Cup\u201D Volleyball League (Women)" } },
      ],
    },
    {
      id: "scholarship",
      title: { zh: "奖学金", en: "Scholarships" },
      items: [
        { year: "2021", text: { zh: "国家励志奖学金", en: "National Encouragement Scholarship" } },
        { year: "2023", text: { zh: "一等奖学金", en: "First-Class Scholarship" } },
      ],
    },
    {
      id: "honors",
      title: { zh: "荣誉称号", en: "Honorary Titles" },
      items: [
        { year: "2020", text: { zh: "「挺进模范」复转老兵 · 「金牌点评员」（服役期间）", en: "Model Veteran & Gold Commentator honors (military service)" } },
        { year: "2021", text: { zh: "院级优秀共青团员", en: "Outstanding League Member (college level)" } },
        { year: "2022", text: { zh: "校级优秀共青团员", en: "Outstanding League Member (university level)" } },
        { year: "2024", text: { zh: "研修班「优秀学员」暨结业", en: "Outstanding Trainee & graduation, advanced seminar" } },
        { year: "2024", text: { zh: "众创空间孵化项目评级「优秀」", en: "Incubation project rated Excellent by university makerspace" } },
        { year: "2024", text: { zh: "「优创之星」· 国家级大创项目线上评选", en: "Star of Innovation, national innovation program online selection" } },
      ],
    },
    {
      id: "honorAward",
      title: { zh: "荣誉奖", en: "Honor Awards" },
      items: [
        { year: "2021", text: { zh: "砥砺奋斗奖", en: "Perseverance Award" } },
        { year: "2023", text: { zh: "创新创业奖", en: "Innovation & Entrepreneurship Award" } },
        { year: "2023", text: { zh: "学术科技奖", en: "Academic Science & Technology Award" } },
      ],
    },
  ],

  /* ---------- 作品集（分类分区展示 · 只放真实材料） ----------
   * workSections：每个分区一个对象 { id, title, items }。
   * ★ 追加新内容：往对应分区的 items 里加一个对象即可——
   *   type: "image" / "video"；图片放 assets/images/portfolio/（英文小写+连字符命名）
   *   有 link 字段 → 整卡可点击跳转原文；无 link → 点击进灯箱放大预览
   * 论文不在此处重复展示，统一放在「文章」区块（publications 数组）。 */
  workSections: [
    {
      id: "product",
      title: { zh: "产品与落地", en: "Product & Implementation" },
      items: [
        {
          type: "video", src: "assets/media/hug-demo.mp4", poster: "assets/images/video-cover.jpg",
          title: { zh: "HUG 产品演示视频", en: "HUG Product Demo" },
          desc: { zh: "从科研走向产品：HUG——基于 VR 的负性情绪调节平台，全国首创 VR 情感触摸。", en: "From research to product: HUG, a VR-based emotion regulation platform and China's first VR affective touch experience." },
          tags: ["HUG", "Product", "VR"],
        },
        {
          type: "image", src: "assets/images/portfolio/hug-logo.png", fit: "contain",
          title: { zh: "HUG logo 展示", en: "HUG Logo Showcase" },
          desc: { zh: "HUG 品牌 logo（透明底原版）。", en: "HUG brand logo (original transparent PNG)." },
          tags: ["HUG", "品牌"],
        },
        /* ---- 实验研究现场（2022，虚拟人际交互研究起步期） ---- */
        {
          type: "image", src: "assets/images/portfolio/lab-session.jpg",
          title: { zh: "实验现场 · 虚拟接触行为实验", en: "Lab Session · Virtual Contact Experiment" },
          desc: { zh: "2022 年于西南大学：被试佩戴头显完成虚拟接触行为实验，同步采集情绪调节的行为数据。", en: "At SWU, 2022 — a participant completing the virtual contact experiment while behavioral data is collected." },
          tags: ["行为实验", "VR", "数据采集"],
        },
        {
          type: "image", src: "assets/images/portfolio/lab-room.jpg",
          title: { zh: "实验场所 · VR 行为实验室", en: "Lab Site · VR Behavioral Lab" },
          desc: { zh: "标准化实验环境：头显、生理记录设备与实验程序部署就绪，静候被试到来。", en: "A standardized lab setup — headsets, recording devices and the experiment program, ready for participants." },
          tags: ["实验室", "实验环境"],
        },
        {
          type: "image", src: "assets/images/portfolio/exp-bystander.png",
          title: { zh: "实验程序 · 旁观者变量", en: "Experiment · Bystander Variable" },
          desc: { zh: "VR 虚拟场景中的旁观者数量操纵（1–4 人）：考察旁观者在场对虚拟互动干预效果的影响。", en: "Manipulating bystander count (1–4) in the VR scene: how the presence of onlookers shapes intervention effects." },
          tags: ["实验程序", "旁观者变量", "虚拟场景"],
        },
        /* ---- 试点与落地现场（追加照片：放图片到 assets/images/portfolio/ 后照抄一条即可） ---- */
        {
          type: "image", src: "assets/images/portfolio/pilot-01.jpg",
          title: { zh: "校园开放日 · 桉塔塔见面会", en: "Campus Open Day · Meet Antata" },
          desc: { zh: "IP 形象「桉塔塔」走进校园开放日，把心理科普变成可以合影、可以触摸的体验。", en: "Our mascot Antata at the campus open day, turning psychology outreach into something you can touch and photograph." },
          tags: ["桉塔塔", "IP", "校园活动"],
        },
        {
          type: "image", src: "assets/images/portfolio/pilot-02.jpg",
          title: { zh: "西南大学心理健康节 · VR 情绪调节体验", en: "SWU Mental Health Festival · VR Session" },
          desc: { zh: "西南大学心理健康节现场，同学佩戴 VR 设备体验 HUG 情绪调节场景。", en: "At the SWU Mental Health Festival — a student trying HUG's emotion regulation scenes in VR." },
          tags: ["西南大学", "心理健康节", "VR 体验"],
        },
        {
          type: "image", src: "assets/images/portfolio/pilot-xinyi.jpg",
          title: { zh: "信宜中学试点 · 志愿服务现场", en: "Xinyi Middle School Pilot · Volunteer Session" },
          desc: { zh: "广东省信宜中学落地试点：志愿者协助学生戴上 VR 设备，完成虚拟拥抱干预体验。", en: "Pilot at Xinyi Middle School, Guangdong — volunteers helping students try the VR hug intervention." },
          tags: ["信宜中学", "试点", "志愿服务"],
        },
        {
          type: "image", src: "assets/images/portfolio/pilot-03.jpg",
          title: { zh: "西昌民族幼儿师范高等专科学校 · 试点体验", en: "Xichang Normal College for Ethnic Preschool Education · Pilot Session" },
          desc: { zh: "走进西昌民族幼儿师范高等专科学校开展试点，同学们轮流体验 VR 情绪调节场景。", en: "Pilot session at Xichang Normal College for Ethnic Preschool Education — students taking turns in VR emotion regulation scenes." },
          tags: ["西昌", "试点", "VR 体验"],
        },
        {
          type: "image", src: "assets/images/portfolio/pilot-04.jpg",
          title: { zh: "试点现场 · 配套活动展示", en: "Pilot Site · Supporting Activities" },
          desc: { zh: "数字人同步演示，围观同学第一次直观看见「虚拟拥抱」的样子。", en: "The digital human demo on screen — students watching what a virtual hug looks like for the first time." },
          tags: ["数字人", "演示", "试点"],
        },
        {
          type: "image", src: "assets/images/portfolio/pilot-05.jpg",
          title: { zh: "试点现场 · 沉浸式 VR 拥抱", en: "Pilot Site · Immersive VR Hug" },
          desc: { zh: "体验者戴上头显进入虚拟拥抱场景，屏幕同步呈现第一人称视角。", en: "A participant entering the virtual hug scene, mirrored in first person on screen." },
          tags: ["VR 拥抱", "试点"],
        },
        {
          type: "image", src: "assets/images/portfolio/pilot-06.jpg",
          title: { zh: "北碚区屋基村 · 试点体验", en: "Wuji Village, Beibei · Pilot Session" },
          desc: { zh: "地点：重庆市北碚区屋基村。走进社区开展规范化 VR 干预实验，为效果研究采集一手数据。", en: "Location: Wuji Village, Beibei, Chongqing. Standardized VR intervention sessions in the community, collecting first-hand data for effect studies." },
          tags: ["干预实验", "北碚屋基村", "科研"],
        },
      ],
    },
    /* ---- IP 形象表情包（type:"stickers" = 无文字说明的简洁卡片墙，点击放大） ---- */
    {
      id: "stickers",
      type: "stickers",
      title: { zh: "IP 形象表情包", en: "Antata Sticker Pack" },
      items: [
        {
          type: "image", src: "assets/images/portfolio/sticker-angry.png",
          title: { zh: "桉塔塔表情包 · 生气", en: "Antata Sticker · Angry" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
        {
          type: "image", src: "assets/images/portfolio/sticker-shock.png",
          title: { zh: "桉塔塔表情包 · 惊讶", en: "Antata Sticker · Surprised" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
        {
          type: "image", src: "assets/images/portfolio/sticker-laugh.png",
          title: { zh: "桉塔塔表情包 · 大笑", en: "Antata Sticker · Laughing" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
        {
          type: "image", src: "assets/images/portfolio/sticker-nice.png",
          title: { zh: "桉塔塔表情包 · NICE！", en: "Antata Sticker · NICE!" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
        {
          type: "image", src: "assets/images/portfolio/sticker-smug.png",
          title: { zh: "桉塔塔表情包 · 偷笑", en: "Antata Sticker · Giggling" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
        /* ---- 新增表情包（暂按画面表情命名，待补充正式名称后替换 title 即可） ---- */
        {
          type: "image", src: "assets/images/portfolio/sticker-cry.png",
          title: { zh: "桉塔塔表情包 · 委屈大哭", en: "Antata Sticker · Crying" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
        {
          type: "image", src: "assets/images/portfolio/sticker-worried.png",
          title: { zh: "桉塔塔表情包 · 担忧不安", en: "Antata Sticker · Worried" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
        {
          type: "image", src: "assets/images/portfolio/sticker-sulky.png",
          title: { zh: "桉塔塔表情包 · 生闷气", en: "Antata Sticker · Sulking" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
        {
          type: "image", src: "assets/images/portfolio/sticker-joyful.png",
          title: { zh: "桉塔塔表情包 · 开心", en: "Antata Sticker · Joyful" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
        {
          type: "image", src: "assets/images/portfolio/sticker-content.png",
          title: { zh: "桉塔塔表情包 · 满足", en: "Antata Sticker · Content" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
        {
          type: "image", src: "assets/images/portfolio/sticker-starstruck.png",
          title: { zh: "桉塔塔表情包 · 星星眼", en: "Antata Sticker · Starstruck" },
          desc: { zh: "HUG IP 形象「桉塔塔」表情包。", en: "Sticker of Antata, HUG's mascot." },
        },
      ],
    },
    {
      id: "ip",
      title: { zh: "知识产权", en: "Intellectual Property" },
      items: [
        {
          type: "image", src: "assets/images/portfolio/patent-cn117198538a.jpg",
          title: { zh: "发明专利：虚拟情感触摸调节负性情绪的系统与方法", en: "Invention Patent: System for Regulating Negative Emotions via Virtual Affective Touch" },
          desc: { zh: "专利号 CN117198538A（2023），已公开并进入实质审查阶段。", en: "CN117198538A (2023), published and under substantive examination." },
          tags: ["发明专利", "CN117198538A"],
        },
        {
          type: "image", src: "assets/images/portfolio/software-copyright-1.jpg",
          title: { zh: "软件著作权：基于 VR 设备的心理学虚拟拥抱实验开发软件", en: "Software Copyright: VR Virtual Hugging Experiment Platform" },
          desc: { zh: "登记号 2024SR13774933。", en: "Reg. No. 2024SR13774933." },
          tags: ["软著", "2024"],
        },
        {
          type: "image", src: "assets/images/portfolio/software-copyright-2.jpg",
          title: { zh: "软件著作权：基于单目摄像头的图像分割系统", en: "Software Copyright: Monocular Image Segmentation System" },
          desc: { zh: "登记号 2024SR14008611。", en: "Reg. No. 2024SR14008611." },
          tags: ["软著", "2024"],
        },
        {
          type: "image", src: "assets/images/portfolio/trademark-hug.png",
          title: { zh: "注册商标：HUG", en: "Registered Trademark: HUG" },
          desc: { zh: "平行时空软件科技（重庆）有限公司注册商标，申请号 82624845。点击查看证书大图。", en: "Registered trademark of Parallels Software Technology (Chongqing). Click to view the certificate." },
          tags: ["商标", "HUG"],
        },
      ],
    },
    {
      id: "certificates",
      title: { zh: "项目结题证书", en: "Project Completion Certificates" },
      items: [
        {
          type: "image", src: "assets/images/portfolio/cert-university-x2022.jpg",
          title: { zh: "校级创新训练项目结题证书", en: "University Innovation Program Completion Certificate" },
          desc: { zh: "《虚拟人际交互对负性情绪调节的作用》（X202210635039），独立完成，2023.07 结题，评定合格。", en: "Virtual interpersonal interaction in regulating negative emotions (X202210635039), completed solo, 2023.07." },
          tags: ["校级", "独立完成"],
        },
        {
          type: "image", src: "assets/images/portfolio/cert-national-project-excellent.jpg",
          title: { zh: "国家级大创优秀结项证书", en: "National Project — Excellent Completion Certificate" },
          desc: { zh: "《来自 VR 世界的抱抱》以「优秀项目」批准结项（2024.08），并获评「优创之星」。", en: "\u201CA Hug from the VR World\u201D rated Excellent on completion (2024.08), plus the \u201CStar of Innovation\u201D award." },
          tags: ["国家级", "优秀结项"],
        },
        {
          type: "image", src: "assets/images/portfolio/cert-national-youth-cba.jpg",
          title: { zh: "全国教育科学规划国家青年课题结项证书", en: "National Youth Program of Educational Science Planning — Completion Certificate" },
          desc: { zh: "《基于虚拟现实技术和具身认知理论的心理健康教育创新研究》（CBA210236），2025.05 结项，鉴定等级「良好」，担任主要参加人。", en: "VR & embodied-cognition based mental health education research (CBA210236), completed 2025.05, rated Good; key participant." },
          tags: ["国家级课题", "良好"],
        },
        {
          type: "image", src: "assets/images/portfolio/cert-municipal-hug.jpg",
          title: { zh: "市级创业训练项目结题证书（HUG）", en: "Municipal Entrepreneurship Program Completion Certificate (HUG)" },
          desc: { zh: "《HUG——基于 VR 的负性情绪调节平台》（S202410635119X），2025.06 结题，评定合格。", en: "HUG — a VR-based emotion regulation platform (S202410635119X), completed 2025.06." },
          tags: ["市级", "HUG"],
        },
        {
          type: "image", src: "assets/images/portfolio/cert-eeg-national.jpg",
          title: { zh: "国家级创新训练项目结题证书（EEG 研究）", en: "National Innovation Program Completion Certificate (EEG Study)" },
          desc: { zh: "《VR 虚拟拥抱干预负性情绪的多感官环境优化——基于 EEG 的负性情绪干预效果研究》，2026.06 结题，评定合格。", en: "Multi-sensory optimization of VR hugging with EEG, completed 2026.06." },
          tags: ["国家级", "EEG"],
        },
      ],
    },
    {
      id: "apps",
      type: "apps",
      title: { zh: "小程序", en: "Mini Programs" },
      items: [
        {
          type: "app",
          title: { zh: "一起咔嚓", en: "Yiqikacha" },
          icon: "assets/images/portfolio/app-kacha.jpg",
          desc: { zh: "旅行拍照互传小程序——照片自动上传云端、朋友间一键互传，拿不准姿势时还能提示你怎么摆。", en: "A travel photo-sharing mini-program — photos auto-upload to the cloud for easy sharing, with pose suggestions." },
          link: "https://kacha-travel-album.app.workbuddy.host/",
          tags: ["小程序", "拍照互传", "AI"],
        },
        {
          type: "app",
          title: { zh: "知间", en: "Zhijian" },
          icon: "assets/images/portfolio/app-zhijian.jpg",
          desc: { zh: "关于关系与相处的小程序——通过对话，理解人与人沟通背后的含义，改善关系。", en: "A mini-program about relationships — understanding what lies behind our conversations and improving how we connect." },
          link: "https://zhijian.love",
          tags: ["小程序", "人际关系", "AI"],
        },
      ],
    },
  ],

  /* ---------- 联系方式卡片 ---------- */
  contactCards: [
    { icon: "mail", key: "email", value: "792189323@qq.com", href: "mailto:792189323@qq.com" },
    { icon: "chat", key: "wechat", value: "PXSK202405", href: "" },
  ],
};
