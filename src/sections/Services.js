import { useState, useEffect, useRef } from 'react';
import './Services.css';

const SERVICES = [
  { icon: '', title: 'Video Editing',            desc: 'From raw footage to cinematic masterpieces — we craft scroll-stopping videos that captivate your audience. Whether it\'s short-form reels, YouTube content, ads, or brand films, every cut is purposeful and every frame tells your story.', tech: 'Premiere Pro · After Effects · DaVinci Resolve' },
  { icon: '', title: 'Graphic Designing',        desc: 'Visual identity that commands attention. We design logos, social media creatives, brand kits, banners, and marketing materials that are not just beautiful — they\'re strategically built to communicate your brand\'s value at a glance.', tech: 'Photoshop · Illustrator · Figma' },
  { icon: '', title: 'Social Media Management', desc: 'We don\'t just post — we build communities and drive growth. From content calendars and daily posting to analytics, engagement, and platform strategy across Instagram, LinkedIn, Facebook, and more.', tech: 'Instagram · LinkedIn · Facebook · TikTok' },
  { icon: '', title: 'Website Development',      desc: 'We engineer high-performance websites built to rank on Google, load in milliseconds, and turn visitors into loyal customers — from polished landing pages to complex web applications.', tech: 'React · Next.js · Node.js' },
  { icon: '', title: 'Mobile App Development',  desc: 'We craft intuitive iOS and Android applications that users keep coming back to. Whether you need an MVP or a full-scale cross-platform product, we deliver it on time and on budget.', tech: 'Flutter · React Native · Swift' },
  { icon: '', title: 'UI/UX Design',            desc: 'Great design is invisible — it guides users effortlessly to take action. We create research-backed, pixel-perfect interfaces that are as functional as they are beautiful, built to convert and built to last.', tech: 'Figma · Prototyping · Design Systems' },
  { icon: '', title: 'E-Commerce Stores',       desc: 'We build online stores engineered to sell around the clock. From seamless checkout flows to smart inventory management and payment gateway integrations — your store will be fast, reliable, and revenue-ready.', tech: 'Shopify · WooCommerce · Custom' },
  { icon: '', title: 'SaaS Development',        desc: 'From user dashboards and billing infrastructure to REST APIs and admin panels, we handle the full engineering lifecycle of software products — so you can focus on acquiring customers, not building plumbing.', tech: 'SaaS · REST APIs · PostgreSQL' },
  { icon: '', title: 'SEO & Performance',       desc: 'Visibility is everything. We conduct in-depth technical SEO audits, resolve Core Web Vitals issues, and implement speed optimisations that move you to page one — and keep you there. More traffic, better rankings, measurable growth.', tech: 'SEO · Analytics · Page Speed' },
];

const N = SERVICES.length;
const STEP_VH = 130; // height of scroll space per card

const getLayoutConfig = (width) => {
  if (width <= 480) {
    return { wActive: 210, wInactive: 100, gap: 8, R: 450 };
  } else if (width <= 680) {
    return { wActive: 240, wInactive: 120, gap: 10, R: 600 };
  } else if (width <= 1024) {
    return { wActive: 280, wInactive: 160, gap: 16, R: 900 };
  } else {
    return { wActive: 340, wInactive: 220, gap: 24, R: 1200 };
  }
};

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const pinRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Pinned arc scroll triggers - active on ALL devices */
  useEffect(() => {
    const onScroll = () => {
      const el = pinRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollableRange = el.offsetHeight - window.innerHeight;
      if (scrollableRange <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
      const idx = Math.min(N - 1, Math.floor(progress * N));
      setActiveIndex(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { wActive, wInactive, gap, R } = getLayoutConfig(windowWidth);

  return (
    <div
      className="svc-pin-outer"
      ref={pinRef}
      style={{ height: `${N * STEP_VH}vh` }}
    >
      <div className="svc-sticky-inner">

        {/* Section header */}
        <div className="svc-header">
          <span className="eyebrow">What We Do</span>
          <h2 className="sec-title" id="services">
            Everything Your <span>Business Needs Online</span>
          </h2>
        </div>

        {/* Arc viewport */}
        <div className="svc-arc-viewport">
          {SERVICES.map((s, i) => {
            let diff = i - activeIndex;
            if (diff < -Math.floor(N / 2)) diff += N;
            if (diff > Math.floor(N / 2)) diff -= N;

            const absDiff = Math.abs(diff);
            const isActive = diff === 0;

            let tx = 0;
            if (diff > 0) {
              tx = (wActive / 2) + gap + (wInactive / 2) + (diff - 1) * (wInactive + gap);
            } else if (diff < 0) {
              tx = -((wActive / 2) + gap + (wInactive / 2) + (absDiff - 1) * (wInactive + gap));
            }

            let ty = 0;
            if (Math.abs(tx) < R) {
              ty = R - Math.sqrt(R * R - tx * tx);
            } else {
              ty = R;
            }

            const angleRad = Math.asin(Math.max(-0.99, Math.min(0.99, tx / R)));
            const rotateDeg = angleRad * (180 / Math.PI) * 0.65;

            const scale = isActive ? 1.0 : Math.max(0.6, 1 - absDiff * 0.08);
            const opacity = isActive ? 1.0 : Math.max(0.2, 1 - absDiff * 0.15);
            const zIdx = 15 - absDiff;

            const currentWidth = isActive ? wActive : wInactive;

            if (absDiff >= 5) return null;

            return (
              <div
                key={s.title}
                className={`svc-card${isActive ? ' active' : ''}`}
                style={{
                  width: `${currentWidth}px`,
                  marginLeft: `${-currentWidth / 2}px`,
                  transform: `translateX(${tx.toFixed(1)}px) translateY(${ty.toFixed(1)}px) rotate(${rotateDeg.toFixed(1)}deg) scale(${scale.toFixed(2)})`,
                  opacity: opacity.toFixed(2),
                  zIndex: zIdx,
                }}
              >
                <span className="svc-ico">{s.icon}</span>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-desc">{s.desc}</p>
                <span className="svc-tech">{s.tech}</span>
              </div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="svc-dots">
          {SERVICES.map((_, i) => (
            <span key={i} className={`svc-dot${i === activeIndex ? ' active' : ''}`} />
          ))}
        </div>

      </div>
    </div>
  );
}
