import { useEffect, useRef, useState } from 'react';
import {
  Layout,
  Button,
  Menu,
  Input,
  Space,
  Drawer,
  Upload,
  Table,
  Typography,
  Modal,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  PlusOutlined,
  SendOutlined,
  PaperClipOutlined,
  ClearOutlined,
  ExportOutlined,
  DatabaseOutlined,
  InboxOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Paragraph } = Typography;

interface Msg {
  role: 'user' | 'ai';
  text: string;
}
interface Conv {
  id: string;
  title: string;
  msgs: Msg[];
}

const initial: Conv[] = [
  {
    id: 'c1',
    title: 'PCB 阻抗匹配设计要点',
    msgs: [
      { role: 'user', text: '高速差分线如何做阻抗匹配？' },
      {
        role: 'ai',
        text:
          '差分阻抗匹配通常控制在 100Ω±10%。需关注：\n\n1. 走线宽度 / 间距：根据叠层计算\n2. 参考平面完整性：避免跨分割\n3. 长度匹配：等长走线、蛇形线补偿\n4. 端接：源端串联端接 / 末端并联终端\n\n可结合阻抗计算工具（Polar SI9000、Saturn PCB）求解。',
      },
    ],
  },
  { id: 'c2', title: '研发流程规范 V2.3', msgs: [{ role: 'ai', text: '可基于知识库回答研发流程问题。' }] },
  { id: 'c3', title: 'Linux 内核裁剪经验', msgs: [{ role: 'ai', text: '可基于知识库回答 Linux 裁剪问题。' }] },
];

export default function KnowledgeQAPage() {
  const [convs, setConvs] = useState<Conv[]>(initial);
  const [activeId, setActiveId] = useState<string>(initial[0].id);
  const [input, setInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const active = convs.find((c) => c.id === activeId)!;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [active?.msgs.length]);

  const newConv = () => {
    const id = `c${Date.now()}`;
    const c: Conv = { id, title: '新对话', msgs: [{ role: 'ai', text: '您好，我是企业知识库助手，请问有什么可以帮您？' }] };
    setConvs([c, ...convs]);
    setActiveId(id);
  };

  const send = () => {
    if (!input.trim()) return;
    const q = input;
    setInput('');
    setConvs((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, msgs: [...c.msgs, { role: 'user', text: q }] } : c)),
    );
    setTimeout(() => {
      setConvs((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                title: c.title === '新对话' ? q.slice(0, 16) : c.title,
                msgs: [
                  ...c.msgs,
                  {
                    role: 'ai',
                    text: `（基于知识库召回 3 篇文档）\n\n关于"${q}"，结合企业内部资料，可参考以下要点：\n\n- 要点 1：根据《研发流程规范 V2.3》第 4.2 节...\n- 要点 2：依据历史项目复盘文档...\n- 要点 3：可联系架构组获取最新建议。\n\n如需查看原文，请打开右上角"知识库管理"。`,
                  },
                ],
              }
            : c,
        ),
      );
    }, 700);
  };

  const convMenu: MenuProps['items'] = convs.map((c) => ({
    key: c.id,
    label: c.title,
  }));

  return (
    <Layout style={{ height: 'calc(100vh - 64px - 40px - 48px)', borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
      <Sider width={260} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>
          <Button type="primary" block icon={<PlusOutlined />} onClick={newConv}>
            新建对话
          </Button>
        </div>
        <Menu
          mode="inline"
          items={convMenu}
          selectedKeys={[activeId]}
          onClick={({ key }) => setActiveId(key)}
          style={{ borderInlineEnd: 0 }}
        />
      </Sider>

      <Content style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            height: 56,
            padding: '0 20px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <strong>{active.title}</strong>
          <Space>
            <Button
              icon={<ClearOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: '确认清空当前对话？',
                  onOk: () => {
                    setConvs((prev) =>
                      prev.map((c) =>
                        c.id === activeId
                          ? { ...c, msgs: [{ role: 'ai', text: '对话已清空，请重新开始。' }] }
                          : c,
                      ),
                    );
                  },
                });
              }}
            >
              清空对话
            </Button>
            <Button icon={<ExportOutlined />} onClick={() => message.success('已导出对话记录')}>
              导出对话
            </Button>
            <Button type="primary" icon={<DatabaseOutlined />} onClick={() => setDrawerOpen(true)}>
              知识库管理
            </Button>
          </Space>
        </div>

        <div ref={listRef} className="chat-list" style={{ flex: 1 }}>
          {active.msgs.map((m, i) => (
            <div key={i} className={`chat-row ${m.role}`}>
              {m.role === 'ai' && (
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    background: '#f0f5ff', color: '#1677ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'
                  }}
                >
                  <RobotOutlined />
                </div>
              )}
              <div className="chat-bubble">
                <Paragraph style={{ margin: 0, color: m.role === 'user' ? '#fff' : 'inherit', whiteSpace: 'pre-wrap' }}>
                  {m.text}
                </Paragraph>
              </div>
              {m.role === 'user' && (
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    background: '#1677ff', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'
                  }}
                >
                  <UserOutlined />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chat-input-wrap">
          <Space.Compact style={{ width: '100%' }}>
            <Upload showUploadList={false} beforeUpload={() => { message.success('文档已上传至当前对话'); return false; }}>
              <Button icon={<PaperClipOutlined />}>上传文档</Button>
            </Upload>
            <Input.TextArea
              autoSize={{ minRows: 1, maxRows: 6 }}
              placeholder="请输入问题，回车发送 / Shift+Enter 换行"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={send}>
              发送
            </Button>
          </Space.Compact>
        </div>
      </Content>

      <Drawer title="企业知识库管理" width={560} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Upload.Dragger multiple beforeUpload={() => false}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">点击或拖拽文档至此区域上传</p>
          <p className="ant-upload-hint">支持 PDF / Word / Excel / Markdown，单文件 ≤ 100MB</p>
        </Upload.Dragger>
        <div style={{ marginTop: 24, fontWeight: 600 }}>已入库文档</div>
        <Table
          size="small"
          style={{ marginTop: 12 }}
          columns={[
            { title: '文档名', dataIndex: 'name' },
            { title: '分类', dataIndex: 'cat' },
            { title: '入库时间', dataIndex: 'time' },
          ]}
          dataSource={[
            { key: 1, name: '研发流程规范V2.3.pdf', cat: '流程', time: '2026-04-12' },
            { key: 2, name: '电源完整性设计指南.pdf', cat: '硬件', time: '2026-03-28' },
            { key: 3, name: 'Linux内核裁剪手册.docx', cat: '软件', time: '2026-03-15' },
          ]}
          pagination={false}
        />
      </Drawer>
    </Layout>
  );
}
