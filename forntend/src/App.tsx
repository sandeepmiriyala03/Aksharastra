import React, { useEffect, useState } from 'react';

type ApiResponse = { message: string };

function App() {
  const [apiMessage, setApiMessage] = useState('Loading...');
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Fetch backend welcome message on page load
  useEffect(() => {
    fetch('https://aksharastra-oncm.onrender.com')
      .then(async (res) => {
        console.log(res);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: ApiResponse = await res.json();
        setApiMessage(data.message);
      })
      .catch((err) => setApiMessage('Error: ' + err.message));
  }, []);

  // Cleanup audio object URL on unmount or when audioUrl changes to avoid memory leaks
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle audio generation on button click
const generateAudio = async () => {
  if (!textInput.trim()) return;
  setLoading(true);
  try {
    const response = await fetch('https://aksharastra-oncm.onrender.com/generate-audio/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textInput, voice_rate: 150, voice_volume: 0.9 }),
    });

    if (!response.ok) {
      // Try to parse and log error text from server response
      let errMsg = '';
      try {
        errMsg = await response.text();
      } catch (e) {
        errMsg = 'Unable to parse error response';
      }
      console.error('Generate audio failed:', response.status, response.statusText, errMsg);
      throw new Error(`Failed to generate audio: ${errMsg || response.statusText}`);
    }

    const blob = await response.blob();
    setAudioUrl(URL.createObjectURL(blob));
  } catch (error) {
    alert('Failed to generate audio. Please try again.');
    console.error('Audio generation error:', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h1>Welcome to Aksharastra Frontend!</h1>
      <p>{apiMessage}</p>

      <div style={{ marginTop: '2rem' }}>
        <h2>Text to Speech</h2>
        <textarea
          rows={4}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter text for speech..."
          aria-label="Enter text for speech"
          style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', resize: 'vertical' }}
        />
        <div style={{ marginTop: 8, display: 'flex', gap: '10px' }}>
          <button
            onClick={generateAudio}
            disabled={loading || !textInput.trim()}
            aria-label="Generate audio from text"
            style={{
              flex: 1,
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
            {loading ? 'Generating...' : 'Generate Audio'}
          </button>

          <button
            onClick={() => setTextInput('')}
            disabled={loading || !textInput.trim()}
            aria-label="Clear text input"
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5a6268')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#6c757d')}
          >
            Clear
          </button>
        </div>
      </div>

      {audioUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Playback</h3>
          <audio controls src={audioUrl} style={{ width: '100%' }} />
          <a
            href={audioUrl}
            download="aksharastra_speech.wav"
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: 4,
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#218838')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#28a745')}
          >
            Download Audio
          </a>
        </div>
      )}
    </div>
  );
}

export default App;


