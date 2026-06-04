import { useState, useEffect } from 'react';
import { getSalesAttributions, incrementSalesAttribution } from './adminData';
import './AdminLayout.css';

const EMAIL_SCRIPTS = [
  {
    id: 1,
    title: '🔗 n8n Workflow Automation',
    subject: '🔧 Save 20+ hours/week by automating your MERN CRM workflows',
    body: `Hi [Prospect Name],

I noticed your incredible operations scale at [Company Name]. Many modern teams lose hundreds of hours annually syncing their client database forms manually to Google Sheets or Airtable.

We specialize in designing robust, automated workflow nodes using n8n that completely eliminate manual entry. 

Can we connect for a brief 10-minute discovery call this Thursday to map your operations?

Book a slot directly here: https://calendly.com/nexhook/it-consultation`
  },
  {
    id: 2,
    title: '💻 Custom MERN CRM Portals',
    subject: '🚀 High-Performance Dashboards specifically for [Company Name]',
    body: `Hi [Prospect Name],

CTOs often struggle to maintain unified visibility across disparate tracking tools. 

We build customized, high-performance dashboards using the MERN stack (MongoDB, Express, React, Node.js) that aggregate all client pipelines, payments, invoices, and scheduling into a single, lightning-fast dashboard.

Here is a quick discovery call link to show you our live dashboard templates: https://calendly.com/nexhook/it-consultation`
  },
  {
    id: 3,
    title: '🔍 Apollo + Maps Scrapers',
    subject: '🔥 Double your pipeline using custom Apollo & Maps B2B scrapers',
    body: `Hi [Prospect Name],

Buying stale lists is killing your cold outreach response rates. 

We build automated scraping workflows using Apify actors, Apollo APIs, and Google Maps to automatically crawl, filter, and SMTP-verify high-intent IT service prospects in real-time.

Let's do a 10-minute strategy call to build your custom B2B scraper: https://calendly.com/nexhook/it-consultation`
  }
];

const OBJECTIONS = [
  {
    id: 'intro',
    label: '🎙️ The Hook (Intro)',
    objection: 'The First 15 Seconds of the Cold Call',
    response: '"Hey [Prospect Name], Rajesh here from NexHook IT. I know you weren\'t expecting my call, but I noticed you\'re running [Company Name]. We build custom MERN dashboards that automate CRM data pipelines. Do you have 45 seconds to hear how we save CTOs 20 hours a week, or did I catch you in the middle of a meeting?"'
  },
  {
    id: 'team',
    label: '👥 "We have an internal team"',
    objection: 'Prospect says they already have developers or a tech team.',
    response: '"That\'s exactly why I\'m calling! Most agencies we work with have great developers, but their core team is focused on product features. We handle the custom internal administrative dashboards, n8n webhook automations, and scraper pipelines so your main dev team doesn\'t lose time. Does it make sense to review a quick 10-minute demo?"'
  },
  {
    id: 'busy',
    label: '⏳ "I am too busy right now"',
    objection: 'Prospect tries to brush you off quickly.',
    response: '"I completely respect that, I know you\'re wearing ten hats today. I don\'t want to pitch you now. Let\'s schedule a brief 10-minute chat this Thursday morning, or I can drop our Calendly link in your WhatsApp. What\'s the best number for that?"'
  },
  {
    id: 'close',
    label: '📅 The Close (CTA)',
    objection: 'Securing the Calendly Consultation',
    response: '"Excellent, I have your email verified as [Prospect Email]. I will send a calendar invite with the join link for Thursday at 11 AM IST. In case you need to adjust it, you can reschedule via our direct link: https://calendly.com/nexhook/it-consultation. Looking forward to our tech review!"'
  }
];

export default function SalesTeam() {
  const [attributions, setAttributions] = useState([]);
  const [selectedScriptId, setSelectedScriptId] = useState(1);
  const [activeObjectionId, setActiveObjectionId] = useState('intro');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    loadAttributions();
  }, []);

  const loadAttributions = async () => {
    const data = await getSalesAttributions();
    setAttributions(Array.isArray(data) ? data : []);
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Copy Cold Script to Clipboard
  const handleCopyScript = (text) => {
    navigator.clipboard.writeText(text);
    triggerToast('📋 Script copied to clipboard successfully!');
  };

  // Real-Time Increment Client attribution
  const handleIncrementAttribution = async (platform) => {
    const res = await incrementSalesAttribution(platform);
    if (res) {
      triggerToast(`🎉 client sourced successfully from [${platform}]!`);
      // Update local state list
      setAttributions(prev => prev.map(a => a.platform === platform ? res : a));
    }
  };

  // Calculate Totals and Percentages
  const totalClients = attributions.reduce((acc, curr) => acc + (curr.clientCount || 0), 0);
  const activeScript = EMAIL_SCRIPTS.find(s => s.id === selectedScriptId);
  const activeObjection = OBJECTIONS.find(o => o.id === activeObjectionId);

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'LinkedIn': return '#0a66c2';
      case 'Google Maps': return '#ea4335';
      case 'Apollo': return '#38bdf8';
      case 'Reddit': return '#ff4500';
      case 'Instagram': return '#e1306c';
      default: return '#10b981';
    }
  };

  return (
    <div className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Sales Playbook & Attributions</h1>
          <p className="ad-page-sub">Equip your sales team with proven high-converting scripts, and track client sourcing attribution channels in real-time.</p>
        </div>
      </div>

      {/* Floating Animated Toast Alert */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: 30, right: 30,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: '0 10px 20px rgba(16,185,129,0.3)',
          zIndex: 99999,
          animation: 'la-slideIn 0.3s ease'
        }}>
          {toastMsg}
        </div>
      )}

      {/* Grid: Attributions Chart & Manual Incrementor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 25 }}>
        
        {/* Sourcing Channel Attribution Chart */}
        <div className="ad-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ color: '#f0f4ff', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>📊 Client Attribution Channels</h3>
            <span style={{ fontSize: '0.85rem', color: '#7689ad' }}>Total Clients: <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{totalClients}</strong></span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {attributions.map(attr => {
              const percentage = totalClients > 0 ? Math.round((attr.clientCount / totalClients) * 100) : 0;
              return (
                <div key={attr.platform}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#dde3f0', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{attr.platform}</span>
                    <span>{attr.clientCount} Sourced ({percentage}%)</span>
                  </div>
                  {/* Progress Bar Container */}
                  <div style={{ width: '100%', height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: getPlatformColor(attr.platform),
                      borderRadius: 5,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Sales Incrementor Simulator */}
        <div className="ad-card" style={{ padding: 24 }}>
          <h3 style={{ color: '#f0f4ff', margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 700 }}>⚡ Real-Time Attribution Simulator</h3>
          <p style={{ color: '#7689ad', fontSize: '0.85rem', marginBottom: 15 }}>
            Did your sales team just close a client? Click to increment the sourcing platform directly in the database.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {attributions.map(attr => (
              <button
                key={attr.platform}
                onClick={() => handleIncrementAttribution(attr.platform)}
                style={{
                  padding: '12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(12,14,26,0.6)',
                  color: '#dde3f0',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = getPlatformColor(attr.platform)}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <span>{attr.platform}</span>
                <span style={{
                  fontSize: '0.72rem',
                  background: `${getPlatformColor(attr.platform)}22`,
                  color: getPlatformColor(attr.platform),
                  padding: '2px 6px',
                  borderRadius: 4
                }}>+1 Sourced</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Email Scripts & Cold Calling Scenario */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        
        {/* proven Cold Emailing Scripts */}
        <div className="ad-card" style={{ padding: 24 }}>
          <h3 style={{ color: '#f0f4ff', margin: '0 0 15px 0', fontSize: '1.1rem', fontWeight: 700 }}>📧 High-Converting Cold Email Scripts</h3>
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
            {EMAIL_SCRIPTS.map(script => (
              <button
                key={script.id}
                onClick={() => setSelectedScriptId(script.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: selectedScriptId === script.id ? 'rgba(36,89,231,0.2)' : 'rgba(255,255,255,0.02)',
                  color: selectedScriptId === script.id ? '#38bdf8' : '#7689ad',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {script.title}
              </button>
            ))}
          </div>

          {activeScript && (
            <div style={{
              background: '#070913',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.05)',
              padding: 16
            }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ color: '#7689ad', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Subject Line</span>
                <div style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.9rem', marginTop: 4 }}>{activeScript.subject}</div>
              </div>
              <div>
                <span style={{ color: '#7689ad', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Email Body</span>
                <pre style={{
                  color: '#dde3f0',
                  fontSize: '0.85rem',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  marginTop: 6,
                  lineHeight: 1.5
                }}>{activeScript.body}</pre>
              </div>
              <button
                className="ad-btn-prim"
                onClick={() => handleCopyScript(activeScript.body)}
                style={{ marginTop: 15, width: '100%', fontSize: '0.85rem', padding: '10px 18px' }}
              >
                📋 Copy Cold Email Script
              </button>
            </div>
          )}
        </div>

        {/* Cold Calling Objection Scenarios */}
        <div className="ad-card" style={{ padding: 24 }}>
          <h3 style={{ color: '#f0f4ff', margin: '0 0 15px 0', fontSize: '1.1rem', fontWeight: 700 }}>🎙️ Cold Calling Objection Scenarios</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 15 }}>
            {OBJECTIONS.map(obj => (
              <button
                key={obj.id}
                onClick={() => setActiveObjectionId(obj.id)}
                style={{
                  padding: '10px',
                  borderRadius: 6,
                  border: activeObjectionId === obj.id ? '1px solid #a78bfa' : '1px solid rgba(255,255,255,0.05)',
                  background: activeObjectionId === obj.id ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.02)',
                  color: activeObjectionId === obj.id ? '#a78bfa' : '#dde3f0',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {obj.label}
              </button>
            ))}
          </div>

          {activeObjection && (
            <div style={{
              background: '#070913',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.05)',
              padding: 16
            }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: '#7689ad', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>Scenario / Situation</span>
                <div style={{ color: '#f87171', fontWeight: 600, fontSize: '0.86rem', marginTop: 4 }}>{activeObjection.objection}</div>
              </div>
              <div>
                <span style={{ color: '#7689ad', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>proven High-Converting Response Script</span>
                <div style={{
                  color: '#dde3f0',
                  fontSize: '0.88rem',
                  marginTop: 6,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                  borderLeft: '3px solid #a78bfa',
                  paddingLeft: 12
                }}>
                  {activeObjection.response}
                </div>
              </div>
              <button
                className="ad-btn-prim"
                onClick={() => handleCopyScript(activeObjection.response)}
                style={{ marginTop: 15, width: '100%', fontSize: '0.85rem', padding: '10px 18px', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
              >
                📋 Copy Response Script
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
