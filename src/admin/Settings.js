import { useState } from 'react';
import { changePassword } from './adminData';
import './AdminLayout.css';

export default function Settings() {
  const [creds, setCreds] = useState({ oldPassword: '', newUsername: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text:'', type:'' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg({text:'', type:''});
    try {
      await changePassword(creds.oldPassword, creds.newPassword, creds.newUsername);
      setMsg({ text: 'Credentials updated successfully!', type: 'success' });
      setCreds({ oldPassword: '', newUsername: '', newPassword: '' });
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Settings</h1>
          <p className="ad-page-sub">Manage your admin panel credentials.</p>
        </div>
      </div>

      <div className="ad-card" style={{ maxWidth: 500 }}>
        <div className="ad-card-head">
          <span className="ad-card-title">Update Security Credentials</span>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {msg.text && (
            <div style={{ padding: 12, marginBottom: 16, borderRadius: 8, fontSize: '.85rem', background: msg.type === 'error' ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)', color: msg.type === 'error' ? '#f87171' : '#4ade80' }}>
              {msg.text}
            </div>
          )}
          <div className="ad-fg">
            <label>Current Password (Required)</label>
            <input required className="ad-inp" type="password" value={creds.oldPassword} onChange={e => setCreds({...creds, oldPassword: e.target.value})} />
          </div>
          <div className="ad-fg">
            <label>New Username (Optional)</label>
            <input className="ad-inp" type="text" placeholder="Leave blank to keep same" value={creds.newUsername} onChange={e => setCreds({...creds, newUsername: e.target.value})} />
          </div>
          <div className="ad-fg">
            <label>New Password (Optional)</label>
            <input className="ad-inp" type="password" placeholder="Leave blank to keep same" value={creds.newPassword} onChange={e => setCreds({...creds, newPassword: e.target.value})} />
          </div>
          <button type="submit" className="ad-btn-prim" style={{ marginTop: 10 }} disabled={loading}>
            {loading ? 'Saving...' : 'Update Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
}
