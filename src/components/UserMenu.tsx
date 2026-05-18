import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth, type RoleKey } from '@/auth/AuthContext';

interface MenuEntry {
  key: string;
  label: string;
  to: string;
  icon: typeof VerifiedUserIcon;
  roles?: RoleKey[];
}

const ENTRIES: MenuEntry[] = [
  {
    key: 'roles',
    label: '权限管理',
    to: '/admin/roles',
    icon: VerifiedUserIcon,
    roles: ['enterprise_admin', 'super_admin'],
  },
  {
    key: 'ops',
    label: '监控运维',
    to: '/ops/monitor',
    icon: MonitorHeartIcon,
    roles: ['ops', 'super_admin'],
  },
];

const ROLE_LABEL: Record<RoleKey, string> = {
  user: '普通用户',
  department_admin: '部门管理员',
  enterprise_admin: '企业管理员',
  super_admin: '超级管理员',
  ops: '运维人员',
};

export default function UserMenu() {
  const navigate = useNavigate();
  const { user, hasAnyRole, logout } = useAuth();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const visible = useMemo(
    () => ENTRIES.filter((e) => !e.roles || hasAnyRole(e.roles)),
    [hasAnyRole],
  );

  if (!user) return null;

  const initial = user.displayName.slice(0, 1);

  return (
    <>
      <Tooltip title={`${user.displayName} · ${user.enterprise}`}>
        <Box
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            '&:hover': { background: 'rgba(0,114,255,0.08)' },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 14,
              fontWeight: 700,
              background: '#0072ff',
              color: '#fff',
              boxShadow: '0 6px 16px rgba(0,114,255,0.32)',
            }}
          >
            {initial}
          </Avatar>
          <Typography
            sx={{
              fontSize: 14,
              color: 'text.primary',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              maxWidth: 160,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user.displayName}
          </Typography>
        </Box>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 268, mt: 1 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                background: '#0072ff',
                color: '#fff',
                fontWeight: 700,
                boxShadow: '0 6px 16px rgba(58,123,213,0.32)',
              }}
            >
              {initial}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }} noWrap>
                {user.displayName}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }} noWrap>
                {user.enterprise} · {user.department}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={0.5} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            {user.roles.map((r) => (
              <Chip key={r} label={ROLE_LABEL[r]} size="small" color="primary" variant="outlined" />
            ))}
          </Stack>
        </Box>
        {visible.length > 0 && (
          <>
            <Divider />
            <Typography sx={{ px: 2, pt: 1, pb: 0.5, fontSize: 11, color: 'text.secondary' }}>
              管理功能
            </Typography>
            {visible.map((e) => {
              const Icon = e.icon;
              return (
                <MenuItem
                  key={e.key}
                  onClick={() => {
                    setAnchor(null);
                    navigate(e.to);
                  }}
                >
                  <ListItemIcon>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={e.label} />
                </MenuItem>
              );
            })}
          </>
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            setAnchor(null);
            logout();
            navigate('/');
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="退出登录" />
        </MenuItem>
      </Menu>
    </>
  );
}
