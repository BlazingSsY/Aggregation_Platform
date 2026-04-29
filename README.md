# 智研AI生产力聚合平台

> 一站式研发办公 AI 聚合平台，覆盖元器件查询、代码开发、电路设计、办公提效全场景。
> 基于 **React 18 + Vite 5 + TypeScript 5 + Ant Design 5.x** 构建，跨 Windows / macOS / Linux 运行。

---

## 一、技术栈

| 层 | 技术 |
|---|---|
| 构建 | Vite 5 |
| 框架 | React 18 + TypeScript 5 |
| UI   | Ant Design 5.x（中文 zh_CN locale） |
| 路由 | React Router v6 |
| 时间 | dayjs |

---

## 二、运行环境要求

| 环境 | 要求 |
|---|---|
| Node.js | **>= 18.0.0**（推荐 18 LTS / 20 LTS） |
| 包管理器 | npm / pnpm / yarn 任选其一 |
| 操作系统 | Windows 10+ / macOS 12+ / 主流 Linux |

---

## 三、本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认端口 5173，启动后自动打开浏览器）
npm run dev

# 3. 生产构建
npm run build

# 4. 本地预览构建产物
npm run preview
```

开发服务器启动后访问：<http://localhost:5173>

### 默认登录账号

| 字段 | 值 |
|---|---|
| 账号 | `admin_root` |
| 密码 | `admin_root` |

> 仅管理员账号可登录系统。

---

## 四、跨平台兼容说明

本项目天然跨 Windows / macOS / Linux：

1. **路径处理**：`vite.config.ts` 使用 `path.resolve(__dirname, ...)`，自动适配各平台路径分隔符。
2. **行结尾 / 换行符**：所有源码使用 `\n`，VS Code / WebStorm 可正常识别。
3. **依赖锁定**：使用 `package.json` 的 `engines` 字段限定 Node 版本，避免低版本兼容问题。
4. **`.gitignore` 全平台屏蔽**：已配置覆盖 `.DS_Store`、`__MACOSX`、`Thumbs.db`、`Desktop.ini` 等系统残留文件，避免在 Windows 环境下构建镜像或解压时报错。
5. **不依赖原生模块**：所有依赖均为纯 JS / TS 模块，无需 `node-gyp`、Python、Visual Studio Build Tools。

---

## 五、目录结构

```
.
├── public/                 # 静态资源
├── src/
│   ├── App.tsx             # 路由入口
│   ├── main.tsx            # 应用入口（ConfigProvider + zh_CN）
│   ├── layouts/
│   │   └── MainLayout.tsx  # 主布局（侧边栏 / 顶栏 / 面包屑 / 内容区）
│   ├── pages/
│   │   ├── Login/          # 登录页
│   │   ├── Dashboard/      # 仪表盘首页
│   │   ├── Apps/           # 7 个 AI 应用页面
│   │   │   ├── ComponentLib.tsx     # 元器件库
│   │   │   ├── KnowledgeQA.tsx      # 知识问答助手
│   │   │   ├── CodeGen.tsx          # 软件代码生成
│   │   │   ├── CodeReview.tsx       # 代码审查
│   │   │   ├── CircuitReview.tsx    # 电路审查
│   │   │   ├── Meeting.tsx          # 会议纪要
│   │   │   └── PPT.tsx              # PPT 生成
│   │   └── System/         # 系统管理（仅 admin 可见）
│   │       ├── UserManage.tsx
│   │       ├── AppConfig.tsx
│   │       └── OperationLog.tsx
│   ├── styles/
│   │   └── global.css      # 全局样式
│   └── utils/
│       └── auth.ts         # 登录态（localStorage）
├── .gitignore              # 跨平台屏蔽规则
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 六、核心功能

### 登录页
- 左右分栏：左栏品牌渐变视觉 + 3 张优势卡片，右栏 400px 登录表单卡片。
- 表单：管理员账号 / 密码（默认 `admin_root` / `admin_root`），记住账号、登录态校验、Loading。

### 主布局
- **左侧侧边栏**：固定 240px / 折叠 64px、深色 `#1F2329`、分组菜单、底部用户区。
- **顶部导航**：折叠按钮 + 面包屑，右侧全局搜索 / 通知 / 帮助 / 主题切换 / 用户头像。
- **内容区**：自适应栅格、面包屑联动路由、主题色 `#1677FF`。

### 仪表盘
- 4 张数据概览卡片（调用次数 / 应用数 / 文件数 / 系统状态）。
- 8 个 AI 应用快捷入口（彩色渐变图标 + hover 上浮）。
- 最近使用 + 待完成任务双列表。

### 7 个 AI 应用
| 应用 | 关键交互 |
|---|---|
| 元器件库 | 全局搜索 + 分类筛选 + 详情 Tab（参数/AI解读/datasheet）+ AI 选型推荐 Modal |
| 知识问答 | 左会话列表 + 右气泡对话 + 文档上传 + 知识库管理 Drawer |
| 代码生成 | 语言/框架/规范配置 + 工程目录树 + 暗色代码预览 + ZIP 下载 |
| 代码审查 | 粘贴/上传 Tab + 5 项检查 + 风险等级统计 + Diff 折叠面板 |
| 电路审查 | 文件上传 + EMC/可制造性配置 + 问题清单 / 优化建议 / 合规报告 Tab |
| 会议纪要 | 上传/录音/粘贴 Tab + 实时录音波形 + 结构化纪要与待办表格 |
| PPT 生成 | 3 步 Steps 配置 + 4 个模板预览 + 缩略图列表 + 全屏页内容预览 |

### 系统管理（仅 admin_root 可见）
- 用户管理：表格 + Modal 表单（新增/编辑/删除/重置密码）。
- 应用配置：每个应用可独立启停 / 改 API 密钥 / 改限额。
- 操作日志：账号 + 时间区间筛选、导出。

---

## 七、Git 上传与镜像构建注意事项

`.gitignore` 已严格屏蔽以下内容，避免上传后在 **Windows 环境下构建 Docker 镜像或解压时报错**：

```
node_modules/   target/   dist/   build/   *.log
.DS_Store   __MACOSX   ._*
.idea/   .vscode/   *.iml   *.suo
docker/volumes/   docker-data/
.env  .env.*.local
Thumbs.db   Desktop.ini   $RECYCLE.BIN/
```

提交前请确认：

```bash
git status   # 不应出现上述任何文件
```

---

## 八、首次提交示例

```bash
git add .
git commit -m "feat: 初始化智研AI生产力聚合平台前端"
git push origin main
```
