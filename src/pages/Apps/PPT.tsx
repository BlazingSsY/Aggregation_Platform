import { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Steps,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  List,
  Empty,
  Space,
  Tag,
  message,
  InputNumber,
} from 'antd';
import { FundProjectionScreenOutlined, DownloadOutlined, FilePdfOutlined, ReloadOutlined } from '@ant-design/icons';

const TEMPLATES = [
  { key: 't1', name: '商务简约·蓝', color: 'linear-gradient(135deg,#1677FF,#69B1FF)' },
  { key: 't2', name: '科技风·深空', color: 'linear-gradient(135deg,#0F1419,#1F2329)' },
  { key: 't3', name: '学术汇报·浅', color: 'linear-gradient(135deg,#F5F7FA,#D9D9D9)' },
  { key: 't4', name: '企业宣传·红', color: 'linear-gradient(135deg,#F5222D,#FF7875)' },
];

export default function PPTPage() {
  const [step, setStep] = useState(0);
  const [tpl, setTpl] = useState('t1');
  const [generated, setGenerated] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { title: '封面', desc: '2026 Q1 研发项目复盘' },
    { title: '目录', desc: '一、概况 / 二、成果 / 三、问题 / 四、规划' },
    { title: '01 · 整体概况', desc: '交付率 92%，超前完成 3 项' },
    { title: '02 · 核心成果', desc: '关键模块上线、性能提升 30%' },
    { title: '03 · 问题与挑战', desc: '测试覆盖率不足、技术债积累' },
    { title: '04 · Q2 规划', desc: '架构调整、质量专项、资源分配' },
    { title: '05 · 关键里程碑', desc: '里程碑甘特图与责任矩阵' },
    { title: '06 · 风险点', desc: '人力、依赖、合规风险评估' },
    { title: '07 · 行动项', desc: '行动项清单与责任人' },
    { title: '结尾页', desc: '感谢聆听 · Q&A' },
  ];

  return (
    <Row gutter={16}>
      <Col xs={24} lg={10}>
        <Card bordered={false} title="PPT 配置" style={{ minHeight: 540 }}>
          <Steps
            current={step}
            onChange={setStep}
            direction="vertical"
            items={[
              {
                title: '基础信息',
                description: (
                  <Form layout="vertical" style={{ marginTop: 8 }}>
                    <Form.Item label="PPT 标题">
                      <Input defaultValue="2026 Q1 研发项目复盘" />
                    </Form.Item>
                    <Form.Item label="副标题">
                      <Input defaultValue="技术中心 · 月度汇报" />
                    </Form.Item>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item label="汇报人"><Input defaultValue="admin_root" /></Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="汇报日期"><Input defaultValue="2026-04-30" /></Form.Item>
                      </Col>
                    </Row>
                    <Form.Item label="页数范围">
                      <InputNumber min={5} max={50} defaultValue={10} style={{ width: '100%' }} />
                    </Form.Item>
                  </Form>
                ),
              },
              {
                title: '内容与风格',
                description: (
                  <div style={{ marginTop: 8 }}>
                    <Input.TextArea
                      rows={4}
                      defaultValue="生成一份2026年Q1研发项目复盘PPT，10页，包含项目进度、成果、问题、后续计划"
                    />
                    <Select
                      style={{ width: '100%', marginTop: 12 }}
                      defaultValue="business"
                      options={[
                        { value: 'business', label: '商务简约' },
                        { value: 'tech', label: '科技风' },
                        { value: 'academic', label: '学术汇报' },
                        { value: 'corp', label: '企业宣传' },
                      ]}
                    />
                    <div style={{ marginTop: 12, marginBottom: 8, color: '#595959' }}>选择模板</div>
                    <Row gutter={8}>
                      {TEMPLATES.map((t) => (
                        <Col span={12} key={t.key} style={{ marginBottom: 8 }}>
                          <Card
                            size="small"
                            hoverable
                            onClick={() => setTpl(t.key)}
                            style={{
                              borderColor: tpl === t.key ? '#1677FF' : undefined,
                              borderWidth: tpl === t.key ? 2 : 1,
                            }}
                          >
                            <div style={{ height: 60, borderRadius: 4, background: t.color, marginBottom: 6 }} />
                            <div style={{ fontSize: 12, textAlign: 'center' }}>{t.name}</div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              },
              {
                title: '生成设置',
                description: (
                  <div style={{ marginTop: 8 }}>
                    <Checkbox.Group
                      options={[
                        { value: 'cover', label: '封面' },
                        { value: 'toc', label: '目录' },
                        { value: 'transition', label: '过渡页' },
                        { value: 'end', label: '结尾页' },
                      ]}
                      defaultValue={['cover', 'toc', 'transition', 'end']}
                    />
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<FundProjectionScreenOutlined />}
                      style={{ marginTop: 16 }}
                      onClick={() => {
                        setGenerated(true);
                        message.success('PPT 已生成');
                      }}
                    >
                      生成 PPT
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </Col>

      <Col xs={24} lg={14}>
        <Card
          bordered={false}
          title="预览"
          extra={
            generated && (
              <Space>
                <Button icon={<DownloadOutlined />}>下载 PPTX</Button>
                <Button icon={<FilePdfOutlined />}>导出 PDF</Button>
                <Button icon={<ReloadOutlined />} onClick={() => setGenerated(false)}>重新生成</Button>
              </Space>
            )
          }
        >
          {!generated ? (
            <div
              style={{
                height: 460,
                borderRadius: 8,
                background: TEMPLATES.find((t) => t.key === tpl)?.color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <FundProjectionScreenOutlined style={{ fontSize: 56, marginBottom: 12 }} />
              <div style={{ fontSize: 18, fontWeight: 500 }}>配置完成后点击生成</div>
              <div style={{ marginTop: 6, color: 'rgba(255,255,255,.8)' }}>将在此处实时预览 PPT</div>
            </div>
          ) : (
            <Row gutter={12}>
              <Col span={6} style={{ borderRight: '1px solid #f0f0f0', maxHeight: 460, overflowY: 'auto' }}>
                <List
                  size="small"
                  dataSource={slides}
                  renderItem={(s, i) => (
                    <List.Item
                      style={{
                        cursor: 'pointer',
                        background: i === activeSlide ? '#e6f4ff' : undefined,
                        borderRadius: 4,
                        padding: '6px 8px',
                      }}
                      onClick={() => setActiveSlide(i)}
                    >
                      <Space direction="vertical" size={0} style={{ width: '100%' }}>
                        <Tag>P{i + 1}</Tag>
                        <span style={{ fontSize: 12 }}>{s.title}</span>
                      </Space>
                    </List.Item>
                  )}
                />
              </Col>
              <Col span={18}>
                <div
                  style={{
                    height: 460,
                    borderRadius: 8,
                    background: TEMPLATES.find((t) => t.key === tpl)?.color,
                    color: '#fff',
                    padding: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.8 }}>第 {activeSlide + 1} 页 / 共 {slides.length} 页</div>
                  <div style={{ fontSize: 36, fontWeight: 700, margin: '12px 0' }}>
                    {slides[activeSlide].title}
                  </div>
                  <div style={{ fontSize: 16, lineHeight: 1.8, opacity: 0.9 }}>
                    {slides[activeSlide].desc}
                  </div>
                </div>
              </Col>
            </Row>
          )}
          {!generated && <Empty style={{ display: 'none' }} />}
        </Card>
      </Col>
    </Row>
  );
}
