import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
function App() {
    const [apiMessage, setApiMessage] = useState('Loading...');
    const [textInput, setTextInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    // Fetch backend welcome message on page load
    useEffect(() => {
        fetch('https://aksharastra.onrender.com/')
            .then(async (res) => {
            if (!res.ok)
                throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
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
        if (!textInput.trim())
            return;
        setLoading(true);
        try {
            // const localhost='http://localhost:8000';
            const response = await fetch('https://aksharastra.onrender.com/generate-audio/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textInput, voice_rate: 150, voice_volume: 0.9 }),
            });
            if (!response.ok)
                throw new Error('Failed to generate audio');
            const blob = await response.blob();
            setAudioUrl(URL.createObjectURL(blob));
        }
        catch (error) {
            alert('Failed to generate audio. Please try again.');
            console.error('Audio generation error:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: 600, margin: '0 auto' }, children: [_jsx("h1", { children: "Welcome to Aksharastra Frontend!" }), _jsx("p", { children: apiMessage }), _jsxs("div", { style: { marginTop: '2rem' }, children: [_jsx("h2", { children: "Text to Speech" }), _jsx("textarea", { rows: 4, value: textInput, onChange: (e) => setTextInput(e.target.value), placeholder: "Enter text for speech...", style: { width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', resize: 'vertical' } }), _jsxs("div", { style: { marginTop: 8, display: 'flex', gap: '10px' }, children: [_jsx("button", { onClick: generateAudio, disabled: loading || !textInput.trim(), style: {
                                    flex: 1,
                                    padding: '0.5rem 1rem',
                                    backgroundColor: loading ? '#999' : '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.3s',
                                }, onMouseEnter: e => !loading && (e.currentTarget.style.backgroundColor = '#0056b3'), onMouseLeave: e => !loading && (e.currentTarget.style.backgroundColor = '#007bff'), children: loading ? 'Generating...' : 'Generate Audio' }), _jsx("button", { onClick: () => setTextInput(''), disabled: loading && !textInput.trim(), style: {
                                    flex: 1,
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.3s',
                                }, onMouseEnter: e => (e.currentTarget.style.backgroundColor = '#5a6268'), onMouseLeave: e => (e.currentTarget.style.backgroundColor = '#6c757d'), children: "Clear" })] })] }), audioUrl && (_jsxs("div", { style: { marginTop: 20 }, children: [_jsx("h3", { children: "Playback" }), _jsx("audio", { controls: true, src: audioUrl, style: { width: '100%' } }), _jsx("a", { href: audioUrl, download: "aksharastra_speech.wav", style: {
                            display: 'inline-block',
                            marginTop: 8,
                            padding: '0.5rem 1rem',
                            backgroundColor: '#28a745',
                            color: 'white',
                            borderRadius: 4,
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s',
                        }, onMouseEnter: e => (e.currentTarget.style.backgroundColor = '#218838'), onMouseLeave: e => (e.currentTarget.style.backgroundColor = '#28a745'), children: "Download Audio" })] }))] }));
}
export default App;
