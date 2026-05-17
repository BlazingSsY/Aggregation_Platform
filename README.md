# AI 应用聚合平台

> 企业级 AI 能力统一入口与治理后台：聚合多个 AI 应用，提供统一身份、组织、权限、应用授权与运行监控。
> 基于 **React 18 + Vite 5 + TypeScript + Material UI 6** 构建，跨 Windows / macOS / Linux 运行。

---

## 一、技术栈

| 层 | 技术 |
|---|---|
| 构建 | Vite 5 |
| 框架 | React 18 + TypeScript 5 |
| UI | Material UI v6（`@mui/material` + `@mui/icons-material`，emotion 驱动） |
| 路由 | React Router v6 |
| 状态 | React Context（鉴权）+ 自研 `usePersistedState` Hook（localStorage 持久化） |
| 图表 | 纯 SVG（无第三方图表库） |

---

## 二、运行环境

| 项 | 要求 |
|---|---|
| Node.js | **>= 18.0.0**（推荐 18 LTS / 20 LTS） |
| 包管理 | npm / pnpm / yarn 任选其一 |
| 端口 | 开发服务 5177（在 `vite.config.ts` 调整） |
| 操作系统 | Windows 10+ / macOS 12+ / 主流 Linux |

---

## 三、本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:5177，自动打开浏览器）
npm run dev

# 生产构建（产物在 dist/）
npm run build

# 本地预览构建产物
npm run preview
```

### 演示账号

所有内置账号统一密码为 `admin`，登录后会按角色加载对应数据范围与可操作项。

| 账号 | 角色 | 所属企业 / 部门 |
|---|---|---|
| `admin` 或 `admin1` | 超级管理员 | 平台 · 平台运营组 |
| `admin2` | 企业管理员 | 智研航空 · 管理中心 |
| `admin3` | 部门管理员 | 智研航空 · 研发中心 |
| `user1` | 普通用户 | 智研航空 · 研发中心 |
| `user2` | 普通用户 | 智研航空 · 硬件设计部 |
| `user3` | 普通用户 | 智研航空 · 产品中心 |

> 「重置密码」操作会把目标账号密码改为统一初始密码 `Avic@12345678`，登录时密码字段同时接受 `admin` 与各账号实际密码。

---

## 四、目录结构

```
.
├── public/                     # favicon 等静态资源
├── src/
│   ├── main.tsx                # 应用入口：ThemeProvider + CssBaseline + Router + AuthProvider
│   ├── App.tsx                 # 路由表
│   ├── auth/
│   │   ├── AuthContext.tsx     # 鉴权上下文 + 角色权限矩阵 + 动态权限覆盖层
│   │   └── RequireAuth.tsx     # 私有路由守卫
│   ├── components/
│   │   ├── AdminLayout.tsx     # 后台外壳（侧边栏 + 面包屑 + 顶部条）
│   │   ├── EmptyState.tsx      # 空态组件
│   │   └── UserMenu.tsx        # 顶部右侧用户下拉
│   ├── data/
│   │   ├── apps.ts             # 应用目录元数据 + 图标映射 + 内置 8 个应用种子
│   │   ├── mock.ts             # 用户 / 企业 / 部门 / 角色 / 监控空数据
│   │   ├── permissions.ts      # 权限树定义 + 冲突规则
│   │   └── store.ts            # usePersistedState：localStorage 单例订阅
│   ├── pages/
│   │   ├── Home/               # 门户首页
│   │   │   ├── index.tsx
│   │   │   ├── TopNav.tsx      # 顶部导航（含登录按钮 / UserMenu / 全局搜索）
│   │   │   ├── HeroBanner.tsx  # 品牌 Hero
│   │   │   ├── AppMatrix.tsx   # 按授权过滤的应用矩阵
│   │   │   └── ValueSection.tsx
│   │   ├── Login/index.tsx     # 登录页 + 忘记密码 + 找回账号
│   │   ├── Apps/index.tsx      # 应用中心（按授权过滤）
│   │   ├── admin/
│   │   │   ├── Apps/           # 应用管理（增删改 + 用户授权 + 跳转网址）
│   │   │   ├── Users/          # 用户管理（密码、状态、角色层级）
│   │   │   ├── Roles/          # 角色管理（权限树 + 权限下放）
│   │   │   └── Organizations/  # 组织管理（企业/部门 CRUD + 权限下放）
│   │   └── ops/Overview.tsx    # 监控总览（应用使用次数 + 用户活跃度）
│   ├── styles/global.css       # 全局 CSS + 主题变量
│   └── theme/index.ts          # MUI 主题（品牌色、字体、组件默认）
├── index.html
├── package.json
├── tsconfig.json / tsconfig.node.json
└── vite.config.ts              # 端口 5177、@/ 别名
```

---

## 五、核心功能

### 1. 门户首页 `/`
- 顶部 LOGO「机载」+ 三项导航（首页 / 应用中心 / 平台优势）视口居中，右上角全局搜索 + 登录态用户菜单
- Hero 区：品牌渐变背景 + 装饰飞机/云朵，主标题 72px 居中
- 应用矩阵：根据当前用户授权过滤展示；未登录访客可预览全部启用应用
- 平台价值区：4 张优势卡片

### 2. 登录页 `/login`
- 单一「账号密码」表单，居中卡片 + 左侧品牌渐变栏
- 连续输错 2 次出图形验证码，5 次提示锁定
- 「忘记密码」三步 Stepper 弹窗（邮箱 → 验证码 → 新密码）
- 「找回账号」弹窗（按邮箱反查脱敏账号）
- 禁用账号登录被拦截

### 3. 应用中心 `/apps`
- 搜索 + 分类筛选 + 推荐 / 最近 / 热门排序
- 仅展示当前用户已获授权的应用

### 4. 应用管理 `/admin/apps`（超管专属）
- 列表：名称 + 图标、分类、描述、跳转网址、授权人数 Chip、状态、操作
- 新增 / 编辑弹窗：分类、图标（含图标预览选择器）、状态、应用描述、跳转网址（http(s) 校验）
- 授权弹窗：按企业 / 部门双层折叠，三级 Checkbox + indeterminate 半选，**用户横排平铺**，支持企业级 / 部门级 / 单人级批量勾选
- 删除二次确认

### 5. 用户管理 `/admin/users`
- **角色层级硬约束**：超管 > 企业管理员 > 部门管理员 > 普通用户；运维归超管单独管
  | 操作者 | 可管理目标角色 | 数据范围 |
  |---|---|---|
  | 超级管理员 | 全部 | 全平台所有用户 |
  | 企业管理员 | 部门管理员 / 普通用户 | 仅本企业 |
  | 部门管理员 | 普通用户 | 仅本企业 + 本部门 |
- 按当前角色自动隐藏越权的筛选条与按钮；列表行/操作按钮按层级动态禁用并 Tooltip 提示原因
- 「密码」列仅超管可见：查看/隐藏切换 + 一键复制；操作列「重置密码」直接重置为 `Avic@12345678` 并自动展开显示
- 「状态」列控制账号启用 / 禁用：禁用账号无法登录、不出现在统计中、保留数据
- 编辑弹窗：超管额外可见密码字段（带「重置为初始密码」🔄 按钮）；企业/部门字段对非超管锁定显示锁图标
- 不能管理自己的状态与删除（防自锁）

### 6. 角色管理 `/admin/roles`
- 角色列表：名称、编码、所属企业、用户数、状态、操作；超管可见企业筛选下拉
- 权限树：3 级（模块-功能-操作）级联勾选、indeterminate 半选、搜索定位、全选/反选/清空
- 冲突检测：3 条预设规则（如"导出日志缺少查看权限"）命中阻止保存
- 变更摘要 + 保存前 Dialog 二次确认；写入即时生效到 AuthContext，角色对应 RoleKey 用户立即获得新权限
- 权限审计 Dialog：时间轴展示历史变更（保存权限会写入新条目）
- 新建 / 编辑角色弹窗：名称、编码、所属企业（仅超管可改）、状态；内置角色锁定保护

### 7. 组织管理 `/admin/organizations`
- 三个 Tab：企业管理 / 部门管理 / 权限下放（仅超管见第三个）
- 企业 CRUD：名称、编码、描述、联系方式、状态；删除前校验关联用户和部门
- 部门 CRUD：所属企业、上级部门（支持二级嵌套）、负责人、状态
- 权限下放矩阵：超管为「企业管理员/部门管理员/运维人员」逐项勾选 `org:enterprise:*` 与 `org:department:*` 权限，写入 `AuthContext.rolePermissions` 立即生效，可在「角色管理」反向核对

### 8. 监控总览 `/ops/monitor`
- 4 张摘要卡（应用总数 / 注册用户 / 总调用 / 活跃用户）+ 时间维度切换
- 「应用使用次数」与「用户活跃度」两张表格，目前为空态结构，等待真实埋点数据接入

---

## 六、关键设计

### 鉴权与权限
- `AuthContext` 维护 `user`（含 RoleKey 列表）、`rolePermissions` 动态覆盖层
- `hasPermission(code)` 合并 PERMISSION_MATRIX 基础权限 + 动态下放权限；超管 `*` 通配
- 鉴权状态、动态权限均持久化到 `localStorage`
- 路由守卫：`<RequireAuth>` 包裹的子路由要求已登录

### 数据持久化
- `src/data/store.ts` 提供 `usePersistedState<T>(key, initial)`：同 key 多组件共享一份内存数据 + 自动写 `localStorage('aap.store.*')`，跨路由 / 刷新都不会丢
- 用 `aap.store.apps` / `users` / `roles` / `enterprises` / `departments` 持久化各业务表
- `aap.rolePermissions` 持久化动态角色权限
- `aap.session` 持久化登录态

### 跨平台兼容
1. `vite.config.ts` 用 `path.resolve(__dirname, ...)` 处理别名，自动适配各平台路径
2. 所有依赖为纯 JS/TS，无 `node-gyp` 等原生构建依赖
3. `.gitignore` 已屏蔽 `.DS_Store`、`Thumbs.db`、`__MACOSX`、`*.tsbuildinfo`、`vite.config.js/d.ts` 等
4. `package.json` 中 `engines.node >= 18`

---

## 七、常见操作

```bash
# 重置所有 mock 数据（开发态）
# 浏览器 DevTools 控制台执行：
Object.keys(localStorage).filter(k=>k.startsWith('aap.')).forEach(k=>localStorage.removeItem(k));location.reload();
```

| 场景 | 操作 |
|---|---|
| 查看授权过滤效果 | 用 `admin/admin` 登录 → 应用管理收回某用户授权 → 退出 → 用该用户登录验证看不到该应用 |
| 验证角色层级约束 | 用 `admin3`（部门管理员）登录 → 用户管理表中能看到的用户被限制；试图操作非普通用户的行，按钮全部禁用并 Tooltip 提示 |
| 验证权限下放 | `admin` 登录 → 组织管理 → 权限下放给「企业管理员」`新增部门` → 退出 → `admin2` 登录后能新增部门 |
| 禁用账号验证 | 用户管理把某账号状态切到禁用 → 用该账号登录会被拦截 |

---

## 八、构建产物

```bash
npm run build
# dist/index.html
# dist/assets/index-<hash>.css     ~10 KB / gzip ~3 KB
# dist/assets/index-<hash>.js     ~630 KB / gzip ~194 KB
```

`dist/` 已在 `.gitignore`，提交前确认不应包含。

---

## 九、Docker 部署（推荐：离线 / 生产环境）

源码直接拷到空白 Linux 服务器无法运行：服务器需要 Node 装依赖、还要 nginx 之类做 SPA 路由 fallback。本项目已 Docker 化，一次镜像包含「Node 构建 + nginx 服务」，离线服务器只要装了 Docker 即可。

### 文件清单

| 文件 | 作用 |
|---|---|
| `Dockerfile` | 多阶段构建：node:20-alpine 编译，nginx:1.27-alpine 出最终镜像（≈50MB） |
| `nginx.conf` | SPA 路由 fallback + gzip + 静态资源长缓存 |
| `.dockerignore` | 排除 node_modules / dist / *.tsbuildinfo 等，缩小构建上下文 |
| `docker-compose.yml` | 一键启动（宿主 5177 → 容器 80） |
| `scripts/pack-offline.sh` | 一键打离线包（镜像 tar + 启动脚本 + 说明） |

### 在有网开发机：构建 / 测试

```bash
# 直接构建并启动（开发或本机演示）
docker compose up -d --build

# 浏览器访问
open http://localhost:5177

# 查看日志 / 停止
docker compose logs -f
docker compose down
```

### 制作离线部署包

```bash
bash scripts/pack-offline.sh
# 产出 offline-package/
#   ├── aap-frontend.tar    （~50MB，docker save 出的镜像）
#   ├── docker-compose.yml
#   ├── install.sh           （目标机一键执行）
#   └── README.txt          （简版操作说明）
```

把整个 `offline-package/` 目录通过 U 盘 / scp / 内网传到目标服务器。

### 在离线 Linux 服务器：一键安装

**前提**：服务器已装好 Docker 引擎（任何 20.10+ 都行）。如果服务器完全无任何工具，先用 Docker 官方提供的离线安装包安装：<https://docs.docker.com/engine/install/binaries/> （把 `docker` 二进制丢到 `/usr/local/bin/` 即可，或者用对应发行版的 rpm/deb 离线包）。

```bash
cd offline-package
bash install.sh
# 自动 docker load 镜像并 docker compose up -d
# 默认绑定 5177 端口，访问 http://<服务器IP>:5177
```

### 自定义

- **改端口**：编辑 `docker-compose.yml` 中 `ports: ["5177:80"]`，把左边换成想要的宿主端口（比如 `80:80`）
- **改基础镜像源**（国内构建慢可加镜像加速）：在 `Dockerfile` 取消注释 `RUN npm config set registry https://registry.npmmirror.com`
- **改 nginx 行为**（接入网关、加反代后端 API）：编辑 `nginx.conf` 后重新 `docker compose up -d --build`

### 完全无 Docker 的备用方案

如果目标机连 Docker 都装不了，剩下两个选择：

1. **找一台带 Docker 的机器**：上面构建镜像，`docker save` 出 tar；目标机也得能跑 Docker，否则 tar 没意义
2. **纯静态服务**：在开发机 `npm run build` 出 `dist/`，把 `dist/` + 任何能 serve 静态文件的二进制（如 `caddy`、单文件 `nginx` 静态 build、Python `http.server`）一起拷到目标机。但要保证服务器配上 SPA fallback（参考本仓库的 `nginx.conf`），否则刷新 `/admin/users` 等路由会 404。

---

## 十、约束与说明

- 当前所有数据均为 mock（前端 localStorage），生产部署需接入真实后端 API
- 密码以明文存储仅用于演示，生产必须哈希
- 监控总览的"应用使用次数 / 用户活跃度"为预留结构，需后端埋点回填
- 角色权限的实时生效依赖 AuthContext 内的动态层，跨设备同步需后端统一管理
