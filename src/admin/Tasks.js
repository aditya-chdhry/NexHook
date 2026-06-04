import { useState, useEffect } from 'react';
import { getTasks, saveTask, deleteTask } from './adminData';
import './AdminLayout.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const reload = async () => {
    const data = await getTasks();
    setTasks(Array.isArray(data) ? data : []);
  };
  useEffect(() => { reload(); }, []);

  const openNew = () => {
    setActiveTask({ title:'', description:'', assigneeName:'', assigneeEmail:'', role:'', status:'todo', dueDate:'' });
    setModalOpen(true);
  };

  const close = () => { setActiveTask(null); setModalOpen(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toSave = { ...activeTask };
    await saveTask(toSave);
    await reload();
    close();
  };

  const filtered = tasks.filter(t => 
    t.title?.toLowerCase().includes(search.toLowerCase()) || 
    t.assigneeName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Task Management</h1>
          <p className="ad-page-sub">Assign tasks to team members and track progress.</p>
        </div>
        <button className="ad-btn-prim" onClick={openNew}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Assign Task
        </button>
      </div>

      <div className="ad-filters">
        <div className="ad-search-wrap">
          <svg className="ad-search-icon" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" className="ad-search" placeholder="Search tasks or assignees..." 
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="ad-card ad-table-wrap">
        {filtered.length === 0 ? (
          <div className="ad-empty">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <p>No tasks found.</p>
          </div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assignee</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{fontWeight:600, color:'#f0f4ff'}}>{t.title}</div>
                    <div style={{fontSize:'.75rem', color:'#7689ad', maxWidth:'300px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{t.description}</div>
                  </td>
                  <td>
                    <div style={{fontWeight:500}}>{t.assigneeName}</div>
                    <div style={{fontSize:'.75rem', color:'#7689ad'}}>{t.role}</div>
                  </td>
                  <td style={{color:'#7689ad'}}>{t.dueDate || 'No date'}</td>
                  <td>
                    <select
                      className="ad-filter-select"
                      style={{padding:'4px 10px',fontSize:'.76rem'}}
                      value={t.status}
                      onChange={async e => { await saveTask({...t, status:e.target.value}); await reload(); }}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td>
                    <button className="ad-btn-icon ad-btn-del" onClick={async () => { if(window.confirm('Delete this task?')) { await deleteTask(t.id); await reload(); } }}>
                      <svg viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && activeTask && (
        <div className="ad-overlay">
          <div className="ad-modal">
            <h3>Assign New Task</h3>
            <form onSubmit={handleSubmit}>
              <div className="ad-fg">
                <label>Task Title</label>
                <input required className="ad-inp" type="text" value={activeTask.title} onChange={e => setActiveTask({...activeTask, title:e.target.value})} />
              </div>
              <div className="ad-fg">
                <label>Description</label>
                <textarea required className="ad-inp" value={activeTask.description} onChange={e => setActiveTask({...activeTask, description:e.target.value})} />
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15}}>
                <div className="ad-fg">
                  <label>Assignee Name</label>
                  <input required className="ad-inp" type="text" value={activeTask.assigneeName} onChange={e => setActiveTask({...activeTask, assigneeName:e.target.value})} />
                </div>
                <div className="ad-fg">
                  <label>Assignee Role</label>
                  <input required className="ad-inp" type="text" placeholder="e.g. Developer, Designer" value={activeTask.role} onChange={e => setActiveTask({...activeTask, role:e.target.value})} />
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15}}>
                <div className="ad-fg">
                  <label>Assignee Email (For Reminder)</label>
                  <input required className="ad-inp" type="email" value={activeTask.assigneeEmail} onChange={e => setActiveTask({...activeTask, assigneeEmail:e.target.value})} />
                </div>
                <div className="ad-fg">
                  <label>Due Date</label>
                  <input type="date" className="ad-inp" value={activeTask.dueDate} onChange={e => setActiveTask({...activeTask, dueDate:e.target.value})} />
                </div>
              </div>
              <div className="ad-modal-footer">
                <button type="button" className="ad-btn-ghost" onClick={close}>Cancel</button>
                <button type="submit" className="ad-btn-prim">Assign Task & Email</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
