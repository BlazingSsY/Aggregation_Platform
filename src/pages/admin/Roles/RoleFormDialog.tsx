import { useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import type { RoleDraft } from './types';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  initial: RoleDraft;
  isSuperAdmin: boolean;
  isBuiltin: boolean;
  existingCodes: string[];
  enterpriseOptions: string[];
  onClose: () => void;
  onSubmit: (draft: RoleDraft) => void;
}

export default function RoleFormDialog({
  open,
  mode,
  initial,
  isSuperAdmin,
  isBuiltin,
  existingCodes,
  enterpriseOptions,
  onClose,
  onSubmit,
}: Props) {
  const [draft, setDraft] = useState<RoleDraft>(initial);
  const [error, setError] = useState<string | null>(null);

  const lastKey = useMemo(
    () => `${initial.code}|${open}|${mode}`,
    [initial.code, open, mode],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    if (open) {
      setDraft(initial);
      setError(null);
    }
  }, [lastKey]);

  const submit = () => {
    if (!draft.name.trim()) {
      setError('角色名称为必填');
      return;
    }
    if (!/^[a-z][a-z0-9_]*$/.test(draft.code)) {
      setError('角色编码必须以英文小写字母开头，仅允许小写字母 / 数字 / 下划线');
      return;
    }
    if (mode === 'create' && existingCodes.includes(draft.code)) {
      setError('该角色编码已存在');
      return;
    }
    onSubmit(draft);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {mode === 'create' ? '新建角色' : '编辑角色'}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography sx={{ color: 'error.main', fontSize: 13, mb: 1 }}>{error}</Typography>
        )}
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
              onChange={(e) => setDraft((s) => ({ ...s, code: e.target.value }))}
              disabled={mode === 'edit'}
              helperText={mode === 'edit' ? '角色编码创建后不可修改' : 'enterprise_admin / ops 等'}
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
