import { useState, useEffect } from 'react';
import { getChatbotData, deleteChatbotConversation, updateChatbotStatus } from './adminData';
import './AdminLayout.css';

export default function ChatbotData() {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [whatsappFilter, setWhatsAppFilter] = useState('all');
  const [activeChat, setActiveChat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const reload = async () => {
    const data = await getChatbotData();
    setConversations(data);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDelete = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this chatbot conversation?')) {
      await deleteChatbotConversation(sessionId);
      await reload();
      if (activeChat && activeChat.sessionId === sessionId) {
        setModalOpen(false);
        setActiveChat(null);
      }
    }
  };

  const handleStatusChange = async (sessionId, status) => {
    await updateChatbotStatus(sessionId, status);
    await reload();
    if (activeChat && activeChat.sessionId === sessionId) {
      setActiveChat(prev => ({ ...prev, status }));
    }
  };

  const openView = (chat) => {
    setActiveChat(chat);
    setModalOpen(true);
  };

  const close = () => {
    setModalOpen(false);
    setActiveChat(null);
  };

  const filteredConversations = conversations.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || 
      c.sessionId.toLowerCase().includes(q) || 
      (c.lastUserMessage && c.lastUserMessage.toLowerCase().includes(q)) ||
      (c.lastAgentMessage && c.lastAgentMessage.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'all' || c.status === statusFilter;

    let matchWhatsApp = true;
    if (whatsappFilter === 'clicked') {
      matchWhatsApp = c.whatsappClicked === true;
    } else if (whatsappFilter === 'not_clicked') {
      matchWhatsApp = c.whatsappClicked === false;
    }

    return matchSearch && matchStatus && matchWhatsApp;
  });

  const totalChats = conversations.length;
  const whatsappClicks = conversations.filter(c => c.whatsappClicked).length;
  const activeCount = conversations.filter(c => c.status === 'active').length;
  const clickRate = totalChats > 0 ? ((whatsappClicks / totalChats) * 100).toFixed(0) : 0;

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Chatbot Data</h1>
          <p className="ad-page-sub">Monitor and analyze live customer chatbot sessions.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="ad-stats">
        <div className="ad-stat">
          <div className="ad-stat-icon">💬</div>
          <div className="ad-stat-label">Total Conversations</div>
          <div className="ad-stat-val">{totalChats}</div>
          <div className="ad-stat-sub">{activeCount} active sessions</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-icon">🟢</div>
          <div className="ad-stat-label">WhatsApp Clickthroughs</div>
          <div className="ad-stat-val">{whatsappClicks}</div>
          <div className="ad-stat-sub">{clickRate}% click-through rate</div>
        </div>
        <div className="ad-stat">
          <div className="ad-stat-icon">⚡</div>
          <div className="ad-stat-label">Handoff Efficiency</div>
          <div className="ad-stat-val">{conversations.filter(c => c.status === 'converted').length}</div>
          <div className="ad-stat-sub">Sessions marked converted</div>
        </div>
      </div>

      {/* Filters */}
      <div className="ad-filters" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div className="ad-search-wrap" style={{ flex: '1 1 300px' }}>
          <svg className="ad-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="ad-search" placeholder="Search by Session ID or chat content..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="ad-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="converted">Converted</option>
        </select>
        <select className="ad-filter-select" value={whatsappFilter} onChange={e => setWhatsAppFilter(e.target.value)}>
          <option value="all">All WhatsApp Activity</option>
          <option value="clicked">WhatsApp Clicked</option>
          <option value="not_clicked">WhatsApp Not Clicked</option>
        </select>
      </div>

      {/* Table */}
      <div className="ad-card">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Last Message Log</th>
                <th>Messages</th>
                <th>WA Clicked</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversations.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="ad-empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <p>No conversations found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredConversations.map(c => (
                  <tr key={c.sessionId}>
                    <td style={{ fontFamily: 'monospace', fontSize: '.78rem', color: '#8fa0c4' }}>
                      {c.sessionId.substring(0, 16)}...
                    </td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600, color: '#f0f4ff' }}>
                        {c.lastUserMessage ? `User: ${c.lastUserMessage}` : 'No messages'}
                      </div>
                      <div style={{ fontSize: '.75rem', color: '#7689ad', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {c.lastAgentMessage ? `AI: ${c.lastAgentMessage}` : ''}
                      </div>
                    </td>
                    <td style={{ color: '#7689ad', textAlign: 'center' }}>{c.messageCount || c.messages?.length || 0}</td>
                    <td>
                      <span className={`badge ${c.whatsappClicked ? 'badge-closed' : 'badge-new'}`} style={{
                        background: c.whatsappClicked ? 'rgba(37, 211, 102, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                        color: c.whatsappClicked ? '#25d366' : '#94a3b8'
                      }}>
                        {c.whatsappClicked ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <select
                        className="ad-filter-select"
                        style={{ padding: '4px 10px', fontSize: '.76rem' }}
                        value={c.status}
                        onChange={e => handleStatusChange(c.sessionId, e.target.value)}
                      >
                        <option value="active">active</option>
                        <option value="closed">closed</option>
                        <option value="converted">converted</option>
                      </select>
                    </td>
                    <td style={{ color: '#7689ad', fontSize: '.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(c.updatedAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="ad-btn-icon" title="View Chat History" onClick={() => openView(c)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="ad-btn-icon ad-btn-del" title="Delete Chat" onClick={() => handleDelete(c.sessionId)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chat History View Modal */}
      {modalOpen && activeChat && (
        <div className="ad-overlay" onClick={close}>
          <div className="ad-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#f0f4ff' }}>💬 Chat History Log</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>Session: {activeChat.sessionId}</span>
              </div>
              <button onClick={close} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
            </div>
            
            <div className="chat-history-log" style={{ maxHeight: '400px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#080a16', borderRadius: '8px', border: '1px solid #1e293b' }}>
              {activeChat.messages && activeChat.messages.length > 0 ? (
                activeChat.messages.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{
                      background: m.sender === 'user' ? '#2459e7' : 'rgba(255, 255, 255, 0.05)',
                      color: m.sender === 'user' ? '#ffffff' : '#cbd5e1',
                      padding: '10px 14px',
                      borderRadius: m.sender === 'user' ? '14px 14px 0 14px' : '14px 14px 14px 0',
                      fontSize: '0.82rem',
                      lineHeight: '1.4',
                      whiteSpace: 'pre-line',
                      border: m.sender === 'user' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {m.text}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#475569', marginTop: '4px', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                      {new Date(m.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#475569' }}>No messages recorded.</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Status:</span>
                <select
                  className="ad-filter-select"
                  style={{ padding: '4px 10px', fontSize: '.76rem' }}
                  value={activeChat.status}
                  onChange={e => handleStatusChange(activeChat.sessionId, e.target.value)}
                >
                  <option value="active">active</option>
                  <option value="closed">closed</option>
                  <option value="converted">converted</option>
                </select>
              </div>
              <div>
                <button className="ad-btn-ghost" onClick={close} style={{ marginRight: '8px' }}>Close</button>
                <button className="ad-btn-prim" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(activeChat.sessionId)}>Delete Log</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
