# AI 应用聚合平台

企业级 AI 应用统一入口与治理后台。平台提供门户首页、应用中心、登录认证、应用授权、用户 / 角色 / 组织管理和监控总览，当前数据使用前端 mock 与 `localStorage` 持久化，适合原型演示和离线部署验证。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 构建 | Vite 5 |
| 前端 | React 18 + TypeScript 5 |
| 主 UI 组件 | **Material UI 6** + Emotion（所有页面组件均用 MUI） |
| 主题层 | Ant Design 6 ConfigProvider（仅用于注入全局主题 token，不渲染 antd 组件） |
| 路由 | React Router 6 |
| 状态 | React Context + `localStorage` 持久化 |
| 部署 | Docker + nginx SPA fallback |

## 本地运行

要求 Node.js `>=18.0.0`。

```bash
npm install
npm run dev
npm run build
npm run preview
```

开发服务默认端口为 `5177`，配置位于 `vite.config.ts`。

## 演示账号

登录页默认填入 `admin / admin`，其中 `admin` 会映射到超级管理员 `admin1`。以下账号均可使用统一快捷密码 `admin` 登录；在用户管理中点击「重置密码」后的实际密码为 `Avic@12345678`，登录页也接受该密码。

| 账号 | 角色 | 企业 / 部门 |
| --- | --- | --- |
| `admin` 或 `admin1` | 超级管理员 | 平台 / 平台运营组 |
| `admin2` | 企业管理员 | 智研航空 / 管理中心 |
| `admin3` | 部门管理员 | 智研航空 / 研发中心 |
| `user1` | 普通用户 | 智研航空 / 研发中心 |
| `user2` | 普通用户 | 智研航空 / 硬件设计部 |
| `user3` | 普通用户 | 智研航空 / 产品中心 |

演示企业：**平台**、**智研航空**、**云翔工业**、**航星智造**。

## 当前功能

### 门户前台

- **门户首页** `/`：品牌 Hero（深蓝渐变）、顶部导航（全局搜索）、授权应用矩阵（登录后按权限过滤）、平台价值区。
- **应用中心** `/apps`：展示当前用户被授权的应用，支持关键词搜索、分类筛选（全部 / 研发提效 / 硬件设计 / 办公协同）、排序（最近使用 / 推荐 / 热门）；未登录点击卡片跳转到登录页。
- **登录页** `/login`：左右分栏卡片（品牌面板 + 登录表单），账号密码登录，失败 ≥2 次触发图形验证码，失败 ≥5 次提示账号锁定；忘记密码弹窗（4 步 Stepper：输入邮箱 → 验证码 → 设置新密码 → 完成）；找回账号弹窗（输入邮箱后区分单账号/多账号/未找到三种反馈）。

### 管理后台（需登录，共用 AdminLayout）

AdminLayout：左侧常驻侧边栏（248px）+ 顶部面包屑工具栏 + 内容区。侧边栏菜单项按当前用户角色动态过滤。

- **应用管理** `/admin/apps`（仅 super_admin）：应用 CRUD、启停开关、跳转网址校验；**三级授权弹窗**（企业 → 部门 → 用户，支持批量勾选和全选/清空，授权人数 Chip 实时展示）。
- **用户管理** `/admin/users`：用户 CRUD；**角色层级约束**（操作者只能管理低于自身角色级别的用户）；账号启停；**密码管理**（super_admin 可查看/复制/直接编辑/重置密码，重置后密码 `Avic@12345678`）；分页（5/10/20/50 条/页）。
- **角色管理** `/admin/roles`：角色列表 + 权限树（三级：模块 → 功能 → 操作）；**权限冲突检测**（阻止保存并高亮冲突项）；保存确认 Dialog（展示变更摘要和影响用户数）；**权限变更审计时间轴**弹窗。
- **组织管理** `/admin/organizations`：三 Tab——企业管理（CRUD）、部门管理（CRUD）、**权限下放**（super_admin 将权限集合下放给 enterprise_admin / department_admin / ops，保存后实时生效）。
- **监控总览** `/ops/monitor`：4 张指标卡片（应用总数、注册用户数、总调用次数、活跃用户数）+ 应用使用次数表 + 用户活跃度表；时间维度切换（今日 / 近 7 天 / 近 30 天）；当前等待真实埋点数据接入。

### 用户下拉菜单（TopNav 右上角，登录后可见）

- 展示头像、姓名、企业 · 部门、角色 Chip。
- **权限管理**（→ `/admin/roles`）：enterprise_admin / super_admin 可见。
- **监控运维**（→ `/ops/monitor`）：ops / super_admin 可见。
- **退出登录**：清除 session 并返回门户首页。

> 「个人中心」「我的 Token 用量」「配额中心」「操作日志」入口尚未实现。

## 权限模型

`src/auth/AuthContext.tsx` 维护登录态、角色判断和权限判断：

- `super_admin` 拥有 `*` 通配权限，可跨企业操作。
- `enterprise_admin` 默认拥有应用中心访问、用户管理（部门管理员及以下）、角色管理相关权限；只能看到本企业数据。
- `department_admin` 默认仅拥有应用中心访问权限，只能看到本部门用户；可通过「权限下放」获得额外权限。
- `ops` 拥有监控总览相关权限。
- `user` 拥有应用中心查看和访问权限。

角色管理和权限下放调用 `setRolePermissions` 写入 `aap.rolePermissions`，与基础矩阵取并集，刷新后仍保留。

业务数据通过 `src/data/store.ts` 的 `usePersistedState` 写入 `localStorage`，主要 key 包括：

| Key | 内容 |
| --- | --- |
| `aap.session` | 当前登录用户信息 |
| `aap.rolePermissions` | 角色动态权限覆盖层 |
| `aap.store.apps` | 应用列表（含 `permittedUserIds`） |
| `aap.store.users` | 用户列表 |
| `aap.store.roles` | 角色列表 |
| `aap.store.enterprises` | 企业列表 |
| `aap.store.departments` | 部门列表 |

重置演示数据可在浏览器控制台执行：

```js
Object.keys(localStorage)
  .filter((key) => key.startsWith('aap.'))
  .forEach((key) => localStorage.removeItem(key));
location.reload();
```

## 目录结构

```text
.
├── public/                  # 静态资源
├── scripts/                 # 离线打包脚本
├── src/
│   ├── antd-shim/           # Ant Design shim 组件（供 ConfigProvider 主题层使用）
│   ├── auth/                # 鉴权上下文（AuthContext）与私有路由守卫（RequireAuth）
│   ├── components/          # AdminLayout（后台骨架）、UserMenu（头像下拉）、EmptyState
│   ├── data/                # 应用数据(apps)、权限树(permissions)、mock 数据、持久化工具(store)
│   ├── pages/
│   │   ├── Home/            # 门户首页（TopNav / HeroBanner / AppMatrix / ValueSection）
│   │   ├── Apps/            # 应用中心
│   │   ├── Login/           # 登录页（含忘记密码 / 找回账号 Dialog）
│   │   ├── admin/
│   │   │   ├── Apps/        # 应用管理（三级授权弹窗）
│   │   │   ├── Users/       # 用户管理（密码管理、角色层级约束）
│   │   │   ├── Roles/       # 角色管理（权限树、冲突检测、审计时间轴）
│   │   │   └── Organizations/ # 组织管理（企业 / 部门 / 权限下放）
│   │   └── ops/
│   │       └── Overview.tsx # 监控总览
│   ├── styles/global.css    # 全局样式
│   ├── App.tsx              # 路由表
│   └── main.tsx             # 应用入口（antd ConfigProvider 主题注入）
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
└── vite.config.ts
```

## Docker 部署

本地构建并启动：

```bash
docker compose up -d --build
docker compose logs -f
docker compose down
```

服务默认暴露 `http://localhost:5177`，容器内由 nginx 提供静态资源与 SPA 路由 fallback。

制作离线部署包：

```bash
bash scripts/pack-offline.sh
```

脚本会生成 `offline-package/`，包含镜像 tar、`docker-compose.yml`、`install.sh` 和简版说明。将该目录复制到已安装 Docker 的 Linux 服务器后执行：

```bash
cd offline-package
bash install.sh
```

## 待建设功能

| 功能 | 路径 |
| --- | --- |
| Token 配额配置 | `/admin/quotas` |
| Token 配额监控 | `/admin/quotas/monitor` |
| Token 配额日志 | `/admin/quotas/logs` |
| 资源看板 | `/ops/resources` |
| 系统日志 | `/ops/logs` |
| 个人中心 | `/profile` |
| 我的 Token 用量 | `/profile/quota` |

## 说明

- 当前所有业务数据均为 mock，生产环境需要接入后端 API。
- 演示密码以明文形式保存在前端代码中，仅用于演示；生产环境必须改为服务端哈希存储与鉴权。
- 监控总览中的指标和表格当前为空数据结构，等待真实埋点回填。
- 双 UI 框架（MUI 6 + antd 6）并存；所有业务组件使用 MUI，antd 仅通过 ConfigProvider 注入主题 token，新增页面请统一使用 MUI。
- `dist/`、`*.tsbuildinfo` 等构建产物已在 `.gitignore` 中排除，不应提交。
