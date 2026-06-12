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
  ListItemText,
  Stack,
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
      { key: 'apps-catalog', label: '应用目录', to: '/admin/apps', icon: AppsIcon, roles: ['super_admin'] },
    ],
  },
  {
    key: 'perm',
    label: '权限管理',
    icon: VerifiedUserIcon,
    roles: ['enterprise_admin', 'super_admin', 'department_admin'],
    children: [
      { key: 'roles', label: '角色管理', to: '/admin/roles', icon: VerifiedUserIcon, roles: ['enterprise_admin', 'super_admin'] },
      { key: 'users', label: '用户管理', to: '/admin/users', icon: PeopleIcon, roles: ['enterprise_admin', 'super_admin'] },
      { key: 'orgs', label: '组织管理', to: '/admin/organizations', icon: BusinessIcon, roles: ['super_admin', 'enterprise_admin', 'department_admin'] },
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

/* Bento 配色：每个菜单项的图标磁贴 */
const TILE: Record<string, { bg: string; fg: string }> = {
  'apps-catalog': { bg: '#E9EEFF', fg: '#2D5BFF' },
  roles:          { bg: '#F1EAFE', fg: '#7C3AED' },
  users:          { bg: '#E9EEFF', fg: '#2D5BFF' },
  orgs:           { bg: '#E2F6F2', fg: '#0E9F8A' },
  'o-overview':   { bg: '#FCF1DD', fg: '#E08700' },
};

const DRAWER_W = 236;

const ROUTE_LABEL: Record<string, string> = {
  admin: '后台管理', apps: '应用管理', roles: '角色管理',
  users: '用户管理', organizations: '组织管理', ops: '监控运维', monitor: '监控总览',
};

function buildCrumbs(pathname: string): Array<{ label: string; to?: string }> {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: Array<{ label: string; to?: string }> = [];
  let acc = '';
  parts.forEach((p, idx) => {
    acc += `/${p}`;
    crumbs.push({ label: ROUTE_LABEL[p] ?? p, to: idx === parts.length - 1 ? undefined : acc });
  });
  return crumbs;
}

function IconTile({ itemKey, icon: Icon, active }: { itemKey: string; icon: typeof HomeIcon; active?: boolean }) {
  const tile = TILE[itemKey] ?? { bg: '#F1F0EC', fg: '#5F6470' };
  return (
    <Box
      sx={{
        width: 28, height: 28, borderRadius: '9px',
        background: active ? 'rgba(255,255,255,0.16)' : tile.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, mr: 1.25,
        transition: 'background 0.15s',
      }}
    >
      <Icon sx={{ fontSize: 15, color: active ? '#fff' : tile.fg, transition: 'color 0.15s' }} />
    </Box>
  );
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F6F5F2' }}>

      {/* ── 暖白侧边栏 ── */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_W,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_W,
            boxSizing: 'border-box',
            background: '#FBFAF8',
            borderRight: '1px solid #E7E5E0',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Logo 区 */}
        <Box sx={{ px: 2, pt: 2.5, pb: 2 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 32, height: 32, borderRadius: '10px', flexShrink: 0,
                background: '#16161A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {/* Neural network mark */}
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="3.5" r="2" fill="white" />
                <circle cx="3" cy="12" r="2" fill="white" />
                <circle cx="13" cy="12" r="2" fill="white" />
                <line x1="8" y1="5.5" x2="4" y2="10.4" stroke="white" strokeWidth="1.1" />
                <line x1="8" y1="5.5" x2="12" y2="10.4" stroke="white" strokeWidth="1.1" />
                <line x1="5" y1="12" x2="11" y2="12" stroke="white" strokeWidth="1.1" />
              </svg>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: '#16161A', letterSpacing: '-0.3px', lineHeight: 1.3 }} noWrap>
                AI 应用聚合平台
              </Typography>
              <Typography sx={{ fontSize: 10, color: '#9B9FA8', letterSpacing: '1.5px', fontFamily: '"IBM Plex Mono", monospace' }} noWrap>
                ADMIN CONSOLE
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* 导航列表 */}
        <Box sx={{ flex: 1, overflow: 'auto', py: 0.5, px: 1.25 }}>

          {/* 返回门户 */}
          <ListItemButton
            component={RouterLink}
            to="/"
            sx={{
              borderRadius: '11px', mb: 0.5, px: 1.25,
              color: '#5F6470',
              '&:hover': { bgcolor: '#F1F0EC', color: '#16161A' },
            }}
          >
            <Box sx={{
              width: 28, height: 28, borderRadius: '9px', mr: 1.25,
              background: '#F1F0EC',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <HomeIcon sx={{ fontSize: 15, color: '#5F6470' }} />
            </Box>
            <ListItemText
              primary="返回门户"
              primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
            />
          </ListItemButton>

          {visible.map((g) => {
            const open = expanded[g.key];
            return (
              <Box key={g.key} sx={{ mb: 0.25 }}>
                {/* 分组标题（可展开/收起） */}
                <Box
                  onClick={() => setExpanded((s) => ({ ...s, [g.key]: !open }))}
                  sx={{
                    display: 'flex', alignItems: 'center',
                    px: 1.25, py: 0.75, mt: 1.25, mb: 0.25,
                    cursor: 'pointer', borderRadius: '8px',
                    '&:hover': { bgcolor: '#F1F0EC' },
                  }}
                >
                  <Typography sx={{
                    flex: 1, fontSize: 9.5, fontWeight: 600, letterSpacing: '2px',
                    textTransform: 'uppercase', color: '#9B9FA8',
                    fontFamily: '"IBM Plex Mono", monospace',
                    userSelect: 'none',
                  }}>
                    {g.label}
                  </Typography>
                  {open
                    ? <ExpandLess sx={{ fontSize: 14, color: '#9B9FA8' }} />
                    : <ExpandMore sx={{ fontSize: 14, color: '#9B9FA8' }} />}
                </Box>

                {/* 子菜单项 */}
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List dense disablePadding>
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
                              borderRadius: '11px', mb: 0.5, px: 1.25,
                              color: selected ? '#fff' : '#5F6470',
                              bgcolor: selected ? '#16161A' : 'transparent',
                              boxShadow: selected ? '0 6px 16px rgba(22,22,26,0.22)' : 'none',
                              transition: 'all 0.15s',
                              '&.Mui-selected': {
                                bgcolor: '#16161A',
                                color: '#fff',
                                '&:hover': { bgcolor: '#26262C' },
                              },
                              '&:hover': {
                                bgcolor: selected ? '#26262C' : '#F1F0EC',
                                color: selected ? '#fff' : '#16161A',
                              },
                            }}
                          >
                            <IconTile itemKey={c.key} icon={SubIcon} active={selected} />
                            <ListItemText
                              primary={c.label}
                              primaryTypographyProps={{
                                fontSize: 13,
                                fontWeight: selected ? 700 : 600,
                                color: 'inherit',
                              }}
                            />
                          </ListItemButton>
                        );
                      })}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </Box>

        {/* 底部用户信息 */}
        {user && (
          <Box sx={{ borderTop: '1px solid #E7E5E0', px: 1.5, py: 1.5 }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  width: 30, height: 30, flexShrink: 0,
                  fontSize: 12, fontWeight: 800,
                  bgcolor: '#2D5BFF',
                }}
              >
                {user.displayName.slice(0, 1)}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: '#16161A', lineHeight: 1.3 }} noWrap>
                  {user.displayName}
                </Typography>
                <Typography sx={{ fontSize: 10.5, color: '#9B9FA8' }} noWrap>
                  {user.enterprise}
                </Typography>
              </Box>
              <Tooltip title="退出登录">
                <IconButton
                  size="small"
                  onClick={() => { logout(); navigate('/'); }}
                  sx={{ color: '#9B9FA8', '&:hover': { color: '#16161A', bgcolor: '#F1F0EC' } }}
                >
                  <LogoutIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        )}
      </Drawer>

      {/* ── 右侧内容区 ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* 顶部工具栏 */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          minHeight: 56, px: 3,
          bgcolor: 'rgba(246,245,242,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E7E5E0',
          position: 'sticky', top: 0, zIndex: 10,
          flexShrink: 0,
        }}>
          <Breadcrumbs sx={{ '& .MuiBreadcrumbs-separator': { color: '#C9CDD6' } }}>
            <MuiLink
              component={RouterLink} to="/" underline="hover"
              sx={{ fontSize: 13, color: '#5F6470', '&:hover': { color: '#2D5BFF' } }}
            >
              门户
            </MuiLink>
            {crumbs.map((c, i) =>
              c.to ? (
                <MuiLink
                  key={i} component={RouterLink} to={c.to} underline="hover"
                  sx={{ fontSize: 13, color: '#5F6470', '&:hover': { color: '#2D5BFF' } }}
                >
                  {c.label}
                </MuiLink>
              ) : (
                <Typography key={i} sx={{ fontSize: 13, fontWeight: 700, color: '#16161A' }}>
                  {c.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {user && (
              <>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{
                    width: 28, height: 28, fontSize: 12, fontWeight: 800,
                    bgcolor: '#2D5BFF',
                  }}>
                    {user.displayName.slice(0, 1)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: '#16161A', lineHeight: 1.2 }}>
                      {user.displayName}
                    </Typography>
                    <Typography sx={{ fontSize: 10.5, color: '#9B9FA8' }}>
                      {user.enterprise}
                    </Typography>
                  </Box>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ borderColor: '#E7E5E0' }} />
              </>
            )}
            <Tooltip title="退出登录">
              <IconButton
                size="small"
                onClick={() => { logout(); navigate('/'); }}
                sx={{ color: '#9B9FA8', '&:hover': { color: '#16161A', bgcolor: '#F1F0EC' } }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* 主内容 */}
        <Box component="main" className="admin-main-area" sx={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
