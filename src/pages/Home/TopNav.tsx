import { useEffect, useState } from 'react';
import { App, Input } from 'antd';
import { APPS } from '@/data/apps';

interface NavLink {
  key: string;
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { key: 'home', label: '首页', href: '#top' },
  { key: 'solution', label: '解决方案', href: '#app-matrix' },
  { key: 'help', label: '帮助中心', href: '#' },
  { key: 'changelog', label: '更新日志', href: '#' },
];

export default function TopNav() {
  const { message } = App.useApp();
  const [activeKey, setActiveKey] = useState<string>('home');

  useEffect(() => {
    const onScroll = () => {
      const matrix = document.getElementById('app-matrix');
      if (!matrix) return;
      const rect = matrix.getBoundingClientRect();
      setActiveKey(rect.top <= 80 ? 'solution' : 'home');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onSearch = (value: string) => {
    const v = value.trim();
    if (!v) return;
    const hit = APPS.find((a) => a.name.includes(v) || a.description.includes(v));
    if (hit) {
      const el = document.getElementById(`app-card-${hit.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('app-card-flash');
        window.setTimeout(() => el.classList.remove('app-card-flash'), 1200);
        return;
      }
    }
    message.info('未匹配到对应应用');
  };

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <a href="#top" className="nav-brand" aria-label="返回首页">
          <span className="nav-brand-logo" aria-hidden>
            <svg viewBox="0 0 512 512" fill="none">
              <path
                d="M482 232 L300 222 L210 80 Q204 70 192 72 L160 78 Q146 80 152 96 L208 218 L116 212 L82 168 Q76 158 64 162 L40 170 Q28 174 32 188 L62 244 Q56 252 62 260 L32 316 Q28 330 40 334 L64 342 Q76 346 82 336 L116 292 L208 286 L152 408 Q146 424 160 426 L192 432 Q204 434 210 424 L300 282 L482 272 Q500 270 500 252 Q500 234 482 232 Z"
                fill="#ffffff"
              />
            </svg>
          </span>
          <span className="nav-brand-text">
            <span className="nav-brand-name">AI应用聚合平台</span>
          </span>
        </a>

        <nav className="nav-menu" aria-label="主导航">
          {NAV_LINKS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`nav-menu-item${activeKey === item.key ? ' active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <Input.Search
            placeholder="搜索AI应用"
            allowClear
            onSearch={onSearch}
            className="nav-search"
            aria-label="搜索AI应用"
          />
        </div>
      </div>
    </header>
  );
}
