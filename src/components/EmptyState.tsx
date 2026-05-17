import { Box, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  height?: number | string;
  compact?: boolean;
}

export default function EmptyState({
  title = '暂无数据',
  description = '待真实数据接入后将在此展示',
  icon,
  height = 220,
  compact = false,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
        py: compact ? 1 : 3,
      }}
    >
      {icon ?? <InboxOutlinedIcon sx={{ fontSize: compact ? 28 : 40, mb: 1, opacity: 0.5 }} />}
      <Typography sx={{ fontSize: compact ? 13 : 14, fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 12, mt: 0.5 }}>{description}</Typography>
    </Box>
  );
}
