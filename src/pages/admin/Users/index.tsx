import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import KeyIcon from '@mui/icons-material/Key';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  DEFAULT_PASSWORD,
  MOCK_DEPARTMENTS,
  MOCK_ENTERPRISES,
  MOCK_USERS,
  ROLE_NAME_OPTIONS,
  type UserRow,
} from '@/data/mock';
import { useAuth, type RoleKey } from '@/auth/AuthContext';
import { usePersistedState } from '@/data/store';

/** 角色等级（用于决定操作者能否管理目标用户）
 * 数值越大权限越高。运维人员不入主线层级，由超管单独管。
 */
const ROLE_RANK: Record<string, number> = {
  超级管理员: 100,
  企业管理员: 80,
  部门管理员: 60,
  运维人员: 50,
  普通用户: 20,
};

/** 当前角色可管理（编辑/删除/状态/重置密码/分配）的角色名集合
 * - 超管：全部
 * - 企业管理员：部门管理员、普通用户（不可管同级、不可管超管、不可管运维）
 * - 部门管理员：仅普通用户
 * - 其他角色：不可管理
 */
function canManageRoleName(actor: RoleKey | undefined, targetRoleName: string): boolean {
  if (!actor) return false;
  if (actor === 'super_admin') return true;
  if (targetRoleName === '运维人员') return false;
  const target = ROLE_RANK[targetRoleName] ?? 0;
  if (target === 0) return false;
  const maxManageable =
    actor === 'enterprise_admin'
      ? 60 // 严格低于 80 → 上限部门管理员 60
      : actor === 'department_admin'
        ? 20 // 严格低于 60 → 上限普通用户 20
        : 0;
  return target <= maxManageable;
}

interface UserDraft {
  username: string;
  displayName: string;
  email: string;
  enterprise: string;
  department: string;
  roleName: string;
  status: 'enabled' | 'disabled';
  password: string;
}

const EMPTY_DRAFT: UserDraft = {
  username: '',
  displayName: '',
  email: '',
  enterprise: '',
  department: '',
  roleName: '普通用户',
  status: 'enabled',
  password: DEFAULT_PASSWORD,
};

function UserFormDialog({
  open,
  mode,
  initial,
  isSuperAdmin,
  enterpriseLocked,
  departmentLocked,
  allowedRoles,
  enterpriseOptions,
  departmentOptionsFor,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  initial: UserDraft;
  isSuperAdmin: boolean;
  /** 当前操作者无权改企业时锁定 */
  enterpriseLocked: boolean;
  /** 部门管理员场景下连同部门一起锁定 */
  departmentLocked: boolean;
  /** 当前操作者允许分配的角色集合 */
  allowedRoles: string[];
  enterpriseOptions: string[];
  departmentOptionsFor: (enterpriseName: string) => string[];
  onClose: () => void;
  onSubmit: (draft: UserDraft) => void;
}) {
  const [draft, setDraft] = useState<UserDraft>(initial);
  const [error, setError] = useState<string | null>(null);

  // 当 dialog 打开时同步 initial
  const lastInitialKey = useMemo(
    () => `${initial.username}|${open}|${mode}`,
    [initial.username, open, mode],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    if (open) {
      setDraft(initial);
      setError(null);
    }
  }, [lastInitialKey]);

  const submit = () => {
    if (!draft.username.trim() || !draft.displayName.trim()) {
      setError('账号与显示名为必填');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      setError('请输入有效邮箱');
      return;
    }
    onSubmit(draft);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {mode === 'create' ? '新增用户' : '编辑用户'}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography sx={{ color: 'error.main', fontSize: 13, mb: 1 }}>{error}</Typography>
        )}
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              label="账号"
              value={draft.username}
              onChange={(e) => setDraft((s) => ({ ...s, username: e.target.value }))}
              disabled={mode === 'edit'}
              helperText={mode === 'edit' ? '账号创建后不可修改' : '建议使用英文 / 数字'}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="显示名"
              value={draft.displayName}
              onChange={(e) => setDraft((s) => ({ ...s, displayName: e.target.value }))}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="邮箱"
              value={draft.email}
              onChange={(e) => setDraft((s) => ({ ...s, email: e.target.value }))}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              select
              label="所属企业"
              value={draft.enterprise}
              onChange={(e) =>
                setDraft((s) => ({ ...s, enterprise: e.target.value, department: '' }))
              }
              disabled={enterpriseLocked}
              helperText={
                enterpriseLocked
                  ? '您仅可管理所属企业的用户，不可跨企业'
                  : '超级管理员可跨企业调整'
              }
              slotProps={{
                input: {
                  endAdornment: enterpriseLocked ? (
                    <InputAdornment position="end">
                      <LockIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    </InputAdornment>
                  ) : undefined,
                },
              }}
            >
              {enterpriseOptions.map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={6}>
            <TextField
              select
              label="部门"
              value={draft.department}
              onChange={(e) => setDraft((s) => ({ ...s, department: e.target.value }))}
              disabled={departmentLocked}
              helperText={
                departmentLocked
                  ? '您仅可管理所属部门的用户'
                  : departmentOptionsFor(draft.enterprise).length === 0
                    ? '当前企业暂无部门，请先在「组织管理」中创建'
                    : '可选部门来自所选企业'
              }
              slotProps={{
                input: {
                  endAdornment: departmentLocked ? (
                    <InputAdornment position="end">
                      <LockIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    </InputAdornment>
                  ) : undefined,
                },
              }}
            >
              {departmentOptionsFor(draft.enterprise).length === 0 ? (
                <MenuItem value="" disabled>
                  暂无可选部门
                </MenuItem>
              ) : (
                departmentOptionsFor(draft.enterprise).map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>
          <Grid size={6}>
            <TextField
              select
              label="角色"
              value={draft.roleName}
              onChange={(e) => setDraft((s) => ({ ...s, roleName: e.target.value }))}
            >
              {ROLE_NAME_OPTIONS.map((r) => {
                const disabled = !allowedRoles.includes(r);
                return (
                  <MenuItem key={r} value={r} disabled={disabled}>
                    {r}
                    {disabled && '（无分配权限）'}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid size={6}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
              <Switch
                checked={draft.status === 'enabled'}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, status: e.target.checked ? 'enabled' : 'disabled' }))
                }
              />
              <Typography sx={{ fontSize: 13 }}>
                {draft.status === 'enabled' ? '已启用' : '已禁用'}
              </Typography>
            </Stack>
          </Grid>
          {isSuperAdmin && (
            <Grid size={12}>
              <TextField
                label="密码"
                value={draft.password}
                onChange={(e) => setDraft((s) => ({ ...s, password: e.target.value }))}
                helperText={`超级管理员可直接修改用户密码；初始密码：${DEFAULT_PASSWORD}`}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="重置为初始密码">
                          <IconButton
                            size="small"
                            onClick={() =>
                              setDraft((s) => ({ ...s, password: DEFAULT_PASSWORD }))
                            }
                          >
                            <RestartAltIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button variant="contained" onClick={submit}>
          {mode === 'create' ? '创建' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UsersPage() {
  const { hasAnyRole, user: currentUser } = useAuth();
  const isSuperAdmin = hasAnyRole(['super_admin']);
  const isEnterpriseAdmin = !isSuperAdmin && hasAnyRole(['enterprise_admin']);
  const isDepartmentAdmin =
    !isSuperAdmin && !isEnterpriseAdmin && hasAnyRole(['department_admin']);

  /** 数据可见范围 */
  type Scope =
    | { kind: 'all' }
    | { kind: 'enterprise'; enterprise: string }
    | { kind: 'department'; enterprise: string; department: string }
    | { kind: 'none' };

  const scope: Scope = useMemo(() => {
    if (!currentUser) return { kind: 'none' };
    if (isSuperAdmin) return { kind: 'all' };
    if (isEnterpriseAdmin) return { kind: 'enterprise', enterprise: currentUser.enterprise };
    if (isDepartmentAdmin)
      return {
        kind: 'department',
        enterprise: currentUser.enterprise,
        department: currentUser.department,
      };
    return { kind: 'none' };
  }, [currentUser, isSuperAdmin, isEnterpriseAdmin, isDepartmentAdmin]);

  /** 当前角色可分配给他人的角色集合（基于 ROLE_RANK 严格层级） */
  const currentRoleKey: RoleKey | undefined = currentUser?.roles[0];
  const allowedRoles: string[] = useMemo(
    () => ROLE_NAME_OPTIONS.filter((r) => canManageRoleName(currentRoleKey, r)),
    [currentRoleKey],
  );

  /** 行级管理判定：操作者不能管理自己，不能管理同级或更高级的角色 */
  const canManageRow = (r: UserRow): boolean => {
    if (!currentUser) return false;
    if (r.id === currentUser.userId) return false;
    return canManageRoleName(currentRoleKey, r.roleName);
  };
  /** 自己也可编辑，但角色下拉仍受 allowedRoles 约束（无法提升自己） */
  const canEditRow = (r: UserRow): boolean =>
    !!currentUser && (r.id === currentUser.userId || canManageRow(r));
  /** 删除/禁用 永远不能针对自己 */
  const canDeleteRow = (r: UserRow): boolean =>
    !!currentUser && r.id !== currentUser.userId && canManageRow(r);
  const canToggleStatusOf = (r: UserRow): boolean => canDeleteRow(r);
  /** 重置密码：对自己始终允许，对他人按层级 */
  const canResetPwdOf = (r: UserRow): boolean =>
    !!currentUser && (r.id === currentUser.userId || canManageRow(r));

  const [rows, setRows] = usePersistedState<UserRow[]>('users', MOCK_USERS);
  const [enterprisesStore] = usePersistedState('enterprises', MOCK_ENTERPRISES);
  const [departmentsStore] = usePersistedState('departments', MOCK_DEPARTMENTS);

  const enterpriseOptions = useMemo(
    () => enterprisesStore.map((e) => e.name),
    [enterprisesStore],
  );
  const departmentOptionsFor = (enterpriseName: string) => {
    const ent = enterprisesStore.find((e) => e.name === enterpriseName);
    if (!ent) return [];
    return departmentsStore
      .filter((d) => d.enterpriseId === ent.id)
      .map((d) => d.name);
  };
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [enterpriseFilter, setEnterpriseFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [confirmReset, setConfirmReset] = useState<UserRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UserRow | null>(null);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [revealedPwds, setRevealedPwds] = useState<Set<string>>(new Set());

  const togglePwdReveal = (id: string) =>
    setRevealedPwds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const copyPwd = (pwd: string) => {
    navigator.clipboard?.writeText(pwd);
    setToast('密码已复制到剪贴板');
  };

  const departments = useMemo(
    () => Array.from(new Set(rows.map((r) => r.department))),
    [rows],
  );
  const enterprises = useMemo(
    () => Array.from(new Set(rows.map((r) => r.enterprise))),
    [rows],
  );

  /** 先按当前管理员角色的数据范围过滤，再按界面筛选条件二次过滤 */
  const scopedRows = useMemo(() => {
    if (scope.kind === 'all') return rows;
    if (scope.kind === 'enterprise')
      return rows.filter((r) => r.enterprise === scope.enterprise);
    if (scope.kind === 'department')
      return rows.filter(
        (r) => r.enterprise === scope.enterprise && r.department === scope.department,
      );
    return [];
  }, [rows, scope]);

  const filtered = useMemo(
    () =>
      scopedRows.filter((r) => {
        if (dept !== 'all' && r.department !== dept) return false;
        if (enterpriseFilter !== 'all' && r.enterprise !== enterpriseFilter) return false;
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (search) {
          const kw = search.toLowerCase();
          if (
            !r.displayName.toLowerCase().includes(kw) &&
            !r.username.toLowerCase().includes(kw) &&
            !r.email.toLowerCase().includes(kw)
          ) {
            return false;
          }
        }
        return true;
      }),
    [scopedRows, search, dept, statusFilter, enterpriseFilter],
  );

  const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const toggleStatus = (id: string, status: 'enabled' | 'disabled') => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const createUser = (draft: UserDraft) => {
    const id = `u-${Date.now()}`;
    setRows((prev) => [{ id, lastLoginAt: '—', ...draft }, ...prev]);
    setCreating(false);
    setToast(`已创建用户 ${draft.username}`);
  };

  const updateUser = (draft: UserDraft) => {
    if (!editing) return;
    setRows((prev) =>
      prev.map((r) => (r.id === editing.id ? { ...r, ...draft } : r)),
    );
    setEditing(null);
    setToast(`已保存用户 ${draft.username} 的变更`);
  };

  const deleteUser = (u: UserRow) => {
    setRows((prev) => prev.filter((r) => r.id !== u.id));
    setConfirmDelete(null);
    setToast(`已删除用户 ${u.username}`);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            用户管理
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
            管理企业用户、部门归属、角色绑定与账号状态
            {isSuperAdmin && ' · 超级管理员可跨企业调整用户所属'}
            {isEnterpriseAdmin &&
              currentUser &&
              ` · 仅可管理「${currentUser.enterprise}」企业内的用户`}
            {isDepartmentAdmin &&
              currentUser &&
              ` · 仅可管理「${currentUser.enterprise} · ${currentUser.department}」的用户`}
          </Typography>
        </Box>
        <Tooltip title={allowedRoles.length === 0 ? '当前角色无新增用户的权限' : ''}>
          <span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              disabled={allowedRoles.length === 0}
              onClick={() => setCreating(true)}
            >
              新增用户
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Card>
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
          <TextField
            placeholder="搜索姓名 / 账号 / 邮箱"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ maxWidth: 260 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          {isSuperAdmin && (
            <TextField
              select
              value={enterpriseFilter}
              onChange={(e) => {
                setEnterpriseFilter(e.target.value);
                setPage(0);
              }}
              sx={{ width: 160 }}
              label="所属企业"
            >
              <MenuItem value="all">全部企业</MenuItem>
              {enterprises.map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </TextField>
          )}
          {!isDepartmentAdmin && (
            <TextField
              select
              value={dept}
              onChange={(e) => {
                setDept(e.target.value);
                setPage(0);
              }}
              sx={{ width: 160 }}
              label="部门"
            >
              <MenuItem value="all">全部部门</MenuItem>
              {departments.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as never)}
            sx={{ width: 140 }}
            label="状态"
          >
            <MenuItem value="all">全部状态</MenuItem>
            <MenuItem value="enabled">启用</MenuItem>
            <MenuItem value="disabled">禁用</MenuItem>
          </TextField>
        </Toolbar>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>用户</TableCell>
                <TableCell>账号</TableCell>
                <TableCell>邮箱</TableCell>
                <TableCell>所属企业</TableCell>
                <TableCell>部门</TableCell>
                <TableCell>角色</TableCell>
                {isSuperAdmin && <TableCell>密码</TableCell>}
                <TableCell>状态</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: 12,
                          fontWeight: 700,
                          background: '#ffffff',
                          color: '#5e7288',
                          border: '1px solid #e5ebf2',
                        }}
                      >
                        {r.displayName.slice(0, 1).toUpperCase()}
                      </Avatar>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                        {r.displayName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {r.username}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{r.email}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={r.enterprise}
                      variant="outlined"
                      color={r.enterprise === '平台' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{r.department}</TableCell>
                  <TableCell>
                    <Chip size="small" label={r.roleName} color="info" variant="outlined" />
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell sx={{ minWidth: 200 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: 12,
                            color: revealedPwds.has(r.id) ? 'text.primary' : 'text.secondary',
                            letterSpacing: revealedPwds.has(r.id) ? 'normal' : 2,
                            minWidth: 100,
                          }}
                        >
                          {revealedPwds.has(r.id)
                            ? r.password ?? DEFAULT_PASSWORD
                            : '••••••••'}
                        </Typography>
                        <Tooltip title={revealedPwds.has(r.id) ? '隐藏' : '查看'}>
                          <IconButton size="small" onClick={() => togglePwdReveal(r.id)}>
                            {revealedPwds.has(r.id) ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="复制密码">
                          <IconButton
                            size="small"
                            onClick={() => copyPwd(r.password ?? DEFAULT_PASSWORD)}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  )}
                  <TableCell>
                    <Tooltip
                      title={
                        canToggleStatusOf(r)
                          ? ''
                          : r.id === currentUser?.userId
                            ? '不能停用自己'
                            : '无权管理该用户的状态'
                      }
                    >
                      <span>
                        <Switch
                          size="small"
                          checked={r.status === 'enabled'}
                          disabled={!canToggleStatusOf(r)}
                          onChange={(e) =>
                            toggleStatus(r.id, e.target.checked ? 'enabled' : 'disabled')
                          }
                        />
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={canEditRow(r) ? '编辑' : '无权编辑该用户'}>
                      <span>
                        <IconButton
                          size="small"
                          disabled={!canEditRow(r)}
                          onClick={() => setEditing(r)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip
                      title={canResetPwdOf(r) ? '重置密码' : '无权重置该用户密码'}
                    >
                      <span>
                        <IconButton
                          size="small"
                          disabled={!canResetPwdOf(r)}
                          onClick={() => setConfirmReset(r)}
                        >
                          <KeyIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip
                      title={
                        canDeleteRow(r)
                          ? '删除'
                          : r.id === currentUser?.userId
                            ? '不能删除自己'
                            : '无权删除该用户'
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={!canDeleteRow(r)}
                          onClick={() => setConfirmDelete(r)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={isSuperAdmin ? 9 : 8}
                    align="center"
                    sx={{ py: 5, color: 'text.secondary' }}
                  >
                    未找到匹配的用户
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage="每页"
        />
      </Card>

      <UserFormDialog
        open={creating}
        mode="create"
        initial={{
          ...EMPTY_DRAFT,
          enterprise:
            !isSuperAdmin && currentUser
              ? currentUser.enterprise
              : enterpriseOptions[0] ?? '',
          department: isDepartmentAdmin && currentUser
            ? currentUser.department
            : departmentOptionsFor(
                !isSuperAdmin && currentUser ? currentUser.enterprise : enterpriseOptions[0] ?? '',
              )[0] ?? '',
        }}
        isSuperAdmin={isSuperAdmin}
        enterpriseLocked={!isSuperAdmin}
        departmentLocked={isDepartmentAdmin}
        allowedRoles={allowedRoles}
        enterpriseOptions={enterpriseOptions}
        departmentOptionsFor={departmentOptionsFor}
        onClose={() => setCreating(false)}
        onSubmit={createUser}
      />

      <UserFormDialog
        open={!!editing}
        mode="edit"
        initial={
          editing
            ? {
                username: editing.username,
                displayName: editing.displayName,
                email: editing.email,
                enterprise: editing.enterprise,
                department: editing.department,
                roleName: editing.roleName,
                status: editing.status,
                password: editing.password ?? DEFAULT_PASSWORD,
              }
            : EMPTY_DRAFT
        }
        isSuperAdmin={isSuperAdmin}
        enterpriseLocked={!isSuperAdmin}
        departmentLocked={isDepartmentAdmin}
        allowedRoles={allowedRoles}
        enterpriseOptions={enterpriseOptions}
        departmentOptionsFor={departmentOptionsFor}
        onClose={() => setEditing(null)}
        onSubmit={updateUser}
      />

      <Dialog open={!!confirmReset} onClose={() => setConfirmReset(null)} maxWidth="xs" fullWidth>
        <DialogTitle>重置密码</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ mb: 1 }}>
            确认将用户 <strong>{confirmReset?.displayName}</strong> 的密码重置为初始密码？
          </Typography>
          <Box
            sx={{
              p: 1.5,
              bgcolor: '#ffffff',
              border: '1px solid #e5ebf2',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: 14,
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: 1,
              textAlign: 'center',
            }}
          >
            {DEFAULT_PASSWORD}
          </Box>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
            请告知用户首次登录后及时修改密码。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmReset(null)}>取消</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              const target = confirmReset!;
              setRows((prev) =>
                prev.map((r) =>
                  r.id === target.id ? { ...r, password: DEFAULT_PASSWORD } : r,
                ),
              );
              setRevealedPwds((prev) => {
                const next = new Set(prev);
                next.add(target.id);
                return next;
              });
              setToast(`已将 ${target.displayName} 的密码重置为 ${DEFAULT_PASSWORD}`);
              setConfirmReset(null);
            }}
          >
            确认重置
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>删除用户</DialogTitle>
        <DialogContent dividers>
          <Typography>
            确认删除用户 <strong>{confirmDelete?.displayName}</strong> ({confirmDelete?.username})？
            此操作不可撤销，对应账号将立即失效。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>取消</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => confirmDelete && deleteUser(confirmDelete)}
          >
            确认删除
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!toast}
        autoHideDuration={2400}
        onClose={() => setToast(null)}
        message={toast ?? ''}
      />
    </Box>
  );
}
