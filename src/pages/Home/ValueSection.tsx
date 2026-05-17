import { Box, Grid2 as Grid, Typography } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SyncIcon from '@mui/icons-material/Sync';
import type { SvgIconComponent } from '@mui/icons-material';

interface ValueItem {
  key: string;
  title: string;
  desc: string;
  icon: SvgIconComponent;
}

const VALUES: ValueItem[] = [
  {
    key: 'coverage',
    title: '航空全链路覆盖',
    desc: '面向研发、制造、运维、保障全链路场景，统一入口、连贯体验，深度贴合航空业务流程。',
    icon: AppsIcon,
  },
  {
    key: 'security',
    title: '航空级安全合规',
    desc: '通过航空行业安全合规审核，权限分级管理，数据可审计、可追溯，满足等保与适航要求。',
    icon: VerifiedUserIcon,
  },
  {
    key: 'reliability',
    title: '高可用稳定保障',
    desc: '多活部署 + 灰度发布，服务可用性 99.9%，关键航空业务系统 7×24 稳定运行。',
    icon: RocketLaunchIcon,
  },
  {
    key: 'iteration',
    title: '持续迭代升级',
    desc: '模型与功能持续演进，紧跟航空数字化趋势，定期上线新能力，赋能业务长期增长。',
    icon: SyncIcon,
  },
];

export default function ValueSection() {
  return (
    <Box component="section" className="value-section" id="value-section" aria-label="平台价值">
      <Box className="value-inner">
        <Box className="value-header">
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
            平台优势
          </Typography>
          <Typography className="section-sub">面向航空企业级生产力场景的一站式AI能力底座</Typography>
        </Box>
        <Grid container spacing={4}>
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <Grid key={v.key} size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                <Box component="a" href="#" className="value-card" aria-label={v.title}>
                  <Box className="value-icon">
                    <Icon sx={{ fontSize: 32, color: '#1E7FC7' }} />
                  </Box>
                  <Typography component="h4" className="value-title">
                    {v.title}
                  </Typography>
                  <Typography className="value-desc">{v.desc}</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
