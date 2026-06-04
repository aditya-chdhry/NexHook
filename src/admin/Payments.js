import { useState, useEffect } from 'react';
import { getPayments, savePayment, deletePayment, } from './adminData';
import './AdminLayout.css';

const STATUSES = ['received','pending','failed'];
const METHODS  = ['Bank Transfer','UPI','Card','Cash','Cheque'];
const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [modal, setModal]       = useState(null);
  const [active, setActive]     = useState(null);

  const reload = async () => setPayments(await getPayments());
  useEffect(() => { reload(); }, []);

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.client.toLowerCase().includes(q) || p.invoice.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const received = payments.filter(p=>p.status==='received').reduce((a,p)=>a+Number(p.amount),0);
  const pending  = payments.filter(p=>p.status==='pending').reduce((a,p)=>a+Number(p.amount),0);
  const failed   = payments.filter(p=>p.status==='failed').reduce((a,p)=>a+Number(p.amount),0);

  const blank = { id:'', client:'', invoice:'', amount:'', date:new Date().toISOString().split('T')[0], method:'Bank Transfer', status:'pending' };
  const openAdd  = () => { setActive({...blank}); setModal('add'); };
  const openEdit = p  => { setActive({...p});     setModal('edit'); };
  const close    = () => { setModal(null); setActive(null); };

  const handleSave = async () => {
    const all = getPayments();
    const toSave = { ...active };
    
    toSave.amount = Number(toSave.amount);
    await savePayment(toSave); await reload(); close();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this payment record?')) { await deletePayment(id); await reload(); }
  };

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Payments</h1>
          <p className="ad-page-sub">{fmt(received)} received · {fmt(pending)} pending</p>
        </div>
        <button className="ad-btn-prim" onClick={openAdd}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Record Payment
        </button>
      </div>

      {/* Summary cards */}
      <div className="ad-stats" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:20}}>
        {[
          {label:'Received', val:fmt(received), sub:`${payments.filter(p=>p.status==='received').length} payments`, color:'#4ade80'},
          {label:'Pending',  val:fmt(pending),  sub:`${payments.filter(p=>p.status==='pending').length} payments`,  color:'#fbbf24'},
          {label:'Failed',   val:fmt(failed),   sub:`${payments.filter(p=>p.status==='failed').length} payments`,   color:'#f87171'},
        ].map(c=>(
          <div className="ad-stat" key={c.label} style={{padding:'18px 20px',borderLeft:`3px solid ${c.color}`}}>
            <div className="ad-stat-label">{c.label}</div>
            <div className="ad-stat-val" style={{color:c.color}}>{c.val}</div>
            <div className="ad-stat-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="ad-filters">
        <div className="ad-search-wrap">
          <svg className="ad-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="ad-search" placeholder="Search by client or invoice…" value={search} onChange={e=>setSearch(e.target.value)} />
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
              <tr><th>ID</th><th>Client</th><th>Invoice</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="8">
                  <div className="ad-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    <p>No payment records found</p>
                  </div>
                </td></tr>
              )}
              {filtered.map(p=>(
                <tr key={p.id}>
                  <td style={{fontFamily:'monospace',fontSize:'.78rem',color:'#4ade80',fontWeight:600}}>{p.id}</td>
                  <td style={{fontWeight:600,color:'#f0f4ff'}}>{p.client}</td>
                  <td style={{fontFamily:'monospace',fontSize:'.8rem',color:'#38bdf8'}}>{p.invoice}</td>
                  <td style={{fontWeight:700,color:'#f0f4ff',whiteSpace:'nowrap'}}>{fmt(p.amount)}</td>
                  <td>
                    <span style={{background:'rgba(36,89,231,.1)',color:'#6ea8fe',borderRadius:6,padding:'3px 9px',fontSize:'.76rem',fontWeight:600}}>
                      {p.method}
                    </span>
                  </td>
                  <td style={{color:'#7689ad',whiteSpace:'nowrap',fontSize:'.8rem'}}>{p.date}</td>
                  <td>
                    <select
                      className="ad-filter-select"
                      style={{padding:'4px 10px',fontSize:'.76rem'}}
                      value={p.status}
                      onChange={async e=>{await savePayment({...p,status:e.target.value});await reload();}}
                    >
                      {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:4}}>
                      <button className="ad-btn-icon" onClick={()=>openEdit(p)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="ad-btn-icon ad-btn-del" onClick={()=>handleDelete(p.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
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
      {(modal==='add'||modal==='edit') && active && (
        <div className="ad-overlay" onClick={close}>
          <div className="ad-modal" onClick={e=>e.stopPropagation()}>
            <h3>{modal==='add'?'➕ Record Payment':'✏️ Edit Payment'}</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
              <div className="ad-fg">
                <label>Client Name</label>
                <input className="ad-inp" value={active.client} onChange={e=>setActive({...active,client:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Invoice ID</label>
                <input className="ad-inp" value={active.invoice} placeholder="INV-001" onChange={e=>setActive({...active,invoice:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Amount (₹)</label>
                <input className="ad-inp" type="number" value={active.amount} onChange={e=>setActive({...active,amount:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Date</label>
                <input className="ad-inp" type="date" value={active.date} onChange={e=>setActive({...active,date:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Payment Method</label>
                <select className="ad-inp" value={active.method} onChange={e=>setActive({...active,method:e.target.value})}>
                  {METHODS.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="ad-fg">
                <label>Status</label>
                <select className="ad-inp" value={active.status} onChange={e=>setActive({...active,status:e.target.value})}>
                  {STATUSES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="ad-modal-footer">
              <button className="ad-btn-ghost" onClick={close}>Cancel</button>
              <button className="ad-btn-prim" onClick={handleSave}>Save Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
