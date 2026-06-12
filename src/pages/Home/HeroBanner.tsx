import { Box, Button, Typography } from '@mui/material';
import ActivityIcon from '@mui/icons-material/MonitorHeart';
import AppsIcon from '@mui/icons-material/Apps';
import BusinessIcon from '@mui/icons-material/Business';
import RadarIcon from '@mui/icons-material/Radar';

export default function HeroBanner() {
  return (
    <Box component="section" className="hero-banner" id="top" aria-label="平台品牌宣传">
      <Box className="hero-grid">
        {/* ── 左侧：标题 + CTA ── */}
        <Box className="hero-left">
          <div className="hero-badge fade-up">
            <span className="hero-badge-dot" />
            航空产业 AI 全场景赋能平台
          </div>

          <Typography
            component="h1"
            className="hero-title fade-up fd-1"
            sx={{
              fontSize: { xs: '36px', sm: '44px', md: '54px' },
              fontWeight: 800,
              lineHeight: 1.18,
              letterSpacing: '-1.8px',
            }}
          >
            一个入口，
            <br />
            全部<span className="u">航空 AI 能力</span>
          </Typography>

          <Typography
            className="hero-subtitle fade-up fd-2"
            sx={{ fontSize: { xs: '14px', md: '15.5px' }, lineHeight: 1.8 }}
          >
            覆盖研发、制造、运维全链路 8 大 AI
            应用——知识管理、研发提效、硬件设计、文档处理，一站式赋能航空智造。
          </Typography>

          <Box className="hero-cta fade-up fd-3">
            <Button
              variant="contained"
              href="#app-matrix"
              sx={{
                px: 3.5, py: 1.4,
                borderRadius: '100px',
                fontSize: 15, fontWeight: 700,
                bgcolor: '#2D5BFF',
                boxShadow: '0 6px 20px rgba(45,91,255,0.35)',
                '&:hover': {
                  bgcolor: '#1D47E8',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 28px rgba(45,91,255,0.45)',
                },
                transition: 'all 0.18s ease',
              }}
            >
              浏览全部应用 →
            </Button>
            <Button
              variant="outlined"
              href="#value-section"
              sx={{
                px: 3.5, py: 1.4,
                borderRadius: '100px',
                fontSize: 15, fontWeight: 700,
                color: '#16161A',
                borderColor: '#16161A',
                borderWidth: '1.5px',
                '&:hover': {
                  bgcolor: '#16161A',
                  color: '#fff',
                  borderColor: '#16161A',
                  borderWidth: '1.5px',
                },
                transition: 'all 0.18s ease',
              }}
            >
              了解平台价值
            </Button>
          </Box>
        </Box>

        {/* ── 右侧：2×2 数据便当格 ── */}
        <Box className="hero-bento fade-up fd-2">
          <div className="hb hb-dark">
            <span className="hb-l">Availability</span>
            <div>
              <div className="hb-v">99.9<small>%</small></div>
              <div className="hb-d">服务可用性 · 多活部署</div>
            </div>
            <ActivityIcon className="bgicon" />
          </div>
          <div className="hb hb-blue">
            <span className="hb-l">Applications</span>
            <div>
              <div className="hb-v">8</div>
              <div className="hb-d">AI 应用 · 持续上新</div>
            </div>
            <AppsIcon className="bgicon" />
          </div>
          <div className="hb hb-amber">
            <span className="hb-l">Enterprises</span>
            <div>
              <div className="hb-v">3<small>+</small></div>
              <div className="hb-d">接入企业 · 协同共建</div>
            </div>
            <BusinessIcon className="bgicon" />
          </div>
          <div className="hb hb-plain">
            <span className="hb-l">Status</span>
            <div>
              <span className="hb-live">系统运行中</span>
              <div className="hb-d" style={{ marginTop: 4 }}>今日调用 23,847 次</div>
            </div>
            <RadarIcon className="bgicon" />
          </div>
        </Box>
      </Box>
    </Box>
  );
}
