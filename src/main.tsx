import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2D5BFF',
          colorInfo: '#2D5BFF',
          colorSuccess: '#0E9F8A',
          colorWarning: '#E08700',
          colorError: '#D43352',
          colorText: '#16161A',
          colorTextSecondary: '#5F6470',
          colorBgLayout: '#F6F5F2',
          colorBgContainer: '#ffffff',
          colorBorder: '#E7E5E0',
          borderRadius: 10,
          boxShadow: '0 1px 3px rgba(22,22,26,0.05), 0 1px 2px rgba(22,22,26,0.04)',
          fontFamily:
            '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
        },
        components: {
          Button: {
            borderRadius: 10,
            controlHeight: 36,
          },
          Input: {
            borderRadius: 10,
            controlHeight: 36,
          },
          Select: {
            borderRadius: 10,
            controlHeight: 36,
          },
          Card: {
            borderRadiusLG: 14,
            paddingLG: 20,
          },
        },
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
);
