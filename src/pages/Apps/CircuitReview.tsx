import { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Upload,
  Input,
  Checkbox,
  Button,
  Statistic,
  Tabs,
  Table,
  Tag,
  message,
} from 'antd';
import { InboxOutlined, ThunderboltOutlined, ExportOutlined } from '@ant-design/icons';

const CHECKS = [
  { value: 'connect', label: '电气连接错误检查' },
  { value: 'select', label: '器件选型匹配检查' },
  { value: 'power', label: '电源完整性检查' },
  { value: 'emc', label: 'EMC / EMI 合规建议' },
  { value: 'mfg', label: '生产可制造性检查' },
];

const ISSUES = [
  {
    key: 1,
    pos: 'U1.PIN23',
    desc: 'STM32 复位引脚 NRST 未接上拉电阻，存在误复位风险',
    level: '严重错误',
    impact: '系统稳定性',
    fix: '增加 10kΩ 上拉电阻至 VCC',
  },
  {
    key: 2,
    pos: 'C5/C6',
    desc: '电源去耦电容容值过小，未覆盖高频段',
    level: '警告',
    impact: '电源完整性',
    fix: '增加 0.1uF 高频去耦并行 10uF 储能电容',
  },
  {
    key: 3,
    pos: 'L2',
    desc: '共模电感未做差分阻抗匹配',
    level: '警告',
    impact: 'EMC',
    fix: '替换为 100Ω@100MHz 共模扼流圈',
  },
  {
    key: 4,
    pos: 'R12',
    desc: '电阻封装 0402 在产线焊接良率较低',
    level: '建议',
    impact: '可制造性',
    fix: '改用 0603 封装',
  },
];

const levelColor: Record<string, string> = {
  严重错误: 'error',
  警告: 'warning',
  建议: 'blue',
};

export default function CircuitReviewPage() {
  const [done, setDone] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Row gutter={16}>
        <Col xs={24} lg={10}>
          <Card bordered={false} title="电路文件与配置">
            <Upload.Dragger multiple beforeUpload={() => false}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">点击或拖拽原理图文件上传</p>
              <p className="ant-upload-hint">支持 Altium Designer / KiCad / 原理图图片 / PDF</p>
            </Upload.Dragger>

            <div style={{ marginTop: 16, marginBottom: 8, fontWeight: 500 }}>补充说明</div>
            <Input.TextArea
              rows={4}
              placeholder="补充说明电路应用场景、设计需求、重点审查方向（如电源稳定性、EMC、成本优化等）"
            />

            <div style={{ marginTop: 16, marginBottom: 8, fontWeight: 500 }}>审查配置</div>
            <Checkbox.Group options={CHECKS} defaultValue={CHECKS.map((c) => c.value)} />

            <Button
              type="primary"
              size="large"
              block
              icon={<ThunderboltOutlined />}
              style={{ marginTop: 20 }}
              onClick={() => {
                setDone(true);
                message.success('电路审查完成');
              }}
            >
              开始审查
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card
            bordered={false}
            title="审查结果"
            extra={
              <Button icon={<ExportOutlined />} disabled={!done}>
                导出合规报告（PDF）
              </Button>
            }
          >
            {!done ? (
              <div style={{ color: '#8c8c8c', textAlign: 'center', padding: '80px 0' }}>
                请在左侧提交原理图文件并点击"开始审查"
              </div>
            ) : (
              <>
                <Row gutter={16}>
                  <Col span={6}><Statistic title="器件总数" value={184} /></Col>
                  <Col span={6}><Statistic title="问题总数" value={ISSUES.length} valueStyle={{ color: '#1677FF' }} /></Col>
                  <Col span={6}><Statistic title="严重错误" value={1} valueStyle={{ color: '#FF4D4F' }} /></Col>
                  <Col span={6}><Statistic title="警告" value={2} valueStyle={{ color: '#FAAD14' }} /></Col>
                </Row>

                <Tabs
                  style={{ marginTop: 12 }}
                  items={[
                    {
                      key: 'list',
                      label: '问题清单',
                      children: (
                        <Table
                          columns={[
                            { title: '位置', dataIndex: 'pos', width: 100 },
                            { title: '问题描述', dataIndex: 'desc' },
                            {
                              title: '等级',
                              dataIndex: 'level',
                              width: 110,
                              render: (l) => <Tag color={levelColor[l]}>{l}</Tag>,
                            },
                            { title: '影响范围', dataIndex: 'impact', width: 120 },
                            { title: '修复建议', dataIndex: 'fix' },
                          ]}
                          dataSource={ISSUES}
                          size="middle"
                          pagination={false}
                        />
                      ),
                    },
                    {
                      key: 'opt',
                      label: '优化建议',
                      children: (
                        <div style={{ lineHeight: 2 }}>
                          <p>
                            <Tag color="blue">拓扑优化</Tag> 建议在 VCC 输入端增加 LC 滤波，提升抗干扰能力。
                          </p>
                          <p>
                            <Tag color="blue">器件替代</Tag> 主控可由 STM32F407 替换为国产 GD32F303，BOM 成本降低约 18%。
                          </p>
                          <p>
                            <Tag color="blue">EMC 整改</Tag> 在 USB 数据线对前增加共模电感 + TVS 防护组合。
                          </p>
                        </div>
                      ),
                    },
                    {
                      key: 'report',
                      label: '合规报告',
                      children: (
                        <div style={{ lineHeight: 2 }}>
                          <p>审查时间：2026-04-30</p>
                          <p>审查工程师：admin_root</p>
                          <p>问题汇总：1 项严重错误、2 项警告、1 项优化建议</p>
                          <p>整改建议：见"问题清单"与"优化建议"，建议在打样前完成整改。</p>
                          <p style={{ color: '#8c8c8c' }}>—— 工程师签字：________________</p>
                        </div>
                      ),
                    },
                  ]}
                />
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
