import { useMemo, useState } from 'react';
import { Layout, Menu, Breadcrumb, Input, Badge, Dropdown, Avatar, Tooltip, Modal } from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  DatabaseOutlined,
  QuestionCircleOutlined,
  CodeOutlined,
  AuditOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  TeamOutlined,
  SettingOutlined,
  FileSearchOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  BgColorsOutlined,
  LogoutOutlined,
  KeyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '@/utils/auth';

const { Header, Sider, Content, Footer } = Layout;

const MENU_TITLE: Record<string, string> = {
  dashboard: '首页',
  apps: 'AI应用中心',
  components: '元器件库',
  knowledge: '知识问答助手',
  codegen: '软件代码生成',
  codereview: '代码审查',
  circuit: '电路审查',
  meeting: '会议纪要',
  ppt: 'PPT生成',
  system: '系统管理',
  users: '用户管理',
  config: '应用配置',
  logs: '操作日志',
};

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const user = getCurrentUser();

  const items: MenuProps['items'] = [
    {
      key: 'group-home',
      type: 'group',
      label: collapsed ? '' : '平台首页',
      children: [{ key: '/dashboard', icon: <HomeOutlined />, label: '首页' }],
    },
    {
      key: 'group-apps',
      type: 'group',
      label: collapsed ? '' : 'AI应用中心',
      children: [
        { key: '/apps/components', icon: <DatabaseOutlined />, label: '元器件库' },
        { key: '/apps/knowledge', icon: <QuestionCircleOutlined />, label: '知识问答助手' },
        { key: '/apps/codegen', icon: <CodeOutlined />, label: '软件代码生成' },
        { key: '/apps/codereview', icon: <AuditOutlined />, label: '代码审查' },
        { key: '/apps/circuit', icon: <ThunderboltOutlined />, label: '电路审查' },
        { key: '/apps/meeting', icon: <FileTextOutlined />, label: '会议纪要' },
        { key: '/apps/ppt', icon: <FundProjectionScreenOutlined />, label: 'PPT生成' },
      ],
    },
    ...(user?.role === 'admin'
      ? [
          {
            key: 'group-system',
            type: 'group' as const,
            label: collapsed ? '' : '系统管理',
            children: [
              { key: '/system/users', icon: <TeamOutlined />, label: '用户管理' },
              { key: '/system/config', icon: <SettingOutlined />, label: '应用配置' },
              { key: '/system/logs', icon: <FileSearchOutlined />, label: '操作日志' },
            ],
          },
        ]
      : []),
  ];

  const breadcrumbItems = useMemo(() => {
    const segs = location.pathname.split('/').filter(Boolean);
    const out: { title: React.ReactNode }[] = [{ title: '首页' }];
    let acc = '';
    segs.forEach((s) => {
      acc += `/${s}`;
      const title = MENU_TITLE[s] ?? s;
      if (title !== '首页') out.push({ title });
    });
    return out;
  }, [location.pathname]);

  const onMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  const userMenu: MenuProps['items'] = [
    { key: 'pwd', icon: <KeyOutlined />, label: '修改密码' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  const onUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      Modal.confirm({
        title: '确认退出登录？',
        okText: '退出',
        cancelText: '取消',
        onOk: () => {
          logout();
          navigate('/login', { replace: true });
        },
      });
    } else if (key === 'pwd') {
      Modal.info({ title: '修改密码', content: '此处为演示，企业版将接入用户中心。' });
    }
  };

  const notificationContent = (
    <div style={{ width: 320, padding: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>通知中心</div>
      <div style={{ fontSize: 13, color: '#595959', lineHeight: 2 }}>
        · 你的代码生成任务已完成<br />
        · PPT《Q1复盘》生成成功<br />
        · 系统将于今晚 23:00 进行例行维护
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={240}
        collapsedWidth={64}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        className="app-sider"
        theme="dark"
      >
        <div className="sider-brand" onClick={() => navigate('/dashboard')}>
          <div className="logo-box">AI</div>
          {!collapsed && <span>智研AI平台</span>}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={items}
          selectedKeys={[location.pathname]}
          onClick={onMenuClick}
          style={{ background: 'transparent', borderInlineEnd: 0, paddingTop: 8 }}
        />

        <Dropdown
          menu={{ items: userMenu, onClick: onUserMenuClick }}
          placement="topLeft"
          trigger={['click']}
        >
          <div className="sider-user">
            <Avatar size={32} icon={<UserOutlined />} style={{ background: '#1677ff' }} />
            {!collapsed && (
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.username || 'admin_root'}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>系统管理员</div>
              </div>
            )}
          </div>
        </Dropdown>
      </Sider>

      <Layout>
        <Header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Tooltip title={collapsed ? '展开' : '折叠'}>
              <span
                onClick={() => setCollapsed(!collapsed)}
                style={{ cursor: 'pointer', fontSize: 18, color: '#595959' }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </span>
            </Tooltip>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Input.Search
              placeholder="搜索AI应用 / 功能 / 文档"
              allowClear
              style={{ width: 280 }}
              onSearch={(v) => v && Modal.info({ title: '搜索', content: `已搜索：${v}` })}
            />
            <Tooltip title="通知中心">
              <Dropdown dropdownRender={() => <div className="page-card">{notificationContent}</div>}>
                <Badge count={3} size="small" offset={[-2, 4]}>
                  <BellOutlined style={{ fontSize: 18, cursor: 'pointer', color: '#595959' }} />
                </Badge>
              </Dropdown>
            </Tooltip>
            <Tooltip title="帮助中心">
              <QuestionCircleOutlined
                style={{ fontSize: 18, cursor: 'pointer', color: '#595959' }}
                onClick={() =>
                  Modal.info({
                    title: '帮助中心',
                    content: '请联系系统管理员获取使用文档与常见问题手册。',
                  })
                }
              />
            </Tooltip>
            <Tooltip title="主题切换（演示）">
              <BgColorsOutlined style={{ fontSize: 18, cursor: 'pointer', color: '#595959' }} />
            </Tooltip>
            <Dropdown
              menu={{ items: userMenu, onClick: onUserMenuClick }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar size={32} icon={<UserOutlined />} style={{ background: '#1677ff', cursor: 'pointer' }} />
            </Dropdown>
          </div>
        </Header>

        <Content className="app-content">
          <Outlet />
        </Content>

        <Footer className="app-footer">© 2026 智研AI生产力聚合平台 · All Rights Reserved</Footer>
      </Layout>
    </Layout>
  );
}
