import { useState, useEffect } from 'react';
import { getAuthHeaders } from './adminData';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '/api'
  : '/_/backend/api';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null); // null if not editing/creating
  const [search, setSearch] = useState('');
  const [editorErrors, setEditorErrors] = useState({});

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/blogs`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (blog) => {
    try {
      const updated = { ...blog, published: !blog.published };
      const res = await fetch(`${API_URL}/blogs/${blog.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (err) {
      console.error('Failed to toggle publication status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`${API_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (err) {
      console.error('Failed to delete blog:', err);
    }
  };

  const startCreate = () => {
    setEditingBlog({
      id: '',
      title: '',
      tag: 'Development',
      excerpt: '',
      readTime: '5 min read',
      image: '',
      author: 'Aditya Chaudhary',
      content: '',
      published: true,
      isNew: true
    });
    setEditorErrors({});
  };

  const startEdit = (blog) => {
    setEditingBlog({
      ...blog,
      isNew: false
    });
    setEditorErrors({});
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingBlog(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validateEditor = () => {
    const errs = {};
    if (!editingBlog.title.trim()) errs.title = 'Title is required';
    if (!editingBlog.id.trim()) {
      errs.id = 'Slug/ID is required';
    } else if (!/^[a-z0-9-]+$/.test(editingBlog.id)) {
      errs.id = 'Slug must be lower-case alphanumeric and dashes only (e.g. why-my-startup-failed)';
    }
    if (!editingBlog.excerpt.trim()) errs.excerpt = 'Excerpt is required';
    if (!editingBlog.content.trim()) errs.content = 'Content is required';
    setEditorErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveBlog = async (e) => {
    e.preventDefault();
    if (!validateEditor()) return;

    try {
      const url = editingBlog.isNew
        ? `${API_URL}/blogs`
        : `${API_URL}/blogs/${editingBlog.id}`;
      const method = editingBlog.isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(editingBlog)
      });

      if (res.ok) {
        setEditingBlog(null);
        fetchBlogs();
      } else {
        const errData = await res.json();
        if (errData.error && errData.error.includes('duplicate')) {
          setEditorErrors({ id: 'Slug/ID already exists. Please choose a unique one.' });
        } else {
          alert('Failed to save blog post: ' + (errData.error || 'Unknown error'));
        }
      }
    } catch (err) {
      console.error('Error saving blog:', err);
    }
  };

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase()) ||
    b.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ad-page">
      <div className="ad-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="ad-page-title">Blog Manager</h1>
          <p className="ad-page-sub">Create, edit, and publish blogs dynamically on your website</p>
        </div>
        {!editingBlog && (
          <button className="btn-prim" onClick={startCreate} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>+ Create Blog</span>
          </button>
        )}
      </div>

      {editingBlog ? (
        // ─── EDITOR VIEW ───
        <div className="ad-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, color: '#f0f4ff' }}>
              {editingBlog.isNew ? '📝 Create New Blog Post' : '✏️ Edit Blog Post'}
            </h3>
            <button className="btn-ghost" onClick={() => setEditingBlog(null)} style={{ padding: '6px 12px' }}>Cancel</button>
          </div>

          <form onSubmit={saveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="ad-fg">
                <label>Blog Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Coding Tips for Startups"
                  value={editingBlog.title}
                  onChange={e => {
                    const title = e.target.value;
                    const autoSlug = title.toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, '')
                      .replace(/\s+/g, '-');
                    setEditingBlog(prev => ({
                      ...prev,
                      title,
                      id: prev.isNew ? autoSlug : prev.id
                    }));
                  }}
                  style={{ width: '100%', padding: '10px', background: '#080a16', border: '1px solid #1e293b', borderRadius: '6px', color: '#cbd5e1' }}
                />
                {editorErrors.title && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{editorErrors.title}</span>}
              </div>

              <div className="ad-fg">
                <label>Blog Slug / ID (URL path) *</label>
                <input
                  type="text"
                  placeholder="e.g. 5-coding-tips-for-startups"
                  disabled={!editingBlog.isNew}
                  value={editingBlog.id}
                  onChange={e => setEditingBlog(prev => ({ ...prev, id: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: '#080a16', border: '1px solid #1e293b', borderRadius: '6px', color: '#cbd5e1', opacity: editingBlog.isNew ? 1 : 0.6 }}
                />
                {editorErrors.id && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{editorErrors.id}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div className="ad-fg">
                <label>Category (Tag) *</label>
                <select
                  value={editingBlog.tag}
                  onChange={e => setEditingBlog(prev => ({ ...prev, tag: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: '#080a16', border: '1px solid #1e293b', borderRadius: '6px', color: '#cbd5e1' }}
                >
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="SEO">SEO</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="AI">AI</option>
                </select>
              </div>

              <div className="ad-fg">
                <label>Read Time Estimate</label>
                <input
                  type="text"
                  placeholder="e.g. 6 min read"
                  value={editingBlog.readTime}
                  onChange={e => setEditingBlog(prev => ({ ...prev, readTime: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: '#080a16', border: '1px solid #1e293b', borderRadius: '6px', color: '#cbd5e1' }}
                />
              </div>

              <div className="ad-fg">
                <label>Author Name</label>
                <input
                  type="text"
                  value={editingBlog.author}
                  onChange={e => setEditingBlog(prev => ({ ...prev, author: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: '#080a16', border: '1px solid #1e293b', borderRadius: '6px', color: '#cbd5e1' }}
                />
              </div>
            </div>

            <div className="ad-fg">
              <label>Featured Image (Image URL or Upload file)</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Paste image URL here..."
                  value={editingBlog.image}
                  onChange={e => setEditingBlog(prev => ({ ...prev, image: e.target.value }))}
                  style={{ flex: 1, padding: '10px', background: '#080a16', border: '1px solid #1e293b', borderRadius: '6px', color: '#cbd5e1' }}
                />
                <span style={{ color: '#475569' }}>or</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ color: '#cbd5e1', fontSize: '0.8rem' }}
                />
              </div>
              {editingBlog.image && (
                <div style={{ marginTop: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>Image Preview:</span>
                  <img src={editingBlog.image} alt="Featured Preview" style={{ maxHeight: '100px', borderRadius: '6px', border: '1px solid #1e293b' }} />
                </div>
              )}
            </div>

            <div className="ad-fg">
              <label>Brief Excerpt *</label>
              <textarea
                placeholder="Write a short summary of the blog to display on listing pages..."
                rows={2}
                value={editingBlog.excerpt}
                onChange={e => setEditingBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                style={{ width: '100%', padding: '10px', background: '#080a16', border: '1px solid #1e293b', borderRadius: '6px', color: '#cbd5e1', resize: 'vertical' }}
              />
              {editorErrors.excerpt && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{editorErrors.excerpt}</span>}
            </div>

            {/* Markdown Editor with side-by-side Live Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '350px' }}>
              <div className="ad-fg" style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Blog Content (Markdown / HTML body) *</label>
                <div style={{ background: '#080a16', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px', display: 'flex', gap: '8px', borderBottom: 'none', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                  <button type="button" onClick={() => {
                    setEditingBlog(prev => ({ ...prev, content: prev.content + '\n## Heading 2\n' }));
                  }} style={{ background: '#1e293b', border: 'none', color: '#cbd5e1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>H2</button>
                  <button type="button" onClick={() => {
                    setEditingBlog(prev => ({ ...prev, content: prev.content + '\n### Heading 3\n' }));
                  }} style={{ background: '#1e293b', border: 'none', color: '#cbd5e1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>H3</button>
                  <button type="button" onClick={() => {
                    setEditingBlog(prev => ({ ...prev, content: prev.content + ' **bold text** ' }));
                  }} style={{ background: '#1e293b', border: 'none', color: '#cbd5e1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>B</button>
                  <button type="button" onClick={() => {
                    setEditingBlog(prev => ({ ...prev, content: prev.content + ' *italic text* ' }));
                  }} style={{ background: '#1e293b', border: 'none', color: '#cbd5e1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontStyle: 'italic' }}>I</button>
                  <button type="button" onClick={() => {
                    setEditingBlog(prev => ({ ...prev, content: prev.content + '\n- List item\n' }));
                  }} style={{ background: '#1e293b', border: 'none', color: '#cbd5e1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>List</button>
                </div>
                <textarea
                  placeholder="Write the full body content here using markdown or html formatting..."
                  value={editingBlog.content}
                  onChange={e => setEditingBlog(prev => ({ ...prev, content: e.target.value }))}
                  style={{ flex: 1, padding: '10px', background: '#04050a', border: '1px solid #1e293b', borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px', color: '#cbd5e1', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
                />
                {editorErrors.content && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{editorErrors.content}</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>👁️ Live Visual Preview</label>
                <div style={{ flex: 1, padding: '16px', background: '#080a16', border: '1px solid #1e293b', borderRadius: '6px', overflowY: 'auto', color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', maxHeight: '400px' }}>
                  {editingBlog.content ? (
                    <div className="blog-body-preview">
                      <h1 style={{ color: '#f0f4ff', margin: '0 0 10px 0', fontSize: '1.4rem' }}>{editingBlog.title || 'Untitled Blog'}</h1>
                      {editingBlog.image && <img src={editingBlog.image} alt="Featured" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '16px' }} />}
                      <div style={{ whiteSpace: 'pre-line' }}>{editingBlog.content}</div>
                    </div>
                  ) : (
                    <div style={{ color: '#475569', textAlign: 'center', marginTop: '100px' }}>Your markdown formatting will render here in real-time.</div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="published"
                checked={editingBlog.published}
                onChange={e => setEditingBlog(prev => ({ ...prev, published: e.target.checked }))}
              />
              <label htmlFor="published" style={{ color: '#cbd5e1', cursor: 'pointer' }}>Publish immediately (Visible on website)</label>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px', borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
              <button type="submit" className="btn-prim" style={{ padding: '10px 24px' }}>Save Post</button>
              <button type="button" className="btn-ghost" onClick={() => setEditingBlog(null)} style={{ padding: '10px 24px' }}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        // ─── LIST VIEW ───
        <div className="ad-card">
          <div className="ad-card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <span className="ad-card-title">📖 All Blogs ({blogs.length})</span>
            <input
              type="text"
              placeholder="Search blogs..."
              className="ad-search-inp"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 12px', background: '#080a16', border: '1px solid #1e293b', borderRadius: '6px', color: '#cbd5e1', minWidth: '240px' }}
            />
          </div>

          <div className="ad-table-wrap">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>Loading blogs...</div>
            ) : filtered.length > 0 ? (
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: '500', color: '#f0f4ff' }}>{b.title}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b' }}>/blogs/{b.id}</td>
                      <td>
                        <span className="m-tag" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                          {b.tag}
                        </span>
                      </td>
                      <td>{b.date}</td>
                      <td>
                        <button
                          onClick={() => handlePublishToggle(b)}
                          className={`badge ${b.published ? 'badge-closed' : 'badge-new'}`}
                          style={{
                            cursor: 'pointer',
                            border: 'none',
                            background: b.published ? 'rgba(74, 222, 128, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                            color: b.published ? '#4ade80' : '#fbbf24'
                          }}
                          title={b.published ? 'Click to unpublish' : 'Click to publish'}
                        >
                          {b.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => startEdit(b)}
                            style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.85rem' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#475569' }}>
                {search ? 'No blogs match your search criteria.' : 'No blog posts found. Create your first post!'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
