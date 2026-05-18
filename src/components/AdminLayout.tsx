import { useMemo, useState } from 'react';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  Link as MuiLink,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppsIcon from '@mui/icons-material/Apps';
import { useAuth, type RoleKey } from '@/auth/AuthContext';

interface NavItem {
  key: string;
  label: string;
  to?: string;
  icon?: typeof HomeIcon;
  roles?: RoleKey[];
  children?: NavItem[];
}

const NAV: NavItem[] = [
  {
    key: 'apps',
    label: '应用管理',
    icon: AppsIcon,
    roles: ['super_admin'],
    children: [
      {
        key: 'apps-catalog',
        label: '应用目录',
        to: '/admin/apps',
        icon: AppsIcon,
        roles: ['super_admin'],
      },
    ],
  },
  {
    key: 'perm',
    label: '权限管理',
    icon: VerifiedUserIcon,
    roles: ['enterprise_admin', 'super_admin', 'department_admin'],
    children: [
      {
        key: 'roles',
        label: '角色管理',
        to: '/admin/roles',
        icon: VerifiedUserIcon,
        roles: ['enterprise_admin', 'super_admin'],
      },
      {
        key: 'users',
        label: '用户管理',
        to: '/admin/users',
        icon: PeopleIcon,
        roles: ['enterprise_admin', 'super_admin'],
      },
      {
        key: 'orgs',
        label: '组织管理',
        to: '/admin/organizations',
        icon: BusinessIcon,
        roles: ['super_admin', 'enterprise_admin', 'department_admin'],
      },
    ],
  },
  {
    key: 'ops',
    label: '监控运维',
    icon: MonitorHeartIcon,
    roles: ['ops', 'super_admin'],
    children: [
      { key: 'o-overview', label: '监控总览', to: '/ops/monitor', icon: DashboardIcon },
    ],
  },
];

const DRAWER_W = 248;

const ROUTE_LABEL: Record<string, string> = {
  admin: '后台管理',
  apps: '应用管理',
  roles: '角色管理',
  users: '用户管理',
  organizations: '组织管理',
  ops: '监控运维',
  monitor: '监控总览',
};

function buildCrumbs(pathname: string): Array<{ label: string; to?: string }> {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: Array<{ label: string; to?: string }> = [];
  let acc = '';
  parts.forEach((p, idx) => {
    acc += `/${p}`;
    crumbs.push({
      label: ROUTE_LABEL[p] ?? p,
      to: idx === parts.length - 1 ? undefined : acc,
    });
  });
  return crumbs;
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasAnyRole, logout } = useAuth();

  const visible = useMemo(
    () => NAV.filter((g) => !g.roles || hasAnyRole(g.roles)),
    [hasAnyRole],
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(visible.map((g) => [g.key, true])),
  );

  const crumbs = buildCrumbs(location.pathname);

  return (
    <Box
      className="admin-layout-root"
      sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}
    >
      <Drawer
        variant="permanent"
        className="admin-layout-drawer"
        sx={{
          width: DRAWER_W,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_W,
            boxSizing: 'border-box',
            background: '#ffffff',
            color: '#172B3A',
            borderRight: '1px solid #E2EAF1',
            boxShadow: 'none',
          },
        }}
      >
        <Toolbar
          className="admin-drawer-toolbar"
          sx={{
            px: 2,
            minHeight: '64px !important',
            display: 'flex',
            gap: 1.5,
            borderBottom: '1px solid #E2EAF1',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#4BB8FA',
              boxShadow: 'none',
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '-1px',
                fontFamily:
                  '"PingFang SC", "Microsoft YaHei", "Source Han Sans CN", sans-serif',
                color: '#ffffff',
              }}
            >
              机载
            </Box>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: '#172B3A',
                letterSpacing: 0.3,
                textShadow: 'none',
              }}
              noWrap
            >
              AI 应用聚合平台
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#607282' }} noWrap>
              管理后台
            </Typography>
          </Box>
        </Toolbar>

        <List className="admin-nav-list" dense sx={{ px: 1, py: 1 }}>
          <ListItemButton
            component={RouterLink}
            to="/"
            sx={{
              borderRadius: 1,
              mb: 0.75,
              color: '#40576A',
              '&:hover': { bgcolor: '#F2F8FC', color: '#172B3A' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="返回门户" />
          </ListItemButton>

          {visible.map((g) => {
            const Icon = g.icon ?? VerifiedUserIcon;
            const open = expanded[g.key];
            return (
              <Box key={g.key}>
                <ListItemButton
                  onClick={() => setExpanded((s) => ({ ...s, [g.key]: !open }))}
                  sx={{
                    borderRadius: 1,
                    color: '#40576A',
                    '&:hover': { bgcolor: '#F2F8FC', color: '#172B3A' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={g.label} />
                  {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    {g.children
                      ?.filter((c) => !c.roles || hasAnyRole(c.roles))
                      .map((c) => {
                      const SubIcon = c.icon ?? VerifiedUserIcon;
                      const selected = location.pathname === c.to;
                      return (
                        <ListItemButton
                          key={c.key}
                          component={RouterLink}
                          to={c.to ?? '#'}
                          selected={selected}
                          sx={{
                            borderRadius: 1,
                            mb: 0.5,
                            color: selected ? '#172B3A' : '#607282',
                            '&.Mui-selected': {
                              bgcolor: '#EAF7FE',
                              borderLeft: '3px solid #4BB8FA',
                              pl: 1.625,
                              '&:hover': { bgcolor: '#EAF7FE' },
                            },
                            '&:hover': { bgcolor: '#F2F8FC', color: '#172B3A' },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                            <SubIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={c.label}
                            primaryTypographyProps={{ fontSize: 13 }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </List>
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Toolbar
          className="admin-top-toolbar"
          sx={{
            bgcolor: '#ffffff',
            borderBottom: '1px solid #E2EAF1',
            px: 4,
            justifyContent: 'space-between',
            minHeight: '64px !important',
          }}
        >
          <Breadcrumbs>
            <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">
              门户
            </MuiLink>
            {crumbs.map((c, i) =>
              c.to ? (
                <MuiLink
                  key={i}
                  component={RouterLink}
                  to={c.to}
                  underline="hover"
                  color="inherit"
                >
                  {c.label}
                </MuiLink>
              ) : (
                <Typography key={i} color="text.primary" sx={{ fontWeight: 600 }}>
                  {c.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {user && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
                  {user.displayName.slice(0, 1)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    {user.displayName}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                    {user.enterprise}
                  </Typography>
                </Box>
              </Stack>
            )}
            <Divider orientation="vertical" flexItem />
            <Tooltip title="退出登录">
              <IconButton
                size="small"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>

        <Box component="main" className="admin-main-area" sx={{ flex: 1, p: 4, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
