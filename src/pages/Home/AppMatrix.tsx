import { useMemo, useState } from 'react';
import { Button, Card, Col, Empty, Radio, Row } from 'antd';
import { APPS, CATEGORIES, type AppCategory, type AppItem } from '@/data/apps';

type FilterValue = AppCategory | 'all';

function AppCard({ app }: { app: AppItem }) {
  const Icon = app.icon;

  const open = () => {
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      hoverable
      className="app-card"
      id={`app-card-${app.id}`}
      onClick={open}
      bodyStyle={{ padding: '32px 24px' }}
      role="link"
      tabIndex={0}
      aria-label={`打开${app.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className="app-card-icon" aria-hidden>
        <Icon style={{ fontSize: 36, color: '#0958D9' }} />
      </div>
      <h3 className="app-card-title">{app.name}</h3>
      <p className="app-card-desc">{app.description}</p>
      <Button
        type="primary"
        ghost
        block
        className="app-card-cta"
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
      >
        立即体验
      </Button>
    </Card>
  );
}

export default function AppMatrix() {
  const [filter, setFilter] = useState<FilterValue>('all');

  const filteredApps = useMemo(
    () => (filter === 'all' ? APPS : APPS.filter((a) => a.category === filter)),
    [filter],
  );

  return (
    <section className="app-matrix" id="app-matrix" aria-label="AI应用矩阵">
      <div className="app-matrix-inner">
        <div className="app-matrix-header">
          <h2 className="section-title">航空企业核心AI应用矩阵</h2>
          <p className="section-sub">按航空业务场景筛选，一键体验对应应用</p>
        </div>

        <div className="app-matrix-filter">
          <Radio.Group
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="large"
            options={CATEGORIES.map((c) => ({ label: c.label, value: c.value }))}
          />
        </div>

        {filteredApps.length === 0 ? (
          <Empty description="该分类暂无应用" />
        ) : (
          <Row gutter={[32, 32]}>
            {filteredApps.map((app) => (
              <Col key={app.id} xs={24} sm={12} md={12} lg={6} xl={6}>
                <AppCard app={app} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </section>
  );
}
