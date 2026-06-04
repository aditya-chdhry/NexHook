import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInvoices, saveInvoice, deleteInvoice, } from './adminData';
import './AdminLayout.css';

const STATUSES = ['draft','sent','paid','overdue'];
const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [modal, setModal]       = useState(null);
  const [active, setActive]     = useState(null);

  const reload = async () => {
    const data = await getInvoices();
    setInvoices(Array.isArray(data) ? data : []);
  };
  useEffect(() => { reload(); }, []);

  const filtered = invoices.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = !q || i.client.toLowerCase().includes(q) || i.id.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || i.status === filter;
    return matchSearch && matchFilter;
  });

  const totalAmt   = filtered.reduce((a,i) => a + Number(i.amount), 0);
  const paidAmt    = filtered.filter(i=>i.status==='paid').reduce((a,i) => a + Number(i.amount), 0);
  const pendingAmt = filtered.filter(i=>i.status!=='paid').reduce((a,i) => a + Number(i.amount), 0);

  const blank = { id:'', client:'', email:'', amount:'', date:new Date().toISOString().split('T')[0], dueDate:'', status:'draft', items:'' };
  const openAdd  = () => { setActive({...blank}); setModal('add'); };
  const openEdit = i  => { setActive({...i});     setModal('edit'); };
  const close    = () => { setModal(null); setActive(null); };

  const handleSave = async () => {
    const toSave = { ...active };
    
    toSave.amount = Number(toSave.amount);
    await saveInvoice(toSave); await reload(); close();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this invoice?')) { await deleteInvoice(id); await reload(); }
  };

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Invoices</h1>
          <p className="ad-page-sub">Total {fmt(totalAmt)} · Paid {fmt(paidAmt)} · Pending {fmt(pendingAmt)}</p>
        </div>
        <button className="ad-btn-prim" onClick={openAdd}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="ad-stats" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:20}}>
        {[
          {label:'Total',     val:fmt(totalAmt),   color:'#6ea8fe'},
          {label:'Paid',      val:fmt(paidAmt),    color:'#4ade80'},
          {label:'Pending',   val:fmt(pendingAmt), color:'#fbbf24'},
          {label:'Overdue',   val:invoices.filter(i=>i.status==='overdue').length+' inv', color:'#f87171'},
        ].map(c=>(
          <div className="ad-stat" key={c.label} style={{padding:'16px 20px'}}>
            <div className="ad-stat-label">{c.label}</div>
            <div className="ad-stat-val" style={{fontSize:'1.4rem',color:c.color}}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="ad-filters">
        <div className="ad-search-wrap">
          <svg className="ad-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="ad-search" placeholder="Search by client or invoice ID…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="ad-filter-select" value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">All Status</option>
          {STATUSES.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>

      <div className="ad-card">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr><th>Invoice</th><th>Client</th><th>Items</th><th>Amount</th><th>Date</th><th>Due</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="8">
                  <div className="ad-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p>No invoices found</p>
                  </div>
                </td></tr>
              )}
              {filtered.map(i => (
                <tr key={i.id}>
                  <td style={{fontFamily:'monospace',fontSize:'.82rem',color:'#38bdf8',fontWeight:600}}>{i.id}</td>
                  <td>
                    <div style={{fontWeight:600,color:'#f0f4ff'}}>{i.client}</div>
                    <div style={{fontSize:'.75rem',color:'#7689ad'}}>{i.email}</div>
                  </td>
                  <td style={{color:'#7689ad',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{i.items}</td>
                  <td style={{fontWeight:700,color:'#f0f4ff',whiteSpace:'nowrap'}}>{fmt(i.amount)}</td>
                  <td style={{color:'#7689ad',whiteSpace:'nowrap',fontSize:'.8rem'}}>{i.date}</td>
                  <td style={{color: i.status==='overdue'?'#f87171':'#7689ad',whiteSpace:'nowrap',fontSize:'.8rem'}}>{i.dueDate}</td>
                  <td>
                    <select
                      className="ad-filter-select"
                      style={{padding:'4px 10px',fontSize:'.76rem'}}
                      value={i.status}
                      onChange={async e=>{await saveInvoice({...i,status:e.target.value});await reload();}}
                    >
                      {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'4px'}}>
                      <button className="ad-btn-icon" title="Print / Download PDF" onClick={()=>navigate(`/admin/invoices/${i.id}/print`)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                      </button>
                      <button className="ad-btn-icon" title="Edit" onClick={()=>openEdit(i)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="ad-btn-icon ad-btn-del" title="Delete" onClick={()=>handleDelete(i.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modal === 'edit' || modal === 'add') && active && (
        <div className="ad-overlay" onClick={close}>
          <div className="ad-modal" onClick={e=>e.stopPropagation()}>
            <h3>{modal==='add' ? '➕ New Invoice' : '✏️ Edit Invoice'}</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
              {[['client','Client Name','text'],['email','Email','email']].map(([k,lbl,t])=>(
                <div className="ad-fg" key={k}>
                  <label>{lbl}</label>
                  <input className="ad-inp" type={t} value={active[k]} onChange={e=>setActive({...active,[k]:e.target.value})} />
                </div>
              ))}
            </div>
            <div className="ad-fg">
              <label>Items / Description</label>
              <input className="ad-inp" type="text" value={active.items} onChange={e=>setActive({...active,items:e.target.value})} />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0 16px'}}>
              <div className="ad-fg">
                <label>Amount (₹)</label>
                <input className="ad-inp" type="number" value={active.amount} onChange={e=>setActive({...active,amount:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Invoice Date</label>
                <input className="ad-inp" type="date" value={active.date} onChange={e=>setActive({...active,date:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Due Date</label>
                <input className="ad-inp" type="date" value={active.dueDate} onChange={e=>setActive({...active,dueDate:e.target.value})} />
              </div>
            </div>
            <div className="ad-fg">
              <label>Status</label>
              <select className="ad-inp" value={active.status} onChange={e=>setActive({...active,status:e.target.value})}>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="ad-modal-footer">
              <button className="ad-btn-ghost" onClick={close}>Cancel</button>
              <button className="ad-btn-prim" onClick={handleSave}>Save Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
