import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from './adminData';
import './AdminLogin.css';

export default function AdminLogin() {
  const [creds, setCreds]   = useState({ username:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 700));
    const success = await adminLogin(creds.username, creds.password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password.');
      setLoading(false);
    }
  };

  return (
    <div className="al-wrap">
      <div className="al-orb al-orb1" />
      <div className="al-orb al-orb2" />
      <div className="al-grid" />

      <div className="al-card">
        <div className="al-logo">
          <div className="al-logo-icon">N</div>
          <span className="al-logo-text">NexHook</span>
        </div>

        <span className="al-badge">Admin Portal</span>
        <h1 className="al-title">Welcome back 👋</h1>
        <p className="al-sub">Sign in to manage your agency dashboard</p>

        <form onSubmit={handleSubmit} className="al-form">
          <div className="al-fg">
            <label>Username</label>
            <div className="al-inp-wrap">
              <svg className="al-inp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <input
                type="text" placeholder="admin" autoComplete="username"
                value={creds.username}
                onChange={e => setCreds({...creds, username: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="al-fg">
            <label>Password</label>
            <div className="al-inp-wrap">
              <svg className="al-inp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input
                type={showPw ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password"
                value={creds.password}
                onChange={e => setCreds({...creds, password: e.target.value})}
                required
              />
              <button type="button" className="al-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {error && <div className="al-error">{error}</div>}

          <button type="submit" className="al-btn" disabled={loading}>
            {loading ? <span className="al-spinner" /> : 'Sign In →'}
          </button>
        </form>

        <p className="al-hint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Secured access · Unauthorised entry is prohibited
        </p>
      </div>
    </div>
  );
}
