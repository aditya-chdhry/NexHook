import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BLOGS_DATA } from './BlogPage';
import useReveal from '../components/useReveal';
import './Blogs.css';

export default function Blogs() {
  const gridRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useReveal();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? '/api/blogs'
          : '/_/backend/api/blogs';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const published = data.filter(b => b.published !== false);
          setBlogs(published.slice(0, 6));
        } else {
          setBlogs(BLOGS_DATA.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to fetch dynamic blogs:', err);
        setBlogs(BLOGS_DATA.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  /* Desktop-only mouse drag — mobile uses native CSS touch scroll */
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
    <section className="section-wrap-alt" id="blogs">
      <div className="blog-intro">
        <div className="eyebrow rev">Our Blog</div>
        <h2 className="sec-title rev">Insights & <span>Resources</span></h2>
        <p className="sec-sub rev">
          Actionable tips, industry trends, and behind-the-scenes stories from the NexHook team.
        </p>
      </div>
      <div className="blog-grid" ref={gridRef}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b', gridColumn: '1 / -1' }}>
            Loading insights...
          </div>
        ) : (
          blogs.map((b, i) => (
            <Link to={`/blogs/${b.id}`} className={`blog-card rev d${(i % 4) + 1}`} key={b.id}>
              <div className="blog-cover">
                <img 
                  src={b.image} 
                  alt={b.title} 
                  className="blog-img" 
                  loading="lazy" 
                  width="360" 
                  height="180" 
                />
                <span className="blog-tag">{b.tag}</span>
              </div>
              <div className="blog-body">
                <h3 className="blog-title">{b.title}</h3>
                <p className="blog-excerpt">{b.excerpt}</p>
                <div className="blog-meta">
                  <span className="blog-date">{b.date}</span>
                  <span className="blog-dot">·</span>
                  <span className="blog-read">{b.readTime}</span>
                </div>
                <span className="blog-link">
                  Read More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="blog-view-more rev">
        <Link to="/blogs" className="btn-ghost">
          View All Blogs
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </section>
  );
}
