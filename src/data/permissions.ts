export interface PermissionNode {
  code: string;
  label: string;
  children?: PermissionNode[];
}

export const PERMISSION_TREE: PermissionNode[] = [
  {
    code: 'app',
    label: '应用中心',
    children: [
      {
        code: 'app:center',
        label: '应用列表',
        children: [
          { code: 'app:center:view', label: '查看' },
          { code: 'app:center:access', label: '访问' },
        ],
      },
      {
        code: 'app:manage',
        label: '应用管理',
        children: [
          { code: 'app:manage:view', label: '查看' },
          { code: 'app:manage:create', label: '新增应用' },
          { code: 'app:manage:edit', label: '编辑（描述/跳转网址等）' },
          { code: 'app:manage:delete', label: '删除应用' },
          { code: 'app:manage:assign_user', label: '为应用授权用户' },
        ],
      },
    ],
  },
  {
    code: 'perm',
    label: '权限管理',
    children: [
      {
        code: 'user:manage',
        label: '用户管理',
        children: [
          { code: 'user:manage:view', label: '查看' },
          { code: 'user:manage:create', label: '新增' },
          { code: 'user:manage:edit', label: '编辑' },
          { code: 'user:manage:delete', label: '删除' },
          { code: 'user:manage:reset_password', label: '重置密码' },
        ],
      },
      {
        code: 'role:manage',
        label: '角色管理',
        children: [
          { code: 'role:manage:view', label: '查看' },
          { code: 'role:manage:create', label: '新增' },
          { code: 'role:manage:edit', label: '编辑' },
          { code: 'role:manage:delete', label: '删除' },
          { code: 'role:manage:assign_permission', label: '分配权限' },
          { code: 'role:manage:disable', label: '停用角色' },
        ],
      },
      {
        code: 'org:enterprise',
        label: '企业管理',
        children: [
          { code: 'org:enterprise:view', label: '查看' },
          { code: 'org:enterprise:create', label: '新增' },
          { code: 'org:enterprise:edit', label: '编辑' },
          { code: 'org:enterprise:delete', label: '删除' },
        ],
      },
      {
        code: 'org:department',
        label: '部门管理',
        children: [
          { code: 'org:department:view', label: '查看' },
          { code: 'org:department:create', label: '新增' },
          { code: 'org:department:edit', label: '编辑' },
          { code: 'org:department:delete', label: '删除' },
        ],
      },
    ],
  },
  {
    code: 'monitor',
    label: '系统监控与运维',
    children: [
      {
        code: 'monitor:overview',
        label: '监控总览',
        children: [
          { code: 'monitor:overview:view', label: '查看' },
          { code: 'monitor:overview:app_usage', label: '查看应用使用次数' },
          { code: 'monitor:overview:user_activity', label: '查看用户活跃度' },
        ],
      },
    ],
  },
];

/** 收集所有叶子节点 code（用于全选） */
export function collectLeafCodes(nodes: PermissionNode[] = PERMISSION_TREE): string[] {
  const out: string[] = [];
  const walk = (n: PermissionNode) => {
    if (!n.children?.length) out.push(n.code);
    else n.children.forEach(walk);
  };
  nodes.forEach(walk);
  return out;
}

/** 收集某节点及其所有后代叶子 code */
export function collectDescendantLeafs(node: PermissionNode): string[] {
  const out: string[] = [];
  const walk = (n: PermissionNode) => {
    if (!n.children?.length) out.push(n.code);
    else n.children.forEach(walk);
  };
  walk(node);
  return out;
}

/** 冲突规则定义 */
export interface ConflictRule {
  name: string;
  reason: string;
  suggestion: string;
  /** 返回 true 表示当前选择命中此冲突 */
  match: (selected: Set<string>) => boolean;
}

export const CONFLICT_RULES: ConflictRule[] = [
  {
    name: '删除用户与仅查看用户互斥',
    reason: '操作权限与只读权限互斥，不能同时持有删除与无编辑权限。',
    suggestion: '请移除"删除用户"，或同时勾选"编辑用户"以确认完整操作权限。',
    match: (s) =>
      s.has('user:manage:delete') && !s.has('user:manage:edit'),
  },
  {
    name: '导出日志缺少查看权限',
    reason: '导出操作依赖查看权限作为前置。',
    suggestion: '请先勾选"系统日志-查看"。',
    match: (s) =>
      s.has('monitor:log:export') && !s.has('monitor:log:view'),
  },
  {
    name: '配额导出缺少查看权限',
    reason: '导出操作依赖查看权限作为前置。',
    suggestion: '请先勾选"配额日志-查看"。',
    match: (s) =>
      s.has('quota:log:export') && !s.has('quota:log:view'),
  },
];
