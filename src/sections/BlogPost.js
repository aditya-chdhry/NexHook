import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuditModal from '../components/AuditModal';
import useReveal from '../components/useReveal';
import { BLOGS_DATA } from './BlogPage';
import './BlogPost.css';

/* Simple markdown-ish renderer — handles ##, ###, **, `, |tables|, lists, \n */
function renderContent(raw) {
  const lines = raw.trim().split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) { i++; continue; }

    // Table detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      // Parse table
      const headerCells = tableLines[0].split('|').filter(c => c.trim()).map(c => c.trim());
      const dataRows = tableLines.slice(2); // skip header + separator
      elements.push(
        <div className="blog-table-wrap" key={`table-${elements.length}`}>
          <table className="blog-table">
            <thead>
              <tr>{headerCells.map((c, ci) => <th key={ci}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => {
                const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
                return <tr key={ri}>{cells.map((c, ci) => <td key={ci}>{c}</td>)}</tr>;
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      elements.push(<h2 key={`h2-${i}`} id={id} className="bp-h2">{text}</h2>);
      i++; continue;
    }

    // H3
    if (line.startsWith('### ')) {
      const text = line.slice(4).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      elements.push(<h3 key={`h3-${i}`} id={id} className="bp-h3">{text}</h3>);
      i++; continue;
    }

    // Ordered list item
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${elements.length}`} className="bp-ol">
          {listItems.map((item, li) => (
            <li key={li} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ol>
      );
      continue;
    }

    // Unordered list item
    if (line.trim().startsWith('- ') || line.trim().startsWith('☑ ')) {
      const listItems = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('☑ '))) {
        listItems.push(lines[i].trim().replace(/^-\s/, '').replace(/^☑\s/, '☑ '));
        i++;
      }
      elements.push(
        <ul key={`ul-${elements.length}`} className="bp-ul">
          {listItems.map((item, li) => (
            <li key={li} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="bp-p" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
    );
    i++;
  }

  return elements;
}

function formatInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\\`/g, '`');
}

export default function BlogPost() {
  useReveal();
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [moreBlogs, setMoreBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadBlogData = async () => {
      setLoading(true);
      try {
        const url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? `/api/blogs/${id}`
          : `/_/backend/api/blogs/${id}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          const fallback = BLOGS_DATA.find(b => b.id === id);
          setBlog(fallback || null);
        }
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        const fallback = BLOGS_DATA.find(b => b.id === id);
        setBlog(fallback || null);
      }

      try {
        const urlList = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? '/api/blogs'
          : '/_/backend/api/blogs';
        const resList = await fetch(urlList);
        if (resList.ok) {
          const list = await resList.json();
          const published = list.filter(b => b.id !== id && b.published !== false);
          setMoreBlogs(published.slice(0, 3));
        } else {
          setMoreBlogs(BLOGS_DATA.filter(b => b.id !== id).slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch more blogs:', err);
        setMoreBlogs(BLOGS_DATA.filter(b => b.id !== id).slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    loadBlogData();
  }, [id]);

  const shareUrl = useMemo(() => {
    if (!blog) return '';
    const origin = window.location.origin;
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return `https://nexhook.in/blogs/${blog.id}`;
    }
    return `${origin}/blogs/${blog.id}`;
  }, [blog]);

  const [copied, setCopied] = useState(false);

  const handleShare = (e, platform) => {
    e.preventDefault();
    if (!blog) return;
    let url = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(blog.title);

    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' - ' + shareUrl)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    } else if (platform === 'x') {
      url = `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    }

    if (url) {
      const width = 575;
      const height = 530;
      const left = (window.innerWidth - width) / 2 + window.screenX;
      const top = (window.innerHeight - height) / 2 + window.screenY;
      window.open(
        url,
        `share-${platform}`,
        `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      );
    }
  };

  const handleCopyLink = (e) => {
    e.preventDefault();
    if (!blog) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const headings = useMemo(() => {
    if (!blog) return [];
    const lines = blog.content.split('\n');
    const list = [];
    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const text = line.slice(3).trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        list.push({ level: 2, text, id });
      } else if (line.startsWith('### ')) {
        const text = line.slice(4).trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        list.push({ level: 3, text, id });
      }
    });
    return list;
  }, [blog]);

  useEffect(() => {
    const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(sorted[0].target.id);
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0.1
      }
    );

    headingElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (loading) {
    return (
      <div className="App">
        <Navbar onAuditClick={() => { console.log("BlogPost Loading Navbar Clicked"); setShowAuditModal(true); }} />
        <div style={{ textAlign: 'center', padding: '120px 0', color: '#64748b' }}>
          <h2>Loading insights...</h2>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="App">
        <Navbar onAuditClick={() => { console.log("BlogPost NotFound Navbar Clicked"); setShowAuditModal(true); }} />
        <div className="bp-not-found">
          <h1>Blog post not found</h1>
          <p>The article you're looking for doesn't exist.</p>
          <Link to="/blogs" className="btn-prim">← Back to All Blogs</Link>
        </div>
      </div>
    );
  }

  const content = renderContent(blog.content);

  return (
    <div className="App">
      <Navbar onAuditClick={() => { console.log("BlogPost Navbar Clicked"); setShowAuditModal(true); }} />
      <article className="bp-article">
        {/* Hero */}
        <header className="bp-hero">
          <button className="bp-back" onClick={() => navigate('/blogs')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            All Blogs
          </button>
          <span className="bp-tag">{blog.tag}</span>
          <h1 className="bp-title rev">{blog.title}</h1>
          <div className="bp-meta rev">
            <span className="bp-author">By {blog.author}</span>
            <span className="bp-dot">·</span>
            <span>{blog.date}</span>
            <span className="bp-dot">·</span>
            <span>{blog.readTime}</span>
          </div>
        </header>

        {/* Cover Image */}
        <div className="bp-cover rev">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="bp-cover-img" 
            fetchpriority="high"
            width="800"
            height="420"
          />
        </div>

        {/* 2-Column Split: TOC on Left, Content on Right */}
        <div className="bp-main-layout">
          {headings.length > 0 && (
            <aside className="bp-toc-sidebar">
              <div className="bp-toc-sticky">
                <h4>Table of Contents</h4>
                <ul>
                  {headings.map((h) => (
                    <li key={h.id} className={`toc-lvl-${h.level}${activeId === h.id ? ' active' : ''}`}>
                      <a 
                        href={`#${h.id}`} 
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(h.id);
                          if (el) {
                            const navbarOffset = 100;
                            const elementPosition = el.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            });
                          }
                        }}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="bp-toc-share">
                  <h5>Share Article</h5>
                  <div className="bp-share-buttons">
                    <button 
                      onClick={(e) => handleShare(e, 'whatsapp')}
                      className="share-btn wa"
                      title="Share on WhatsApp"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleShare(e, 'x')}
                      className="share-btn x"
                      title="Share on X"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleShare(e, 'linkedin')}
                      className="share-btn li"
                      title="Share on LinkedIn"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={handleCopyLink}
                      className={`share-btn copy${copied ? ' copied' : ''}`}
                      title={copied ? "Link Copied!" : "Copy Link"}
                    >
                      {copied ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cyan)' }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}

          <div className="bp-content-col">
            {/* Content */}
            <div className="bp-content rev">
              {content}
            </div>

            {/* CTA */}
            <div className="bp-cta rev">
              <h3>Want results like these for your business?</h3>
              <p>Book a free 30-minute strategy call with the NexHook team.</p>
              <button onClick={() => { console.log("BlogPost CTA Clicked"); setShowAuditModal(true); }} className="btn-prim" style={{ border: 'none', cursor: 'pointer' }}>
                Book Free Audit Call →
              </button>
            </div>
          </div>
        </div>

        {/* More Blogs */}
        <div className="bp-more rev">
          <h3>More from our blog</h3>
          <div className="bp-more-grid">
            {moreBlogs.map(b => (
              <Link to={`/blogs/${b.id}`} className="bp-more-card" key={b.id}>
                <div className="bp-more-cover">
                  <img 
                    src={b.image} 
                    alt={b.title} 
                    loading="lazy"
                    width="300"
                    height="140"
                  />
                </div>
                <div className="bp-more-body">
                  <span className="bp-more-tag">{b.tag}</span>
                  <h4>{b.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
      <AuditModal isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} />
    </div>
  );
}
