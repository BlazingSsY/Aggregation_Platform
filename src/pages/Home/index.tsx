import AppMatrix from './AppMatrix';
import HeroBanner from './HeroBanner';
import TopNav from './TopNav';
import ValueSection from './ValueSection';

export default function HomePage() {
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
