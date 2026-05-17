import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { RoleRow } from '@/data/mock';

interface Props {
  open: boolean;
  activeRole: RoleRow;
  added: string[];
  removed: string[];
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmSaveDialog({
  open,
  activeRole,
  added,
  removed,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>确认权限变更</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ mb: 1 }}>
          将对角色 <strong>{activeRole.name}</strong>（影响 {activeRole.userCount} 个用户）
          执行以下变更，保存后将实时生效：
        </Typography>
        {added.length > 0 && (
          <>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'success.main', mt: 1 }}>
              新增权限（{added.length}）
            </Typography>
            <Box sx={{ pl: 1, fontFamily: 'monospace', fontSize: 12 }}>
              {added.map((c) => (
                <div key={c}>+ {c}</div>
              ))}
            </Box>
          </>
        )}
        {removed.length > 0 && (
          <>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'error.main', mt: 1 }}>
              移除权限（{removed.length}）
            </Typography>
            <Box sx={{ pl: 1, fontFamily: 'monospace', fontSize: 12 }}>
              {removed.map((c) => (
                <div key={c}>- {c}</div>
              ))}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>取消</Button>
        <Button variant="contained" onClick={onConfirm}>
          确认保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
