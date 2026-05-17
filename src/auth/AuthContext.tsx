import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type RoleKey = 'user' | 'department_admin' | 'enterprise_admin' | 'super_admin' | 'ops';

export interface SessionUser {
  userId: string;
  username: string;
  displayName: string;
  email: string;
  enterprise: string;
  department: string;
  roles: RoleKey[];
  avatar?: string;
}

export interface AuthContextValue {
  user: SessionUser | null;
  isLoggedIn: boolean;
  login: (user: SessionUser) => void;
  logout: () => void;
  hasAnyRole: (roles: RoleKey[]) => boolean;
  hasPermission: (code: string) => boolean;
  /** 当前生效的角色权限（含动态下放） */
  rolePermissions: Record<string, string[]>;
  /** 由管理员保存角色权限或下放权限时调用，立即生效 */
  setRolePermissions: (roleCode: string, permissions: string[]) => void;
}

const STORAGE_KEY = 'aap.session';
const PERM_OVERRIDE_KEY = 'aap.rolePermissions';

const DEMO_USER: SessionUser = {
  userId: 'u-admin1',
  username: 'admin1',
  displayName: '超级管理员',
  email: 'admin1@platform.local',
  enterprise: '平台',
  department: '平台运营组',
  roles: ['super_admin'],
};

/** 基础角色权限矩阵；可被 rolePermissions 覆盖层"追加"权限 */
const PERMISSION_MATRIX: Record<RoleKey, string[]> = {
  user: ['app:center:view', 'app:center:access'],
  department_admin: ['app:center:view', 'app:center:access'],
  enterprise_admin: [
    'app:center:view',
    'app:center:access',
    'user:manage:view',
    'user:manage:create',
    'user:manage:edit',
    'user:manage:delete',
    'role:manage:view',
    'role:manage:assign_permission',
  ],
  super_admin: ['*'],
  ops: [
    'monitor:overview:view',
    'monitor:overview:app_usage',
    'monitor:overview:user_activity',
  ],
};

const AuthContext = createContext<AuthContextValue | null>(null);

function loadOverrides(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(PERM_OVERRIDE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
  } catch {
    return {};
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  });

  const [rolePermissions, setRolePermissionsState] = useState<Record<string, string[]>>(
    () => loadOverrides(),
  );

  const value = useMemo<AuthContextValue>(() => {
    const login = (u: SessionUser) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
    };
    const logout = () => {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    };
    const hasAnyRole = (roles: RoleKey[]) =>
      !!user && roles.some((r) => user.roles.includes(r));

    const setRolePermissions = (roleCode: string, permissions: string[]) => {
      const next = { ...rolePermissions, [roleCode]: permissions };
      setRolePermissionsState(next);
      try {
        localStorage.setItem(PERM_OVERRIDE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    };

    const hasPermission = (code: string) => {
      if (!user) return false;
      const collected = new Set<string>();
      user.roles.forEach((r) => {
        // 1) 矩阵基础权限
        (PERMISSION_MATRIX[r] ?? []).forEach((c) => collected.add(c));
        // 2) 该角色的动态覆盖（来自角色管理/权限下放）
        (rolePermissions[r] ?? []).forEach((c) => collected.add(c));
      });
      if (collected.has('*')) return true;
      return collected.has(code);
    };

    return {
      user,
      isLoggedIn: !!user,
      login,
      logout,
      hasAnyRole,
      hasPermission,
      rolePermissions,
      setRolePermissions,
    };
  }, [user, rolePermissions]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用');
  return ctx;
}

export const DEMO_LOGIN_USER = DEMO_USER;

/** roleName（中文）→ RoleKey 映射，供登录页和管理页共用 */
export const ROLE_NAME_TO_KEY: Record<string, RoleKey> = {
  超级管理员: 'super_admin',
  企业管理员: 'enterprise_admin',
  部门管理员: 'department_admin',
  运维人员: 'ops',
  普通用户: 'user',
};
