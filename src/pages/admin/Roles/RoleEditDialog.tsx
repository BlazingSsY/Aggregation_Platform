import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2 as Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { CONFLICT_RULES, PERMISSION_TREE } from '@/data/permissions';
import type { RoleRow } from '@/data/mock';
import PermNodeView from './PermissionNode';
import ConfirmSaveDialog from './ConfirmSaveDialog';
import { ALL_LEAFS, expandPermissions, type RoleDraft } from './types';

export interface RoleEditSavePayload {
  role: RoleRow;
  draft: RoleDraft;
  nextPerms: string[];
  added: string[];
  removed: string[];
  metaChanged: boolean;
}

interface Props {
  open: boolean;
  role: RoleRow | null;
  isSuperAdmin: boolean;
  enterpriseOptions: string[];
  onClose: () => void;
  onSave: (payload: RoleEditSavePayload) => void;
}

export default function RoleEditDialog({
  open,
  role,
  isSuperAdmin,
  enterpriseOptions,
  onClose,
  onSave,
}: Props) {
  const isBuiltin = !!role?.builtin;

  const [draft, setDraft] = useState<RoleDraft>({
    name: '',
    code: '',
    enterprise: '',
    status: 'enabled',
  });
  const [originDraft, setOriginDraft] = useState<RoleDraft>(draft);
  const [draftPerms, setDraftPerms] = useState<Set<string>>(new Set());
  const [originPerms, setOriginPerms] = useState<Set<string>>(new Set());
  const [permSearch, setPermSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open || !role) return;
    const initDraft: RoleDraft = {
      name: role.name,
      code: role.code,
      enterprise: role.enterprise,
      status: role.status,
    };
    setDraft(initDraft);
    setOriginDraft(initDraft);
    const perms = new Set(expandPermissions(role.permissions));
    setDraftPerms(perms);
    setOriginPerms(perms);
    setPermSearch('');
    setError(null);
  }, [open, role]);

  const added = useMemo(
    () => Array.from(draftPerms).filter((c) => !originPerms.has(c)),
    [draftPerms, originPerms],
  );
  const removed = useMemo(
    () => Array.from(originPerms).filter((c) => !draftPerms.has(c)),
    [draftPerms, originPerms],
  );
  const conflicts = useMemo(
    () => CONFLICT_RULES.filter((r) => r.match(draftPerms)),
    [draftPerms],
  );
  const metaChanged =
    draft.name !== originDraft.name ||
    draft.enterprise !== originDraft.enterprise ||
    draft.status !== originDraft.status;
  const permsChanged = added.length > 0 || removed.length > 0;
  const dirty = metaChanged || permsChanged;

  const togglePerm = (codes: string[], on: boolean) => {
    setDraftPerms((prev) => {
      const next = new Set(prev);
      codes.forEach((c) => (on ? next.add(c) : next.delete(c)));
      return next;
    });
  };

  const handleSave = () => {
    if (!role) return;
    if (!draft.name.trim()) {
      setError('角色名称为必填');
      return;
    }
    if (conflicts.length > 0) {
      setError('存在权限冲突，请处理后再保存');
      return;
    }
    setError(null);
    if (permsChanged) {
      setConfirmOpen(true);
    } else {
      commitSave();
    }
  };

  const commitSave = () => {
    if (!role) return;
    onSave({
      role,
      draft,
      nextPerms: Array.from(draftPerms),
      added,
      removed,
      metaChanged,
    });
    setConfirmOpen(false);
  };

  if (!role) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>编辑角色 · {originDraft.name}</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Typography sx={{ color: 'error.main', fontSize: 13, mb: 1 }}>{error}</Typography>
          )}

          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1.5 }}>角色信息</Typography>
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                label="角色名称"
                value={draft.name}
                onChange={(e) => setDraft((s) => ({ ...s, name: e.target.value }))}
                disabled={isBuiltin}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="角色编码"
                value={draft.code}
                disabled
                helperText="角色编码创建后不可修改"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                select
                label="所属企业"
                value={draft.enterprise}
                onChange={(e) => setDraft((s) => ({ ...s, enterprise: e.target.value }))}
                disabled={!isSuperAdmin || isBuiltin}
                helperText={
                  isBuiltin
                    ? '内置角色归属不可调整'
                    : isSuperAdmin
                      ? '超级管理员可调整角色归属'
                      : '仅超级管理员可调整'
                }
                slotProps={{
                  input: {
                    endAdornment:
                      !isSuperAdmin || isBuiltin ? (
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
              <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
                <Switch
                  checked={draft.status === 'enabled'}
                  disabled={isBuiltin}
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

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>权限配置</Typography>
            <Chip
              size="small"
              label={`${draftPerms.size}/${ALL_LEAFS.length}`}
              color="primary"
              variant="outlined"
            />
          </Stack>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1.5 }}>
            权限按 模块 - 功能 - 操作 三级展示，支持父子级联与搜索定位
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <TextField
              placeholder="搜索权限节点"
              value={permSearch}
              onChange={(e) => setPermSearch(e.target.value)}
              sx={{ flex: 1 }}
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
            <Button size="small" onClick={() => setDraftPerms(new Set(ALL_LEAFS))}>
              全选
            </Button>
            <Button
              size="small"
              onClick={() =>
                setDraftPerms((prev) => {
                  const next = new Set<string>();
                  ALL_LEAFS.forEach((c) => {
                    if (!prev.has(c)) next.add(c);
                  });
                  return next;
                })
              }
            >
              反选
            </Button>
            <Button size="small" color="warning" onClick={() => setDraftPerms(new Set())}>
              清空
            </Button>
          </Stack>

          <Paper
            variant="outlined"
            sx={{ p: 1, maxHeight: 360, overflow: 'auto', borderColor: '#E6EFFF' }}
          >
            {PERMISSION_TREE.map((n) => (
              <PermNodeView
                key={n.code}
                node={n}
                selected={draftPerms}
                toggle={togglePerm}
                search={permSearch}
              />
            ))}
          </Paper>

          {conflicts.length > 0 && (
            <Alert icon={<WarningAmberIcon />} severity="error" sx={{ mt: 2 }} variant="outlined">
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                检测到 {conflicts.length} 项权限冲突
              </Typography>
              {conflicts.map((c) => (
                <Box key={c.name} sx={{ mb: 0.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{c.name}</Typography>
                  <Typography sx={{ fontSize: 12 }}>
                    原因：{c.reason}；处理建议：{c.suggestion}
                  </Typography>
                </Box>
              ))}
            </Alert>
          )}

          {permsChanged && (
            <Box sx={{ mt: 2, p: 1.5, bgcolor: '#F0F5FF', borderRadius: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.5 }}>变更摘要</Typography>
              <Stack direction="row" spacing={2} sx={{ fontSize: 12 }}>
                <Typography sx={{ color: 'success.main' }}>新增 {added.length} 项</Typography>
                <Typography sx={{ color: 'error.main' }}>移除 {removed.length} 项</Typography>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDraft(originDraft);
              setDraftPerms(new Set(originPerms));
              setError(null);
            }}
            disabled={!dirty}
          >
            撤销
          </Button>
          <Button onClick={onClose}>取消</Button>
          <Button variant="contained" onClick={handleSave} disabled={!dirty}>
            保存
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmSaveDialog
        open={confirmOpen}
        activeRole={role}
        added={added}
        removed={removed}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={commitSave}
      />
    </>
  );
}
