import { Col, Row } from 'antd';
import {
  AppstoreOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { ComponentType } from 'react';

interface ValueItem {
  key: string;
  title: string;
  desc: string;
  icon: ComponentType<{ style?: React.CSSProperties }>;
}

const VALUES: ValueItem[] = [
  {
    key: 'coverage',
    title: '航空全链路覆盖',
    desc: '面向研发、制造、运维、保障全链路场景，统一入口、连贯体验，深度贴合航空业务流程。',
    icon: AppstoreOutlined,
  },
  {
    key: 'security',
    title: '航空级安全合规',
    desc: '通过航空行业安全合规审核，权限分级管理，数据可审计、可追溯，满足等保与适航要求。',
    icon: SafetyCertificateOutlined,
  },
  {
    key: 'reliability',
    title: '高可用稳定保障',
    desc: '多活部署 + 灰度发布，服务可用性 99.9%，关键航空业务系统 7×24 稳定运行。',
    icon: RocketOutlined,
  },
  {
    key: 'iteration',
    title: '持续迭代升级',
    desc: '模型与功能持续演进，紧跟航空数字化趋势，定期上线新能力，赋能业务长期增长。',
    icon: SyncOutlined,
  },
];

export default function ValueSection() {
  return (
    <section className="value-section" id="value-section" aria-label="平台价值">
      <div className="value-inner">
        <div className="value-header">
          <h2 className="section-title">平台优势</h2>
          <p className="section-sub">面向航空企业级生产力场景的一站式AI能力底座</p>
        </div>
        <Row gutter={[32, 32]}>
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <Col key={v.key} xs={24} sm={12} md={12} lg={6} xl={6}>
                <a href="#" className="value-card" aria-label={v.title}>
                  <div className="value-icon">
                    <Icon style={{ fontSize: 32, color: '#0958D9' }} />
                  </div>
                  <h4 className="value-title">{v.title}</h4>
                  <p className="value-desc">{v.desc}</p>
                </a>
              </Col>
            );
          })}
        </Row>
      </div>
    </section>
  );
}
