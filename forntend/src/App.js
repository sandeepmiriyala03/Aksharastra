import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
function App() {
    const [apiMessage, setApiMessage] = useState('Loading...');
    useEffect(() => {
        fetch('https://aksharastra-oncm.onrender.com/') // Replace with your backend URL
            .then(async (res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setApiMessage(data.message);
        })
            .catch((err) => {
            setApiMessage('Error: ' + err.message);
        });
    }, []);
    return (_jsxs("div", { className: "App", style: { padding: '1rem' }, children: [_jsx("h1", { children: "Welcome to Aksharastra Frontend!" }), _jsx("p", { children: apiMessage })] }));
}
export default App;
