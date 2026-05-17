import { Box, Button, Typography } from '@mui/material';

export default function HeroBanner() {
  return (
    <Box component="section" className="hero-banner" id="top" aria-label="平台品牌宣传">
      <Box className="hero-decor" aria-hidden>
        <svg className="decor-cloud-1" viewBox="0 0 200 80" fill="none">
          <path
            d="M30 60 Q10 60 10 45 Q10 30 28 30 Q32 14 50 14 Q70 14 76 30 Q92 26 100 40 Q120 36 124 56 Q120 66 104 64 L40 64 Q30 66 30 60 Z"
            fill="rgba(255,255,255,0.6)"
          />
        </svg>
        <svg className="decor-cloud-2" viewBox="0 0 200 80" fill="none">
          <path
            d="M30 60 Q10 60 10 45 Q10 30 28 30 Q32 14 50 14 Q70 14 76 30 Q92 26 100 40 Q120 36 124 56 Q120 66 104 64 L40 64 Q30 66 30 60 Z"
            fill="rgba(255,255,255,0.55)"
          />
        </svg>
        <svg className="decor-cloud-3" viewBox="0 0 200 80" fill="none">
          <path
            d="M30 60 Q10 60 10 45 Q10 30 28 30 Q32 14 50 14 Q70 14 76 30 Q92 26 100 40 Q120 36 124 56 Q120 66 104 64 L40 64 Q30 66 30 60 Z"
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
        <svg className="decor-cloud-4" viewBox="0 0 200 80" fill="none">
          <path
            d="M30 60 Q10 60 10 45 Q10 30 28 30 Q32 14 50 14 Q70 14 76 30 Q92 26 100 40 Q120 36 124 56 Q120 66 104 64 L40 64 Q30 66 30 60 Z"
            fill="rgba(255,255,255,0.7)"
          />
        </svg>
      </Box>
      <Box className="hero-inner" sx={{ textAlign: 'center' }}>
        <Typography
          component="h1"
          className="hero-title"
          sx={{
            textAlign: 'center',
            width: '100%',
            fontSize: { xs: '40px', sm: '52px', md: '72px' },
            fontWeight: 700,
            lineHeight: 1.4,
            letterSpacing: '1.5px',
            mb: '36px',
            background:
              'linear-gradient(135deg, #ffffff 0%, #ffffff 35%, #D6EFFD 70%, #46AEF7 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            textShadow: '0 2px 18px rgba(70,174,247,0.28)',
          }}
        >
          航空企业级 AI 全场景应用矩阵
        </Typography>
        <Typography
          className="hero-subtitle"
          sx={{
            textAlign: 'center',
            mx: 'auto',
            fontSize: { xs: '16px', md: '18px' },
            fontWeight: 400,
            lineHeight: 2.1,
            color: 'rgba(255,255,255,0.88)',
            maxWidth: 820,
            mb: '64px',
          }}
        >
          面向航空产业研发、制造、运维全链路场景，覆盖知识管理、研发提效、硬件设计、文档处理，一站式赋能航空智造与数字化升级
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            href="#app-matrix"
            sx={{
              background:
                'linear-gradient(135deg, #ffffff 0%, #EBF7FE 60%, #D6EFFD 100%)',
              color: 'var(--av-deep)',
              px: 4,
              py: 1.3,
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(48,199,236,0.45)',
              '&:hover': {
                background:
                  'linear-gradient(135deg, #ffffff 0%, #ffffff 60%, #46AEF7 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(48,199,236,0.55)',
              },
            }}
          >
            浏览全部应用
          </Button>
          <Button
            variant="outlined"
            href="#value-section"
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.6)',
              borderWidth: 1.5,
              px: 4,
              py: 1.3,
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
              '&:hover': {
                borderColor: '#fff',
                borderWidth: 1.5,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(70,174,247,0.18) 100%)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            了解平台价值
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
