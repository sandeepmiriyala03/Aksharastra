import React, { useEffect, useState } from 'react';

type ApiResponse = { message: string };

function App() {
  const [apiMessage, setApiMessage] = useState('Loading...');
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Offline Page';
  }, []);

  useEffect(() => {
    fetch('https://aksharastra-oncm.onrender.com')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: ApiResponse = await res.json();
        setApiMessage(data.message);
      })
      .catch((err) => setApiMessage('Error: ' + err.message));
  }, []);

  const sendText = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('https://aksharastra-oncm.onrender.com/generate-audio/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`API error: ${errMsg || response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      alert('Failed to fetch API response. Please try again.');
      console.error('API error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h1>Offline Page</h1>
      <p>{apiMessage}</p>

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
          onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#007bff')}
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
    </div>
  );
}

export default App;
