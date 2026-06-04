import { useState, useEffect } from 'react';
import { getClients, saveClient, deleteClient, } from './adminData';
import './AdminLayout.css';
import './Clients.css';

const STAGES = ['prospect','proposal','negotiation','won','lost'];
const STAGE_COLORS = { prospect:'#38bdf8', proposal:'#c084fc', negotiation:'#fbbf24', won:'#4ade80', lost:'#f87171' };
const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch]   = useState('');
  const [view, setView]       = useState('pipeline'); // pipeline | table
  const [modal, setModal]     = useState(null);
  const [active, setActive]   = useState(null);

  const reload = async () => setClients(await getClients());
  useEffect(() => { reload(); }, []);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const blank = { id:'', name:'', company:'', email:'', phone:'', stage:'prospect', value:'', date:new Date().toISOString().split('T')[0] };
  const openAdd  = () => { setActive({...blank}); setModal('add'); };
  const openEdit = c  => { setActive({...c});     setModal('edit'); };
  const close    = () => { setModal(null); setActive(null); };

  const handleSave = async () => {
    const all = getClients();
    const toSave = { ...active };
    
    toSave.value = Number(toSave.value);
    await saveClient(toSave); await reload(); close();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this client?')) { await deleteClient(id); await reload(); }
  };

  const pipelineVal = stage => filtered.filter(c=>c.stage===stage).reduce((a,c)=>a+Number(c.value),0);

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Client Pipeline</h1>
          <p className="ad-page-sub">{clients.filter(c=>c.stage==='won').length} won · {fmt(pipelineVal('won'))} closed revenue</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className={`ad-btn-ghost ${view==='pipeline'?'active':''}`} onClick={()=>setView('pipeline')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="3" width="4" height="18" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="17" y="5" width="4" height="16" rx="1"/></svg>
            Pipeline
          </button>
          <button className={`ad-btn-ghost ${view==='table'?'active':''}`} onClick={()=>setView('table')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Table
          </button>
          <button className="ad-btn-prim" onClick={openAdd}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Client
          </button>
        </div>
      </div>

      {/* Pipeline stage summary */}
      <div className="ad-stats" style={{gridTemplateColumns:'repeat(5,1fr)',marginBottom:20}}>
        {STAGES.map(s=>(
          <div className="ad-stat" key={s} style={{padding:'14px 16px',borderColor:`${STAGE_COLORS[s]}22`}}>
            <div className="ad-stat-label" style={{color:STAGE_COLORS[s]}}>{s.charAt(0).toUpperCase()+s.slice(1)}</div>
            <div className="ad-stat-val" style={{fontSize:'1.5rem'}}>{filtered.filter(c=>c.stage===s).length}</div>
            <div className="ad-stat-sub">{fmt(pipelineVal(s))}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="ad-filters">
        <div className="ad-search-wrap">
          <svg className="ad-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="ad-search" placeholder="Search clients…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      {/* Pipeline View (Kanban) */}
      {view === 'pipeline' && (
        <div className="cp-kanban">
          {STAGES.map(stage => (
            <div key={stage} className="cp-col">
              <div className="cp-col-head" style={{borderColor:STAGE_COLORS[stage]}}>
                <span className="cp-col-title" style={{color:STAGE_COLORS[stage]}}>
                  {stage.charAt(0).toUpperCase()+stage.slice(1)}
                </span>
                <span className="cp-col-count">{filtered.filter(c=>c.stage===stage).length}</span>
              </div>
              <div className="cp-col-body">
                {filtered.filter(c=>c.stage===stage).map(c=>(
                  <div key={c.id} className="cp-card" onClick={()=>openEdit(c)}>
                    <div className="cp-card-avatar" style={{background:`${STAGE_COLORS[stage]}22`,color:STAGE_COLORS[stage]}}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="cp-card-body">
                      <div className="cp-card-name">{c.name}</div>
                      <div className="cp-card-company">{c.company}</div>
                      <div className="cp-card-val">{fmt(c.value)}</div>
                    </div>
                    <button className="ad-btn-icon ad-btn-del" style={{alignSelf:'flex-start'}} onClick={e=>{e.stopPropagation();handleDelete(c.id);}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                ))}
                {filtered.filter(c=>c.stage===stage).length===0 && (
                  <div className="cp-empty">No clients here</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="ad-card">
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr><th>Client</th><th>Company</th><th>Email</th><th>Value</th><th>Stage</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(c=>(
                  <tr key={c.id}>
                    <td style={{fontWeight:600,color:'#f0f4ff'}}>{c.name}</td>
                    <td style={{color:'#7689ad'}}>{c.company}</td>
                    <td style={{color:'#7689ad',fontSize:'.8rem'}}>{c.email}</td>
                    <td style={{fontWeight:700,color:'#f0f4ff'}}>{fmt(c.value)}</td>
                    <td>
                      <select className="ad-filter-select" style={{padding:'4px 10px',fontSize:'.76rem'}} value={c.stage} onChange={async e=>{await saveClient({...c,stage:e.target.value});await reload();}}>
                        {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{color:'#3b4d6a',fontSize:'.8rem'}}>{c.date}</td>
                    <td>
                      <div style={{display:'flex',gap:4}}>
                        <button className="ad-btn-icon" onClick={()=>openEdit(c)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="ad-btn-icon ad-btn-del" onClick={()=>handleDelete(c.id)}>
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
      )}

      {/* Add / Edit Modal */}
      {(modal==='add'||modal==='edit') && active && (
        <div className="ad-overlay" onClick={close}>
          <div className="ad-modal" onClick={e=>e.stopPropagation()}>
            <h3>{modal==='add'?'➕ Add Client':'✏️ Edit Client'}</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
              {[['name','Full Name','text'],['company','Company','text'],['email','Email','email'],['phone','Phone','tel']].map(([k,lbl,t])=>(
                <div className="ad-fg" key={k}>
                  <label>{lbl}</label>
                  <input className="ad-inp" type={t} value={active[k]} onChange={e=>setActive({...active,[k]:e.target.value})} />
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
              <div className="ad-fg">
                <label>Deal Value (₹)</label>
                <input className="ad-inp" type="number" value={active.value} onChange={e=>setActive({...active,value:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Pipeline Stage</label>
                <select className="ad-inp" value={active.stage} onChange={e=>setActive({...active,stage:e.target.value})}>
                  {STAGES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
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
