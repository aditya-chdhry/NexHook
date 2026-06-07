import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Services',  id: 'services'  },
  { label: 'Work',      id: 'portfolio' },
  { label: 'Process',   id: 'process'   },
  { label: 'Team',      id: 'team'      },
  { label: 'Reviews',   id: 'reviews'   },
  { label: 'Blog',      route: '/blogs'  },
];

export default function Navbar({ onAuditClick }) {
  const [solid, setSolid] = useState(false);
  const [open,  setOpen]  = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (isHome) {
      setSolid(false);
      return;
    }
    const fn = () => setSolid(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, [isHome]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const go = (link) => {
    setOpen(false);

    // If the link has a route (like Blog), navigate to that page
    if (link.route) {
      navigate(link.route);
      return;
    }

    // If we're on the home page, just scroll
    if (isHome) {
      const el = document.getElementById(link.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Navigate to home page with hash for section
      navigate('/#' + link.id);
      // Small delay to let the page render, then scroll
      setTimeout(() => {
        const el = document.getElementById(link.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  const goHome = () => {
    setOpen(false);
    if (isHome) {
      const el = document.getElementById('hero');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/');
    }
  };

  const goAudit = () => {
    setOpen(false);
    if (onAuditClick) {
      onAuditClick();
    } else if (isHome) {
      const el = document.getElementById('audit');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/#audit');
      setTimeout(() => {
        const el = document.getElementById('audit');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  return (
    <header className={`nh-nav${solid ? ' solid' : ''}${!isHome ? ' sticky-nav' : ''}`}>
      <button className="nh-logo" onClick={goHome}>
        <img src="/logo.png" alt="NexHook" className="nh-logo-img" width="24" height="24" />
        <span className="nh-logo-text">Nex<span>Hook</span></span>
      </button>

      <nav className="nh-links">
        {NAV_LINKS.map(l => (
          <button
            key={l.id || l.route}
            onClick={() => go(l)}
            className={l.route && location.pathname === l.route ? 'active' : ''}
          >
            {l.label}
          </button>
        ))}
      </nav>

      <div className="nh-actions-wrap">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        <button className="nh-cta" onClick={goAudit}>
          Book Free Audit →
        </button>
      </div>

      <button className={`nh-burger${open ? ' x' : ''}`} onClick={() => setOpen(!open)} aria-label="menu">
        <span /><span /><span />
      </button>

      <div className={`nh-mobile${open ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <button key={l.id || l.route} onClick={() => go(l)}>{l.label}</button>
        ))}
        <button className="nh-mob-cta" onClick={goAudit}>
          Book Free Audit Call →
        </button>
      </div>
    </header>
  );
}
