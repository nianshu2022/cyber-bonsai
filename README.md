# 🌱 CyberBonsai (赛博盆栽)

一个运行在 Cloudflare Edge 上的动态 GitHub README 像素盆栽挂件。

你的赛博盆栽会根据你最近 7 天在 GitHub 上的开发活跃度（Commits、PRs、Issues）自动浇灌、成长、开花，或者因为疏于管理而枯萎进入休眠。

---

## 🎨 盆栽成长阶段 (Growth Levels)

* **LV.0 种子萌芽 (Sprout)**：最近 7 天内有 0-1 次 commit。
* **LV.1 幼苗小树 (Sapling)**：最近 7 天内有 2-4 次 commits。
* **LV.2 成长阶段 (Growing)**：最近 7 天内有 5-9 次 commits。
* **LV.3 成熟盆景 (Bonsai)**：最近 7 天内有 10-19 次 commits。
* **LV.4 繁花似锦 (Blooming)**：最近 7 天内有 20+ 次 commits 🌸（树冠会盛开粉红色与白色的像素小花）。
* **🍂 缺水休眠 (Dormant)**：最近 7 天内 0 次 commit，盆栽会转为干枯昏黄的色调。

---

## 🛠️ 本地开发 (Local Development)

### 1. 启动开发服务器
```bash
npm run dev
```
打开 [http://localhost:3000](http://localhost:3000) 访问页面。

### 2. 完整 Pages 环境模拟 (WSL 推荐)
```bash
# 初始化本地 D1 数据库
npx wrangler d1 execute cyber-bonsai-db --local --file=schema.sql

# 编译并启动本地 wrangler Pages 模拟服务器
npm run preview
```

---

## 🚀 部署在 Cloudflare Pages (Deploy on Cloudflare)

本站采用单体 Next.js 16.x 架构，适配 `@cloudflare/next-on-pages`：

1. 创建线上的 D1 数据库：
   ```bash
   npx wrangler d1 create cyber-bonsai-db
   ```
2. 将返回的 `database_id` 填入 `wrangler.toml` 中。
3. 导入 GitHub 仓库到 Cloudflare Pages，并在后台配置：
   * **Build command**: `npm run pages:build`
   * **Build output directory**: `.vercel/output/static`
   * **Functions settings**:
     * 绑定 D1 数据库，变量命名为 `DB`，对应选定 `cyber-bonsai-db`。
     * 开启兼容性标志（Compatibility flags）：`nodejs_compat`。
4. 完成部署！
