# 2026 Todo Dashboard

一个纯前端的 2026 年待办事项综合台。

## 功能特点
- **2026 全年日历**：支持 12 个月切换。
- **待办事项管理**：每日可添加无限个待办事项。
- **积分系统**：完成任务自动加分，实时显示在日历上。
- **本地存储**：数据保存在浏览器本地，无需服务器或 AI 连接。
- **部署友好**：已针对 GitHub 和 Netlify 进行优化。

## 本地开发
1. 安装依赖：
   ```bash
   npm install
   ```
2. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 部署到 Netlify
1. 将此项目上传到您的 **GitHub** 仓库。
2. 登录 **Netlify**。
3. 点击 "Add new site" -> "Import an existing project"。
4. 选择您的 GitHub 仓库。
5. Netlify 会自动识别 Vite 配置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. 点击 "Deploy site" 即可。

## 注意事项
- 本工具不依赖任何大模型（Gemini 等），所有逻辑均在本地运行。
- 积分功能基于本地任务完成情况计算，不涉及 AI 调整。
