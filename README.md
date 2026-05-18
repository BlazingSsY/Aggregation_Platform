# AI 应用聚合平台

企业级 AI 应用统一入口与治理后台。项目提供门户首页、应用中心、应用授权、用户/角色/组织管理和监控总览，当前数据使用前端 mock 与 `localStorage` 持久化，适合原型演示和离线部署验证。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 构建 | Vite 5 |
| 前端 | React 18 + TypeScript 5 |
| UI | Material UI 6 + Emotion |
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

登录页默认填入 `admin / admin`，其中 `admin` 会映射到超级管理员 `admin1`。以下账号均可使用统一快捷密码 `admin` 登录；用户管理中重置后的实际密码为 `Avic@12345678`，登录页也会接受该实际密码。

| 账号 | 角色 | 企业 / 部门 |
| --- | --- | --- |
| `admin` 或 `admin1` | 超级管理员 | 平台 / 平台运营组 |
| `admin2` | 企业管理员 | 智研航空 / 管理中心 |
| `admin3` | 部门管理员 | 智研航空 / 研发中心 |
| `user1` | 普通用户 | 智研航空 / 研发中心 |
| `user2` | 普通用户 | 智研航空 / 硬件设计部 |
| `user3` | 普通用户 | 智研航空 / 产品中心 |

## 当前功能

- 门户首页 `/`：品牌首页、顶部导航、全局搜索、授权应用矩阵、平台价值区。
- 应用中心 `/apps`：按授权用户过滤应用，支持搜索、分类筛选和排序。
- 登录 `/login`：账号密码登录、错误次数提示、图形验证码触发、忘记密码和找回账号弹窗。
- 应用管理 `/admin/apps`：应用新增、编辑、删除、启停、跳转地址校验、企业/部门/用户三级授权。
- 用户管理 `/admin/users`：用户 CRUD、角色层级约束、账号启停、密码查看/复制/重置。
- 角色管理 `/admin/roles`：角色 CRUD、权限树配置、冲突检测、保存确认、权限变更审计。
- 组织管理 `/admin/organizations`：企业和部门维护，支持超级管理员进行权限下放。
- 监控总览 `/ops/monitor`：指标卡、应用使用次数表、用户活跃度表；当前等待真实埋点数据接入。

## 权限模型

`src/auth/AuthContext.tsx` 维护登录态、角色判断和权限判断：

- `super_admin` 拥有 `*` 通配权限。
- `enterprise_admin` 默认拥有应用中心、用户管理、角色管理相关权限。
- `department_admin` 默认拥有应用中心访问权限，可通过组织管理进行权限下放。
- `ops` 拥有监控总览相关权限。
- 角色管理和权限下放写入 `aap.rolePermissions`，刷新后仍保留。

业务数据通过 `src/data/store.ts` 的 `usePersistedState` 写入 `localStorage`，主要 key 包括：

- `aap.session`
- `aap.rolePermissions`
- `aap.store.apps`
- `aap.store.users`
- `aap.store.roles`
- `aap.store.enterprises`
- `aap.store.departments`

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
│   ├── auth/                # 鉴权上下文与私有路由守卫
│   ├── components/          # 后台布局、用户菜单、空状态
│   ├── data/                # 应用、权限、mock 数据和持久化工具
│   ├── pages/
│   │   ├── Home/            # 门户首页
│   │   ├── Apps/            # 应用中心
│   │   ├── Login/           # 登录页
│   │   ├── admin/           # 应用、用户、角色、组织管理
│   │   └── ops/             # 监控总览
│   ├── styles/global.css    # 全局样式与 MUI 覆盖
│   ├── theme/index.ts       # MUI 主题
│   ├── App.tsx              # 路由表
│   └── main.tsx             # 应用入口
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

## 说明

- 当前所有业务数据均为 mock，生产环境需要接入后端 API。
- Demo 密码以明文形式保存在前端数据中，仅用于演示；生产环境必须改为服务端哈希存储与鉴权。
- 监控总览中的使用次数和活跃度表当前为空数据结构，等待真实埋点回填。
- `dist/`、`*.tsbuildinfo`、`vite.config.js`、`vite.config.d.ts` 等构建产物已在 `.gitignore` 中排除，不应提交。
