import { MOCK_ENTERPRISES } from '@/data/mock';
import { collectLeafCodes, type PermissionNode } from '@/data/permissions';
import type { RoleKey } from '@/auth/AuthContext';

export interface RoleDraft {
  name: string;
  code: string;
  enterprise: string;
  status: 'enabled' | 'disabled';
}

export const EMPTY_ROLE_DRAFT: RoleDraft = {
  name: '',
  code: '',
  enterprise: MOCK_ENTERPRISES[1]?.name ?? '',
  status: 'enabled',
};

export const KNOWN_ROLE_KEYS: RoleKey[] = [
  'user',
  'department_admin',
  'enterprise_admin',
  'super_admin',
  'ops',
];

export const ALL_LEAFS = collectLeafCodes();

export function expandPermissions(perms: string[]): string[] {
  if (perms.includes('*')) return ALL_LEAFS;
  return perms;
}

export function matchSearch(node: PermissionNode, kw: string): boolean {
  if (!kw) return true;
  if (node.label.includes(kw) || node.code.includes(kw)) return true;
  return !!node.children?.some((c) => matchSearch(c, kw));
}
