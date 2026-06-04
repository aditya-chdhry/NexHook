import { useEffect, useState } from 'react';
import { getLeads, getInvoices, getClients, getPayments } from './adminData';
import './AdminLayout.css';
import './Dashboard.css';

/* ─── Tiny SVG Bar Chart ──────────────────────────────────────── */
function BarChart({ data, color = '#2459e7' }) {
  const max = Math.max(...data.map(d => d.val), 1);
  return (
    <div className="db-chart-wrap">
      {data.map((d, i) => (
        <div key={i} className="db-bar-col">
          <div className="db-bar-track">
            <div
              className="db-bar-fill"
              style={{ height: `${(d.val / max) * 100}%`, background: color }}
            />
          </div>
          <span className="db-bar-label">{d.label}</span>
          <span className="db-bar-val">{d.val}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Donut Chart ─────────────────────────────────────────────── */
function DonutChart({ segments }) {
  const total = segments.reduce((a, s) => a + s.val, 0) || 1;
  let offset = 0;
  const R = 40, C = 2 * Math.PI * R;
  return (
    <div className="db-donut-wrap">
      <svg viewBox="0 0 100 100" className="db-donut-svg">
        {segments.map((s, i) => {
          const pct   = s.val / total;
          const dash  = pct * C;
          const gap   = C - dash;
          const rot   = offset * 360;
          offset += pct;
          return (
            <circle
              key={i} cx="50" cy="50" r={R}
              fill="none" stroke={s.color} strokeWidth="14"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={C / 4}
              transform={`rotate(${rot} 50 50)`}
            />
          );
        })}
        <circle cx="50" cy="50" r="26" fill="#0c0e1a" />
        <text x="50" y="54" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f0f4ff">{total}</text>
      </svg>
      <div className="db-donut-legend">
        {segments.map((s, i) => (
          <div key={i} className="db-legend-row">
            <span className="db-legend-dot" style={{ background: s.color }} />
            <span>{s.label}</span>
            <span className="db-legend-val">{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Dashboard ───────────────────────────────────────────────── */
export default function Dashboard() {
  const [leads,    setLeads]    = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [clients,  setClients]  = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    async function load() {
      const [l, i, c, p] = await Promise.all([
        getLeads(), getInvoices(), getClients(), getPayments()
      ]);
      setLeads(Array.isArray(l) ? l : []);
      setInvoices(Array.isArray(i) ? i : []);
      setClients(Array.isArray(c) ? c : []);
      setPayments(Array.isArray(p) ? p : []);
    }
    load();
  }, []);

  const totalRev     = payments.filter(p => p.status === 'received').reduce((a, p) => a + p.amount, 0);
  const pendingRev   = invoices.filter(i => i.status !== 'paid').reduce((a, i) => a + i.amount, 0);
  const paidInv      = invoices.filter(i => i.status === 'paid').length;
  const overdueInv   = invoices.filter(i => i.status === 'overdue').length;

  const STATS = [
    { icon:'📥', label:'Total Leads',       val: leads.length,    sub: `${leads.filter(l=>l.status==='new').length} new` },
    { icon:'👥', label:'Active Clients',    val: clients.filter(c=>!['lost'].includes(c.stage)).length, sub: `${clients.filter(c=>c.stage==='won').length} won` },
    { icon:'🧾', label:'Total Invoices',    val: invoices.length, sub: `${paidInv} paid · ${overdueInv} overdue` },
    { icon:'💰', label:'Revenue Received',  val: `₹${(totalRev/1000).toFixed(0)}K`, sub: `₹${(pendingRev/1000).toFixed(0)}K pending` },
  ];

  /* Bar chart — leads per month from date */
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyCounts = months.map((m, idx) => ({
    label: m.slice(0,3),
    val: leads.filter(l => new Date(l.date).getMonth() === idx).length,
  })).filter((_, i) => i <= new Date().getMonth());

  /* Payment status donut */
  const pmtSegments = [
    { label:'Received', val: payments.filter(p=>p.status==='received').length, color:'#4ade80' },
    { label:'Pending',  val: payments.filter(p=>p.status==='pending').length,  color:'#fbbf24' },
    { label:'Failed',   val: payments.filter(p=>p.status==='failed').length,   color:'#f87171' },
  ];

  /* Lead status donut */
  const leadSegments = [
    { label:'New',       val: leads.filter(l=>l.status==='new').length,       color:'#38bdf8' },
    { label:'Contacted', val: leads.filter(l=>l.status==='contacted').length, color:'#c084fc' },
    { label:'Qualified', val: leads.filter(l=>l.status==='qualified').length, color:'#6ea8fe' },
    { label:'Closed',    val: leads.filter(l=>l.status==='closed').length,    color:'#4ade80' },
  ];

  /* Pipeline value by stage */
  const STAGES = ['prospect','proposal','negotiation','won'];
  const stageData = STAGES.map(s => ({
    label: s.charAt(0).toUpperCase() + s.slice(0,3),
    val: clients.filter(c => c.stage === s).length,
  }));

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Dashboard</h1>
          <p className="ad-page-sub">Welcome back, Admin · {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="ad-stats">
        {STATS.map(s => (
          <div className="ad-stat" key={s.label}>
            <div className="ad-stat-icon">{s.icon}</div>
            <div className="ad-stat-label">{s.label}</div>
            <div className="ad-stat-val">{s.val}</div>
            <div className="ad-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="db-charts-row">
        <div className="ad-card db-chart-card">
          <div className="ad-card-head">
            <span className="ad-card-title">📊 Monthly Leads</span>
          </div>
          <div style={{padding:'20px'}}>
            <BarChart data={monthlyCounts} color="url(#blueGrad)" />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#2459e7"/>
                  <stop offset="100%" stopColor="#38bdf8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="ad-card db-chart-card">
          <div className="ad-card-head">
            <span className="ad-card-title">🎯 Lead Status</span>
          </div>
          <div style={{padding:'20px'}}>
            <DonutChart segments={leadSegments} />
          </div>
        </div>

        <div className="ad-card db-chart-card">
          <div className="ad-card-head">
            <span className="ad-card-title">💳 Payments</span>
          </div>
          <div style={{padding:'20px'}}>
            <DonutChart segments={pmtSegments} />
          </div>
        </div>
      </div>

      {/* Pipeline bar */}
      <div className="db-charts-row" style={{marginTop:16}}>
        <div className="ad-card" style={{flex:1}}>
          <div className="ad-card-head">
            <span className="ad-card-title">🚀 Client Pipeline</span>
          </div>
          <div style={{padding:'20px'}}>
            <BarChart data={stageData} color="#a855f7" />
          </div>
        </div>

        {/* Recent leads */}
        <div className="ad-card" style={{flex:2}}>
          <div className="ad-card-head">
            <span className="ad-card-title">📥 Recent Leads</span>
          </div>
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Name</th><th>Service</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0,5).map(l => (
                  <tr key={l.id}>
                    <td>
                      <div style={{fontWeight:600,color:'#f0f4ff'}}>{l.name}</div>
                      <div style={{fontSize:'.75rem',color:'#7689ad'}}>{l.email}</div>
                    </td>
                    <td style={{color:'#7689ad'}}>{l.service}</td>
                    <td style={{color:'#7689ad',whiteSpace:'nowrap'}}>{l.date}</td>
                    <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
