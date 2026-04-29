import { useMemo, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Input,
  Tag,
  Table,
  Tabs,
  Descriptions,
  Button,
  Space,
  Modal,
  Form,
  message,
  Empty,
} from 'antd';
import {
  DownloadOutlined,
  RobotOutlined,
  FilePdfOutlined,
  SendOutlined,
} from '@ant-design/icons';

interface Comp {
  key: string;
  model: string;
  brand: string;
  pkg: string;
  spec: string;
  stock: string;
  category: string;
  desc: string;
}

const ALL_DATA: Comp[] = [
  { key: '1', model: 'STM32F407VGT6', brand: 'ST', pkg: 'LQFP-100', spec: 'ARM Cortex-M4 168MHz / 1MB Flash / 192KB RAM', stock: '充足', category: '芯片', desc: '高性能MCU，适用于工业控制、消费电子。' },
  { key: '2', model: 'GD32F303RCT6', brand: 'GigaDevice', pkg: 'LQFP-64', spec: 'ARM Cortex-M4 120MHz / 256KB Flash', stock: '充足', category: '芯片', desc: '国产替代主流方案。' },
  { key: '3', model: 'AMS1117-3.3', brand: 'AMS', pkg: 'SOT-223', spec: 'LDO 3.3V / 1A', stock: '充足', category: '芯片', desc: '常用线性稳压器。' },
  { key: '4', model: 'CL10A106KP8NNNC', brand: 'Samsung', pkg: '0603', spec: 'X5R 10uF 10V', stock: '充足', category: '电容', desc: 'MLCC 贴片电容。' },
  { key: '5', model: 'RC0603FR-0710KL', brand: 'Yageo', pkg: '0603', spec: '10kΩ 1% 1/10W', stock: '充足', category: '电阻', desc: '通用厚膜电阻。' },
  { key: '6', model: '1N4148WS', brand: 'Diodes', pkg: 'SOD-323', spec: '100V / 150mA 高速开关二极管', stock: '紧张', category: '二极管', desc: '高速信号整流。' },
  { key: '7', model: 'AO3400A', brand: 'AOS', pkg: 'SOT-23', spec: 'N-MOS 30V 5.7A', stock: '充足', category: '三极管', desc: '小功率开关 MOS。' },
  { key: '8', model: 'ESP32-WROOM-32E', brand: 'Espressif', pkg: 'SMD-38', spec: 'WiFi+BT5 / 双核240MHz', stock: '充足', category: '芯片', desc: '主流 IoT 主控模组。' },
];

const CATEGORIES = ['全部', '芯片', '电阻', '电容', '二极管', '三极管'];

export default function ComponentLibPage() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('全部');
  const [selected, setSelected] = useState<Comp | null>(ALL_DATA[0]);
  const [recoOpen, setRecoOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '您好，我是元器件AI助手，可帮您分析参数、查找替代型号、推荐应用电路。请提问。' },
  ]);

  const filtered = useMemo(() => {
    return ALL_DATA.filter(
      (c) =>
        (category === '全部' || c.category === category) &&
        (!keyword ||
          c.model.toLowerCase().includes(keyword.toLowerCase()) ||
          c.brand.toLowerCase().includes(keyword.toLowerCase()) ||
          c.spec.toLowerCase().includes(keyword.toLowerCase())),
    );
  }, [keyword, category]);

  const sendChat = () => {
    if (!chatInput.trim() || !selected) return;
    const q = chatInput;
    setChat((c) => [...c, { role: 'user', text: q }]);
    setChatInput('');
    setTimeout(() => {
      setChat((c) => [
        ...c,
        {
          role: 'ai',
          text: `针对 ${selected.model}：\n\n· 国产替代推荐：GD32F303RCT6 / CH32V307VCT6\n· 典型应用：电机控制、工业网关、HMI\n· 注意事项：注意外设映射差异与时钟树配置\n\n如需进一步对比电气参数，可点击"批量导出参数"。`,
        },
      ]);
    }, 600);
  };

  const columns = [
    { title: '型号', dataIndex: 'model', key: 'model', width: 180, render: (t: string) => <a>{t}</a> },
    { title: '品牌', dataIndex: 'brand', key: 'brand', width: 120 },
    { title: '封装', dataIndex: 'pkg', key: 'pkg', width: 110 },
    { title: '参数规格', dataIndex: 'spec', key: 'spec', ellipsis: true },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 90,
      render: (s: string) => (
        <Tag color={s === '充足' ? 'success' : s === '紧张' ? 'warning' : 'default'}>{s}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'op',
      width: 140,
      render: () => (
        <Space size={4}>
          <Button type="link" size="small" icon={<FilePdfOutlined />}>datasheet</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card bordered={false}>
        <Input.Search
          size="large"
          enterButton="搜索"
          placeholder="输入元器件型号 / 品类 / 参数搜索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={setKeyword}
        />
        <div style={{ marginTop: 14 }}>
          <span style={{ color: '#8c8c8c', marginRight: 8 }}>分类筛选：</span>
          {CATEGORIES.map((c) => (
            <Tag.CheckableTag
              key={c}
              checked={category === c}
              onChange={() => setCategory(c)}
              style={{ padding: '4px 12px', marginRight: 8 }}
            >
              {c}
            </Tag.CheckableTag>
          ))}
        </div>
      </Card>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card
            title={`元器件列表（${filtered.length}）`}
            bordered={false}
            extra={
              <Space>
                <Button icon={<DownloadOutlined />}>批量导出参数</Button>
                <Button type="primary" icon={<RobotOutlined />} onClick={() => setRecoOpen(true)}>
                  AI选型推荐
                </Button>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={filtered}
              rowSelection={{ type: 'checkbox' }}
              size="middle"
              pagination={{ pageSize: 8, showSizeChanger: false }}
              onRow={(r) => ({
                onClick: () => setSelected(r),
                style: { cursor: 'pointer' },
              })}
              rowClassName={(r) => (r.key === selected?.key ? 'ant-table-row-selected' : '')}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card bordered={false} title={selected ? `详情 · ${selected.model}` : '详情'}>
            {!selected ? (
              <Empty description="请在左侧选择元器件" />
            ) : (
              <Tabs
                defaultActiveKey="param"
                items={[
                  {
                    key: 'param',
                    label: '参数详情',
                    children: (
                      <Descriptions column={1} size="small" bordered>
                        <Descriptions.Item label="型号">{selected.model}</Descriptions.Item>
                        <Descriptions.Item label="品牌">{selected.brand}</Descriptions.Item>
                        <Descriptions.Item label="品类">{selected.category}</Descriptions.Item>
                        <Descriptions.Item label="封装">{selected.pkg}</Descriptions.Item>
                        <Descriptions.Item label="参数规格">{selected.spec}</Descriptions.Item>
                        <Descriptions.Item label="工作温度">-40 ~ 85℃</Descriptions.Item>
                        <Descriptions.Item label="合规认证">RoHS / REACH</Descriptions.Item>
                        <Descriptions.Item label="备注">{selected.desc}</Descriptions.Item>
                      </Descriptions>
                    ),
                  },
                  {
                    key: 'ai',
                    label: 'AI解读',
                    children: (
                      <div style={{ display: 'flex', flexDirection: 'column', height: 380 }}>
                        <div className="chat-list" style={{ flex: 1, padding: 0 }}>
                          {chat.map((m, i) => (
                            <div key={i} className={`chat-row ${m.role}`}>
                              <div className="chat-bubble">{m.text}</div>
                            </div>
                          ))}
                        </div>
                        <Space.Compact style={{ marginTop: 8, width: '100%' }}>
                          <Input
                            placeholder="如：该元器件的国产替代型号有哪些？"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onPressEnter={sendChat}
                          />
                          <Button type="primary" icon={<SendOutlined />} onClick={sendChat}>
                            发送
                          </Button>
                        </Space.Compact>
                      </div>
                    ),
                  },
                  {
                    key: 'doc',
                    label: '资料附件',
                    children: (
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Card size="small">
                          <Space>
                            <FilePdfOutlined style={{ color: '#FF4D4F' }} />
                            <span>{selected.model}_datasheet.pdf</span>
                            <Button
                              type="link"
                              icon={<DownloadOutlined />}
                              onClick={() => message.success('已开始下载')}
                            >
                              下载
                            </Button>
                          </Space>
                        </Card>
                        <Card size="small">
                          <Space>
                            <FilePdfOutlined style={{ color: '#1677FF' }} />
                            <span>{selected.model}_application_note.pdf</span>
                            <Button
                              type="link"
                              icon={<DownloadOutlined />}
                              onClick={() => message.success('已开始下载')}
                            >
                              下载
                            </Button>
                          </Space>
                        </Card>
                      </Space>
                    ),
                  },
                ]}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title="AI 选型推荐"
        open={recoOpen}
        onCancel={() => setRecoOpen(false)}
        onOk={() => {
          setRecoOpen(false);
          message.success('已生成选型推荐清单');
        }}
        okText="生成推荐"
        cancelText="取消"
        width={560}
      >
        <Form layout="vertical">
          <Form.Item label="设计需求">
            <Input.TextArea
              rows={5}
              placeholder="请描述您的电路设计需求，例如：低功耗 BLE 蓝牙网关，需 SPI/I2C 外设，工作温度 -20~70℃，预算 ¥30 以内"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
