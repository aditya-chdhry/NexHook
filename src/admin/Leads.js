import { useState, useEffect } from 'react';
import { getLeads, saveLead, deleteLead, } from './adminData';
import './AdminLayout.css';

const STATUSES = ['new','contacted','qualified','closed','lost'];

export default function Leads() {
  const [leads, setLeads]     = useState([]);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');
  const [modal, setModal]     = useState(null); // null | 'view' | 'edit' | 'add'
  const [active, setActive]   = useState(null);

  const reload = async () => setLeads(await getLeads());
  useEffect(() => { reload(); }, []);

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.company.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || l.status === filter;
    return matchSearch && matchFilter;
  });

  const openView = l  => { setActive(l);    setModal('view'); };
  const openEdit = l  => { setActive({...l}); setModal('edit'); };
  const openAdd  = () => { setActive({ id:'', name:'', email:'', phone:'', company:'', service:'Website Development', message:'', status:'new' }); setModal('add'); };
  const close    = () => { setModal(null); setActive(null); };

  const handleSave = async () => {
    const toSave = { ...active };
    
    if (!toSave.date) toSave.date = new Date().toISOString().split('T')[0];
    await saveLead(toSave); await reload(); close();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this lead?')) { await deleteLead(id); await reload(); }
  };

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Leads</h1>
          <p className="ad-page-sub">{leads.length} total · {leads.filter(l=>l.status==='new').length} new</p>
        </div>
        <button className="ad-btn-prim" onClick={openAdd}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="ad-filters">
        <div className="ad-search-wrap">
          <svg className="ad-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="ad-search" placeholder="Search by name, email, company…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="ad-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="ad-card">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr><th>#</th><th>Contact</th><th>Company</th><th>Service</th><th>Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="7">
                  <div className="ad-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <p>No leads found</p>
                  </div>
                </td></tr>
              )}
              {filtered.map(l => (
                <tr key={l.id}>
                  <td style={{color:'#3b4d6a',fontFamily:'monospace',fontSize:'.78rem'}}>{l.id}</td>
                  <td>
                    <div style={{fontWeight:600,color:'#f0f4ff'}}>{l.name}</div>
                    <div style={{fontSize:'.75rem',color:'#7689ad'}}>{l.email}</div>
                    <div style={{fontSize:'.75rem',color:'#3b4d6a'}}>{l.phone}</div>
                  </td>
                  <td style={{color:'#7689ad'}}>{l.company || '—'}</td>
                  <td style={{color:'#7689ad',whiteSpace:'nowrap'}}>{l.service}</td>
                  <td style={{color:'#3b4d6a',whiteSpace:'nowrap',fontSize:'.8rem'}}>{l.date}</td>
                  <td>
                    <select
                      className="ad-filter-select"
                      style={{padding:'4px 10px',fontSize:'.76rem'}}
                      value={l.status}
                      onChange={async e => { await saveLead({...l, status:e.target.value}); await reload(); }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'4px'}}>
                      <button className="ad-btn-icon" title="View" onClick={() => openView(l)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button className="ad-btn-icon" title="Edit" onClick={() => openEdit(l)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="ad-btn-icon ad-btn-del" title="Delete" onClick={() => handleDelete(l.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {modal === 'view' && active && (
        <div className="ad-overlay" onClick={close}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <h3>📋 Lead Details</h3>
            <div className="ld-detail-grid">
              {[['ID',active.id],['Name',active.name],['Email',active.email],['Phone',active.phone],['Company',active.company||'—'],['Service',active.service],['Date',active.date]].map(([k,v])=>(
                <div key={k} className="ld-detail-row"><span className="ld-detail-key">{k}</span><span>{v}</span></div>
              ))}
              <div className="ld-detail-row"><span className="ld-detail-key">Status</span><span className={`badge badge-${active.status}`}>{active.status}</span></div>
              {active.message && (
                <div className="ld-detail-row ld-detail-full"><span className="ld-detail-key">Message</span><p className="ld-detail-msg">{active.message}</p></div>
              )}
            </div>
            <div className="ad-modal-footer">
              <button className="ad-btn-ghost" onClick={close}>Close</button>
              <button className="ad-btn-prim" onClick={() => { close(); setTimeout(()=>openEdit(active),50); }}>Edit</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal === 'edit' || modal === 'add') && active && (
        <div className="ad-overlay" onClick={close}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <h3>{modal === 'add' ? '➕ Add Lead' : '✏️ Edit Lead'}</h3>
            {[['name','Full Name','text'],['email','Email','email'],['phone','Phone','tel'],['company','Company','text']].map(([k,lbl,t])=>(
              <div className="ad-fg" key={k}>
                <label>{lbl}</label>
                <input className="ad-inp" type={t} value={active[k]} onChange={e=>setActive({...active,[k]:e.target.value})} />
              </div>
            ))}
            <div className="ad-fg">
              <label>Service</label>
              <select className="ad-inp" value={active.service} onChange={e=>setActive({...active,service:e.target.value})}>
                {['Website Development','Mobile App','E-Commerce Store','SaaS / Web App','UI/UX Design','SEO & Growth','Free Audit Call','Other'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="ad-fg">
              <label>Status</label>
              <select className="ad-inp" value={active.status} onChange={e=>setActive({...active,status:e.target.value})}>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="ad-fg">
              <label>Message</label>
              <textarea className="ad-inp" value={active.message} onChange={e=>setActive({...active,message:e.target.value})} rows={3} />
            </div>
            <div className="ad-modal-footer">
              <button className="ad-btn-ghost" onClick={close}>Cancel</button>
              <button className="ad-btn-prim" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
