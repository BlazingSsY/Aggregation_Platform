export default function HeroBanner() {
  return (
    <section className="hero-banner" id="top" aria-label="平台品牌宣传">
      <div className="hero-decor" aria-hidden>
        <svg className="decor-cloud-1" viewBox="0 0 200 80" fill="none">
          <path
            d="M30 60 Q10 60 10 45 Q10 30 28 30 Q32 14 50 14 Q70 14 76 30 Q92 26 100 40 Q120 36 124 56 Q120 66 104 64 L40 64 Q30 66 30 60 Z"
            fill="rgba(255,255,255,0.6)"
          />
        </svg>
        <svg className="decor-cloud-2" viewBox="0 0 200 80" fill="none">
          <path
            d="M30 60 Q10 60 10 45 Q10 30 28 30 Q32 14 50 14 Q70 14 76 30 Q92 26 100 40 Q120 36 124 56 Q120 66 104 64 L40 64 Q30 66 30 60 Z"
            fill="rgba(255,255,255,0.55)"
          />
        </svg>
        <svg className="decor-cloud-3" viewBox="0 0 200 80" fill="none">
          <path
            d="M30 60 Q10 60 10 45 Q10 30 28 30 Q32 14 50 14 Q70 14 76 30 Q92 26 100 40 Q120 36 124 56 Q120 66 104 64 L40 64 Q30 66 30 60 Z"
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
        <svg className="decor-plane" viewBox="0 0 512 512" fill="none">
          <defs>
            <linearGradient id="planeBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#bae0ff" />
            </linearGradient>
          </defs>
          <path
            d="M482 232 L300 222 L210 80 Q204 70 192 72 L160 78 Q146 80 152 96 L208 218 L116 212 L82 168 Q76 158 64 162 L40 170 Q28 174 32 188 L62 244 Q56 252 62 260 L32 316 Q28 330 40 334 L64 342 Q76 346 82 336 L116 292 L208 286 L152 408 Q146 424 160 426 L192 432 Q204 434 210 424 L300 282 L482 272 Q500 270 500 252 Q500 234 482 232 Z"
            fill="url(#planeBody)"
            stroke="rgba(0,21,41,0.18)"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="hero-inner">
        <h1 className="hero-title">
          航空企业级 <span className="accent">AI 全场景应用矩阵</span>
        </h1>
        <p className="hero-subtitle">
          面向航空产业研发、制造、运维全链路场景，覆盖知识管理、研发提效、硬件设计、文档处理，一站式赋能航空智造与数字化升级
        </p>
        <div className="hero-actions">
          <a href="#app-matrix" className="hero-anchor" aria-label="浏览应用矩阵">
            浏览全部应用
          </a>
          <a href="#value-section" className="hero-anchor ghost" aria-label="了解平台价值">
            了解平台价值
          </a>
        </div>
      </div>
    </section>
  );
}
