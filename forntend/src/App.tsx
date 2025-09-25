import React, { useEffect, useState } from 'react';

type ApiResponse = {
  message?: string;
  echoed_text?: string;
  reversed_text?: string;
  capitalized_text?: string;
  word_count?: number;
  tokens?: string[];
};

function App() {
  const [apiMessage, setApiMessage] = useState('Loading...');
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [apiEndpoint, setApiEndpoint] = useState('/generate-audio/');

  // For PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    document.title = 'Offline Page';

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    fetch('https://aksharastra-oncm.onrender.com')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: ApiResponse = await res.json();
        setApiMessage(data.message || 'No message');
      })
      .catch((err) => setApiMessage('Error: ' + err.message));
  }, []);

  // Send request to selected API endpoint
  const sendText = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    setResponseMessage(null);
    try {
      // Special handling: /word-count/ endpoint supports optional min_length query param
      let url = `https://aksharastra-oncm.onrender.com${apiEndpoint}`;
      if (apiEndpoint === '/word-count/') {
        // Including a min_length=1 as example; you can extend UI to choose this if needed
        url += '?min_length=1';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`API error: ${errMsg || response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      // Map response fields to a single display message
      const message =
        data.message ||
        data.echoed_text ||
        data.reversed_text ||
        data.capitalized_text ||
        (data.word_count !== undefined ? `Word count: ${data.word_count}` : null) ||
        (data.tokens ? `Tokens: ${data.tokens.join(', ')}` : null) ||
        'No response message';

      setResponseMessage(message);
    } catch (error) {
      alert('Failed to fetch API response. Please try again.');
      console.error('API error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User choice:', outcome);
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto', position: 'relative' }}>
      <h1>Offline Page</h1>
      <p>{apiMessage}</p>

      {/* Dropdown to select API endpoint */}
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="apiSelect">Choose API Endpoint: </label>
        <select
          id="apiSelect"
          value={apiEndpoint}
          onChange={(e) => setApiEndpoint(e.target.value)}
          style={{ marginLeft: 10, padding: 5 }}
        >
          <option value="/generate-audio/">Generate Audio</option>
          <option value="/echo/">Echo Text</option>
          <option value="/reverse-text/">Reverse Text</option>
          <option value="/capitalize-text/">Capitalize Text</option>
          <option value="/word-count/">Word Count</option>
          <option value="/tokenize/">Tokenize Text</option>
        </select>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Enter Text</h2>
        <textarea
          rows={4}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter text here..."
          aria-label="Enter text here"
          style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', resize: 'vertical' }}
        />
        <button
          onClick={sendText}
          disabled={loading || !textInput.trim()}
          aria-label="Send text to API"
          style={{
            marginTop: 8,
            padding: '0.5rem 1rem',
            backgroundColor: loading ? '#999' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          {loading ? 'Loading...' : 'Send Text'}
        </button>
      </div>

      {responseMessage && (
        <div style={{ marginTop: 20 }}>
          <h3>API Response</h3>
          <p>{responseMessage}</p>
        </div>
      )}

      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            borderRadius: 8,
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          Install App
        </button>
      )}
    </div>
  );
}

export default App;
