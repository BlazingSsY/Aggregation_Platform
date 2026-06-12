import { Box, Typography } from '@mui/material';

interface ValueItem {
  key: string;
  num: string;
  title: string;
  desc: string;
}

const VALUES: ValueItem[] = [
  {
    key: 'coverage',
    num: '01',
    title: '航空全链路覆盖',
    desc: '面向研发、制造、运维、保障全链路场景，统一入口、连贯体验，深度贴合航空业务流程。',
  },
  {
    key: 'security',
    num: '02',
    title: '航空级安全合规',
    desc: '通过航空行业安全合规审核，权限分级管理，数据可审计、可追溯，满足等保与适航要求。',
  },
  {
    key: 'reliability',
    num: '03',
    title: '高可用稳定保障',
    desc: '多活部署 + 灰度发布，服务可用性 99.9%，关键航空业务系统 7×24 稳定运行。',
  },
  {
    key: 'iteration',
    num: '04',
    title: '持续迭代升级',
    desc: '模型与功能持续演进，紧跟航空数字化趋势，定期上线新能力，赋能业务长期增长。',
  },
];

export default function ValueSection() {
  return (
    <Box component="section" className="value-section" id="value-section" aria-label="平台价值">
      <Box className="value-inner">
        <Box className="values-grid">
          <Box className="values-stick">
            <div className="section-eyebrow">Platform Edge</div>
            <Typography component="h2" className="section-title">
              为什么选择
              <br />
              聚合平台
            </Typography>
            <p className="sec-side">
              不是又一个工具集合，而是面向航空企业级生产力场景的一站式 AI 能力底座。
            </p>
          </Box>
          <Box className="v-list">
            {VALUES.map((v) => (
              <div key={v.key} className="v-item">
                <span className="v-num">{v.num}</span>
                <div>
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
