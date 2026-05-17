import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { APPS, CATEGORIES, getAppIcon, type AppCategory, type AppItem } from '@/data/apps';
import { useAuth } from '@/auth/AuthContext';
import { usePersistedState } from '@/data/store';

type FilterValue = AppCategory | 'all';

function AppCard({ app }: { app: AppItem }) {
  const Icon = getAppIcon(app.iconKey);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const open = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      className="app-card"
      id={`app-card-${app.id}`}
      onClick={open}
      role="link"
      tabIndex={0}
      aria-label={`打开${app.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      sx={{ cursor: 'pointer' }}
    >
      <CardContent
        sx={{
          p: '32px 24px !important',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          height: '100%',
        }}
      >
        <Box className="app-card-icon" aria-hidden>
          <Icon sx={{ fontSize: 36, color: '#1E7FC7' }} />
        </Box>
        <Typography className="app-card-title">{app.name}</Typography>
        <Typography className="app-card-desc">{app.description}</Typography>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
        >
          立即体验
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AppMatrix() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const location = useLocation();
  const { user, hasAnyRole } = useAuth();
  const [appsList] = usePersistedState<AppItem[]>('apps', APPS);

  const visibleApps = useMemo(() => {
    const enabled = appsList.filter((a) => a.status === 'enabled');
    // 未登录访客：展示全部启用应用以便预览，点击时引导登录
    if (!user) return enabled;
    if (hasAnyRole(['super_admin'])) return enabled;
    return enabled.filter((a) => a.permittedUserIds.includes(user.userId));
  }, [appsList, user, hasAnyRole]);

  const filteredApps = useMemo(
    () => (filter === 'all' ? visibleApps : visibleApps.filter((a) => a.category === filter)),
    [filter, visibleApps],
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const focus = params.get('focus');
    if (!focus) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(`app-card-${focus}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('app-card-flash');
        window.setTimeout(() => el.classList.remove('app-card-flash'), 1200);
      }
    });
  }, [location.search]);

  return (
    <Box component="section" className="app-matrix" id="app-matrix" aria-label="AI应用矩阵">
      <Box className="app-matrix-inner">
        <Box className="app-matrix-header">
          <Typography
            component="h2"
            className="section-title"
            sx={{
              fontSize: { xs: 26, md: 34 },
              fontWeight: 700,
              background:
                'linear-gradient(135deg, #0C3458 0%, #1E7FC7 55%, #30C7EC 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            航空企业核心AI应用矩阵
          </Typography>
          <Typography className="section-sub">按航空业务场景筛选，一键体验对应应用</Typography>
        </Box>

        <Box className="app-matrix-filter">
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, v) => v && setFilter(v as FilterValue)}
            color="primary"
            size="medium"
          >
            {CATEGORIES.map((c) => (
              <ToggleButton key={c.value} value={c.value} sx={{ px: 3 }}>
                {c.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {filteredApps.length === 0 ? (
          <Stack alignItems="center" sx={{ py: 6, color: 'text.secondary' }}>
            <Typography>
              {user && !hasAnyRole(['super_admin'])
                ? '当前账号未被授权访问任何应用，请联系超级管理员在「应用管理」中开放权限'
                : '该分类暂无应用'}
            </Typography>
          </Stack>
        ) : (
          <Grid container spacing={4}>
            {filteredApps.map((app) => (
              <Grid key={app.id} size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                <AppCard app={app} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
