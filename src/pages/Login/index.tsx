import { useState } from 'react';
import { Form, Input, Button, Checkbox, App as AntdApp } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ApartmentOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '@/utils/auth';

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<LoginForm>();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    // 模拟接口请求
    await new Promise((r) => setTimeout(r, 500));
    const user = login(values.username, values.password);
    setLoading(false);
    if (user) {
      message.success('登录成功，欢迎回来');
      navigate('/dashboard', { replace: true });
    } else {
      message.error('账号或密码错误，请重新输入');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-logo">AI</div>
            <span>智研AI生产力平台</span>
          </div>
        </div>

        <div className="login-hero">
          <h1>一站式研发办公AI聚合平台</h1>
          <p>覆盖元器件查询、代码开发、电路设计、办公提效全场景</p>
        </div>

        <div className="login-feature-cards">
          <div className="login-feature-card">
            <ApartmentOutlined />
            <h4>研发场景全覆盖</h4>
            <p>电子研发 / 软件开发 / 企业办公一站直达</p>
          </div>
          <div className="login-feature-card">
            <SafetyCertificateOutlined />
            <h4>企业级安全管控</h4>
            <p>权限隔离、操作审计、数据加密</p>
          </div>
          <div className="login-feature-card">
            <ThunderboltOutlined />
            <h4>开箱即用低门槛</h4>
            <p>零配置接入，主流模型一键调用</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-card">
          <div className="login-form-header">
            <div className="mini-logo">
              <span className="box">AI</span>
              <span>智研平台</span>
            </div>
            <h2>管理员登录</h2>
            <p>请输入管理员账号密码登录系统</p>
          </div>

          <Form<LoginForm>
            form={form}
            layout="vertical"
            requiredMark
            onFinish={onFinish}
            initialValues={{ remember: false }}
            size="large"
          >
            <Form.Item
              label="管理员账号"
              name="username"
              extra="默认账号：admin_root"
              rules={[{ required: true, message: '请输入管理员账号' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入管理员账号" allowClear />
            </Form.Item>

            <Form.Item
              label="管理员密码"
              name="password"
              extra="默认密码：admin_root"
              rules={[{ required: true, message: '请输入管理员密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请输入管理员密码" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 12 }}>
              <Checkbox>记住账号</Checkbox>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{ fontSize: 16, fontWeight: 500 }}
              >
                登录系统
              </Button>
            </Form.Item>
          </Form>

          <div className="login-tip">仅管理员账号可登录，非授权人员请勿操作</div>
        </div>

        <div className="login-footer">© 2026 智研AI平台 版权所有</div>
      </div>
    </div>
  );
}
