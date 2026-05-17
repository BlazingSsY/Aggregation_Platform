export interface Enterprise {
  id: string;
  name: string;
  code: string;
  description: string;
  contact: string;
  status: 'enabled' | 'disabled';
  createdAt: string;
}

export interface Department {
  id: string;
  enterpriseId: string;
  parentId: string | null;
  name: string;
  code: string;
  head: string;
  status: 'enabled' | 'disabled';
}

/** 平台已纳管的企业（结构化数据，由组织管理页维护） */
export const MOCK_ENTERPRISES: Enterprise[] = [
  {
    id: 'ent-platform',
    name: '平台',
    code: 'platform',
    description: '平台运营方，承担超级管理员职责',
    contact: 'admin@platform.local',
    status: 'enabled',
    createdAt: '2026-01-01',
  },
  {
    id: 'ent-zy',
    name: '智研航空',
    code: 'zy_aviation',
    description: '航空研发型企业，覆盖研发、硬件、产品全链路',
    contact: 'contact@zy-aviation.cn',
    status: 'enabled',
    createdAt: '2026-03-15',
  },
  {
    id: 'ent-yx',
    name: '云翔工业',
    code: 'yx_industry',
    description: '工业制造企业',
    contact: 'hi@yx-industry.cn',
    status: 'enabled',
    createdAt: '2026-04-10',
  },
  {
    id: 'ent-hx',
    name: '航星智造',
    code: 'hx_smart',
    description: '智能装备研发与制造',
    contact: 'ops@hx-smart.cn',
    status: 'enabled',
    createdAt: '2026-04-22',
  },
];

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'dept-platform-ops',
    enterpriseId: 'ent-platform',
    parentId: null,
    name: '平台运营组',
    code: 'platform_ops',
    head: 'admin1',
    status: 'enabled',
  },
  {
    id: 'dept-zy-mgmt',
    enterpriseId: 'ent-zy',
    parentId: null,
    name: '管理中心',
    code: 'zy_mgmt',
    head: 'admin2',
    status: 'enabled',
  },
  {
    id: 'dept-zy-rd',
    enterpriseId: 'ent-zy',
    parentId: null,
    name: '研发中心',
    code: 'zy_rd',
    head: 'admin3',
    status: 'enabled',
  },
  {
    id: 'dept-zy-hw',
    enterpriseId: 'ent-zy',
    parentId: null,
    name: '硬件设计部',
    code: 'zy_hw',
    head: 'user2',
    status: 'enabled',
  },
  {
    id: 'dept-zy-prod',
    enterpriseId: 'ent-zy',
    parentId: null,
    name: '产品中心',
    code: 'zy_prod',
    head: 'user3',
    status: 'enabled',
  },
];

export interface RoleRow {
  id: string;
  name: string;
  code: string;
  enterprise: string;
  userCount: number;
  status: 'enabled' | 'disabled';
  createdBy: string;
  updatedAt: string;
  builtin?: boolean;
  permissions: string[];
}

export const MOCK_ROLES: RoleRow[] = [
  {
    id: 'r-super',
    name: '超级管理员',
    code: 'super_admin',
    enterprise: '平台',
    userCount: 1,
    status: 'enabled',
    createdBy: 'system',
    updatedAt: '2026-04-22 10:21',
    builtin: true,
    permissions: ['*'],
  },
  {
    id: 'r-ent',
    name: '企业管理员',
    code: 'enterprise_admin',
    enterprise: '智研航空',
    userCount: 2,
    status: 'enabled',
    createdBy: 'admin1',
    updatedAt: '2026-05-08 16:04',
    permissions: [
      'app:center:view',
      'app:center:access',
      'user:manage:view',
      'user:manage:create',
      'user:manage:edit',
      'role:manage:view',
      'role:manage:assign_permission',
      'quota:config:view',
      'quota:config:update',
      'monitor:log:view',
    ],
  },
  {
    id: 'r-dept',
    name: '部门管理员',
    code: 'department_admin',
    enterprise: '智研航空',
    userCount: 1,
    status: 'enabled',
    createdBy: 'admin1',
    updatedAt: '2026-05-09 09:32',
    permissions: ['app:center:view', 'app:center:access', 'quota:config:view'],
  },
  {
    id: 'r-ops',
    name: '运维人员',
    code: 'ops',
    enterprise: '平台',
    userCount: 0,
    status: 'enabled',
    createdBy: 'system',
    updatedAt: '2026-04-30 19:11',
    permissions: ['monitor:overview:view', 'monitor:log:view', 'monitor:log:export'],
  },
  {
    id: 'r-user',
    name: '普通用户',
    code: 'user',
    enterprise: '智研航空',
    userCount: 3,
    status: 'enabled',
    createdBy: 'system',
    updatedAt: '2026-04-01 08:00',
    permissions: ['app:center:view', 'app:center:access'],
  },
];

export interface PermAuditEvent {
  time: string;
  actor: string;
  target: string;
  type: 'add' | 'remove' | 'modify';
  detail: string;
  reason: string;
  result: 'success' | 'failed' | 'partial';
}

/** 权限审计：默认空，由真实操作写入 */
export const MOCK_PERM_AUDIT: PermAuditEvent[] = [];

export interface UserRow {
  id: string;
  username: string;
  displayName: string;
  email: string;
  enterprise: string;
  department: string;
  roleName: string;
  status: 'enabled' | 'disabled';
  lastLoginAt: string;
  /** Demo 用明文密码，仅供超级管理员查看与重置；生产环境必须哈希存储 */
  password: string;
}

/** 系统统一初始密码：用于新用户创建与「重置密码」操作 */
export const DEFAULT_PASSWORD = 'Avic@12345678';

export const MOCK_USERS: UserRow[] = [
  {
    id: 'u-admin1',
    username: 'admin1',
    displayName: 'admin1',
    email: 'admin1@platform.local',
    enterprise: '平台',
    department: '平台运营组',
    roleName: '超级管理员',
    status: 'enabled',
    lastLoginAt: '—',
    password: DEFAULT_PASSWORD,
  },
  {
    id: 'u-admin2',
    username: 'admin2',
    displayName: 'admin2',
    email: 'admin2@zy-aviation.cn',
    enterprise: '智研航空',
    department: '管理中心',
    roleName: '企业管理员',
    status: 'enabled',
    lastLoginAt: '—',
    password: DEFAULT_PASSWORD,
  },
  {
    id: 'u-admin3',
    username: 'admin3',
    displayName: 'admin3',
    email: 'admin3@zy-aviation.cn',
    enterprise: '智研航空',
    department: '研发中心',
    roleName: '部门管理员',
    status: 'enabled',
    lastLoginAt: '—',
    password: DEFAULT_PASSWORD,
  },
  {
    id: 'u-user1',
    username: 'user1',
    displayName: 'user1',
    email: 'user1@zy-aviation.cn',
    enterprise: '智研航空',
    department: '研发中心',
    roleName: '普通用户',
    status: 'enabled',
    lastLoginAt: '—',
    password: DEFAULT_PASSWORD,
  },
  {
    id: 'u-user2',
    username: 'user2',
    displayName: 'user2',
    email: 'user2@zy-aviation.cn',
    enterprise: '智研航空',
    department: '硬件设计部',
    roleName: '普通用户',
    status: 'enabled',
    lastLoginAt: '—',
    password: DEFAULT_PASSWORD,
  },
  {
    id: 'u-user3',
    username: 'user3',
    displayName: 'user3',
    email: 'user3@zy-aviation.cn',
    enterprise: '智研航空',
    department: '产品中心',
    roleName: '普通用户',
    status: 'enabled',
    lastLoginAt: '—',
    password: DEFAULT_PASSWORD,
  },
];

/** 应用使用次数：待真实埋点接入后填充 */
export interface AppUsageRow {
  appId: string;
  appName: string;
  callCount: number;
  uniqueUsers: number;
  lastUsedAt: string;
}

export const MOCK_APP_USAGE: AppUsageRow[] = [];

/** 用户活跃度：待真实活跃统计接入后填充 */
export interface UserActivityRow {
  userId: string;
  username: string;
  displayName: string;
  enterprise: string;
  loginCount: number;
  appUsedCount: number;
  lastActiveAt: string;
}

export const MOCK_USER_ACTIVITY: UserActivityRow[] = [];

/** 角色中文名集合，用于用户/角色管理的角色下拉 */
export const ROLE_NAME_OPTIONS = [
  '超级管理员',
  '企业管理员',
  '部门管理员',
  '运维人员',
  '普通用户',
];
