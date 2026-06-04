import { useState, useEffect, useRef } from 'react';
import './Portfolio.css';

const PROJECTS = [
  { emoji:'🛍️', title:'LuxCart E-Commerce',  desc:'Fashion store with 10k+ products, smart filtering and one-click checkout. 40% uplift in conversion rate.', tags:['Shopify','React','E-Com'],       service:'E-Commerce',   link:'https://shopify.com',     linkLabel:'',  gradient:'linear-gradient(135deg, #1a1040 0%, #0d0a20 100%)' },
  { emoji:'📊', title:'FinTrack Dashboard',  desc:'Real-time analytics SaaS with 500+ paying users. Built with Next.js and a custom Node backend.',   tags:['Next.js','Node','SaaS'],        service:'Web Dev',      link:'https://vercel.com',      linkLabel:'',  gradient:'linear-gradient(135deg, #0a1628 0%, #061020 100%)' },
  { emoji:'🏥', title:'HealthMate App',      desc:'Doctor appointment and health record mobile app. 4.8★ on the App Store. 20k+ downloads.',       tags:['Flutter','Firebase','Mobile'],  service:'App Dev',      link:'https://flutter.dev',     linkLabel:'', gradient:'linear-gradient(135deg, #0d1a14 0%, #081510 100%)' },
  { emoji:'🏘️', title:'PropFind Platform',  desc:'Real estate listing platform with map search and 3D virtual tours.',                   tags:['React','Maps API','Web'],       service:'Web Dev',      link:'https://react.dev',       linkLabel:'',  gradient:'linear-gradient(135deg, #151020 0%, #0c0818 100%)' },
  { emoji:'🎓', title:'EduFlow LMS',         desc:'Learning platform with video courses, quizzes, and certificates. 2,000 students enrolled.',               tags:['Vue.js','Django','LMS'],        service:'UI/UX Design', link:'https://vuejs.org',        linkLabel:'', gradient:'linear-gradient(135deg, #101a28 0%, #0a1020 100%)' },
  { emoji:'🍕', title:'QuickBite Delivery',  desc:'Food delivery app with GPS live tracking and handles 500+ orders/day.',                       tags:['React Native','GPS','Mobile'],  service:'App Dev',      link:'https://reactnative.dev', linkLabel:'',   gradient:'linear-gradient(135deg, #1a0d0d 0%, #140808 100%)' },
  { emoji:'🎬', title:'ReelCraft Studio',    desc:'Professional video editing workflow for a content agency.',                   tags:['Premiere','After Effects'],     service:'Video Editing', link:'#',                      linkLabel:'', gradient:'linear-gradient(135deg, #1a1018 0%, #120810 100%)' },
  { emoji:'📱', title:'GrowthPulse Social',  desc:'Full social media management D2C brand. 3x follower growth and 5x engagement.',                       tags:['Instagram','LinkedIn','Ads'],   service:'Social Media', link:'#',                      linkLabel:'', gradient:'linear-gradient(135deg, #0a1a18 0%, #061510 100%)' },
];

const SERVICES = ['All', ...new Set(PROJECTS.map(p => p.service))];

export default function Portfolio() {
  const [activeService, setActiveService] = useState('All');
  const [rotation, setRotation] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveredOverViewport, setIsHoveredOverViewport] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered = activeService === 'All' ? PROJECTS : PROJECTS.filter(p => p.service === activeService);
  const totalCards = filtered.length;

  const angleStep = 36; // Spacing angle
  const autoPlayTimer = useRef(null);
  // Auto Play setup (Only active when mouse is NOT inside the viewport)
  useEffect(() => {
    if (isHoveredOverViewport || hoveredIndex !== null || totalCards <= 1) return;
    autoPlayTimer.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % totalCards;
        setRotation(-next * angleStep);
        return next;
      });
    }, 5000); // Autoplay interval speed (Relaxed to 5.0s)

    return () => clearInterval(autoPlayTimer.current);
  }, [isHoveredOverViewport, hoveredIndex, totalCards]);

  useEffect(() => {
    setRotation(0);
    setActiveIndex(0);
  }, [activeService]);

  // Buttery-smooth mouse position hover-to-slide logic
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width)); // Normalise to 0 to 1
    
    // Map horizontal mouse coordinate to continuous 3D rotation
    const targetRotation = -percentage * (totalCards - 1) * angleStep;
    setRotation(targetRotation);
    
    const currentIdx = Math.round(-targetRotation / angleStep);
    setActiveIndex(currentIdx);
  };

  // Buttery-smooth touch position tracking for mobile
  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    const targetRotation = -percentage * (totalCards - 1) * angleStep;
    setRotation(targetRotation);
    
    const currentIdx = Math.round(-targetRotation / angleStep);
    setActiveIndex(currentIdx);
  };

  return (
    <section className="section-wrap" id="portfolio">
      <div className="eyebrow rev">Our Work</div>
      <h2 className="sec-title rev">Projects That <span>Actually Shipped</span></h2>
      <p className="sec-sub rev">Simply hover and move your mouse left or right over the cards to glide smoothly.</p>

      {/* Service filter pills */}
      <div className="port-filters rev d1">
        {SERVICES.map(s => (
          <button
            key={s}
            className={`port-filter-pill ${activeService === s ? 'active' : ''}`}
            onClick={() => setActiveService(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 3D Arc Viewport */}
      <div 
        className="arc-viewport rev d2"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseEnter={() => setIsHoveredOverViewport(true)}
        onMouseLeave={() => {
          setIsHoveredOverViewport(false);
          setHoveredIndex(null);
          // Snap back cleanly to closest index on leave
          setRotation(-activeIndex * angleStep);
        }}
      >
        <div className="arc-scene">
          <div className="arc-deck">
            {filtered.map((p, i) => {
              const currentActiveFloatingIndex = -rotation / angleStep;
              const offset = i - currentActiveFloatingIndex;

              const cardAngle = i * angleStep;
              const isActive = i === activeIndex;
              const isHovered = hoveredIndex === i;

              // Smooth opacity fades
              const offsetAngle = Math.abs(cardAngle + rotation);
              const opacity = Math.max(0.15, 1 - (offsetAngle / 95));

              // 3D coverflow coordinates
              const getCardSpacing = (w) => {
                if (w <= 600) return 180;
                if (w <= 900) return 230;
                return 290;
              };
              const spacing = getCardSpacing(windowWidth);
              const translateX = offset * spacing;
              const translateZ = -Math.abs(offset) * 140;
              const rotateY = -offset * 32;

              // Scale & lift variables
              const scale = isActive ? (isHovered ? 1.12 : 1.04) : 0.8;
              const translateY = (isActive && isHovered) ? -40 : 0;

              return (
                <div
                  key={p.title}
                  className={`arc-card ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                  style={{
                    transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity: opacity,
                    zIndex: 10 - Math.round(Math.abs(offset)),
                    pointerEvents: Math.abs(offset) > 1.2 ? 'none' : 'auto',
                    // Use a unified, highly-dampened smooth glide transition
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  }}
                  onClick={() => {
                    setActiveIndex(i);
                    setRotation(-i * angleStep);
                  }}
                  onMouseEnter={() => { if (isActive) setHoveredIndex(i); }}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="acard-thumb" style={{ background: p.gradient }}>
                    <span className="acard-emoji">{p.emoji}</span>
                    <div className="acard-service-badge">{p.service}</div>
                  </div>
                  <div className="acard-body">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <div className="acard-footer">
                      <div className="tags">
                        {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                      </div>
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="acard-link">
                        {p.linkLabel}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manual Click Buttons */}
        {totalCards > 1 && (
          <div className="arc-nav">
            <button 
              className="arc-nav-btn prev" 
              onClick={(e) => {
                e.stopPropagation();
                const prev = (activeIndex - 1 + totalCards) % totalCards;
                setActiveIndex(prev);
                setRotation(-prev * angleStep);
              }}
            >
              ←
            </button>
            <button 
              className="arc-nav-btn next" 
              onClick={(e) => {
                e.stopPropagation();
                const next = (activeIndex + 1) % totalCards;
                setActiveIndex(next);
                setRotation(-next * angleStep);
              }}
            >
              →
            </button>
          </div>
        )}

        <div className="arc-floor-glow" />
      </div>
    </section>
  );
}
