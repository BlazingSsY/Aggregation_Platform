import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppMatrix from './AppMatrix';
import HeroBanner from './HeroBanner';
import TopNav from './TopNav';
import ValueSection from './ValueSection';

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
        <ValueSection />
      </main>
    </div>
  );
}
