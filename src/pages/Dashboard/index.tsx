import { Card, Col, Row, Statistic, List, Tag, Table, Button, Empty } from 'antd';
import {
  BarChartOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  QuestionCircleOutlined,
  CodeOutlined,
  AuditOutlined,
  ThunderboltOutlined,
  FundProjectionScreenOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const APPS = [
  { key: 'components', icon: <DatabaseOutlined />, name: '元器件库', desc: '百万级电子元器件参数查询与AI选型', color: 'linear-gradient(135deg,#1677FF,#69B1FF)' },
  { key: 'knowledge', icon: <QuestionCircleOutlined />, name: '知识问答助手', desc: '企业级RAG知识库智能问答与多轮对话', color: 'linear-gradient(135deg,#722ED1,#B37FEB)' },
  { key: 'codegen', icon: <CodeOutlined />, name: '软件代码生成', desc: '自然语言转工程化代码，多语言多框架', color: 'linear-gradient(135deg,#13C2C2,#5CDBD3)' },
  { key: 'codereview', icon: <AuditOutlined />, name: '代码审查', desc: '安全漏洞、规范、性能、缺陷一键检测', color: 'linear-gradient(135deg,#52C41A,#95DE64)' },
  { key: 'circuit', icon: <ThunderboltOutlined />, name: '电路审查', desc: '原理图电气、EMC、可制造性AI审查', color: 'linear-gradient(135deg,#FA8C16,#FFC069)' },
  { key: 'meeting', icon: <FileTextOutlined />, name: '会议纪要', desc: '语音转写、AI纪要与待办事项拆分', color: 'linear-gradient(135deg,#EB2F96,#FF85C0)' },
  { key: 'ppt', icon: <FundProjectionScreenOutlined />, name: 'PPT生成', desc: '一句话生成专业可编辑PPT', color: 'linear-gradient(135deg,#F5222D,#FF7875)' },
  { key: 'add', icon: <PlusOutlined />, name: '自定义应用', desc: '更多AI能力即将上线，敬请期待', color: 'linear-gradient(135deg,#8c8c8c,#bfbfbf)' },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  const recentList = [
    { app: '软件代码生成', time: '今天 14:22', desc: '生成 SpringBoot 用户管理 CRUD 接口' },
    { app: 'PPT生成', time: '今天 11:08', desc: '生成《2026 Q1 研发复盘》10页PPT' },
    { app: '知识问答助手', time: '昨天 17:42', desc: '查询「PCB 阻抗匹配设计要点」' },
    { app: '元器件库', time: '昨天 10:15', desc: '查询 STM32F407VGT6 国产替代' },
    { app: '代码审查', time: '前天 16:33', desc: '审查 user-service 模块 1280 行代码' },
  ];

  const taskColumns = [
    { title: '任务名称', dataIndex: 'name', key: 'name' },
    { title: '应用', dataIndex: 'app', key: 'app' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const map: Record<string, { color: string; text: string }> = {
          running: { color: 'processing', text: '生成中' },
          done: { color: 'success', text: '已完成' },
          fail: { color: 'error', text: '失败' },
        };
        const cfg = map[s] || { color: 'default', text: s };
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
    { title: '进度', dataIndex: 'progress', key: 'progress' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small" danger>取消</Button>
        </>
      ),
    },
  ];

  const taskData = [
    { key: 1, name: 'PPT《产品发布会》', app: 'PPT生成', status: 'running', progress: '62%' },
    { key: 2, name: 'user-service 审查', app: '代码审查', status: 'running', progress: '35%' },
    { key: 3, name: '电源模块 EMC 审查', app: '电路审查', status: 'done', progress: '100%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 第一行：数据概览 */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title={<span><BarChartOutlined /> 累计AI调用次数</span>}
              value={12864}
              valueStyle={{ color: '#1677FF', fontWeight: 700 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>今日新增 1,286 次</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title={<span><AppstoreOutlined /> 可用AI应用总数</span>}
              value={7}
              valueStyle={{ color: '#722ED1', fontWeight: 700 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>覆盖研发 / 办公全场景</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title={<span><FileTextOutlined /> 累计生成文件数</span>}
              value={4382}
              valueStyle={{ color: '#13C2C2', fontWeight: 700 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>近 7 日新增 326 个</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title={<span><CheckCircleOutlined /> 系统运行状态</span>}
              valueRender={() => <Tag color="success" style={{ fontSize: 16, padding: '4px 12px' }}>正常运行</Tag>}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>所有模型与服务在线</div>
          </Card>
        </Col>
      </Row>

      {/* 第二行：AI应用快捷入口 */}
      <Card title="AI应用中心" bordered={false}>
        <Row gutter={[16, 16]}>
          {APPS.map((a) => (
            <Col xs={12} sm={8} md={6} lg={3} key={a.key}>
              <Card
                className="app-entry-card"
                bordered
                onClick={() => a.key !== 'add' && navigate(`/apps/${a.key}`)}
              >
                <div className="app-entry-icon" style={{ background: a.color }}>
                  {a.icon}
                </div>
                <h4>{a.name}</h4>
                <p>{a.desc}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 第三行：最近使用 + 待完成任务 */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="最近使用记录" bordered={false} bodyStyle={{ padding: 0 }}>
            {recentList.length ? (
              <List
                dataSource={recentList}
                renderItem={(item) => (
                  <List.Item style={{ padding: '14px 24px' }}>
                    <List.Item.Meta
                      title={<span style={{ fontWeight: 500 }}>{item.app}</span>}
                      description={<span style={{ color: '#595959' }}>{item.desc}</span>}
                    />
                    <span style={{ color: '#8c8c8c', fontSize: 12 }}>{item.time}</span>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无历史使用记录" style={{ padding: 40 }}>
                <Button type="primary" onClick={() => navigate('/apps/codegen')}>立即体验</Button>
              </Empty>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="待完成任务" bordered={false}>
            <Table size="middle" columns={taskColumns} dataSource={taskData} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
