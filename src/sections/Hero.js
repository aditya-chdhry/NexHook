import { Film, Palette, Share2, Code2, Smartphone, Search, PenTool, ShoppingBag } from 'lucide-react';
import './Hero.css';

// angle = starting position on the circle (0° = right, 90° = bottom, 270° = top)
// radius = px distance from center
// duration = seconds for one full orbit
const services = [
  // --- INNER RING (Duration: 32s) ---
  {
    label: 'Video Editing',
    Icon: Film,
    color: '#e05c4b',
    bg: 'rgba(224,92,75,.13)',
    border: 'rgba(224,92,75,.4)',
    angle: 0,
    ring: 'inner',
    duration: 32,
  },
  {
    label: 'Web Dev',
    Icon: Code2,
    color: '#4b9fe0',
    bg: 'rgba(75,159,224,.13)',
    border: 'rgba(75,159,224,.4)',
    angle: 120,
    ring: 'inner',
    duration: 32,
  },
  {
    label: 'App Dev',
    Icon: Smartphone,
    color: '#a855f7',
    bg: 'rgba(168,85,247,.13)',
    border: 'rgba(168,85,247,.4)',
    angle: 240,
    ring: 'inner',
    duration: 32,
  },

  // --- OUTER RING (Duration: 48s) ---
  {
    label: 'Graphic Design',
    Icon: Palette,
    color: '#7c6fe0',
    bg: 'rgba(124,111,224,.13)',
    border: 'rgba(124,111,224,.4)',
    angle: 0,
    ring: 'outer',
    duration: 48,
  },
  {
    label: 'Social Media',
    Icon: Share2,
    color: '#4bcca0',
    bg: 'rgba(75,204,160,.13)',
    border: 'rgba(75,204,160,.4)',
    angle: 72,
    ring: 'outer',
    duration: 48,
  },
  {
    label: 'SEO & Growth',
    Icon: Search,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,.13)',
    border: 'rgba(245,158,11,.4)',
    angle: 144,
    ring: 'outer',
    duration: 48,
  },
  {
    label: 'UI/UX Design',
    Icon: PenTool,
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,.13)',
    border: 'rgba(14,165,233,.4)',
    angle: 216,
    ring: 'outer',
    duration: 48,
  },
  {
    label: 'E-Commerce',
    Icon: ShoppingBag,
    color: '#10b981',
    bg: 'rgba(16,185,129,.13)',
    border: 'rgba(16,185,129,.4)',
    angle: 288,
    ring: 'outer',
    duration: 48,
  },
];

export default function Hero() {
  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-glow" />
      <div className="hero-glow2" />
      <div className="hero-grid" />

      {/* ── LEFT COLUMN ── */}
      <div className="hero-inner">
        <div className="hero-chip">
          {/* <div className="hero-chip-dot" />
          Accepting New Clients — Limited Spots */}
        </div>
         
        <h1>
          We just don't build<br />
          <em>Services, We Solve</em><br />
          what others can't.
        </h1>
        <p className="hero-sub">
          NexHook Services is a modern IT solutions company focused on delivering innovative, scalable, and reliable digital products. We help businesses transform their ideas into powerful technology solutions that drive growth and success.
        </p>
        <div className="hero-actions">
          <button className="btn-prim" onClick={() => go('audit')}>Book a Free Audit Call</button>
          <button className="btn-ghost" onClick={() => go('portfolio')}>See Our Work ↓</button>
        </div>
        <div className="hero-trust">
          {[
            { num: '10', sup: '+', label: 'Projects Shipped' },
            { num: '98', sup: '%', label: 'Client Retention' },
            { num: '3',  sup: 'x', label: 'Avg. ROI Growth' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {i > 0 && <div className="trust-divider" />}
              <div className="trust-item">
                <div className="trust-num">{s.num}<sup>{s.sup}</sup></div>
                <div className="trust-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT COLUMN — orbital ── */}
      <div className="hero-visual">
        <div className="orbital-scene">

          {/* Decorative dashed rings */}
          <div className="dashed-ring dashed-ring--outer" />
          <div className="dashed-ring dashed-ring--inner" />

          {/* Orbiting service nodes */}
          {services.map((s) => (
            <div
              key={s.label}
              className={`orbital-node orbital-node--${s.ring}`}
              style={{
                '--duration': `${s.duration}s`,
                '--delay':    `${-(s.duration * (s.angle / 360)).toFixed(3)}s`,
              }}
            >
              <div
                className="orbital-icon"
                style={{ background: s.bg, border: `1.5px solid ${s.border}`, color: s.color }}
              >
                <s.Icon size={20} strokeWidth={1.8} />
              </div>
              <span
                className="orbital-label"
                style={{ color: s.color, borderColor: s.border, background: s.bg }}
              >
                {s.label}
              </span>
            </div>
          ))}

          {/* Nucleus */}
          <div className="orbital-nucleus">
            <div className="nucleus-pulse" />
            <div className="nucleus-pulse nucleus-pulse--2" />
            <div className="nucleus-core">
              <span className="nucleus-brand">Nex<span>Hook</span></span>
              {/* <span className="nucleus-sub">Web &amp; App<br />Agency</span> */}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
