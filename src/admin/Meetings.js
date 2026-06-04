import { useState, useEffect } from 'react';
import { getMeetings, saveMeeting, deleteMeeting } from './adminData';
import './AdminLayout.css';

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMtg, setActiveMtg] = useState(null);

  const reload = async () => {
    const data = await getMeetings();
    setMeetings(Array.isArray(data) ? data : []);
  };
  useEffect(() => { reload(); }, []);

  const openNew = () => {
    setActiveMtg({
      clientName: '',
      clientEmail: '',
      teamEmail: '',
      meetingType: 'client',
      date: '',
      time: '',
      meetingLink: '',
      status: 'scheduled',
      notes: ''
    });
    setModalOpen(true);
  };

  const openEdit = (mtg) => {
    setActiveMtg({ ...mtg });
    setModalOpen(true);
  };

  const close = () => { setActiveMtg(null); setModalOpen(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveMeeting(activeMtg);
    await reload();
    close();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      await deleteMeeting(id);
      await reload();
    }
  };

  // Metrics calculations
  const scheduledCount = meetings.filter(m => m.status === 'scheduled').length;
  const ongoingCount   = meetings.filter(m => m.status === 'ongoing').length;
  const completedCount = meetings.filter(m => m.status === 'completed').length;
  const cancelledCount = meetings.filter(m => m.status === 'cancelled').length;

  const filtered = meetings.filter(m => {
    const matchesSearch = 
      m.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      m.clientEmail?.toLowerCase().includes(search.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && m.status === filterStatus;
  });

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Meetings & Calls Scheduler</h1>
          <p className="ad-page-sub">Schedule video calls, automate email/link notifications, and track call pipelines.</p>
        </div>
        <button className="ad-btn-prim" onClick={openNew}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{marginRight:8}}><path d="M15.6 11.6L22 7v10l-6.4-4.6z"/><rect x="2" y="5" width="12" height="14" rx="2"/></svg>
          Schedule Call
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="ad-stats">
        <div className="ad-stat">
          <div className="ad-stat-icon">📅</div>
          <div className="ad-stat-label">Scheduled Calls</div>
          <div className="ad-stat-val" style={{color:'#38bdf8'}}>{scheduledCount}</div>
          <div className="ad-stat-sub">Reminders Active</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-icon">🎙️</div>
          <div className="ad-stat-label">Ongoing Calls</div>
          <div className="ad-stat-val" style={{color:'#a78bfa'}}>{ongoingCount}</div>
          <div className="ad-stat-sub">Live right now</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-icon">✅</div>
          <div className="ad-stat-label">Active / Completed</div>
          <div className="ad-stat-val" style={{color:'#34d399'}}>{completedCount}</div>
          <div className="ad-stat-sub">Calls done</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-icon">❌</div>
          <div className="ad-stat-label">Cancelled Calls</div>
          <div className="ad-stat-val" style={{color:'#f87171'}}>{cancelledCount}</div>
          <div className="ad-stat-sub">Rescheduled/No-show</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="ad-filters">
        <div className="ad-search-wrap">
          <svg className="ad-search-icon" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" className="ad-search" placeholder="Search by client name or email..." 
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="ad-filter-select" 
          value={filterStatus} 
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Meetings Table */}
      <div className="ad-card ad-table-wrap">
        {filtered.length === 0 ? (
          <div className="ad-empty">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" width="48" height="48"><path d="M15.6 11.6L22 7v10l-6.4-4.6z"/><rect x="2" y="5" width="12" height="14" rx="2"/></svg>
            <p style={{marginTop:12}}>No calls scheduled yet.</p>
          </div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Scheduled Date & Time</th>
                <th>Status</th>
                <th>Meeting Link</th>
                <th>Auto-Reminder</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td>
                    <div style={{fontWeight:600, color:'#f0f4ff'}}>{m.clientName}</div>
                    <div style={{fontSize:'.75rem', color:'#7689ad'}}>{m.clientEmail}</div>
                  </td>
                  <td>
                    <div style={{fontWeight:500, color:'#f0f4ff'}}>{m.date}</div>
                    <div style={{fontSize:'.75rem', color:'#7689ad'}}>{m.time}</div>
                  </td>
                  <td>
                    <select
                      className="ad-filter-select"
                      style={{
                        padding:'4px 10px',
                        fontSize:'.76rem',
                        background: m.status === 'scheduled' ? 'rgba(56,189,248,0.1)' : 
                                    m.status === 'ongoing' ? 'rgba(167,139,250,0.1)' : 
                                    m.status === 'completed' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                        borderColor: m.status === 'scheduled' ? '#38bdf8' : 
                                     m.status === 'ongoing' ? '#a78bfa' : 
                                     m.status === 'completed' ? '#34d399' : '#f87171',
                        color: m.status === 'scheduled' ? '#38bdf8' : 
                               m.status === 'ongoing' ? '#a78bfa' : 
                               m.status === 'completed' ? '#34d399' : '#f87171',
                      }}
                      value={m.status}
                      onChange={async e => { await saveMeeting({...m, status:e.target.value}); await reload(); }}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <a 
                      href={m.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{
                        color:'#38bdf8', 
                        textDecoration:'none', 
                        fontSize:'.85rem', 
                        fontWeight:500, 
                        display:'flex', 
                        alignItems:'center', 
                        gap:6
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      Join Link
                    </a>
                  </td>
                  <td>
                    <span style={{
                      fontSize:'.75rem',
                      padding:'3px 8px',
                      borderRadius:12,
                      background: m.reminded ? 'rgba(52,211,153,0.12)' : 'rgba(56,189,248,0.12)',
                      color: m.reminded ? '#34d399' : '#38bdf8',
                      border: `1px solid ${m.reminded ? '#34d399' : '#38bdf8'}`
                    }}>
                      {m.reminded ? 'Sent ✅' : 'Active ⏰'}
                    </span>
                  </td>
                  <td>
                    <div style={{display:'flex', gap:'8px'}}>
                      <button className="ad-btn-icon" title="Edit" onClick={() => openEdit(m)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="ad-btn-icon ad-btn-del" title="Delete" onClick={() => handleDelete(m.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Schedule Call Modal */}
      {modalOpen && activeMtg && (
        <div className="ad-overlay">
          <div className="ad-modal">
            <h3>{activeMtg._id ? 'Edit Scheduled Call' : 'Schedule New Call'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="ad-fg">
                <label>Client Name</label>
                <input required className="ad-inp" type="text" value={activeMtg.clientName} onChange={e => setActiveMtg({...activeMtg, clientName:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Client Email</label>
                <input required className="ad-inp" type="email" value={activeMtg.clientEmail} onChange={e => setActiveMtg({...activeMtg, clientEmail:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Team Email (internal notification)</label>
                <input className="ad-inp" type="email" placeholder="team@nexhook.com" value={activeMtg.teamEmail || ''} onChange={e => setActiveMtg({...activeMtg, teamEmail:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Meeting Type</label>
                <select className="ad-inp" value={activeMtg.meetingType || 'client'} onChange={e => setActiveMtg({...activeMtg, meetingType:e.target.value})}>
                  <option value="client">Client Call</option>
                  <option value="discovery">Discovery Call</option>
                  <option value="internal">Internal Meeting</option>
                </select>
              </div>
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15}}>
                <div className="ad-fg">
                  <label>Date</label>
                  <input required className="ad-inp" type="date" value={activeMtg.date} onChange={e => setActiveMtg({...activeMtg, date:e.target.value})} />
                </div>
                <div className="ad-fg">
                  <label>Time (IST)</label>
                  <input required className="ad-inp" type="time" value={activeMtg.time} onChange={e => setActiveMtg({...activeMtg, time:e.target.value})} />
                </div>
              </div>

              <div className="ad-fg">
                <label>Meeting / Video Call Link (Zoom, Meet, etc.)</label>
                <input required className="ad-inp" type="url" placeholder="https://meet.google.com/abc-defg-hij" value={activeMtg.meetingLink} onChange={e => setActiveMtg({...activeMtg, meetingLink:e.target.value})} />
              </div>

              <div className="ad-fg">
                <label>Host Notes / Description</label>
                <textarea className="ad-inp" placeholder="Details about this scheduled call..." value={activeMtg.notes} onChange={e => setActiveMtg({...activeMtg, notes:e.target.value})} />
              </div>

              <div className="ad-modal-footer">
                <button type="button" className="ad-btn-ghost" onClick={close}>Cancel</button>
                <button type="submit" className="ad-btn-prim">
                  {activeMtg._id ? 'Save Meeting' : 'Schedule & Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
