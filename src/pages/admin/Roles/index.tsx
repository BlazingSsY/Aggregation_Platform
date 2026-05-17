import { useMemo, useState } from 'react';
import { Box, Button, Snackbar, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import { MOCK_ENTERPRISES, MOCK_PERM_AUDIT, MOCK_ROLES, type RoleRow } from '@/data/mock';
import { useAuth } from '@/auth/AuthContext';
import { usePersistedState } from '@/data/store';
import RoleFormDialog from './RoleFormDialog';
import RoleEditDialog, { type RoleEditSavePayload } from './RoleEditDialog';
import RolesTable from './RolesTable';
import AuditTimelineDialog from './AuditTimelineDialog';
import { EMPTY_ROLE_DRAFT, KNOWN_ROLE_KEYS, type RoleDraft } from './types';

export default function RolesPage() {
  const { hasAnyRole, setRolePermissions } = useAuth();
  const isSuperAdmin = hasAnyRole(['super_admin']);

  const [roles, setRoles] = usePersistedState<RoleRow[]>('roles', MOCK_ROLES);
  const [enterprisesStore] = usePersistedState('enterprises', MOCK_ENTERPRISES);
  const enterpriseOptionsList = useMemo(
    () => enterprisesStore.map((e) => e.name),
    [enterprisesStore],
  );
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [enterpriseFilter, setEnterpriseFilter] = useState('all');
  const [activeId, setActiveId] = useState<string>(roles[0].id);
  const [toast, setToast] = useState<string | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null);
  const [auditLog, setAuditLog] = useState(MOCK_PERM_AUDIT);

  const enterpriseOptions = useMemo(
    () => Array.from(new Set(roles.map((r) => r.enterprise))),
    [roles],
  );

  const visibleRoles = useMemo(
    () =>
      roles.filter((r) => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (enterpriseFilter !== 'all' && r.enterprise !== enterpriseFilter) return false;
        if (search && !r.name.includes(search) && !r.code.includes(search)) return false;
        return true;
      }),
    [roles, search, statusFilter, enterpriseFilter],
  );

  const handleRoleEditSave = ({
    role,
    draft,
    nextPerms,
    added,
    removed,
    metaChanged,
  }: RoleEditSavePayload) => {
    const permsChanged = added.length > 0 || removed.length > 0;
    setRoles((prev) =>
      prev.map((r) =>
        r.id === role.id
          ? {
              ...r,
              name: draft.name,
              enterprise: draft.enterprise,
              status: draft.status,
              permissions: nextPerms,
              updatedAt: '刚刚',
            }
          : r,
      ),
    );
    if (permsChanged && (KNOWN_ROLE_KEYS as string[]).includes(role.code)) {
      setRolePermissions(role.code, nextPerms);
    }
    if (permsChanged) {
      setAuditLog((prev) => [
        {
          time: new Date().toISOString().replace('T', ' ').slice(0, 16),
          actor: '当前用户',
          target: draft.name,
          type: 'modify',
          detail: `新增 ${added.length} 项 / 移除 ${removed.length} 项`,
          reason: '后台管理员调整',
          result: 'success',
        },
        ...prev,
      ]);
    }
    setEditingRole(null);
    if (permsChanged) setToast('权限已保存并实时生效');
    else if (metaChanged) setToast(`已保存角色 ${draft.name}`);
  };

  const createRole = (draft: RoleDraft) => {
    const id = `r-${Date.now()}`;
    const newRole: RoleRow = {
      id,
      name: draft.name,
      code: draft.code,
      enterprise: draft.enterprise,
      status: draft.status,
      permissions: [],
      userCount: 0,
      createdBy: '当前用户',
      updatedAt: '刚刚',
    };
    setRoles((prev) => [...prev, newRole]);
    setCreatingRole(false);
    setToast(`已创建角色 ${draft.name}`);
  };

  const toggleStatus = (id: string, status: 'enabled' | 'disabled') => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const copyRole = (row: RoleRow) => {
    const id = `r-copy-${Date.now()}`;
    setRoles((prev) => [
      ...prev,
      { ...row, id, name: `${row.name} 副本`, code: `${row.code}_copy`, builtin: false, userCount: 0 },
    ]);
    setToast(`已复制角色：${row.name}`);
  };

  const deleteRole = (row: RoleRow) => {
    if (row.builtin) {
      setToast('系统内置角色不可删除');
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== row.id));
    if (row.id === activeId && roles.length > 1) {
      setActiveId(roles[0].id);
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            角色管理
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
            集中管理企业内角色、权限分配和权限变更审计
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => setAuditOpen(true)}>
            权限审计
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreatingRole(true)}>
            新建角色
          </Button>
        </Stack>
      </Stack>

      <RolesTable
        rows={visibleRoles}
        activeId={activeId}
        isSuperAdmin={isSuperAdmin}
        enterpriseOptions={enterpriseOptions}
        search={search}
        statusFilter={statusFilter}
        enterpriseFilter={enterpriseFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onEnterpriseFilterChange={setEnterpriseFilter}
        onSelect={(id) => {
          setActiveId(id);
          const row = roles.find((r) => r.id === id);
          if (row) setEditingRole(row);
        }}
        onEdit={(row) => {
          setActiveId(row.id);
          setEditingRole(row);
        }}
        onCopy={copyRole}
        onDelete={deleteRole}
        onToggleStatus={toggleStatus}
      />

      <RoleEditDialog
        open={!!editingRole}
        role={editingRole}
        isSuperAdmin={isSuperAdmin}
        enterpriseOptions={enterpriseOptionsList}
        onClose={() => setEditingRole(null)}
        onSave={handleRoleEditSave}
      />

      <AuditTimelineDialog
        open={auditOpen}
        log={auditLog}
        onClose={() => setAuditOpen(false)}
      />

      <RoleFormDialog
        open={creatingRole}
        mode="create"
        initial={EMPTY_ROLE_DRAFT}
        isSuperAdmin={isSuperAdmin}
        isBuiltin={false}
        existingCodes={roles.map((r) => r.code)}
        enterpriseOptions={enterpriseOptionsList}
        onClose={() => setCreatingRole(false)}
        onSubmit={createRole}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={2400}
        onClose={() => setToast(null)}
        message={toast ?? ''}
      />
    </Box>
  );
}
