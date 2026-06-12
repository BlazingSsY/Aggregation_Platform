import { useEffect, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import EastIcon from '@mui/icons-material/East';
import { useLocation, useNavigate } from 'react-router-dom';
import { APPS, CATEGORIES, getAppIcon, type AppCategory, type AppItem } from '@/data/apps';
import { useAuth } from '@/auth/AuthContext';
import { usePersistedState } from '@/data/store';

type FilterValue = AppCategory | 'all';

/* 每个应用的图标磁贴配色（按 id 优先，类别兜底） */
const APP_COLOR: Record<string, string> = {
  knowledge: 'ic-blue',
  meeting: 'ic-violet',
  codegen: 'ic-violet',
  codereview: 'ic-violet',
  circuit: 'ic-teal',
  components: 'ic-teal',
  docgen: 'ic-amber',
  docreview: 'ic-amber',
};
const CAT_COLOR: Record<AppCategory, string> = {
  研发提效: 'ic-violet',
  硬件设计: 'ic-teal',
  办公协同: 'ic-blue',
};
function colorOf(app: AppItem) {
  return APP_COLOR[app.id] ?? CAT_COLOR[app.category] ?? 'ic-blue';
}

function useOpenApp() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  return (app: AppItem) => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };
}

function cellA11y(open: () => void) {
  return {
    role: 'link' as const,
    tabIndex: 0,
    onClick: open,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    },
  };
}

/* ── 2×2 主推大格（含对话演示） ── */
function FeaturedCell({ app }: { app: AppItem }) {
  const Icon = getAppIcon(app.iconKey);
  const openApp = useOpenApp();
  return (
    <div
      className="bento-cell bento-big"
      id={`app-card-${app.id}`}
      aria-label={`打开${app.name}`}
      {...cellA11y(() => openApp(app))}
    >
      <span className="bento-feat-tag">MOST USED</span>
      <span className="bento-go"><ArrowOutwardIcon sx={{ fontSize: 16 }} /></span>
      <div className="bento-ic"><Icon sx={{ fontSize: 22 }} /></div>
      <h3>{app.name}</h3>
      <p className="desc">{app.description}</p>
      <div className="chatmock" aria-hidden>
        <div className="bubble bub-q">DO-178C 中 A 级软件的目标项有多少条？</div>
        <div className="bubble bub-a">
          <b>71 条目标项</b>，其中 30 条需独立性验证。依据 DO-178C 表 A-1 至 A-10…
        </div>
      </div>
    </div>
  );
}

/* ── 2×1 横长格（含声波动画） ── */
function WideCell({ app }: { app: AppItem }) {
  const Icon = getAppIcon(app.iconKey);
  const openApp = useOpenApp();
  return (
    <div
      className="bento-cell bento-wide"
      id={`app-card-${app.id}`}
      aria-label={`打开${app.name}`}
      {...cellA11y(() => openApp(app))}
    >
      <span className="bento-go"><ArrowOutwardIcon sx={{ fontSize: 16 }} /></span>
      <div className={`bento-ic ${colorOf(app)}`}><Icon sx={{ fontSize: 22 }} /></div>
      <h3>{app.name}</h3>
      <p className="desc">{app.description}</p>
      <div className="wave" aria-hidden>
        {Array.from({ length: 18 }, (_, i) => <i key={i} />)}
      </div>
    </div>
  );
}

/* ── 1×1 标准格 ── */
function NormalCell({ app }: { app: AppItem }) {
  const Icon = getAppIcon(app.iconKey);
  const openApp = useOpenApp();
  return (
    <div
      className="bento-cell"
      id={`app-card-${app.id}`}
      aria-label={`打开${app.name}`}
      {...cellA11y(() => openApp(app))}
    >
      <span className="bento-go"><ArrowOutwardIcon sx={{ fontSize: 16 }} /></span>
      <div className={`bento-ic ${colorOf(app)}`}><Icon sx={{ fontSize: 22 }} /></div>
      <h3>{app.name}</h3>
      <p className="desc">{app.description}</p>
    </div>
  );
}

export default function AppMatrix() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const location = useLocation();
  const navigate = useNavigate();
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

  /* 「全部」视图且应用足够多时启用混排：首个 2×2、次个 2×1 */
  const useBentoLayout = filter === 'all' && filteredApps.length >= 4;
  const [featured, wide, ...rest] = filteredApps;

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
        <Box className="sec-head">
          <Box>
            <div className="section-eyebrow">App Matrix</div>
            <Typography component="h2" className="section-title">
              航空企业核心 AI 应用
            </Typography>
          </Box>
          <p className="sec-side">重点应用占据大格，一眼锁定高频能力；全部应用统一权限管控。</p>
        </Box>

        <Box className="app-matrix-filter" role="tablist" aria-label="应用分类筛选">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              role="tab"
              aria-selected={filter === c.value}
              className={`filter-chip${filter === c.value ? ' on' : ''}`}
              onClick={() => setFilter(c.value as FilterValue)}
            >
              {c.label}
            </button>
          ))}
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
          <div className="bento">
            {useBentoLayout ? (
              <>
                <FeaturedCell app={featured} />
                <WideCell app={wide} />
                {rest.map((app) => (
                  <NormalCell key={app.id} app={app} />
                ))}
                <div
                  className="bento-cell bento-more"
                  aria-label="前往应用中心"
                  {...cellA11y(() => navigate('/apps'))}
                >
                  <h3>全部 {visibleApps.length} 个应用</h3>
                  <span className="arrow"><EastIcon sx={{ fontSize: 22 }} /></span>
                </div>
              </>
            ) : (
              filteredApps.map((app) => <NormalCell key={app.id} app={app} />)
            )}
          </div>
        )}
      </Box>
    </Box>
  );
}
