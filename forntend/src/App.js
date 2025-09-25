import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
function App() {
    const [apiMessage, setApiMessage] = useState('Loading...');
    const [textInput, setTextInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    // For PWA install prompt
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    useEffect(() => {
        document.title = 'Offline Page';
        // Listen for beforeinstallprompt event
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        // Cleanup listener
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);
    useEffect(() => {
        fetch('https://aksharastra-oncm.onrender.com')
            .then(async (res) => {
            if (!res.ok)
                throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setApiMessage(data.message);
        })
            .catch((err) => setApiMessage('Error: ' + err.message));
    }, []);
    // POST request; will be queued by service worker background sync if offline
    const sendText = async () => {
        if (!textInput.trim())
            return;
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
            const data = await response.json();
            setResponseMessage(data.message);
        }
        catch (error) {
            alert('Failed to fetch API response. Please try again.');
            console.error('API error:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleInstallClick = async () => {
        if (!deferredPrompt)
            return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('User choice:', outcome);
        setDeferredPrompt(null);
        setShowInstallButton(false);
    };
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: 600, margin: '0 auto', position: 'relative' }, children: [_jsx("h1", { children: "Offline Page" }), _jsx("p", { children: apiMessage }), _jsxs("div", { style: { marginTop: '2rem' }, children: [_jsx("h2", { children: "Enter Text" }), _jsx("textarea", { rows: 4, value: textInput, onChange: (e) => setTextInput(e.target.value), placeholder: "Enter text here...", "aria-label": "Enter text here", style: { width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', resize: 'vertical' } }), _jsx("button", { onClick: sendText, disabled: loading || !textInput.trim(), "aria-label": "Send text to API", style: {
                            marginTop: 8,
                            padding: '0.5rem 1rem',
                            backgroundColor: loading ? '#999' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s',
                        }, onMouseEnter: (e) => !loading && (e.currentTarget.style.backgroundColor = '#0056b3'), onMouseLeave: (e) => !loading && (e.currentTarget.style.backgroundColor = '#007bff'), children: loading ? 'Loading...' : 'Send Text' })] }), responseMessage && (_jsxs("div", { style: { marginTop: 20 }, children: [_jsx("h3", { children: "API Response" }), _jsx("p", { children: responseMessage })] })), showInstallButton && (_jsx("button", { onClick: handleInstallClick, style: {
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
                }, children: "Install App" }))] }));
}
export default App;
