import { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Tabs,
  Input,
  Upload,
  Checkbox,
  Button,
  Statistic,
  Tag,
  Collapse,
  Space,
  message,
} from 'antd';
import {
  InboxOutlined,
  AuditOutlined,
  ExportOutlined,
  CopyOutlined,
} from '@ant-design/icons';

const CHECKS = [
  { value: 'spec', label: '代码规范检查' },
  { value: 'security', label: '安全漏洞检测' },
  { value: 'perf', label: '性能优化建议' },
  { value: 'logic', label: '逻辑缺陷排查' },
  { value: 'comment', label: '注释完整性检查' },
];

const ISSUES = [
  {
    level: 'high',
    title: '[高危] SQL 注入风险',
    pos: 'UserMapper.java:48',
    desc: '直接拼接用户输入构造 SQL，存在注入风险。',
    fix: '使用参数化查询：\n@Select("SELECT * FROM users WHERE name = #{name}")',
    before: 'String sql = "SELECT * FROM users WHERE name = \'" + name + "\'";',
    after: '@Select("SELECT * FROM users WHERE name = #{name}")',
  },
  {
    level: 'mid',
    title: '[中危] 异常吞噬',
    pos: 'UserService.java:112',
    desc: 'catch 块捕获异常但未记录日志，可能掩盖错误。',
    fix: '使用 logger.error 记录异常堆栈。',
    before: 'try { ... } catch (Exception e) { /* ignore */ }',
    after: 'try { ... } catch (Exception e) { log.error("xxx fail", e); throw e; }',
  },
  {
    level: 'low',
    title: '[优化] 集合遍历可使用 Stream',
    pos: 'UserController.java:36',
    desc: 'for 循环可改写为 Stream API 提升可读性。',
    fix: 'list.stream().map(...).collect(Collectors.toList())',
    before: 'for (User u : list) { ... }',
    after: 'list.stream().map(User::getName).collect(Collectors.toList());',
  },
];

const LEVEL_MAP: Record<string, { color: string; text: string }> = {
  high: { color: 'error', text: '高危' },
  mid: { color: 'warning', text: '中风险' },
  low: { color: 'default', text: '低风险' },
};

export default function CodeReviewPage() {
  const [reviewed, setReviewed] = useState(false);
  const [checks, setChecks] = useState(CHECKS.map((c) => c.value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card bordered={false} title="代码输入">
            <Tabs
              items={[
                {
                  key: 'paste',
                  label: '代码粘贴',
                  children: (
                    <Input.TextArea
                      rows={14}
                      placeholder="请粘贴需要审查的代码，支持 Java / Python / JS / Go 等多语言"
                      defaultValue={`public List<User> queryByName(String name) {
    String sql = "SELECT * FROM users WHERE name = '" + name + "'";
    return jdbcTemplate.query(sql, new UserRowMapper());
}`}
                    />
                  ),
                },
                {
                  key: 'upload',
                  label: '文件上传',
                  children: (
                    <Upload.Dragger multiple beforeUpload={() => false}>
                      <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                      <p className="ant-upload-text">点击或拖拽文件至此区域上传</p>
                      <p className="ant-upload-hint">支持 .zip / .java / .py / .js / .ts / .go 等格式</p>
                    </Upload.Dragger>
                  ),
                },
              ]}
            />
            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>审查项配置</div>
              <Checkbox.Group
                options={CHECKS}
                value={checks}
                onChange={(v) => setChecks(v as string[])}
              />
            </div>
            <Button
              type="primary"
              size="large"
              block
              icon={<AuditOutlined />}
              style={{ marginTop: 16 }}
              onClick={() => {
                setReviewed(true);
                message.success('审查完成');
              }}
            >
              开始审查
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title="审查结果"
            extra={
              <Button icon={<ExportOutlined />} disabled={!reviewed}>
                导出审查报告
              </Button>
            }
          >
            {!reviewed ? (
              <div style={{ color: '#8c8c8c', textAlign: 'center', padding: '60px 0' }}>
                请在左侧提交代码并点击"开始审查"
              </div>
            ) : (
              <>
                <Row gutter={16}>
                  <Col span={6}><Statistic title="代码行数" value={1280} /></Col>
                  <Col span={6}><Statistic title="问题总数" value={ISSUES.length} valueStyle={{ color: '#1677FF' }} /></Col>
                  <Col span={6}><Statistic title="高危" value={1} valueStyle={{ color: '#FF4D4F' }} /></Col>
                  <Col span={6}><Statistic title="中风险" value={1} valueStyle={{ color: '#FAAD14' }} /></Col>
                </Row>

                <Collapse style={{ marginTop: 16 }} defaultActiveKey={['0']}>
                  {ISSUES.map((iss, idx) => (
                    <Collapse.Panel
                      key={String(idx)}
                      header={
                        <Space>
                          <Tag color={LEVEL_MAP[iss.level].color}>{LEVEL_MAP[iss.level].text}</Tag>
                          <span style={{ fontWeight: 500 }}>{iss.title}</span>
                          <span style={{ color: '#8c8c8c', fontSize: 12 }}>{iss.pos}</span>
                        </Space>
                      }
                    >
                      <p>{iss.desc}</p>
                      <div style={{ marginBottom: 8, color: '#595959' }}>AI 修复建议：</div>
                      <Row gutter={8}>
                        <Col span={12}>
                          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>修改前</div>
                          <pre style={{ background: '#fff1f0', padding: 10, borderRadius: 6, fontSize: 12 }}>
                            {iss.before}
                          </pre>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>修改后</div>
                          <pre style={{ background: '#f6ffed', padding: 10, borderRadius: 6, fontSize: 12 }}>
                            {iss.after}
                          </pre>
                        </Col>
                      </Row>
                      <Button
                        size="small"
                        icon={<CopyOutlined />}
                        style={{ marginTop: 8 }}
                        onClick={() => {
                          navigator.clipboard?.writeText(iss.after);
                          message.success('已复制修复后代码');
                        }}
                      >
                        复制修复代码
                      </Button>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
