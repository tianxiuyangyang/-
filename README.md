# 张睿琛个人网站

这是一个暗黑电影感的 React + Vite + TypeScript 个人网站，包含首页视觉展示、个人介绍、创作能力模块和公开留言板。页面适合部署到 GitHub Pages。

## 本地运行

```bash
npm install
npm run dev
```

运行后在浏览器打开终端提示的地址，通常是 `http://localhost:5173`。

## 主界面 4K 视频

当前线上背景视频实际分辨率约为 1924×1076，不是原生 4K。页面已经做了高清显示优化：降低噪点遮罩强度、减轻渐变压暗、增强视频对比度和饱和度。

如果你有真正的 4K 视频素材，请把文件命名为 `hero-4k.mp4`，放到 `public` 文件夹中，然后将 [src/App.tsx](src/App.tsx) 里的 `heroVideo` 地址改成：

```ts
const heroVideo = '/hero-4k.mp4'
```

推荐视频规格：3840×2160，H.264 MP4，码率 25-45 Mbps，时长控制在 8-20 秒，文件尽量压到 50 MB 以内，避免 GitHub Pages 加载太慢。

## 留言板后端

网站不配置后端也能运行。此时留言只会保存在当前访客浏览器的 `localStorage` 中，适合本地预览。

如果要让所有访客看到同一个公开留言板，建议使用 Supabase。创建 Supabase 项目后，在 SQL Editor 里执行：

```sql
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 40),
  content text not null check (char_length(content) <= 280),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Anyone can read messages"
on public.messages for select
using (true);

create policy "Anyone can post messages"
on public.messages for insert
with check (true);
```

复制 `.env.example` 为 `.env.local`，填入你的 Supabase URL 和 anon key：

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## 部署到 GitHub Pages

1. 在 GitHub 创建一个新仓库。
2. 把本项目上传或推送到仓库。
3. 打开仓库的 `Settings -> Pages`。
4. 将 `Source` 设置为 `GitHub Actions`。
5. 如果你要使用 Supabase 留言板，打开 `Settings -> Secrets and variables -> Actions`，添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. 推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并部署网站。

`vite.config.ts` 已经在 GitHub Actions 环境中自动配置仓库路径，所以 GitHub Pages 项目站点可以正常加载资源。

## 检查命令

```bash
npm run build
npm run lint
```
