import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { PermAuditEvent } from '@/data/mock';

interface Props {
  open: boolean;
  log: PermAuditEvent[];
  onClose: () => void;
}

const resultLabel: Record<PermAuditEvent['result'], string> = {
  success: '成功',
  partial: '部分成功',
  failed: '失败',
};

const resultColor: Record<PermAuditEvent['result'], 'success' | 'warning' | 'error'> = {
  success: 'success',
  partial: 'warning',
  failed: 'error',
};

const typeLabel: Record<PermAuditEvent['type'], string> = {
  add: '新增',
  remove: '移除',
  modify: '修改',
};

export default function AuditTimelineDialog({ open, log, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>权限变更审计</DialogTitle>
      <DialogContent dividers>
        {log.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
              暂无权限变更记录
            </Typography>
            <Typography sx={{ fontSize: 12, mt: 0.5 }}>
              后续在权限配置中保存变更会自动写入审计时间轴
            </Typography>
          </Box>
        ) : (
          <Box sx={{ position: 'relative', pl: 3 }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 8,
                width: 2,
                bgcolor: '#e5ebf2',
              }}
            />
            {log.map((e, i) => {
              const dotColor = `${resultColor[e.result]}.main`;
              return (
                <Box key={i} sx={{ position: 'relative', mb: 2 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -22,
                      top: 6,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: dotColor,
                      border: '2px solid #fff',
                    }}
                  />
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{e.time}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    {e.actor} 对 {e.target} 执行了 {typeLabel[e.type]}：{e.detail}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    原因：{e.reason} · 结果：
                    <Chip
                      size="small"
                      label={resultLabel[e.result]}
                      color={resultColor[e.result]}
                      variant="outlined"
                      sx={{ ml: 0.5, height: 18 }}
                    />
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}
