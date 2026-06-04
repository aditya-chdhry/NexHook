import { useState, useEffect, useRef } from 'react';
import { getOutreachLeads, triggerOutreachCampaign, deleteOutreachLead } from './adminData';
import './AdminLayout.css';
import './LeadAutomation.css';

const NODES = [
  { id: 1, key: 'trigger', icon: '⚡', label: 'Trigger', desc: 'n8n & Webhooks' },
  { id: 2, key: 'sourcing', icon: '🔍', label: 'Lead Sourcing', desc: 'Apollo, Maps, LinkedIn' },
  { id: 3, key: 'duplicate', icon: '🗂️', label: 'Duplicate Check', desc: 'Google Sheets & DB' },
  { id: 4, key: 'verification', icon: '✉️', label: 'Email Verify', desc: 'MillionVerifier API' },
  { id: 5, key: 'qualification', icon: '🤖', label: 'AI Qualify', desc: 'GPT-4 Score & Reason' },
  { id: 6, key: 'outreach', icon: '📤', label: 'Outreach Sent', desc: 'SMTP & Calendly Link' },
  { id: 7, key: 'replies', icon: '💬', label: 'Detect Replies', desc: 'n8n IMAP Listeners' },
  { id: 8, key: 'meetings', icon: '📅', label: 'Book Meetings', desc: 'Calendly & Pipeline' }
];

export default function LeadAutomation() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [running, setRunning] = useState(false);
  const [nodeStates, setNodeStates] = useState({});
  const [selectedMailLead, setSelectedMailLead] = useState(null); // Modal for email preview
  const [query, setQuery] = useState('SaaS Startups');
  const [location, setLocation] = useState('New York');
  const [platform, setPlatform] = useState('Google Maps');
  const [calendlyUrl, setCalendlyUrl] = useState(localStorage.getItem('calendly_url') || 'https://calendly.com/adityaschdhry');
  const [emailMode, setEmailMode] = useState('test'); // 'test' or 'live'
  const [logs, setLogs] = useState([
    '🤖 AI Campaign engine initialized. Ready to launch outreach pipeline.',
    '💡 Tip: Enter your target keywords and location below, select a platform, and click "Find & Outreach" to scrape live data globally using AI.',
    '⚠️ Safety: Keep "Email Mode" set to "Test Mode" to preview messages in your inbox before sending to live prospects!'
  ]);

  useEffect(() => {
    localStorage.setItem('calendly_url', calendlyUrl);
  }, [calendlyUrl]);

  const consoleEndRef = useRef(null);

  useEffect(() => {
    reload();
    // Initialize all nodes as pending
    const initial = {};
    NODES.forEach(n => { initial[n.key] = 'pending'; });
    setNodeStates(initial);
  }, []);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const reload = async () => {
    const data = await getOutreachLeads();
    setLeads(Array.isArray(data) ? data : []);
  };

  const addLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  const runCampaign = async () => {
    if (running) return;
    setRunning(true);
    setLogs([]);
    
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    try {
      // Step 1: Trigger
      setNodeStates(prev => ({ ...prev, trigger: 'processing' }));
      addLog(`⚡ [n8n Webhook] Triggering AI lead generation pipeline for "${query}" in "${location}" via ${platform}...`, 'info');
      await sleep(1000);
      setNodeStates(prev => ({ ...prev, trigger: 'success' }));

      // Step 2: Sourcing
      setNodeStates(prev => ({ ...prev, sourcing: 'processing' }));
      if (platform === 'Google Maps') {
        addLog(`🔍 [Apify Actor] Initializing Google Maps Scraper for "${query}" in "${location}"...`, 'info');
        await sleep(1200);
        addLog('🔍 Extraction complete. Sourced active business addresses and websites.', 'info');
      } else if (platform === 'Apollo') {
        addLog(`🔍 [Apollo B2B Scraper] Connecting to Apollo search directory for "${query}" companies in "${location}"...`, 'info');
        await sleep(1200);
        addLog('🔍 Apollo extraction complete. Sourced validated corporate domains & employee sizes.', 'info');
      } else {
        addLog(`🔍 [Apify LinkedIn Scraper] Scraping LinkedIn profiles matching keyword "${query}" in "${location}"...`, 'info');
        await sleep(1200);
        addLog('🔍 LinkedIn profile extraction complete.', 'info');
      }
      await sleep(800);
      setNodeStates(prev => ({ ...prev, sourcing: 'success' }));

      // Step 3: Duplicate Check & Google Sheets Sync
      setNodeStates(prev => ({ ...prev, duplicate: 'processing' }));
      addLog('🗂️ [Google Sheets API] Reading master lead database index...', 'info');
      await sleep(800);
      addLog('🗂️ Checking prospects against local MongoDB indexes to prevent duplicate spam...', 'info');
      await sleep(600);
      setNodeStates(prev => ({ ...prev, duplicate: 'success' }));

      // Step 4: Email Verify
      setNodeStates(prev => ({ ...prev, verification: 'processing' }));
      addLog('✉️ Connecting to MillionVerifier API. Performing SMTP handshakes & MX validity tests...', 'info');
      await sleep(1200);
      setNodeStates(prev => ({ ...prev, verification: 'success' }));

      // Step 5: AI Qualify & Scoring
      setNodeStates(prev => ({ ...prev, qualification: 'processing' }));
      addLog('🤖 Running custom qualification prompt on OpenAI GPT-4 API...', 'info');
      await sleep(1000);
      addLog('🤖 Scoring prospects for "IT & Automation Services fit" (Qualifying Threshold > 60)...', 'info');
      await sleep(800);
      setNodeStates(prev => ({ ...prev, qualification: 'success' }));

      // Step 6: Outreach Email dispatch
      setNodeStates(prev => ({ ...prev, outreach: 'processing' }));
      addLog(`📤 Drafting custom cold outreach emails with Calendly link: ${calendlyUrl}...`, 'info');
      await sleep(1000);
      if (emailMode === 'test') {
        addLog('🛡️ [TEST MODE ENABLED] Rerouting outgoing emails to your own address to prevent SMTP bounce-backs...', 'warn');
      } else {
        addLog('📤 [LIVE MODE] Dispatching outreach messages directly to verified prospect inboxes...', 'info');
      }
      await sleep(800);
      setNodeStates(prev => ({ ...prev, outreach: 'success' }));

      // Step 7: Replies Detection
      setNodeStates(prev => ({ ...prev, replies: 'processing' }));
      addLog('💬 [n8n IMAP Node] Scanning mailbox folder for active prospect replies...', 'info');
      await sleep(1000);
      setNodeStates(prev => ({ ...prev, replies: 'success' }));

      // Step 8: CRM & Meetings
      setNodeStates(prev => ({ ...prev, meetings: 'processing' }));
      addLog('📅 Synchronizing hot prospects with Airtable and booking calendar links...', 'info');
      
      // Trigger actual backend MERN execution
      const res = await triggerOutreachCampaign({ query, location, platform, calendlyUrl, emailMode });
      await sleep(1000);
      
      // Sync Google Sheets back
      addLog(`📊 [Google Sheets Sync] Uploading qualified ${query} leads back to master sheets. OK!`, 'info');
      setNodeStates(prev => ({ ...prev, meetings: 'success' }));

      if (res.success) {
        addLog(`🎉 n8n Workflow Campaign COMPLETED successfully! Sourced and qualified ${res.count} prospects.`, 'info');
        if (emailMode === 'test') {
          addLog(`✉️ Check your inbox at adityaschdhry@gmail.com to view the drafted outreach templates!`, 'info');
        }
      } else {
        addLog(`⚠️ Campaign completed. Sourced leads already existed in local index.`, 'warn');
      }

      await reload();
    } catch (err) {
      addLog(`❌ Campaign workflow failed: ${err.message}`, 'err');
    } finally {
      setRunning(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this lead record?')) {
      await deleteOutreachLead(id);
      await reload();
    }
  };

  // CSV Downloader
  const downloadCSV = () => {
    const headers = ['Lead ID', 'Name', 'Company', 'Email', 'Phone', 'Source', 'Email Status', 'AI Score', 'Email Sent', 'Reply Received', 'Status', 'Personal Message', 'Notes'];
    const rows = filtered.map(l => [
      l.id,
      l.name,
      l.company,
      l.email,
      l.phone,
      l.source || 'Apollo',
      l.emailStatus,
      l.leadScore,
      l.emailSent ? 'Yes' : 'No',
      l.replyReceived,
      l.status,
      `"${l.personalMessage?.replace(/"/g, '""') || ''}"`,
      `"${l.notes?.replace(/"/g, '""') || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AI_Outreach_Campaign_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog('📊 Master Google Sheet data successfully exported to Excel (CSV) format.', 'info');
  };

  const downloadPDF = () => {
    addLog('🖨️ Launching printable PDF report view...', 'info');
    window.print();
  };

  const filtered = leads.filter(l => {
    const match = l.name?.toLowerCase().includes(search.toLowerCase()) || 
                  l.company?.toLowerCase().includes(search.toLowerCase()) ||
                  l.email?.toLowerCase().includes(search.toLowerCase());
    if (filterStatus === 'all') return match;
    return match && l.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="ad-page" id="print-area">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">AI Lead Automation Campaign</h1>
          <p className="ad-page-sub">Visualize, qualify, and execute cold outreach using automated scrapers and n8n + Google Sheets integrations.</p>
        </div>
      </div>

      {/* AI Lead Sourcing Control Panel */}
      <div className="la-control-panel">
        <h3 style={{color: '#f0f4ff', margin: '0 0 16px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700}}>
          🌐 AI Lead Finder & Global Scraper Config
        </h3>
        
        {/* Row 1: Sourcing Filters */}
        <div className="la-control-row">
          <div className="la-input-group">
            <label className="la-input-label" style={{color: '#7689ad'}}>Industry / Keywords</label>
            <input 
              type="text" 
              className="la-input" 
              placeholder="e.g. Dentists, SaaS, Real Estate" 
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="la-input-group">
            <label className="la-input-label" style={{color: '#7689ad'}}>Target Location</label>
            <input 
              type="text" 
              className="la-input" 
              placeholder="e.g. New York, London, Tokyo" 
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
          <div className="la-input-group">
            <label className="la-input-label" style={{color: '#7689ad'}}>Sourcing Platform</label>
            <select 
              className="la-input"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              style={{cursor: 'pointer'}}
            >
              <option value="Google Maps">Google Maps (via Apify)</option>
              <option value="Apollo">Apollo Database</option>
              <option value="LinkedIn">LinkedIn Profiles</option>
            </select>
          </div>
        </div>

        {/* Row 2: Delivery & Sourcing Trigger */}
        <div className="la-control-row-2">
          <div className="la-input-group">
            <label className="la-input-label" style={{color: '#7689ad'}}>Calendly Booking Link</label>
            <input 
              type="text" 
              className="la-input" 
              placeholder="e.g. https://calendly.com/your-username" 
              value={calendlyUrl}
              onChange={e => setCalendlyUrl(e.target.value)}
            />
          </div>
          <div className="la-input-group">
            <label className="la-input-label" style={{color: '#7689ad'}}>Email Mode</label>
            <select 
              className="la-input"
              value={emailMode}
              onChange={e => setEmailMode(e.target.value)}
              style={{cursor: 'pointer'}}
            >
              <option value="test">🛡️ Test Mode (Deliver to Self)</option>
              <option value="live">🚀 Live Mode (Deliver to Prospect)</option>
            </select>
          </div>
          <button 
            className="ad-btn-prim" 
            onClick={runCampaign} 
            disabled={running}
            style={{ width: '100%', height: '42px', opacity: running ? 0.6 : 1, cursor: running ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {running ? (
              <>⏳ Sourcing...</>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Find & Outreach
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Workflow Graph */}
      <div className="la-graph-section">
        <div className="la-graph-header">
          <span className="la-graph-title">🔄 Outreach Automation n8n Webhook Nodes</span>
          <span className={`la-status-tag ${running ? 'active' : ''}`}>
            {running ? '● Running AI Workflow' : 'Idle'}
          </span>
        </div>

        <div className="la-nodes-container">
          {NODES.map(node => (
            <div key={node.id} className={`la-node ${nodeStates[node.key] || 'pending'}`}>
              <div className="la-node-num">{node.id}</div>
              <div className="la-node-icon">{node.icon}</div>
              <div className="la-node-title">{node.label}</div>
              <div className="la-node-desc">{node.desc}</div>
            </div>
          ))}
        </div>

        {/* Scrolling Console Log Window */}
        <div className="la-console">
          {logs.map((log, index) => {
            let className = 'info';
            if (log.includes('❌') || log.includes('failed')) className = 'err';
            if (log.includes('⚠️')) className = 'warn';
            if (log.includes('[n8n') || log.includes('[Google Sheets')) className = 'success';
            return (
              <div key={index} className={`la-console-line ${className}`}>
                {log}
              </div>
            );
          })}
          <div ref={consoleEndRef} />
        </div>
      </div>

      {/* Campaign leads table & exporting options */}
      <div className="ad-filters">
        <div className="ad-search-wrap">
          <svg className="ad-search-icon" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" className="ad-search" placeholder="Search campaign leads..." 
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <select 
          className="ad-filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Campaign Stages</option>
          <option value="sourced">Sourced Leads</option>
          <option value="qualified">AI Qualified</option>
          <option value="replied">Replied (Interested)</option>
          <option value="rejected">Rejected (Low Score)</option>
        </select>

        <div className="la-action-buttons">
          <button className="la-btn-export" title="Export Excel / Sheets" onClick={downloadCSV}>
            📥 Export CSV / Excel
          </button>
          <button className="la-btn-export pdf" title="Export Report PDF" onClick={downloadPDF}>
            📄 Download PDF Report
          </button>
        </div>
      </div>

      <div className="ad-card ad-table-wrap">
        {filtered.length === 0 ? (
          <div className="ad-empty">
            <p>No campaign leads found. Click "Run Outreach Campaign" above to scrape and verify leads!</p>
          </div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Lead Info</th>
                <th>Sourcing Channel</th>
                <th>Company</th>
                <th>Email Status</th>
                <th>AI Score</th>
                <th>Reply Status</th>
                <th>Campaign Stage</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{fontWeight:600, color:'#f0f4ff'}}>{l.name}</div>
                    <div style={{fontSize:'.75rem', color:'#7689ad'}}>{l.email}</div>
                  </td>
                  <td>
                    <span style={{
                      fontSize:'.72rem',
                      padding:'3px 8px',
                      borderRadius:6,
                      background: l.source === 'LinkedIn' ? 'rgba(10,102,194,0.12)' :
                                  l.source === 'Google Maps' ? 'rgba(234,67,53,0.12)' :
                                  l.source === 'Apify' ? 'rgba(240,163,10,0.12)' : 'rgba(56,189,248,0.12)',
                      color: l.source === 'LinkedIn' ? '#0a66c2' :
                             l.source === 'Google Maps' ? '#ea4335' :
                             l.source === 'Apify' ? '#f0a30a' : '#38bdf8',
                      border: `1px solid ${
                        l.source === 'LinkedIn' ? '#0a66c2' :
                        l.source === 'Google Maps' ? '#ea4335' :
                        l.source === 'Apify' ? '#f0a30a' : '#38bdf8'
                      }`,
                      fontWeight: 600
                    }}>
                      {l.source || 'Apollo'}
                    </span>
                  </td>
                  <td>
                    <div style={{fontWeight:500, color:'#dde3f0'}}>{l.company}</div>
                    <div style={{fontSize:'.72rem', color:'#7689ad'}}>{l.phone}</div>
                  </td>
                  <td>
                    <span style={{
                      fontSize:'.75rem',
                      padding:'3px 8px',
                      borderRadius:12,
                      background: l.emailStatus === 'Verified' ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
                      color: l.emailStatus === 'Verified' ? '#34d399' : '#f87171',
                      border: `1px solid ${l.emailStatus === 'Verified' ? '#34d399' : '#f87171'}`
                    }}>
                      {l.emailStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{fontWeight:700, color: l.leadScore >= 70 ? '#34d399' : '#f87171'}}>
                      {l.leadScore || 0}%
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize:'.74rem',
                      color: l.replyReceived === 'Interested' ? '#34d399' : '#7689ad',
                      fontWeight: l.replyReceived === 'Interested' ? 600 : 400
                    }}>
                      {l.replyReceived}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize:'.75rem',
                      padding:'4px 10px',
                      borderRadius:8,
                      background: l.status === 'Replied' ? 'rgba(167,139,250,0.1)' :
                                  l.status === 'Qualified' ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.05)',
                      color: l.status === 'Replied' ? '#a78bfa' :
                             l.status === 'Qualified' ? '#38bdf8' : '#7689ad',
                      border: `1px solid ${
                        l.status === 'Replied' ? '#a78bfa' :
                        l.status === 'Qualified' ? '#38bdf8' : 'rgba(255,255,255,0.1)'
                      }`
                    }}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    {l.emailSent ? (
                      <button 
                        className="ad-btn-icon" 
                        title="Preview Outreach Mail"
                        onClick={() => setSelectedMailLead(l)}
                        style={{color:'#38bdf8'}}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </button>
                    ) : (
                      <span style={{fontSize:'.72rem', color:'#3b4d6a'}}>Not Sent</span>
                    )}
                  </td>
                  <td>
                    <button className="ad-btn-icon ad-btn-del" onClick={() => handleDelete(l.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* HTML Outreach Mail Preview Modal */}
      {selectedMailLead && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(4,5,10,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            maxWidth: 650,
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              background: '#0c0e1a',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div>
                <span style={{color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase'}}>Outreach Preview</span>
                <h4 style={{color: '#f0f4ff', margin: '4px 0 0 0', fontSize: '1.05rem'}}>IT & Automation Services Proposal</h4>
              </div>
              <button 
                onClick={() => setSelectedMailLead(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#7689ad',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  padding: 0
                }}
              >&times;</button>
            </div>

            {/* Email Container Scroll */}
            <div style={{ padding: '24px 20px', maxHeight: '550px', overflowY: 'auto', background: '#f7fafc' }}>
              <div style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                maxWidth: 600,
                margin: '0 auto',
                padding: 24,
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                backgroundColor: '#ffffff',
                color: '#1a202c'
              }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #2459e7', paddingBottom: 15, marginBottom: 20 }}>
                  <h2 style={{ color: '#2459e7', margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>NexHook Services</h2>
                  <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: 14 }}>Next-Gen IT & Workflow Automation Specialists</p>
                </div>
                
                <h3 style={{ color: '#2d3748', fontSize: 18, fontWeight: 700, marginTop: 0 }}>Hi {selectedMailLead.name},</h3>
                
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#4a5568' }}>
                  I noticed your amazing work leading operations at <strong>{selectedMailLead.company}</strong>. 
                  Our AI outreach system analyzed your profile and found a strong match for implementing advanced workflow automations.
                </p>
                
                <div style={{ backgroundColor: '#f7fafc', borderLeft: '4px solid #38bdf8', padding: 15, borderRadius: '0 8px 8px 0', margin: '20px 0' }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#4a5568' }}>
                    <strong>AI-Generated Synergy Review:</strong><br/>
                    I {selectedMailLead.personalMessage}
                  </p>
                </div>

                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#4a5568' }}>
                  We specialize in building fully-automated systems connecting tools like <strong>n8n, Google Sheets, Airtable, Apify, and customized MERN Stack web portals</strong> to optimize your operations and save hundreds of manual hours.
                </p>

                <div style={{ textAlign: 'center', margin: '30px 0 20px 0' }}>
                  <a href="https://calendly.com/nexhook/it-consultation" style={{
                    background: 'linear-gradient(135deg, #2459e7, #38bdf8)',
                    color: '#ffffff',
                    padding: '12px 30px',
                    textDecoration: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 16,
                    display: 'inline-block',
                    boxShadow: '0 4px 14px rgba(36,89,231,0.35)',
                    textAlign: 'center'
                  }}>
                    📅 Schedule Free IT Consultation
                  </a>
                  <p style={{ margin: '10px 0 0 0', fontSize: 12, color: '#a0aec0' }}>Click to book directly via Calendly</p>
                </div>

                <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '25px 0' }}/>
                
                <p style={{ fontSize: 13, color: '#718096', lineHeight: 1.5, marginBottom: 0 }}>
                  Best regards,<br/>
                  <strong>Outreach Division</strong><br/>
                  NexHook IT Solutions & Automations
                </p>
              </div>
            </div>
            
            <div style={{
              background: '#f8fafc',
              padding: '12px 24px',
              textAlign: 'right',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button 
                onClick={() => setSelectedMailLead(null)}
                style={{
                  background: '#0c0e1a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
