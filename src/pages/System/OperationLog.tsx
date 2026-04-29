import { useMemo, useState } from 'react';
import { Card, Table, DatePicker, Input, Tag, Button, Space, message } from 'antd';
import { ExportOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

interface Log {
  key: string;
  user: string;
  time: string;
  action: string;
  ip: string;
  result: 'success' | 'fail';
}

const ACTIONS = [
  '登录系统', '退出系统', '调用代码生成', '调用知识问答', '查询元器件',
  '执行代码审查', '执行电路审查', '生成会议纪要', '生成 PPT',
  '新增用户', '编辑应用配置', '重置用户密码',
];
const USERS = ['admin_root', 'zhangsan', 'lisi', 'wangwu'];

const data: Log[] = Array.from({ length: 36 }, (_, i) => ({
  key: String(i),
  user: USERS[i % USERS.length],
  time: dayjs().subtract(i * 37, 'minute').format('YYYY-MM-DD HH:mm:ss'),
  action: ACTIONS[i % ACTIONS.length],
  ip: `10.32.${(i * 13) % 255}.${(i * 7) % 255}`,
  result: i % 9 === 0 ? 'fail' : 'success',
}));

export default function OperationLogPage() {
  const [user, setUser] = useState('');
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (user && !row.user.includes(user)) return false;
      if (range && range[0] && range[1]) {
        const t = dayjs(row.time);
        if (t.isBefore(range[0]) || t.isAfter(range[1])) return false;
      }
      return true;
    });
  }, [user, range]);

  return (
    <Card
      bordered={false}
      title="操作日志"
      extra={
        <Button icon={<ExportOutlined />} onClick={() => message.success('日志已导出')}>
          导出日志
        </Button>
      }
    >
      <Space style={{ marginBottom: 12 }} wrap>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="按账号筛选"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{ width: 200 }}
        />
        <DatePicker.RangePicker showTime onChange={(v) => setRange(v as any)} />
      </Space>

      <Table
        dataSource={filtered}
        size="middle"
        columns={[
          { title: '操作人', dataIndex: 'user', width: 140 },
          { title: '操作时间', dataIndex: 'time', width: 200 },
          { title: '操作内容', dataIndex: 'action' },
          { title: 'IP 地址', dataIndex: 'ip', width: 160 },
          {
            title: '结果',
            dataIndex: 'result',
            width: 100,
            render: (r) => <Tag color={r === 'success' ? 'success' : 'error'}>{r === 'success' ? '成功' : '失败'}</Tag>,
          },
        ]}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </Card>
  );
}
