import { useState } from 'react';
import {
  Card,
  Tabs,
  Upload,
  Input,
  Select,
  Checkbox,
  Button,
  Space,
  Typography,
  Table,
  Tag,
  message,
} from 'antd';
import {
  InboxOutlined,
  AudioOutlined,
  PauseOutlined,
  CopyOutlined,
  ExportOutlined,
  MailOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function MeetingPage() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [generated, setGenerated] = useState(false);

  const toggleRec = () => {
    if (recording) {
      setRecording(false);
      message.success('录音已结束');
      return;
    }
    setRecording(true);
    setSeconds(0);
    const t = setInterval(() => {
      setSeconds((s) => {
        if (!recording && s > 0) {
          clearInterval(t);
          return s;
        }
        return s + 1;
      });
    }, 1000);
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card bordered={false} title="会议输入与配置">
        <Tabs
          items={[
            {
              key: 'upload',
              label: '音频/视频上传',
              children: (
                <Upload.Dragger multiple beforeUpload={() => false}>
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">拖拽 mp3 / mp4 / wav / m4a 文件至此</p>
                  <p className="ant-upload-hint">支持多文件批量上传，单文件 ≤ 500MB</p>
                </Upload.Dragger>
              ),
            },
            {
              key: 'rec',
              label: '实时录音',
              children: (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <Button
                    type={recording ? 'default' : 'primary'}
                    danger={recording}
                    size="large"
                    icon={recording ? <PauseOutlined /> : <AudioOutlined />}
                    onClick={toggleRec}
                  >
                    {recording ? '结束录音' : '开始录音'}
                  </Button>
                  <div style={{ marginTop: 16, fontSize: 28, fontFamily: 'monospace', color: '#1677FF' }}>
                    {fmt(seconds)}
                  </div>
                  {recording && (
                    <div style={{ marginTop: 12, color: '#8c8c8c' }}>
                      ●●●● 录音中... 实时波形采集中
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'paste',
              label: '文本粘贴',
              children: (
                <Input.TextArea
                  rows={8}
                  placeholder="粘贴会议录音转写文本，一键生成结构化会议纪要"
                />
              ),
            },
          ]}
        />

        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <Space>
            <span>会议类型：</span>
            <Select
              defaultValue="review"
              style={{ width: 180 }}
              options={[
                { value: 'review', label: '需求评审会' },
                { value: 'tech', label: '技术研讨会' },
                { value: 'weekly', label: '周会' },
                { value: 'retro', label: '项目复盘会' },
              ]}
            />
          </Space>
          <Checkbox.Group
            options={[
              { value: 'overview', label: '会议概况' },
              { value: 'topic', label: '核心议题' },
              { value: 'decision', label: '决议事项' },
              { value: 'todo', label: '待办事项' },
              { value: 'risk', label: '风险点' },
              { value: 'attendee', label: '参会人' },
            ]}
            defaultValue={['overview', 'topic', 'decision', 'todo', 'risk', 'attendee']}
          />
          <Button
            type="primary"
            size="large"
            icon={<FileTextOutlined />}
            onClick={() => {
              setGenerated(true);
              message.success('已生成结构化会议纪要');
            }}
            style={{ marginLeft: 'auto' }}
          >
            生成会议纪要
          </Button>
        </div>
      </Card>

      {generated && (
        <Card
          bordered={false}
          title="会议纪要"
          extra={
            <Space>
              <Button icon={<CopyOutlined />} onClick={() => message.success('已复制全文')}>复制全文</Button>
              <Button icon={<ExportOutlined />}>导出 Word / PDF</Button>
              <Button icon={<MailOutlined />}>发送邮件</Button>
            </Space>
          }
        >
          <Title level={4}>2026年4月30日 · Q1 项目复盘会</Title>
          <Paragraph>
            <Tag>会议时长</Tag> 1 小时 12 分钟
            <Tag>主持人</Tag> 张三
            <Tag>参会人</Tag> 张三、李四、王五、赵六、admin_root
          </Paragraph>

          <Title level={5}>一、会议概况</Title>
          <Paragraph>本次会议围绕 Q1 研发项目执行情况进行复盘，重点讨论交付质量、技术债务与 Q2 规划。</Paragraph>

          <Title level={5}>二、核心议题</Title>
          <Paragraph>
            1. Q1 各项目里程碑完成情况：交付率 92%，超前完成 3 项；<br />
            2. 关键技术风险：核心模块单元测试覆盖率仅 58%，需提升至 80%；<br />
            3. Q2 资源分配与里程碑规划。
          </Paragraph>

          <Title level={5}>三、决议事项</Title>
          <Paragraph>
            · 由李四牵头组建质量小组，统筹覆盖率提升专项；<br />
            · 王五负责架构调整 RFC，5 月 15 日前完成评审。
          </Paragraph>

          <Title level={5}>四、待办事项</Title>
          <Table
            size="small"
            pagination={false}
            columns={[
              { title: '事项', dataIndex: 'item' },
              { title: '责任人', dataIndex: 'owner', width: 100 },
              { title: '截止时间', dataIndex: 'due', width: 120 },
              {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (s) => <Tag color={s === '已完成' ? 'success' : 'processing'}>{s}</Tag>,
              },
            ]}
            dataSource={[
              { key: 1, item: '编写覆盖率提升专项方案', owner: '李四', due: '2026-05-08', status: '进行中' },
              { key: 2, item: '架构调整 RFC 文档', owner: '王五', due: '2026-05-15', status: '进行中' },
              { key: 3, item: 'Q2 OKR 草稿', owner: '张三', due: '2026-05-05', status: '已完成' },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
