import { useState, useEffect, useRef } from 'react';
import './WhatsAppChatbot.css';

// Configure the WhatsApp phone number (with country code, without + or spaces)
const WHATSAPP_NUMBER = "919315573429"; // Replace with NexHook's actual WhatsApp Business number

const API_PREFIX = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? ''
  : '/_/backend';

const SUGGESTIONS = [
  "Web Dev pricing 🌐",
  "Video editing rates 🎬",
  "Social Media plans 📈",
  "SaaS / App quote ⚙️",
  "Free audit call 📞",
  "Portfolio examples 🌟",
  "UI/UX Design 🖌️",
  "SEO & Speed 🔍",
  "Delivery timeline ⚡",
  "About NexHook 🚀",
];

export default function WhatsAppChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Initialize unique session ID per session (stored in sessionStorage)
  const [sessionId] = useState(() => {
    let id = sessionStorage.getItem('nexhook_chatbot_session_id');
    if (!id) {
      id = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem('nexhook_chatbot_session_id', id);
    }
    return id;
  });

  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: "Hey there! Welcome to NexHook. 👋\n\nI am your AI assistant. How can we help you scale your business today?",
      time: "Just now",
      suggestions: []
    }
  ]);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll inside chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleOpenChat = () => {
    setIsOpen(!isOpen);
    setUnreadCount(0);
  };

  const handleSuggestionClick = (suggestion) => {
    processIncomingMessage(suggestion);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    processIncomingMessage(userMessage);
    setUserMessage("");
  };

  // Connect to backend Gemini API for a true AI chatbot experience
  const processIncomingMessage = async (text) => {
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 1. Add user's query to chat log
    setMessages(prev => [...prev, { sender: 'user', text, time: userTime }]);

    // 2. Trigger typing simulation
    setIsTyping(true);

    try {
      const res = await fetch(`${API_PREFIX}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId })
      });
      
      const data = await res.json();
      setIsTyping(false);

      if (res.ok) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'agent',
            text: data.reply || "I'm sorry, I couldn't understand that. Could you try rephrasing?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            showWhatsAppBtn: !!data.showWhatsAppBtn,
            suggestions: data.suggestions || [],
            userQuery: `Hi NexHook, I have a query: ${text}`
          }
        ]);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: "I am having trouble connecting to the AI server. Let's get you connected directly with our human expert on WhatsApp! 💬\n\nClick the button below to connect instantly!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showWhatsAppBtn: true,
          userQuery: `Hi NexHook, I have a query: ${text}`
        }
      ]);
    }
  };

  const handleWhatsAppRedirect = async (customText) => {
    // Call backend to log the click (converted status in DB)
    try {
      await fetch(`${API_PREFIX}/api/chatbot-data/${sessionId}/whatsapp-click`, {
        method: 'POST'
      });
    } catch (e) {
      console.error('Failed to log WhatsApp click:', e);
    }

    const formattedText = encodeURIComponent(customText || "Hi, I have a custom query about NexHook services!");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${formattedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`wa-widget-container ${isOpen ? 'active' : ''}`}>
      
      {/* ─── CHATBOX POPUP WINDOW ─── */}
      <div className={`wa-chat-window ${isOpen ? 'open' : ''}`}>
        
        {/* Header (Branded NexHook Cobalt Blue & Cyan) */}
        <div className="wa-header">
          <div className="wa-avatar-wrap">
            <div className="wa-avatar">
              <img src="/logo.png" alt="NexHook Logo" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
            </div>
            <div className="wa-status-dot animated"></div>
          </div>
          <div className="wa-header-info">
            <h4>NexHook AI Agent</h4>
            <p>Online • Instant Resolution</p>
          </div>
          <button className="wa-close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Messages Body */}
        <div className="wa-body">
          <div className="wa-messages-list">
            {messages.map((m, i) => (
              <div key={i} className="wa-bubble-wrapper">
                <div className={`wa-bubble ${m.sender}`}>
                  <p>{m.text}</p>
                  
                  {/* Graceful WhatsApp Redirect Button */}
                  {m.showWhatsAppBtn && (
                    <button 
                      className="wa-embedded-redirect-btn"
                      onClick={() => handleWhatsAppRedirect(m.userQuery)}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.742.002-2.602-1.01-5.05-2.85-6.892-1.84-1.842-4.287-2.856-6.886-2.858-5.441 0-9.87 4.372-9.875 9.745-.002 1.77.476 3.498 1.385 5.048l-.999 3.648 3.736-.971zm11.367-7.24c-.072-.121-.264-.193-.551-.337-.287-.144-1.696-.837-1.958-.933-.262-.096-.453-.144-.645.144-.191.288-.741.933-.909 1.125-.168.192-.336.216-.622.072-.287-.144-1.21-.446-2.305-1.424-.853-.76-1.43-1.7-1.597-1.988-.168-.288-.018-.444.125-.587.13-.129.287-.336.43-.504.144-.168.192-.288.287-.48.096-.192.048-.36-.024-.504-.072-.144-.645-1.554-.884-2.13-.233-.56-.47-.484-.645-.493-.167-.008-.36-.01-.552-.01-.191 0-.503.072-.767.36-.264.288-1.006.984-1.006 2.397 0 1.413 1.03 2.78 1.173 2.973.144.192 2.028 3.1 4.912 4.346.686.296 1.221.474 1.637.606.69.219 1.319.188 1.815.114.553-.083 1.696-.693 1.937-1.362.24-.668.24-1.242.168-1.362z"/>
                      </svg>
                      Connect on WhatsApp
                    </button>
                  )}

                  {/* Inline Contextual suggestion chips inside agent bubbles */}
                  {m.sender === 'agent' && m.suggestions && m.suggestions.length > 0 && (
                    <div className="wa-inline-suggestions">
                      {m.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="wa-inline-chip"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <span className="wa-time">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="wa-bubble agent typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Suggestion Chips — single horizontal scroll row */}
        <div className="wa-suggestions">
          <div className="wa-chips-row">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                className="wa-chip"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input Footer */}
        <form onSubmit={handleFormSubmit} className="wa-footer">
          <input
            type="text"
            placeholder="Ask anything or type 'human' to connect..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="wa-input"
          />
          <button type="submit" className="wa-send-btn" aria-label="Send query">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      {/* Floating Branded Trigger Button */}
      <button 
        className="wa-trigger-btn" 
        onClick={handleOpenChat}
        aria-label="Open AI Helpdesk"
      >
        {unreadCount > 0 && (
          <span className="wa-badge">{unreadCount}</span>
        )}
        
        {/* NexHook Logo */}
        <img src="/logo.png" alt="NexHook Logo" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
      </button>
    </div>
  );
}
