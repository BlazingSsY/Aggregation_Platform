import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid2 as Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import TopNav from '@/pages/Home/TopNav';
import {
  APPS,
  CATEGORIES,
  getAppIcon,
  type AppCategory,
  type AppItem,
} from '@/data/apps';
import { useAuth } from '@/auth/AuthContext';
import { usePersistedState } from '@/data/store';

type FilterValue = AppCategory | 'all';
type SortKey = 'recent' | 'popular' | 'recommended';

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: 'recent', label: '最近使用' },
  { key: 'recommended', label: '推荐应用' },
  { key: 'popular', label: '热门应用' },
];

const RECENT_IDS = ['knowledge', 'codegen', 'docgen'];
const POPULAR_IDS = ['codegen', 'docgen', 'meeting', 'knowledge', 'docreview', 'codereview'];

function AppCardWide({ app }: { app: AppItem }) {
  const Icon = getAppIcon(app.iconKey);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const open = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/apps' } });
      return;
    }
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        '&:hover': { borderColor: 'primary.light', boxShadow: '0 12px 28px rgba(30,127,199,0.14)' },
      }}
      onClick={open}
    >
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 1.5,
              bgcolor: 'rgba(30,127,199,0.1)',
              color: 'primary.main',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{app.name}</Typography>
              <Chip size="small" label={app.category} color="info" variant="outlined" />
            </Stack>
            <Typography
              sx={{
                fontSize: 13,
                color: 'text.secondary',
                mt: 1,
                lineHeight: 1.65,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {app.description}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
              >
                立即体验
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AppsPage() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const [sort, setSort] = useState<SortKey>('recommended');
  const [search, setSearch] = useState('');

  const { user, hasAnyRole, isLoggedIn } = useAuth();
  const [appsList] = usePersistedState<AppItem[]>('apps', APPS);

  const accessibleApps = useMemo(() => {
    const enabled = appsList.filter((a) => a.status === 'enabled');
    if (!user) return enabled;
    if (hasAnyRole(['super_admin'])) return enabled;
    return enabled.filter((a) => a.permittedUserIds.includes(user.userId));
  }, [appsList, user, hasAnyRole]);

  const visible = useMemo(() => {
    let list = accessibleApps;
    if (filter !== 'all') list = list.filter((a) => a.category === filter);
    if (search) {
      const kw = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(kw) ||
          a.description.toLowerCase().includes(kw) ||
          a.category.includes(search),
      );
    }
    if (sort === 'recent') {
      list = [...list].sort((a, b) => {
        const ai = RECENT_IDS.indexOf(a.id);
        const bi = RECENT_IDS.indexOf(b.id);
        return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
      });
    } else if (sort === 'popular') {
      list = [...list].sort((a, b) => {
        const ai = POPULAR_IDS.indexOf(a.id);
        const bi = POPULAR_IDS.indexOf(b.id);
        return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
      });
    }
    return list;
  }, [filter, sort, search, accessibleApps]);

  return (
    <Box className="home-page">
      <TopNav />
      <Box component="main" className="home-main">
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 5 }}>
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
            应用中心
          </Typography>
          <Typography className="section-sub">
            发现并访问所有已为您开放的 AI 应用
          </Typography>

          {isLoggedIn && !hasAnyRole(['super_admin']) && accessibleApps.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              当前账号未被授权访问任何应用，请联系超级管理员在「应用管理」中开放权限。
            </Alert>
          )}

          <Card sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  placeholder="搜索应用名称、描述、分类"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <ToggleButtonGroup
                  size="small"
                  value={filter}
                  exclusive
                  color="primary"
                  onChange={(_, v) => v && setFilter(v as FilterValue)}
                  sx={{ flexWrap: 'wrap' }}
                >
                  {CATEGORIES.map((c) => (
                    <ToggleButton key={c.value} value={c.value}>
                      {c.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  select
                  size="small"
                  label="排序"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <MenuItem key={o.key} value={o.key}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Card>

          <Grid container spacing={2}>
            {visible.map((app) => (
              <Grid key={app.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <AppCardWide app={app} />
              </Grid>
            ))}
          </Grid>

          {visible.length === 0 && (
            <Stack alignItems="center" sx={{ py: 8, color: 'text.secondary' }}>
              <Typography>没有符合条件的应用</Typography>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
