import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';

interface User {
  key: string;
  username: string;
  name: string;
  role: string;
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'disabled';
}

const initial: User[] = [
  { key: '1', username: 'admin_root', name: '系统管理员', role: 'admin', createdAt: '2026-01-01', lastLogin: '2026-04-30 09:12', status: 'active' },
  { key: '2', username: 'zhangsan', name: '张三', role: 'developer', createdAt: '2026-02-12', lastLogin: '2026-04-29 17:08', status: 'active' },
  { key: '3', username: 'lisi', name: '李四', role: 'reviewer', createdAt: '2026-03-04', lastLogin: '2026-04-28 14:22', status: 'active' },
  { key: '4', username: 'wangwu', name: '王五', role: 'viewer', createdAt: '2026-03-20', lastLogin: '2026-04-15 10:01', status: 'disabled' },
];

export default function UserManagePage() {
  const [data, setData] = useState<User[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form] = Form.useForm();

  const onSubmit = async () => {
    const v = await form.validateFields();
    if (editing) {
      setData((d) => d.map((u) => (u.key === editing.key ? { ...u, ...v } : u)));
      message.success('用户信息已更新');
    } else {
      const key = String(Date.now());
      setData((d) => [
        ...d,
        { key, ...v, createdAt: new Date().toISOString().slice(0, 10), lastLogin: '-', status: 'active' },
      ]);
      message.success('用户已新增');
    }
    setOpen(false);
    setEditing(null);
    form.resetFields();
  };

  return (
    <Card
      bordered={false}
      title="用户管理"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          新增用户
        </Button>
      }
    >
      <Table
        dataSource={data}
        size="middle"
        columns={[
          { title: '账号', dataIndex: 'username' },
          { title: '姓名', dataIndex: 'name' },
          {
            title: '角色',
            dataIndex: 'role',
            render: (r) => {
              const map: Record<string, { color: string; text: string }> = {
                admin: { color: 'red', text: '管理员' },
                developer: { color: 'blue', text: '开发' },
                reviewer: { color: 'purple', text: '审查' },
                viewer: { color: 'default', text: '只读' },
              };
              const c = map[r] || { color: 'default', text: r };
              return <Tag color={c.color}>{c.text}</Tag>;
            },
          },
          { title: '创建时间', dataIndex: 'createdAt' },
          { title: '最后登录', dataIndex: 'lastLogin' },
          {
            title: '状态',
            dataIndex: 'status',
            render: (s) => (
              <Tag color={s === 'active' ? 'success' : 'default'}>{s === 'active' ? '启用' : '禁用'}</Tag>
            ),
          },
          {
            title: '操作',
            key: 'op',
            width: 240,
            render: (_, r) => (
              <Space size={0}>
                <Button
                  size="small"
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditing(r);
                    form.setFieldsValue(r);
                    setOpen(true);
                  }}
                >
                  编辑
                </Button>
                <Button
                  size="small"
                  type="link"
                  icon={<KeyOutlined />}
                  onClick={() => message.success(`已为 ${r.username} 重置密码`)}
                >
                  重置密码
                </Button>
                <Popconfirm
                  title={`确认删除用户 ${r.username}？`}
                  okText="删除"
                  cancelText="取消"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => {
                    setData((d) => d.filter((x) => x.key !== r.key));
                    message.success('用户已删除');
                  }}
                >
                  <Button size="small" type="link" danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? '编辑用户' : '新增用户'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="账号" name="username" rules={[{ required: true }]}>
            <Input placeholder="如 zhangsan" />
          </Form.Item>
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input placeholder="如 张三" />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'developer', label: '开发' },
                { value: 'reviewer', label: '审查' },
                { value: 'viewer', label: '只读' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
