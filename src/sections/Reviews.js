import { useRef, useEffect } from 'react';
import './Reviews.css';

const REVIEWS = [
  { init:'AC', color:'#2459e7', name:'Adarsh Chaudhary',  role:'Founder, Agnirise Systems', text:'"NexHook transformed our clunky website into something we\'re genuinely proud to share. Traffic is up 80% and enquiries have tripled. Worth every rupee."' },
  { init:'KB', color:'#0e40c4', name:'Karan Bajaj',   role:'Founder, Pipeloom',              text:'"We had a tight 8-week timeline and NexHook delivered 3 days early. The app is fast, beautiful, and our customers love it. Already planning v2 with them."' },
  { init:'SR', color:'#1e6bff', name:'Sandesh Raj',    role:'CTO, CartClothing',      text:'"What impressed me most was the communication. Weekly demos, Slack updates, honest timelines. I always knew where we were. That\'s rare in this industry."' },
  { init:'VG', color:'#0a30a8', name:'Vikram Gupta',   role:'Product Lead',       text:'"They took a confusing brief and turned it into a clean, intuitive mobile app. The UX work was exceptional — users figured it out with zero onboarding."' },
  { init:'SR', color:'#2952d9', name:'Sneha Rajput',   role:'Founder, LCart',            text:'"Our e-commerce store went from loading in 7 seconds to under 1.5 seconds. Sales went up 35% the next month. The SEO work alone paid for the whole project."' },
  { init:'DK', color:'#1a3cb0', name:'Deepak Kumar',   role:'Co-founder, Quick**',       text:'"5 stars isn\'t enough. NexHook treated our startup like it was their own. They flagged things we hadn\'t thought of, pushed back when it mattered, and shipped something special."' },
];

export default function Reviews() {
  const gridRef = useRef(null);

  /* Desktop-only mouse drag — mobile uses native touch scroll via CSS */
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      el.classList.add('grabbing');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove('grabbing');
    };
    const onMouseUp = () => {
      isDown = false;
      el.classList.remove('grabbing');
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.8;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <section className="section-wrap" id="reviews">
      <div className="eyebrow rev">Client Reviews</div>
      <h2 className="sec-title rev">What Clients <span>Write About Us</span></h2>
      <div className="reviews-grid" ref={gridRef}>
        {REVIEWS.map((r, i) => (
          <div className={`review-card rev d${(i % 3) + 1}`} key={r.name}>
            <div className="review-stars">★★★★★</div>
            <p className="review-text">{r.text}</p>
            <div className="reviewer">
              <div className="rev-av" style={{ background: r.color }}>{r.init}</div>
              <div>
                <div className="rev-name">{r.name}</div>
                <div className="rev-role">{r.role}</div>
                <div className="rev-verified">✔ Verified Client</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
