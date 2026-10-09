# 王馨妍个人网站（my-portfolio）

单页式个人网站：浅蓝紫毛玻璃风格、锚点导航、响应式（桌面 / 平板 / 手机）、中英双语一键切换、作品图片懒加载与灯箱预览。**纯 HTML + CSS + 原生 JavaScript，零依赖、零构建。**

## 目录结构

```
my-portfolio/
├── index.html              # 页面结构（首页 / 关于 / 经历 / 作品 / 联系）
├── css/style.css           # 全站样式（设计令牌在 :root）
├── js/
│   ├── i18n.js             # ★ 界面文案字典（中 / 英）
│   ├── data.js             # ★ 全部内容数据（改这里就能更新网站）
│   ├── main.js             # 交互逻辑（导航 / 灯箱 / 懒加载 / 语言切换 / 3D 倾斜卡片 / 视差）
│   ├── hero3d.js           # 全站 3D 叙事层（首屏情绪光点+呼吸光环；滚动换幕：正念曼陀罗→EEG→星宿→颂钵→水瓶座星流，零依赖）。主题系统：每主题一套完整配色（主/深/浅/背景/雾色）写入 CSS 变量驱动全站换色，粒子色板逐帧 lerp 平滑过渡
│   ├── cursor.js           # 顶层光标特效层（z-index 最高；拖拽=仙气星尘，静止=呼吸涟漪+果冻光点，activity 交叉淡化平滑过渡）
│   ├── ambient.js          # 氛围音效（Web Audio 合成大自然声：樱粉溪流/暖金鸟鸣/青蓝海浪/霓虹紫夜虫/薄荷绿林风，默认关闭、需要时显现，随主题联动）
│   └── controls.js         # 氛围控制（音乐开关，默认关闭；主题色切换已移至顶部导航栏，localStorage 记忆）
├── assets/
│   ├── images/
│   │   ├── avatar.jpg      # 头像（800×800）
│   │   ├── video-cover.jpg # 视频封面
│   │   └── portfolio/      # 作品图片（1200px 宽，JPG）
│   └── media/hug-demo.mp4  # 产品演示视频
├── favicon.svg
└── README.md
```

## 本地运行

方式一（最简单）：**双击 `index.html`** 即可在浏览器打开。

方式二（推荐，地址栏更干净）：

```bash
cd my-portfolio
python -m http.server 8000
# 打开 http://localhost:8000
```

## 如何更新内容（内容更新接口）

**99% 的更新只需改 `js/data.js`：**

| 想做什么 | 改哪里 |
|---------|--------|
| 新增/修改项目经历 | `projects` 数组加/改对象（含 `period`、`role`、`title`、`points`） |
| 新增文章 | `publications` 数组加对象；PDF 放 `assets/files/`，命名用英文小写+连字符 |
| 新增作品 | `workSections` 里找到对应分区（产品与落地 / IP 形象表情包 / 知识产权 / 项目结题证书 / 竞赛获奖），往其 `items` 数组加对象；图片放 `assets/images/portfolio/`，命名用英文小写+连字符。要新开一个分区，就加一个 `{ id, title, items }` 对象 |
| 加一张表情包 | `workSections` 中 `id: "stickers"` 分区的 `items` 加 `{ type: "image", src, title, desc }`（建议白底原图，程序会以卡片墙展示） |
| 加一条竞赛奖项（文字列表） | `workSections` 中 `id: "competition"`（`type: "list"`）分区的 `items` 加 `{ year, name: {zh,en}, prize: {zh,en} }` |
| 改一句话简介 | `profile.tagline`（中英各一条） |
| 改第一人称自述 | `profile.intro`（中英各一条） |
| 改兴趣标签 | `profile.interests` 数组 |
| 加社交链接 | `profile.socials` 数组加 `{ label, url }`，卡片自动出现 |
| 改奖项 | `awardGroups` 数组（奖学金 / 荣誉称号 / 荣誉奖 / 竞赛获奖 / 体育获奖） |
| 改界面文字（按钮、标题等） | `js/i18n.js` 中英字典 |

要点：

- 文案字段统一 `{ zh: "中文", en: "English" }` 双语格式；切换语言立即生效，选择存入 `localStorage`。
- 图片只支持 JPG / PNG / WebP / SVG；建议作品图宽度 ≤1200px、单张 <300KB。
- 文件名**只用英文小写 + 连字符**，禁止中文和空格（避免部署到 Linux 服务器路径失效）。

## 更换头像

当前头像是占位用的抽象小人 SVG（`assets/images/avatar.svg`，与蓝紫主题同色系）。
换成自己的素材只需两步：

1. 把你的图片放进 `assets/images/`（推荐 800×800 正方形、<200KB，如 `avatar.png`）
2. 打开 `js/data.js`，把 `profile.avatar` 的值改成 `"assets/images/avatar.png"` 即可，首屏会自动更新

## 文章链接说明

「文章」区块的每张卡片（封面 + 标题）都可点击，**新标签页打开原文**：

- 当前 4 篇论文的 PDF 已内置在 `assets/files/`，访客可直接在线阅读 / 下载
- 若某篇有期刊官方页面或 DOI，建议改用外链（对 SEO 与引用更友好）：
  打开 `js/data.js` → `publications` → 对应条目，把 `link` 改成网址，
  或取消 `doi` 字段的注释（如 `doi: "https://doi.org/10.1111/aphw.70007"`），有 `doi` 时会优先使用
- 作品集里带 `link` 字段的卡片同样整卡可点；卡片右上角的放大镜按钮可就地预览大图（灯箱）

## 部署上线

### 方案 A：Vercel（推荐，最省事）

1. 打开 [vercel.com](https://vercel.com) → 用 GitHub / 邮箱注册登录
2. 「Add New… → Project」，若没有代码仓库，选 Deploy Without Git 也行；推荐先推到 GitHub（见方案 B 第 1 步）
3. 导入仓库后**无需任何配置**（纯静态站，Vercel 自动识别），点 Deploy
4. 约 30 秒后得到 `https://你的项目名.vercel.app`，即上线完成
5. 绑定自定义域名（可选）：Project → Settings → Domains → 添加域名，按提示到域名服务商加一条 CNAME 记录（指向 `cname.vercel-dns.com`），等待解析生效即可，HTTPS 自动配置

### 方案 B：GitHub Pages（免费、稳定）

1. 在 GitHub 新建仓库（如 `my-portfolio`），把本目录全部文件推上去：

   ```bash
   cd my-portfolio
   git init
   git add .
   git commit -m "init: 个人网站"
   git branch -M main
   git remote add origin https://github.com/你的用户名/my-portfolio.git
   git push -u origin main
   ```

2. 仓库页面 → Settings → Pages
3. Source 选「Deploy from a branch」，Branch 选 `main` / 目录 `(root)`，Save
4. 约 1–2 分钟后访问 `https://你的用户名.github.io/my-portfolio/`
5. 绑定自定义域名（可选）：Settings → Pages → Custom domain 填入域名，并在域名服务商加 CNAME 记录指向 `你的用户名.github.io`，勾选 Enforce HTTPS

### 方案 C：Netlify

1. 打开 [app.netlify.com](https://app.netlify.com) 注册登录
2. 「Add new site → Deploy manually」，把 **整个 `my-portfolio` 文件夹** 拖进上传区
3. 即刻得到 `https://随机名.netlify.app`；Site settings → Change site name 可改名字
4. 绑定自定义域名（可选）：Domain management → Add a domain，按提示加 CNAME，HTTPS 自动配置

## 部署检查清单

- [ ] 所有图片文件名均为英文小写 + 连字符（无中文、无空格）
- [ ] 手机端打开检查：汉堡菜单可开合、灯箱可滑动切换
- [ ] 中英切换后刷新，语言保持
- [ ] 联系邮箱正确（`js/data.js` → `profile.email` 与 `contactCards`）
- [ ] 如绑定了自定义域名，等待 HTTPS 证书签发（几分钟到几小时）

## 常见问题

- **部署后图片 404**：多半是文件名大小写不一致。服务器区分大小写，`Project-01.jpg` ≠ `project-01.jpg`。
- **视频文件较大（4.4MB）**：如嫌首屏加载慢，可把 `assets/media/hug-demo.mp4` 换成压缩后的版本（推荐 ≤1080p、码率 ≤2Mbps），文件名不变即可。
- **改了 data.js 没生效**：浏览器缓存，按 `Ctrl + F5` 强制刷新。
