import { useMemo, useState } from 'react';
import {
  Alert,
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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShareIcon from '@mui/icons-material/Share';
import { useAuth, type RoleKey } from '@/auth/AuthContext';
import {
  MOCK_DEPARTMENTS,
  MOCK_ENTERPRISES,
  MOCK_USERS,
  type Department,
  type Enterprise,
} from '@/data/mock';
import { usePersistedState } from '@/data/store';

type TabKey = 'enterprise' | 'department' | 'delegate';

interface DelegatableRole {
  key: RoleKey;
  label: string;
  description: string;
}

const DELEGATABLE_ROLES: DelegatableRole[] = [
  { key: 'enterprise_admin', label: '企业管理员', description: '管理本企业用户、角色、配额' },
  { key: 'department_admin', label: '部门管理员', description: '管理本部门用户与分配项' },
  { key: 'ops', label: '运维人员', description: '查看监控、日志、告警' },
];

const DELEGATABLE_PERMS = [
  { code: 'org:enterprise:view', label: '查看企业' },
  { code: 'org:enterprise:create', label: '新增企业' },
  { code: 'org:enterprise:edit', label: '编辑企业' },
  { code: 'org:enterprise:delete', label: '删除企业' },
  { code: 'org:department:view', label: '查看部门' },
  { code: 'org:department:create', label: '新增部门' },
  { code: 'org:department:edit', label: '编辑部门' },
  { code: 'org:department:delete', label: '删除部门' },
];

interface EnterpriseDraft {
  name: string;
  code: string;
  description: string;
  contact: string;
  status: 'enabled' | 'disabled';
}

const EMPTY_ENT: EnterpriseDraft = {
  name: '',
  code: '',
  description: '',
  contact: '',
  status: 'enabled',
};

function EnterpriseFormDialog({
  open,
  mode,
  initial,
  existingCodes,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  initial: EnterpriseDraft;
  existingCodes: string[];
  onClose: () => void;
  onSubmit: (d: EnterpriseDraft) => void;
}) {
  const [draft, setDraft] = useState<EnterpriseDraft>(initial);
  const [error, setError] = useState<string | null>(null);
  const key = useMemo(() => `${initial.code}|${open}|${mode}`, [initial.code, open, mode]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    if (open) {
      setDraft(initial);
      setError(null);
    }
  }, [key]);

  const submit = () => {
    if (!draft.name.trim()) {
      setError('企业名称为必填');
      return;
    }
    if (!/^[a-z][a-z0-9_]*$/.test(draft.code)) {
      setError('企业编码必须以小写英文字母开头，仅允许小写字母/数字/下划线');
      return;
    }
    if (mode === 'create' && existingCodes.includes(draft.code)) {
      setError('企业编码已存在');
      return;
    }
    onSubmit(draft);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {mode === 'create' ? '新增企业' : '编辑企业'}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography sx={{ color: 'error.main', fontSize: 13, mb: 1 }}>{error}</Typography>
        )}
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              label="企业名称"
              value={draft.name}
              onChange={(e) => setDraft((s) => ({ ...s, name: e.target.value }))}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="企业编码"
              value={draft.code}
              onChange={(e) => setDraft((s) => ({ ...s, code: e.target.value }))}
              disabled={mode === 'edit'}
              helperText={mode === 'edit' ? '创建后不可修改' : 'zy_aviation / yx_industry'}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="企业描述"
              value={draft.description}
              onChange={(e) => setDraft((s) => ({ ...s, description: e.target.value }))}
              multiline
              minRows={2}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="联系方式"
              value={draft.contact}
              onChange={(e) => setDraft((s) => ({ ...s, contact: e.target.value }))}
              placeholder="contact@company.cn"
            />
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
                {draft.status === 'enabled' ? '已启用' : '已停用'}
              </Typography>
            </Stack>
          </Grid>
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

interface DepartmentDraft {
  name: string;
  code: string;
  enterpriseId: string;
  parentId: string | null;
  head: string;
  status: 'enabled' | 'disabled';
}

function emptyDept(enterpriseId: string): DepartmentDraft {
  return {
    name: '',
    code: '',
    enterpriseId,
    parentId: null,
    head: '',
    status: 'enabled',
  };
}

function DepartmentFormDialog({
  open,
  mode,
  initial,
  enterprises,
  candidateParents,
  existingCodes,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  initial: DepartmentDraft;
  enterprises: Enterprise[];
  candidateParents: Department[];
  existingCodes: string[];
  onClose: () => void;
  onSubmit: (d: DepartmentDraft) => void;
}) {
  const [draft, setDraft] = useState<DepartmentDraft>(initial);
  const [error, setError] = useState<string | null>(null);
  const key = useMemo(
    () => `${initial.code}|${initial.enterpriseId}|${open}|${mode}`,
    [initial.code, initial.enterpriseId, open, mode],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    if (open) {
      setDraft(initial);
      setError(null);
    }
  }, [key]);

  const submit = () => {
    if (!draft.name.trim()) {
      setError('部门名称为必填');
      return;
    }
    if (!/^[a-z][a-z0-9_]*$/.test(draft.code)) {
      setError('部门编码必须以小写英文字母开头，仅允许小写字母/数字/下划线');
      return;
    }
    if (mode === 'create' && existingCodes.includes(draft.code)) {
      setError('部门编码已存在');
      return;
    }
    if (!draft.enterpriseId) {
      setError('请选择所属企业');
      return;
    }
    onSubmit(draft);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {mode === 'create' ? '新增部门' : '编辑部门'}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography sx={{ color: 'error.main', fontSize: 13, mb: 1 }}>{error}</Typography>
        )}
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              label="部门名称"
              value={draft.name}
              onChange={(e) => setDraft((s) => ({ ...s, name: e.target.value }))}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="部门编码"
              value={draft.code}
              onChange={(e) => setDraft((s) => ({ ...s, code: e.target.value }))}
              disabled={mode === 'edit'}
              helperText={mode === 'edit' ? '创建后不可修改' : 'zy_rd / zy_hw'}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              select
              label="所属企业"
              value={draft.enterpriseId}
              onChange={(e) =>
                setDraft((s) => ({ ...s, enterpriseId: e.target.value, parentId: null }))
              }
              disabled={mode === 'edit'}
              helperText={mode === 'edit' ? '编辑模式下不可跨企业转移' : '可跨企业创建'}
            >
              {enterprises.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={6}>
            <TextField
              select
              label="上级部门"
              value={draft.parentId ?? ''}
              onChange={(e) =>
                setDraft((s) => ({ ...s, parentId: e.target.value || null }))
              }
            >
              <MenuItem value="">（一级部门）</MenuItem>
              {candidateParents
                .filter((d) => d.enterpriseId === draft.enterpriseId)
                .map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid size={6}>
            <TextField
              label="部门负责人"
              value={draft.head}
              onChange={(e) => setDraft((s) => ({ ...s, head: e.target.value }))}
              placeholder="账号 / 显示名"
            />
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
                {draft.status === 'enabled' ? '已启用' : '已停用'}
              </Typography>
            </Stack>
          </Grid>
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

export default function OrganizationsPage() {
  const { hasPermission, hasAnyRole, rolePermissions, setRolePermissions } = useAuth();
  const isSuperAdmin = hasAnyRole(['super_admin']);

  const canViewEnt = isSuperAdmin || hasPermission('org:enterprise:view');
  const canCreateEnt = isSuperAdmin || hasPermission('org:enterprise:create');
  const canEditEnt = isSuperAdmin || hasPermission('org:enterprise:edit');
  const canDeleteEnt = isSuperAdmin || hasPermission('org:enterprise:delete');

  const canViewDept = isSuperAdmin || hasPermission('org:department:view');
  const canCreateDept = isSuperAdmin || hasPermission('org:department:create');
  const canEditDept = isSuperAdmin || hasPermission('org:department:edit');
  const canDeleteDept = isSuperAdmin || hasPermission('org:department:delete');

  const [tab, setTab] = useState<TabKey>('enterprise');
  const [enterprises, setEnterprises] = usePersistedState<Enterprise[]>(
    'enterprises',
    MOCK_ENTERPRISES,
  );
  const [departments, setDepartments] = usePersistedState<Department[]>(
    'departments',
    MOCK_DEPARTMENTS,
  );

  const [entSearch, setEntSearch] = useState('');
  const [editingEnt, setEditingEnt] = useState<Enterprise | null>(null);
  const [creatingEnt, setCreatingEnt] = useState(false);
  const [deletingEnt, setDeletingEnt] = useState<Enterprise | null>(null);

  const [users] = usePersistedState('users', MOCK_USERS);

  const [deptEnterprise, setDeptEnterprise] = useState<string>(
    () => enterprises[0]?.id ?? '',
  );
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [creatingDept, setCreatingDept] = useState(false);
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  const userCountByEnterprise = useMemo(() => {
    const m = new Map<string, number>();
    users.forEach((u) => {
      const ent = enterprises.find((e) => e.name === u.enterprise);
      if (ent) m.set(ent.id, (m.get(ent.id) ?? 0) + 1);
    });
    return m;
  }, [users, enterprises]);

  const deptCountByEnterprise = useMemo(() => {
    const m = new Map<string, number>();
    departments.forEach((d) => m.set(d.enterpriseId, (m.get(d.enterpriseId) ?? 0) + 1));
    return m;
  }, [departments]);

  const userCountByDept = useMemo(() => {
    const m = new Map<string, number>();
    users.forEach((u) => {
      const dept = departments.find(
        (d) =>
          d.name === u.department &&
          enterprises.find((e) => e.id === d.enterpriseId)?.name === u.enterprise,
      );
      if (dept) m.set(dept.id, (m.get(dept.id) ?? 0) + 1);
    });
    return m;
  }, [departments, users, enterprises]);

  const filteredEnts = useMemo(
    () =>
      enterprises.filter(
        (e) =>
          !entSearch ||
          e.name.includes(entSearch) ||
          e.code.includes(entSearch.toLowerCase()),
      ),
    [enterprises, entSearch],
  );

  const visibleDepts = useMemo(
    () => departments.filter((d) => d.enterpriseId === deptEnterprise),
    [departments, deptEnterprise],
  );

  const createEnterprise = (d: EnterpriseDraft) => {
    const id = `ent-${Date.now()}`;
    setEnterprises((prev) => [
      ...prev,
      { id, createdAt: new Date().toISOString().slice(0, 10), ...d },
    ]);
    setCreatingEnt(false);
    setToast(`已创建企业 ${d.name}`);
  };

  const updateEnterprise = (d: EnterpriseDraft) => {
    if (!editingEnt) return;
    setEnterprises((prev) =>
      prev.map((e) => (e.id === editingEnt.id ? { ...e, ...d } : e)),
    );
    setEditingEnt(null);
    setToast(`已保存企业 ${d.name}`);
  };

  const deleteEnterprise = (e: Enterprise) => {
    const userCount = userCountByEnterprise.get(e.id) ?? 0;
    const deptCount = deptCountByEnterprise.get(e.id) ?? 0;
    if (userCount > 0 || deptCount > 0) {
      setToast(`无法删除：该企业下仍有 ${userCount} 个用户、${deptCount} 个部门`);
      setDeletingEnt(null);
      return;
    }
    setEnterprises((prev) => prev.filter((x) => x.id !== e.id));
    setDeletingEnt(null);
    setToast(`已删除企业 ${e.name}`);
  };

  const createDepartment = (d: DepartmentDraft) => {
    const id = `dept-${Date.now()}`;
    setDepartments((prev) => [...prev, { id, ...d }]);
    setCreatingDept(false);
    setDeptEnterprise(d.enterpriseId);
    setToast(`已创建部门 ${d.name}`);
  };

  const updateDepartment = (d: DepartmentDraft) => {
    if (!editingDept) return;
    setDepartments((prev) =>
      prev.map((x) => (x.id === editingDept.id ? { ...x, ...d } : x)),
    );
    setEditingDept(null);
    setToast(`已保存部门 ${d.name}`);
  };

  const deleteDepartment = (d: Department) => {
    const userCount = userCountByDept.get(d.id) ?? 0;
    if (userCount > 0) {
      setToast(`无法删除：该部门下仍有 ${userCount} 个用户`);
      setDeletingDept(null);
      return;
    }
    setDepartments((prev) => prev.filter((x) => x.id !== d.id));
    setDeletingDept(null);
    setToast(`已删除部门 ${d.name}`);
  };

  if (!canViewEnt && !canViewDept) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          组织管理
        </Typography>
        <Alert severity="warning" sx={{ mt: 2 }}>
          当前账号未获得组织管理权限。请联系超级管理员在「权限管理 → 角色管理」中为您的角色授予
          <code style={{ margin: '0 4px' }}>org:enterprise:view</code>
          或
          <code style={{ margin: '0 4px' }}>org:department:view</code>
          权限。
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            组织管理
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
            统一维护企业、部门，超级管理员可通过「角色管理」将
            <code style={{ margin: '0 4px' }}>org:enterprise:*</code>
            和
            <code style={{ margin: '0 4px' }}>org:department:*</code>
            授权下放给普通管理员
          </Typography>
        </Box>
        {isSuperAdmin && (
          <Chip
            icon={<VerifiedUserIcon sx={{ fontSize: 16 }} />}
            label="当前以超级管理员身份操作"
            color="primary"
            variant="outlined"
          />
        )}
      </Stack>

      <Tabs value={tab} onChange={(_, v) => setTab(v as TabKey)} sx={{ mb: 2 }}>
        {canViewEnt && <Tab value="enterprise" label="企业管理" />}
        {canViewDept && <Tab value="department" label="部门管理" />}
        {isSuperAdmin && <Tab value="delegate" label="权限下放" icon={<ShareIcon sx={{ fontSize: 16 }} />} iconPosition="start" />}
      </Tabs>

      {tab === 'delegate' && isSuperAdmin && (
        <Card>
          <Box sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5 }}>
              将组织管理能力下放至其他管理员
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 2 }}>
              勾选后立即生效到对应角色，对应身份重新登录或刷新后即可在「组织管理」中执行被授权的操作。
              下放结果同时显示在「权限管理 → 角色管理」中。
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>角色</TableCell>
                    {DELEGATABLE_PERMS.map((p) => (
                      <TableCell key={p.code} align="center" sx={{ minWidth: 90 }}>
                        {p.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DELEGATABLE_ROLES.map((role) => {
                    const current = new Set(rolePermissions[role.key] ?? []);
                    return (
                      <TableRow key={role.key} hover>
                        <TableCell>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                            {role.label}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                            {role.description}
                          </Typography>
                        </TableCell>
                        {DELEGATABLE_PERMS.map((p) => (
                          <TableCell key={p.code} align="center">
                            <Switch
                              size="small"
                              checked={current.has(p.code)}
                              onChange={(e) => {
                                const next = new Set(current);
                                if (e.target.checked) next.add(p.code);
                                else next.delete(p.code);
                                setRolePermissions(role.key, Array.from(next));
                                setToast(
                                  e.target.checked
                                    ? `已为「${role.label}」授予「${p.label}」`
                                    : `已撤销「${role.label}」的「${p.label}」`,
                                );
                              }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
            <Alert severity="info" sx={{ mt: 2 }}>
              典型场景：把「新增部门」权限下放给企业管理员，他们登录后即可在组织管理中独立创建本企业的部门，
              无需再由超级管理员代办；任何时候都可撤回，权限实时生效。
            </Alert>
          </Box>
        </Card>
      )}

      {tab === 'enterprise' && canViewEnt && (
        <Card>
          <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="搜索企业名称 / 编码"
              value={entSearch}
              onChange={(e) => setEntSearch(e.target.value)}
              sx={{ maxWidth: 280 }}
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
            <Box sx={{ flex: 1 }} />
            <Tooltip title={canCreateEnt ? '' : '无新增权限，请联系超级管理员授权'}>
              <span>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={!canCreateEnt}
                  onClick={() => setCreatingEnt(true)}
                >
                  新增企业
                </Button>
              </span>
            </Tooltip>
          </Toolbar>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>企业名称</TableCell>
                  <TableCell>编码</TableCell>
                  <TableCell>描述</TableCell>
                  <TableCell>联系方式</TableCell>
                  <TableCell align="right">部门数</TableCell>
                  <TableCell align="right">用户数</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>创建时间</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEnts.map((e) => (
                  <TableRow key={e.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{e.name}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{e.code}</TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.secondary', maxWidth: 240 }}>
                      {e.description}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{e.contact}</TableCell>
                    <TableCell align="right">{deptCountByEnterprise.get(e.id) ?? 0}</TableCell>
                    <TableCell align="right">{userCountByEnterprise.get(e.id) ?? 0}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={e.status === 'enabled' ? '启用' : '停用'}
                        color={e.status === 'enabled' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>
                      {e.createdAt}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={canEditEnt ? '编辑' : '无编辑权限'}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={!canEditEnt}
                            onClick={() => setEditingEnt(e)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={canDeleteEnt ? '删除' : '无删除权限'}>
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={!canDeleteEnt}
                            onClick={() => setDeletingEnt(e)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEnts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      暂无匹配企业
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}

      {tab === 'department' && canViewDept && (
        <Card>
          <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
            <TextField
              select
              label="所属企业"
              value={deptEnterprise}
              onChange={(e) => setDeptEnterprise(e.target.value)}
              sx={{ width: 220 }}
            >
              {enterprises.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ flex: 1 }} />
            <Tooltip title={canCreateDept ? '' : '无新增权限，请联系超级管理员授权'}>
              <span>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={!canCreateDept || !deptEnterprise}
                  onClick={() => setCreatingDept(true)}
                >
                  新增部门
                </Button>
              </span>
            </Tooltip>
          </Toolbar>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>部门名称</TableCell>
                  <TableCell>编码</TableCell>
                  <TableCell>上级部门</TableCell>
                  <TableCell>负责人</TableCell>
                  <TableCell align="right">用户数</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleDepts.map((d) => {
                  const parent = departments.find((p) => p.id === d.parentId);
                  return (
                    <TableRow key={d.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {d.parentId ? '└ ' : ''}
                        {d.name}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{d.code}</TableCell>
                      <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>
                        {parent?.name ?? '—'}
                      </TableCell>
                      <TableCell>{d.head || '—'}</TableCell>
                      <TableCell align="right">{userCountByDept.get(d.id) ?? 0}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={d.status === 'enabled' ? '启用' : '停用'}
                          color={d.status === 'enabled' ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={canEditDept ? '编辑' : '无编辑权限'}>
                          <span>
                            <IconButton
                              size="small"
                              disabled={!canEditDept}
                              onClick={() => setEditingDept(d)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title={canDeleteDept ? '删除' : '无删除权限'}>
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={!canDeleteDept}
                              onClick={() => setDeletingDept(d)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {visibleDepts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      该企业暂无部门，点击右上角「新增部门」创建
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}

      <EnterpriseFormDialog
        open={creatingEnt}
        mode="create"
        initial={EMPTY_ENT}
        existingCodes={enterprises.map((e) => e.code)}
        onClose={() => setCreatingEnt(false)}
        onSubmit={createEnterprise}
      />
      <EnterpriseFormDialog
        open={!!editingEnt}
        mode="edit"
        initial={
          editingEnt
            ? {
                name: editingEnt.name,
                code: editingEnt.code,
                description: editingEnt.description,
                contact: editingEnt.contact,
                status: editingEnt.status,
              }
            : EMPTY_ENT
        }
        existingCodes={enterprises.filter((e) => e.id !== editingEnt?.id).map((e) => e.code)}
        onClose={() => setEditingEnt(null)}
        onSubmit={updateEnterprise}
      />

      <DepartmentFormDialog
        open={creatingDept}
        mode="create"
        initial={emptyDept(deptEnterprise)}
        enterprises={enterprises}
        candidateParents={departments}
        existingCodes={departments.map((d) => d.code)}
        onClose={() => setCreatingDept(false)}
        onSubmit={createDepartment}
      />
      <DepartmentFormDialog
        open={!!editingDept}
        mode="edit"
        initial={
          editingDept
            ? {
                name: editingDept.name,
                code: editingDept.code,
                enterpriseId: editingDept.enterpriseId,
                parentId: editingDept.parentId,
                head: editingDept.head,
                status: editingDept.status,
              }
            : emptyDept(deptEnterprise)
        }
        enterprises={enterprises}
        candidateParents={departments.filter((d) => d.id !== editingDept?.id)}
        existingCodes={departments.filter((d) => d.id !== editingDept?.id).map((d) => d.code)}
        onClose={() => setEditingDept(null)}
        onSubmit={updateDepartment}
      />

      <Dialog open={!!deletingEnt} onClose={() => setDeletingEnt(null)} maxWidth="xs" fullWidth>
        <DialogTitle>删除企业</DialogTitle>
        <DialogContent dividers>
          <Typography>
            确认删除企业 <strong>{deletingEnt?.name}</strong>？此操作不可撤销。若企业下仍有部门或用户，将被阻止。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingEnt(null)}>取消</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deletingEnt && deleteEnterprise(deletingEnt)}
          >
            确认删除
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deletingDept} onClose={() => setDeletingDept(null)} maxWidth="xs" fullWidth>
        <DialogTitle>删除部门</DialogTitle>
        <DialogContent dividers>
          <Typography>
            确认删除部门 <strong>{deletingDept?.name}</strong>？若部门下仍有用户，将被阻止。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingDept(null)}>取消</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deletingDept && deleteDepartment(deletingDept)}
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
