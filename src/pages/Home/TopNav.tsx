import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, InputAdornment, Snackbar, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { APPS } from '@/data/apps';
import { useAuth } from '@/auth/AuthContext';
import UserMenu from '@/components/UserMenu';

interface NavLink {
  key: string;
  label: string;
  to: string;
  /** 'top' = 滚到顶部；其他字符串 = 滚到对应 id 元素 */
  scroll?: string;
}

const NAV_LINKS: NavLink[] = [
  { key: 'home', label: '首页', to: '/', scroll: 'top' },
  { key: 'apps', label: '应用中心', to: '/apps' },
  { key: 'value', label: '平台优势', to: '/', scroll: 'value-section' },
];

export default function TopNav() {
  const { isLoggedIn } = useAuth();
  const [activeKey, setActiveKey] = useState<string>('home');
  const [keyword, setKeyword] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/apps') {
      setActiveKey('apps');
      return;
    }
    const onScroll = () => {
      const matrix = document.getElementById('app-matrix');
      if (!matrix) return;
      const rect = matrix.getBoundingClientRect();
      setActiveKey(rect.top <= 80 ? 'apps' : 'home');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const onSearch = () => {
    const v = keyword.trim();
    if (!v) return;
    const hit = APPS.find((a) => a.name.includes(v) || a.description.includes(v));
    if (hit) {
      if (location.pathname !== '/') {
        navigate(`/?focus=${hit.id}`);
        return;
      }
      const el = document.getElementById(`app-card-${hit.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('app-card-flash');
        window.setTimeout(() => el.classList.remove('app-card-flash'), 1200);
        return;
      }
    }
    setToast('未匹配到对应应用');
  };

  return (
    <Box component="header" className="top-nav">
      <Box className="top-nav-inner">
        <RouterLink to="/" className="nav-brand" aria-label="返回首页">
          <span className="nav-brand-logo" aria-hidden>
            <span className="nav-brand-logo-text">机载</span>
          </span>
          <span className="nav-brand-text">
            <span className="nav-brand-name">AI应用聚合平台</span>
          </span>
        </RouterLink>

        <Box component="nav" className="nav-menu" aria-label="主导航">
          {NAV_LINKS.map((item) => (
            <RouterLink
              key={item.key}
              to={item.to}
              className={`nav-menu-item${activeKey === item.key ? ' active' : ''}`}
              onClick={(e) => {
                if (!item.scroll) return;
                if (item.scroll === 'top') {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                  return;
                }
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById(item.scroll)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                } else {
                  e.preventDefault();
                  navigate('/', { state: { scrollTo: item.scroll } });
                }
              }}
            >
              {item.label}
            </RouterLink>
          ))}
        </Box>

        <Box className="nav-actions">
          <TextField
            placeholder="搜索AI应用"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch();
            }}
            className="nav-search"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={onSearch} aria-label="搜索">
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/login')}
              sx={{ px: 2 }}
            >
              登录
            </Button>
          )}
        </Box>
      </Box>
      <Snackbar
        open={!!toast}
        autoHideDuration={2200}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message={toast ?? ''}
      />
    </Box>
  );
}
