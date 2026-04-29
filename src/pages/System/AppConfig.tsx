import { useState } from 'react';
import { Card, Table, Switch, Button, Input, InputNumber, Tag, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface AppRow {
  key: string;
  name: string;
  enabled: boolean;
  apiKey: string;
  quota: number;
  perm: string;
}

const initial: AppRow[] = [
  { key: 'components', name: '元器件库', enabled: true, apiKey: 'sk-comp-***-7d9a', quota: 10000, perm: '全员' },
  { key: 'knowledge', name: '知识问答助手', enabled: true, apiKey: 'sk-rag-***-2b1c', quota: 50000, perm: '全员' },
  { key: 'codegen', name: '软件代码生成', enabled: true, apiKey: 'sk-code-***-4f7e', quota: 30000, perm: '研发' },
  { key: 'codereview', name: '代码审查', enabled: true, apiKey: 'sk-rev-***-8a3b', quota: 20000, perm: '研发' },
  { key: 'circuit', name: '电路审查', enabled: false, apiKey: 'sk-cir-***-6c5d', quota: 5000, perm: '硬件' },
  { key: 'meeting', name: '会议纪要', enabled: true, apiKey: 'sk-mt-***-3e9f', quota: 8000, perm: '全员' },
  { key: 'ppt', name: 'PPT生成', enabled: true, apiKey: 'sk-ppt-***-1a2b', quota: 6000, perm: '全员' },
];

export default function AppConfigPage() {
  const [data, setData] = useState<AppRow[]>(initial);
  const [editKey, setEditKey] = useState<string | null>(null);

  const update = (key: string, patch: Partial<AppRow>) => {
    setData((d) => d.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  return (
    <Card bordered={false} title="应用配置">
      <Table
        dataSource={data}
        size="middle"
        pagination={false}
        columns={[
          { title: '应用名称', dataIndex: 'name', width: 160 },
          {
            title: '启用',
            dataIndex: 'enabled',
            width: 90,
            render: (v, r) => (
              <Switch
                checked={v}
                onChange={(c) => {
                  update(r.key, { enabled: c });
                  message.success(`${r.name} 已${c ? '启用' : '禁用'}`);
                }}
              />
            ),
          },
          {
            title: 'API 密钥',
            dataIndex: 'apiKey',
            render: (v, r) =>
              editKey === r.key ? (
                <Input
                  defaultValue={v}
                  onPressEnter={(e) => {
                    update(r.key, { apiKey: (e.target as HTMLInputElement).value });
                    setEditKey(null);
                    message.success('API 密钥已更新');
                  }}
                />
              ) : (
                <span style={{ fontFamily: 'monospace' }}>{v}</span>
              ),
          },
          {
            title: '调用限额（次/月）',
            dataIndex: 'quota',
            width: 180,
            render: (v, r) => (
              <InputNumber
                min={0}
                value={v}
                style={{ width: 140 }}
                onChange={(n) => update(r.key, { quota: Number(n) || 0 })}
              />
            ),
          },
          {
            title: '访问权限',
            dataIndex: 'perm',
            width: 110,
            render: (v) => <Tag color="blue">{v}</Tag>,
          },
          {
            title: '操作',
            key: 'op',
            width: 120,
            render: (_, r) => (
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => setEditKey(editKey === r.key ? null : r.key)}
              >
                {editKey === r.key ? '完成' : '编辑密钥'}
              </Button>
            ),
          },
        ]}
      />
    </Card>
  );
}
