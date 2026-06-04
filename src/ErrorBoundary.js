import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#04050a',
          color: '#f87171',
          padding: '40px',
          minHeight: '100vh',
          fontFamily: 'monospace',
          overflow: 'auto',
          boxSizing: 'border-box'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '20px', fontSize: '1.8rem' }}>⚠️ React Application Crashed</h1>
          <p style={{ color: '#dde3f0', marginBottom: '10px', fontSize: '1.1rem' }}>
            <strong>Error:</strong> {this.state.error && this.state.error.toString()}
          </p>
          {this.state.errorInfo && (
            <pre style={{
              background: '#0c0e1a',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '20px',
              borderRadius: '8px',
              color: '#a7b8db',
              whiteSpace: 'pre-wrap',
              fontSize: '0.85rem',
              lineHeight: '1.4'
            }}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
          <button 
            onClick={() => { sessionStorage.clear(); window.location.href = '/admin-login'; }}
            style={{
              marginTop: '20px',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear Session & Go to Login
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
