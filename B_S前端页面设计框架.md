# B/S 架构前端页面设计框架

> 适用于常规企业级应用系统（如 OA、CRM、ERP、项目管理、数据管理等 B/S 应用）

---

## 一、整体布局结构

```
┌─────────────────────────────────────────────────────────┐
│  顶部导航栏 TopBar          [Logo] [系统名称] [用户信息] │
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  侧边栏    │          主内容区 Content Area              │
│  Sidebar   │                                            │
│  (可折叠)  │  ┌──────────────────────────────────────┐  │
│            │  │  面包屑 + 页面标题 + 操作按钮          │  │
│  菜单目录  │  ├──────────────────────────────────────┤  │
│            │  │                                      │  │
│            │  │  内容主体（列表/表单/详情/图表）        │  │
│            │  │                                      │  │
│            │  └──────────────────────────────────────┘  │
└────────────┴────────────────────────────────────────────┘
```

### 3.1 顶部导航栏（TopBar）

- 高度：56px
- 左侧：系统 Logo + 系统名称
- 右侧：通知图标 + 全屏切换 + 用户头像 + 用户名下拉菜单
- 背景色：深色系（#1e1e1e 或与主色呼应）
- 字体：白色，无衬线字体

### 3.2 侧边栏（Sidebar）

- 宽度：220px（折叠后 64px）
- 背景色：白色或浅灰
- 菜单项：图标 + 文字，支持二级菜单
- 当前选中项：左侧主色边条 + 浅色背景填充
- 支持 collapsible（可折叠/展开）

### 3.3 主内容区（Content）

- 左侧自适应
- 内边距：24px
- 全局背景色：浅灰 #f0f2f5
- 卡片圆角：8px
- 卡片阴影：0 1px 3px rgba(0,0,0,0.08)

### 3.4 面包屑（Breadcrumb）

- 位于页面标题区左侧
- 格式：首页 / 一级菜单 / 当前页
- 颜色：次要文字色，当前页主色

---

## 二、配色方案

### 4.1 主色调

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 Primary | #409EFF | Element Plus 默认蓝，系统主色 |
| 深主色 | #322ef1 | 顶部导航背景 |
| 成功色 | #62d828 | 成功、已完成 |
| 警告色 | #ecba30 | 警告、待处理 |
| 危险色 | #e73939 | 错误、删除、紧急 |
| 信息色 | #909399 | 提示、默认值 |

### 4.2 文字层级

| 层级 | 色值 | 用途 |
|------|------|------|
| 主要文字 | #303133 | 标题、核心内容 |
| 次要文字 | #606266 | 正文说明 |
| 占位文字 | #C0C4CC | placeholder、空状态 |

### 4.3 背景层级

| 层级 | 色值 | 用途 |
|------|------|------|
| 全局背景 | #f0f2f5 | 页面整体背景 |
| 卡片背景 | #ffffff | 表格、卡片、弹窗 |
| 表格斑马纹 | #fafafa | 奇偶行区分 |

---

## 三、核心页面模式

### 5.1 列表页（List Page）

最常用的数据展示页面。

```
┌────────────────────────────────────────────────────┐
│  用户管理                              [+ 新建]   │
│  首页 / 系统管理 / 用户管理                      │
├────────────────────────────────────────────────────┤
│  [搜索框................] [部门 ▼] [状态 ▼] [搜索] [重置] │
├────────────────────────────────────────────────────┤
│  ┌────┬───────┬────┬──────┬────────┬───────────┐ │
│  │勾选│用户名 │部门│ 职位 │ 状态  │ 操作     │ │
│  ├────┼───────┼────┼──────┼────────┼───────────┤ │
│  │ ☐ │ 张三   │销售│经理  │ 启用  │[编辑][删除]│ │
│  │ ☐ │ 李四   │技术│主管  │ 禁用  │[编辑][删除]│ │
│  └────┴───────┴────┴──────┴────────┴───────────┘ │
│                                      [< 1 2 3 >] │
└────────────────────────────────────────────────────┘
```

关键要素：
- 搜索条件区：支持关键词搜索 + 下拉筛选
- 操作按钮区：新建（主按钮）、导出、筛选
- 表格区：支持勾选、分页、排序
- 末尾操作列：编辑、删除等

### 5.2 表单页（Form Page）

用于新增/编辑数据。

```
┌────────────────────────────────────────────────────┐
│  [返回]  新建用户 / 编辑用户                        │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  基本信息                                    │  │
│  │  ──────────────────────────────────────────   │  │
│  │  用户名 * │ [_______________]                 │  │
│  │  手机号 * │ [_______________]                  │  │
│  │  部门   * │ [____下拉框____▼]                │  │
│  │  职位    │ [_______________]                  │  │
│  │  状态    │ ( ) 启用  ( ) 禁用                 │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  其他信息                                    │  │
│  │  ──────────────────────────────────────────   │  │
│  │  备注    │ [________________________]        │  │
│  │          │ [多行文本，可选]                   │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│                          [取消]  [保存]  [保存并继续] │
└────────────────────────────────────────────────────┘
```

关键要素：
- 分组展示，表单项不宜超过20个
- 必填项标签前加红色星号
- 底部固定操作区，按钮右对齐
- 支持「保存并继续」快捷操作

### 5.3 详情页（Detail Page）

用于查看单条记录的完整信息。

```
┌────────────────────────────────────────────────────┐
│  [返回]  用户详情                    [编辑] [删除] │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌───────────────┐  ┌───────────────┐             │
│  │ 基本信息      │  │ 扩展信息      │             │
│  ├───────────────┤  ├───────────────┤             │
│  │ 用户名：张三  │  │ 创建时间：    │             │
│  │ 手机号：...   │  │ 2024-01-01    │             │
│  │ 部门：销售部  │  │ 最后登录：    │             │
│  │ 职位：经理    │  │ 2024-06-01    │             │
│  └───────────────┘  └───────────────┘             │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  操作日志                                    │  │
│  ├──────────────────────────────────────────────┤  │
│  │  时间         操作人      操作内容            │  │
│  │  2024-01-01   管理员      创建用户            │  │
│  │  2024-06-01   张三        修改密码            │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

### 5.4 仪表盘首页（Dashboard）

用于展示数据汇总和关键指标。

```
┌────────────────────────────────────────────────────┐
│  欢迎回来！admin                                  │
├─────────┬─────────┬─────────┬─────────┬─────────┬──┤
│总用户数 │今日新增│ 活跃用户│待处理项 │ 任务完成│  │
│  1,230 │  +12   │  892    │  35     │  93.2% │  │
│  ↑8%   │  ↑3    │  ↓2%    │  ↑5     │  ↑1.2% │  │
└─────────┴─────────┴─────────┴─────────┴─────────┴──┘

┌───────────────────────────┐ ┌───────────────────────┐
│  近7日趋势                │ │  各部门数据占比       │
│                           │ │                       │
│                           │ │                       │
└───────────────────────────┘ └───────────────────────┘

┌────────────────────────────────────────────────────┐
│  待处理事项                                       │
│  • 您有 5 条审批待处理              [去处理 →]    │
│  • 您有 3 条任务即将到期            [查看 →]    │
└────────────────────────────────────────────────────┘
```

---

## 四、通用组件规范

### 6.1 表格（Table）

| 属性 | 规范 |
|------|------|
| 斑马纹 | 开启，#fafafa / #ffffff 交替 |
| 边框 | 单元格横向边框，竖向边框去除 |
| 表头背景 | #f5f7fa，字重 600 |
| 行高 | 固定 48px |
| 选中行 | 浅主色背景填充 |
| 排序 | 表头点击排序，支持升序/降序 |
| 分页 | 底部右对齐，每页 10/20/50 条 |
| 加载态 | 骨架屏（Skeleton） |
| 空状态 | 插画 + 文案说明 |

### 6.2 按钮（Button）

| 类型 | 用途 | 样式 |
|------|------|------|
| 主按钮 | 主要操作（保存、提交、查询） | 主色背景，白字 |
| 默认按钮 | 次要操作（取消、返回） | 白色背景，主色边框 |
| 文字按钮 | 辅助操作（更多、操作列） | 无边框，主色文字 |
| 危险按钮 | 删除等不可逆操作 | 红色系 |

**尺寸规范：** 高度 32px（小）/ 36px（默认）/ 40px（大）

### 6.3 表单（Form）

- 标签居右，表单域左对齐
- 必填项标签前加红色星号 `*`
- 输入框高度：36px，圆角 4px
- 多行文本：resize 禁用手动拉伸
- 错误提示：红色文字 + 红色边框

### 6.4 卡片（Card）

- 背景：#ffffff
- 圆角：8px
- 阴影：hover 时增强（0 4px 12px rgba(0,0,0,0.12)）
- 内边距：20px

### 6.5 弹窗（Dialog）

- 圆角：8px
- 遮罩层：rgba(0,0,0,0.4)
- 宽度：480px（小）/ 720px（中）/ 960px（大）
- 底部按钮：右对齐

### 6.6 消息提示（Message）

| 类型 | 颜色 | 用途 |
|------|------|------|
| success | #62d828 | 操作成功 |
| warning | #ecba30 | 警告提示 |
| error | #e73939 | 错误提示 |
| info | #909399 | 一般提示 |

---

## 五、响应式断点

| 断点 | 宽度 | 适配 |
|------|------|------|
| 超大屏 | ≥1920px | 4列指标卡片 |
| 大屏 | 1366px ~ 1919px | 3列指标卡片 |
| 中屏 | 992px ~ 1365px | 2列指标卡片，侧边栏可折叠 |
| 小屏 | <992px | 1列指标卡片，侧边栏默认收起 |

---

## 六、页面结构模板代码

以下为基础 Vue 3 + Element Plus 的通用页面模板：

```vue
<template>
  <el-container class="layout-container">
    <!-- 顶部导航 -->
    <el-header class="topbar">
      <div class="topbar-left">
        <span class="logo-text">MySystem</span>
        <span class="system-title">企业管理平台</span>
      </div>
      <div class="topbar-right">
        <el-badge :value="3" class="notification-badge">
          <el-icon :size="18"><Bell /></el-icon>
        </el-badge>
        <el-dropdown>
          <el-avatar size="small" class="user-avatar">管</el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
        <el-menu :collapse="isCollapse" :default-active="activeMenu">
          <el-menu-item index="1" @click="goPage('/')">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="2-1" @click="goPage('/users')">用户管理</el-menu-item>
            <el-menu-item index="2-2" @click="goPage('/roles')">角色管理</el-menu-item>
          </el-sub-menu>
        </el-menu>
        <div class="collapse-btn" @click="isCollapse = !isCollapse">
          <el-icon><DArrowLeft v-if="!isCollapse" /><DArrowRight v-else /></el-icon>
        </div>
      </el-aside>

      <!-- 主内容 -->
      <el-main class="content">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 页面内容 -->
        <div class="page-header">
          <h2 class="page-title">用户管理</h2>
          <div class="page-actions">
            <el-button type="primary" @click="handleAdd">新建</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>

        <!-- 搜索区 -->
        <el-card class="search-card">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable />
            </el-form-item>
            <el-form-item label="部门">
              <el-select v-model="searchForm.dept" placeholder="请选择" clearable>
                <el-option label="销售部" value="sales" />
                <el-option label="技术部" value="tech" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 表格区 -->
        <el-card class="table-card">
          <el-table :data="tableData" stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="用户名" />
            <el-table-column prop="dept" label="部门" />
            <el-table-column prop="position" label="职位" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status === '启用' ? 'success' : 'info'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            :current-page="pagination.page"
            :page-size="pagination.size"
            :total="pagination.total"
            layout="total, prev, pager, next"
            @current-change="handlePageChange"
          />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container { height: 100vh; }
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  background: #1e1e1e; color: #fff; padding: 0 20px;
}
.topbar-left { display: flex; align-items: center; gap: 12px; }
.logo-text { font-size: 20px; font-weight: 700; color: #409EFF; }
.system-title { font-size: 14px; }
.topbar-right { display: flex; align-items: center; gap: 16px; color: #fff; }
.notification-badge { cursor: pointer; }
.user-avatar { cursor: pointer; background: #409EFF; }

.sidebar { position: relative; transition: width 0.3s; background: #fff; }
.collapse-btn {
  position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
  cursor: pointer; color: #909399;
}

.content { background: #f0f2f5; padding: 20px; overflow-y: auto; }
.breadcrumb { margin-bottom: 16px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.page-title { font-size: 18px; font-weight: 600; color: #303133; margin: 0; }
.page-actions { display: flex; gap: 8px; }

.search-card { margin-bottom: 16px; }
.table-card { }
.pagination { margin-top: 16px; justify-content: flex-end; }
</style>
```

---

## 七、命名与代码规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面命名 | PascalCase | `UserList.vue`、`UserDetail.vue` |
| 组件命名 | PascalCase | `DataTable.vue`、`SearchForm.vue` |
| 方法命名 | camelCase，动词优先 | `handleAdd`、`handleSearch`、`handleDelete` |
| 变量命名 | camelCase，名词优先 | `tableData`、`searchForm`、`pagination` |
| 常量命名 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE`、`DEFAULT_STATUS` |
| CSS类名 | kebab-case | `.page-header`、`.search-card` |

---

## 八、设计原则总结

1. **一致性** — 全系统统一的色彩、字体、间距、阴影
2. **效率优先** — 常用操作一步触达，减少点击次数
3. **可扫性** — 重要信息一眼可见，不需要用户"找"
4. **操作可逆** — 删除等危险操作需二次确认
5. **加载友好** — 骨架屏优于白屏，错误提示明确
6. **留白合理** — 避免页面过于拥挤

---

*设计框架版本：v1.0*
*适用系统类型：常规企业级 B/S 应用*
*推荐技术栈：Vue 3 + Element Plus*