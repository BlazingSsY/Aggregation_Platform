import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LaunchIcon from '@mui/icons-material/Launch';
import LockIcon from '@mui/icons-material/Lock';
import {
  APP_ICON_OPTIONS,
  APPS,
  CATEGORIES,
  getAppIcon,
  type AppCategory,
  type AppIconKey,
  type AppItem,
} from '@/data/apps';
import { MOCK_USERS, type UserRow } from '@/data/mock';
import { usePersistedState } from '@/data/store';
import { useAuth } from '@/auth/AuthContext';

interface AppDraft {
  name: string;
  category: AppCategory;
  iconKey: AppIconKey;
  description: string;
  url: string;
  status: 'enabled' | 'disabled';
}

const EMPTY_DRAFT: AppDraft = {
  name: '',
  category: '研发提效',
  iconKey: 'default',
  description: '',
  url: 'https://',
  status: 'enabled',
};

function AppFormDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  initial: AppDraft;
  onClose: () => void;
  onSubmit: (d: AppDraft) => void;
}) {
  const [draft, setDraft] = useState<AppDraft>(initial);
  const [error, setError] = useState<string | null>(null);
  const key = useMemo(
    () => `${initial.name}|${initial.url}|${open}|${mode}`,
    [initial.name, initial.url, open, mode],
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
      setError('应用名称为必填');
      return;
    }
    if (!draft.description.trim()) {
      setError('应用描述为必填');
      return;
    }
    if (!/^https?:\/\/.+/i.test(draft.url)) {
      setError('跳转网址必须以 http:// 或 https:// 开头');
      return;
    }
    onSubmit(draft);
  };

  const IconPreview = getAppIcon(draft.iconKey);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {mode === 'create' ? '新增应用' : '编辑应用'}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography sx={{ color: 'error.main', fontSize: 13, mb: 1 }}>{error}</Typography>
        )}
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              label="应用名称"
              value={draft.name}
              onChange={(e) => setDraft((s) => ({ ...s, name: e.target.value }))}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              select
              label="应用分类"
              value={draft.category}
              onChange={(e) =>
                setDraft((s) => ({ ...s, category: e.target.value as AppCategory }))
              }
            >
              {CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={6}>
            <TextField
              select
              label="应用图标"
              value={draft.iconKey}
              onChange={(e) =>
                setDraft((s) => ({ ...s, iconKey: e.target.value as AppIconKey }))
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconPreview sx={{ fontSize: 18, color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                },
              }}
            >
              {APP_ICON_OPTIONS.map((o) => {
                const Icon = getAppIcon(o.key);
                return (
                  <MenuItem key={o.key} value={o.key}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Icon sx={{ fontSize: 18, color: 'primary.main' }} />
                      <span>{o.label}</span>
                    </Stack>
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
                {draft.status === 'enabled' ? '已启用（可被用户看到）' : '已停用（对所有用户隐藏）'}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={12}>
            <TextField
              label="应用描述"
              value={draft.description}
              onChange={(e) => setDraft((s) => ({ ...s, description: e.target.value }))}
              multiline
              minRows={3}
              helperText="将展示在首页应用卡片与应用中心列表"
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="跳转网址"
              value={draft.url}
              onChange={(e) => setDraft((s) => ({ ...s, url: e.target.value }))}
              placeholder="https://example.com/your-app"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LaunchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              helperText="用户点击应用卡片或「立即体验」时打开此地址"
            />
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

interface GroupedDept {
  department: string;
  users: UserRow[];
}
interface GroupedEnt {
  enterprise: string;
  totalUsers: number;
  departments: GroupedDept[];
}

function groupUsers(users: UserRow[]): GroupedEnt[] {
  const entOrder: string[] = [];
  const entMap = new Map<string, Map<string, UserRow[]>>();
  users.forEach((u) => {
    if (!entMap.has(u.enterprise)) {
      entMap.set(u.enterprise, new Map());
      entOrder.push(u.enterprise);
    }
    const deptMap = entMap.get(u.enterprise)!;
    if (!deptMap.has(u.department)) deptMap.set(u.department, []);
    deptMap.get(u.department)!.push(u);
  });
  return entOrder.map((ent) => {
    const deptMap = entMap.get(ent)!;
    const departments: GroupedDept[] = [];
    let total = 0;
    deptMap.forEach((list, department) => {
      total += list.length;
      departments.push({ department, users: list });
    });
    return { enterprise: ent, totalUsers: total, departments };
  });
}

type SelectionState = 'none' | 'partial' | 'all';

function selectionState(allIds: string[], selected: Set<string>): SelectionState {
  const sel = allIds.filter((id) => selected.has(id)).length;
  if (sel === 0) return 'none';
  if (sel === allIds.length) return 'all';
  return 'partial';
}

function GrantDialog({
  open,
  app,
  users,
  onClose,
  onSubmit,
}: {
  open: boolean;
  app: AppItem | null;
  users: UserRow[];
  onClose: () => void;
  onSubmit: (permitted: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const key = useMemo(() => `${app?.id}|${open}`, [app?.id, open]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    if (open && app) setSelected(new Set(app.permittedUserIds));
  }, [key]);

  const grouped = useMemo(() => groupUsers(users), [users]);

  if (!app) return null;

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMany = (ids: string[], turnOn: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (turnOn ? next.add(id) : next.delete(id)));
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(users.map((u) => u.id)));
  const clearAll = () => setSelected(new Set());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>授权用户访问「{app.name}」</DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          支持按企业、部门批量勾选。未在下方勾选的成员将在首页和应用中心看不到此应用；超级管理员始终可访问，不受授权列表限制。
        </Alert>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button size="small" onClick={selectAll} variant="outlined">
            全部企业全选
          </Button>
          <Button size="small" onClick={clearAll} variant="outlined" color="warning">
            全部清空
          </Button>
          <Box sx={{ flex: 1, minWidth: 16 }} />
          <Chip
            label={`已选 ${selected.size} / ${users.length}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Stack spacing={2}>
          {grouped.map((g) => {
            const entIds = g.departments.flatMap((d) => d.users.map((u) => u.id));
            const entState = selectionState(entIds, selected);
            const entSelectedCount = entIds.filter((id) => selected.has(id)).length;
            return (
              <Box
                key={g.enterprise}
                sx={{
                  border: '1px solid #e5ebf2',
                  borderRadius: 1.5,
                  bgcolor: '#ffffff',
                  p: 1.5,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Checkbox
                    size="small"
                    checked={entState === 'all'}
                    indeterminate={entState === 'partial'}
                    onChange={() => toggleMany(entIds, entState !== 'all')}
                  />
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>
                    {g.enterprise}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${entSelectedCount} / ${g.totalUsers}`}
                    color={
                      entState === 'all' ? 'success' : entState === 'partial' ? 'primary' : 'default'
                    }
                    variant="outlined"
                    sx={{ height: 20, fontSize: 11 }}
                  />
                </Stack>

                <Stack spacing={1.5}>
                  {g.departments.map((d) => {
                    const deptIds = d.users.map((u) => u.id);
                    const deptState = selectionState(deptIds, selected);
                    const deptSelected = deptIds.filter((id) => selected.has(id)).length;
                    return (
                      <Box
                        key={d.department}
                        sx={{
                          ml: 4,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: '#fff',
                          border: '1px solid #e5ebf2',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                          <Checkbox
                            size="small"
                            checked={deptState === 'all'}
                            indeterminate={deptState === 'partial'}
                            onChange={() => toggleMany(deptIds, deptState !== 'all')}
                          />
                          <Typography
                            sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}
                          >
                            {d.department}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${deptSelected} / ${deptIds.length}`}
                            variant="outlined"
                            sx={{ height: 18, fontSize: 10 }}
                          />
                        </Stack>
                        <Box
                          sx={{
                            ml: 4,
                            display: 'flex',
                            flexWrap: 'wrap',
                            columnGap: 2,
                            rowGap: 0.5,
                          }}
                        >
                          {d.users.map((u) => (
                            <FormControlLabel
                              key={u.id}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={selected.has(u.id)}
                                  onChange={() => toggleOne(u.id)}
                                />
                              }
                              label={
                                <Stack direction="row" spacing={0.5} alignItems="baseline">
                                  <Typography
                                    component="span"
                                    sx={{ fontSize: 13, fontWeight: 500 }}
                                  >
                                    {u.displayName}
                                  </Typography>
                                  <Typography
                                    component="span"
                                    sx={{ fontSize: 10, color: 'text.secondary' }}
                                  >
                                    {u.roleName}
                                  </Typography>
                                </Stack>
                              }
                              sx={{ m: 0, minWidth: 160 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button variant="contained" onClick={() => onSubmit(Array.from(selected))}>
          保存授权
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AppsAdminPage() {
  const { hasAnyRole } = useAuth();
  const isSuperAdmin = hasAnyRole(['super_admin']);

  const [apps, setApps] = usePersistedState<AppItem[]>('apps', APPS);
  const [users] = usePersistedState<UserRow[]>('users', MOCK_USERS);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<AppCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'enabled' | 'disabled'>('all');

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AppItem | null>(null);
  const [granting, setGranting] = useState<AppItem | null>(null);
  const [deleting, setDeleting] = useState<AppItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      apps.filter((a) => {
        if (filterCategory !== 'all' && a.category !== filterCategory) return false;
        if (filterStatus !== 'all' && a.status !== filterStatus) return false;
        if (search && !a.name.includes(search) && !a.description.includes(search)) return false;
        return true;
      }),
    [apps, search, filterCategory, filterStatus],
  );

  if (!isSuperAdmin) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          应用管理
        </Typography>
        <Alert severity="warning" sx={{ mt: 2 }}>
          仅超级管理员可以新增/删减应用与授权用户。
        </Alert>
      </Box>
    );
  }

  const createApp = (d: AppDraft) => {
    const id = `app-${Date.now()}`;
    const newApp: AppItem = {
      id,
      name: d.name,
      description: d.description,
      category: d.category,
      iconKey: d.iconKey,
      url: d.url,
      status: d.status,
      permittedUserIds: [],
    };
    setApps((prev) => [...prev, newApp]);
    setCreating(false);
    setToast(`已创建应用「${d.name}」，请前往「授权」分配可访问用户`);
  };

  const updateApp = (d: AppDraft) => {
    if (!editing) return;
    setApps((prev) =>
      prev.map((a) =>
        a.id === editing.id
          ? {
              ...a,
              name: d.name,
              description: d.description,
              category: d.category,
              iconKey: d.iconKey,
              url: d.url,
              status: d.status,
            }
          : a,
      ),
    );
    setEditing(null);
    setToast(`已保存应用「${d.name}」`);
  };

  const deleteApp = (a: AppItem) => {
    setApps((prev) => prev.filter((x) => x.id !== a.id));
    setDeleting(null);
    setToast(`已删除应用「${a.name}」`);
  };

  const saveGrant = (permitted: string[]) => {
    if (!granting) return;
    setApps((prev) =>
      prev.map((a) => (a.id === granting.id ? { ...a, permittedUserIds: permitted } : a)),
    );
    setToast(`已为「${granting.name}」更新授权用户（${permitted.length} 人）`);
    setGranting(null);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            应用管理
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
            新增/删减 AI 应用，编辑描述与跳转网址，并控制可见用户范围
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreating(true)}>
          新增应用
        </Button>
      </Stack>

      <Card>
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
          <TextField
            placeholder="搜索应用名称 / 描述"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          <TextField
            select
            label="分类"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as never)}
            sx={{ width: 140 }}
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="状态"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as never)}
            sx={{ width: 140 }}
          >
            <MenuItem value="all">全部状态</MenuItem>
            <MenuItem value="enabled">启用</MenuItem>
            <MenuItem value="disabled">停用</MenuItem>
          </TextField>
        </Toolbar>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>应用</TableCell>
                <TableCell>分类</TableCell>
                <TableCell>描述</TableCell>
                <TableCell>跳转网址</TableCell>
                <TableCell align="right">授权人数</TableCell>
                <TableCell>状态</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((a) => {
                const Icon = getAppIcon(a.iconKey);
                return (
                  <TableRow key={a.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            bgcolor: '#ffffff',
                            color: 'text.secondary',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon sx={{ fontSize: 18 }} />
                        </Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{a.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={a.category} color="info" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.secondary', maxWidth: 360 }}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {a.description}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 11, maxWidth: 220 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LaunchIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                        <Typography
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: 11,
                            color: 'text.secondary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {a.url}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={`${a.permittedUserIds.length} / ${users.length}`}>
                        <Chip
                          size="small"
                          icon={
                            a.permittedUserIds.length === 0 ? (
                              <LockIcon sx={{ fontSize: 14 }} />
                            ) : undefined
                          }
                          label={
                            a.permittedUserIds.length === 0
                              ? '未授权'
                              : a.permittedUserIds.length === users.length
                                ? '全员可见'
                                : `${a.permittedUserIds.length} 人`
                          }
                          color={
                            a.permittedUserIds.length === 0
                              ? 'warning'
                              : a.permittedUserIds.length === users.length
                                ? 'success'
                                : 'primary'
                          }
                          variant="outlined"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Switch
                        size="small"
                        checked={a.status === 'enabled'}
                        onChange={(e) =>
                          setApps((prev) =>
                            prev.map((x) =>
                              x.id === a.id
                                ? {
                                    ...x,
                                    status: e.target.checked ? 'enabled' : 'disabled',
                                  }
                                : x,
                            ),
                          )
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="编辑">
                        <IconButton size="small" onClick={() => setEditing(a)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="授权用户">
                        <IconButton size="small" onClick={() => setGranting(a)}>
                          <GroupAddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleting(a)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                    暂无匹配应用
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>

      <AppFormDialog
        open={creating}
        mode="create"
        initial={EMPTY_DRAFT}
        onClose={() => setCreating(false)}
        onSubmit={createApp}
      />
      <AppFormDialog
        open={!!editing}
        mode="edit"
        initial={
          editing
            ? {
                name: editing.name,
                category: editing.category,
                iconKey: editing.iconKey,
                description: editing.description,
                url: editing.url,
                status: editing.status,
              }
            : EMPTY_DRAFT
        }
        onClose={() => setEditing(null)}
        onSubmit={updateApp}
      />

      <GrantDialog
        open={!!granting}
        app={granting}
        users={users}
        onClose={() => setGranting(null)}
        onSubmit={saveGrant}
      />

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" fullWidth>
        <DialogTitle>删除应用</DialogTitle>
        <DialogContent dividers>
          <Typography>
            确认删除应用 <strong>{deleting?.name}</strong>？此操作不可撤销，所有已授权用户将立即无法访问该应用。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>取消</Button>
          <Button variant="contained" color="error" onClick={() => deleting && deleteApp(deleting)}>
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
