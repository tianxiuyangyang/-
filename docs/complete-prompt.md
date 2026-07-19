# 完整提示词

你可以把下面这段提示词复制到其他 AI 编程会话中，用来复刻或继续优化这个网站。

```text
请创建一个 React + Vite + TypeScript + Tailwind CSS 个人网站。网站需要是全中文界面，整体风格暗黑、电影感、高级、克制，灵感来自名为 “Prisma” 的创意工作室落地页。网站必须展示我的个人信息，包含公开留言板，并且可以部署到 GitHub Pages。

技术栈：
- Vite + React + TypeScript
- Tailwind CSS 3
- framer-motion 用于文字动效、滚动动效、卡片入场动画
- lucide-react 用于图标
- Supabase REST API 作为可选后端，用于公开共享留言板

字体：
- 在 index.html 加载 Google Fonts：
  - Almarai，字重 300、400、700、800，作为全局默认字体
  - Instrument Serif italic，仅用于 About 区域中的斜体强调文字
- 在 index.css 中设置所有元素使用 Almarai，并带系统字体兜底。
- 在 tailwind.config.js 中扩展 colors.primary 为 #DEDBC8，fontFamily.serif 为 ["Instrument Serif", "serif"]。

配色系统：
- 全局背景：#000000
- 主文字：#E1E0CC
- Tailwind primary：#DEDBC8
- About 卡片背景：#101010
- Features 卡片背景：#212121
- 辅助灰色文字使用 text-gray-400 和 text-gray-500
- 导航文字颜色 rgba(225, 224, 204, 0.8)，hover 时变为 #E1E0CC

自定义 CSS 工具类：
- .noise-overlay 使用 inline SVG fractal noise，baseFrequency 0.85，numOctaves 3。
- .bg-noise 使用 inline SVG fractal noise，baseFrequency 0.9，numOctaves 4。

首页 Hero：
- 高度为完整视口 h-screen，外层 p-4 md:p-6，形成内嵌视觉。
- 内部容器 relative、overflow-hidden、rounded-2xl md:rounded-[2rem]。
- 背景视频填满容器：
  https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4
- 视频属性：autoPlay、loop、muted、playsInline、object-cover。
- 叠加 .noise-overlay，opacity-[0.7]，mix-blend-overlay，pointer-events-none。
- 叠加渐变遮罩 bg-gradient-to-b from-black/30 via-transparent to-black/60。
- 导航栏绝对定位在顶部居中，是一个从顶部垂下的黑色胶囊，rounded-b-2xl md:rounded-b-3xl，px-4 py-2 md:px-8。
- 导航项使用中文：我的故事、个人信息、创作能力、项目方向、留言联系。
- 导航文字大小：text-[10px] sm:text-xs md:text-sm。
- 导航间距：gap-3 sm:gap-6 md:gap-12 lg:gap-14。
- Hero 底部内容使用 12 栏网格。
- 左侧 8 栏是巨大的中文标题“睿琛”，使用 WordsPullUp 动画。
- 标题尺寸：text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]。
- 标题样式：font-medium leading-[0.85] tracking-[-0.07em]，颜色 #E1E0CC。
- 标题末尾带一个星号上标，absolute top-[0.65em] -right-[0.3em] text-[0.31em]。
- 右侧 4 栏是中文简介和 CTA 按钮。
- CTA 文案为“给我留言”，按钮 bg-primary、rounded-full、黑色文字，右侧黑色圆形里放 ArrowRight 图标。
- CTA hover 时按钮 gap 变大，右侧圆形图标轻微放大。

About 区域：
- 黑色背景，内容居中。
- 内部卡片 bg-[#101010]，max-w-6xl，居中文本。
- 小标签为“视觉创作”。
- 主标题使用 WordsPullUpMultiStyle，分三段：
  - “我是张睿琛，” 普通 Almarai
  - “一个持续自学的创作者。” 使用 Instrument Serif italic
  - “我关注影像表达、视觉设计、前端作品和叙事体验。” 普通 Almarai
- 标题大小：text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl，leading-[0.95] sm:leading-[0.9]，max-w-3xl mx-auto。
- 正文段落使用字符级滚动透明度动画，每个字符从 opacity 0.2 变到 1。

个人信息区域：
- 使用高级卡片展示姓名、位置、方向、联系。
- 文案为中文。
- 使用 lucide-react 的 UserRound、MapPin、Clapperboard、Mail 图标。
- 保持暗黑、暖奶油色、电影感风格。

Features 区域：
- min-h-screen bg-black，并添加 .bg-noise 背景，opacity-[0.15]。
- 标题使用 WordsPullUpMultiStyle：
  - “为个人表达建立清晰而高级的展示方式。” 使用奶油色
  - “从灵感出发，用细节形成记忆。” 使用 text-gray-500
- 卡片网格：移动端 1 列，md 2 列，lg 4 列；lg:h-[480px]。
- 第 1 张卡是视频卡，视频地址：
  https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4
- 第 1 张卡底部文字：“这里收藏我的创作现场。”
- 第 2 张卡标题：“项目叙事板。”，编号 01，包含中文清单项和“了解更多”链接。
- 第 3 张卡标题：“灵感复盘。”，编号 02，包含中文清单项和“了解更多”链接。
- 第 4 张卡标题：“沉浸空间。”，编号 03，包含中文清单项和“了解更多”链接。
- 清单图标使用 Check，颜色 text-primary。
- Learn more/了解更多 的 ArrowRight 图标旋转 -45deg。
- 卡片入场动画使用 framer-motion：opacity 0、scale 0.95 到 opacity 1、scale 1，每张卡延迟 0.15s。

留言板：
- 添加中文公开留言板区域，锚点为留言联系。
- 表单字段：你的名字、写一句留言，按钮为“发送”，使用 Send 图标。
- 校验名字和留言不能为空。
- 名字最多 40 个字符，留言最多 280 个字符。
- 如果存在 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY，就通过 Supabase REST API 的 public.messages 表读取和插入留言。
- 如果 Supabase 未配置，则使用 localStorage 作为演示兜底，并显示中文状态提示。
- 留言按最新优先展示，包含名字、中文日期和留言内容。

共享动画组件：
- WordsPullUp 按空格拆分文本，每个词用 motion.span 包裹，从 y:20 动画到 y:0，delay 按 0.08s 递增，useInView once。
- WordsPullUp 支持 showAsterisk，在最终文字后添加上标星号。
- WordsPullUpMultiStyle 接收 { text, className } 数组，拆分词语并保留每段样式。
- AnimatedParagraph 将每个字符包裹为 AnimatedLetter，并使用 useScroll/useTransform 实现滚动渐显。

部署：
- 添加 .env.example，包含 Supabase 凭据示例。
- 添加 GitHub Actions workflow：安装依赖、构建 Vite 应用、部署 dist 到 GitHub Pages。
- 在 vite.config.ts 中，GitHub Actions 构建时自动将 base 设置为 /仓库名/。
- README.md 使用中文说明本地运行、Supabase SQL、GitHub Pages 部署步骤和检查命令。
```
