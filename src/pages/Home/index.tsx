import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppMatrix from './AppMatrix';
import HeroBanner from './HeroBanner';
import TopNav from './TopNav';
import ValueSection from './ValueSection';

function StatsBand() {
  return (
    <section className="stats-band-wrap" aria-label="平台数据">
      <div className="stats-band">
        <div className="b">
          <div className="bv">8</div>
          <div className="bl">AI 应用</div>
        </div>
        <div className="b">
          <div className="bv">4<span>+</span></div>
          <div className="bl">覆盖场景</div>
        </div>
        <div className="b">
          <div className="bv">3<span>+</span></div>
          <div className="bl">接入企业</div>
        </div>
        <div className="b">
          <div className="bv">99.9<span>%</span></div>
          <div className="bl">服务可用性</div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    const target = state?.scrollTo;
    if (!target) return;
    const id = window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(id);
  }, [location.state]);

  return (
    <div className="home-page">
      <TopNav />
      <main className="home-main">
        <HeroBanner />
        <AppMatrix />
        <StatsBand />
        <ValueSection />
      </main>
      <footer className="home-footer">
        <div className="fm">AI APPLICATION AGGREGATION PLATFORM · AVIATION ENTERPRISE © 2026</div>
      </footer>
    </div>
  );
}
