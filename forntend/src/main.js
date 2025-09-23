import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import App from './App';
const container = document.getElementById('root');
if (!container)
    throw new Error('Root container not found');
const root = ReactDOM.createRoot(container);
root.render(_jsx(App, {}));
// Register the PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
            console.log('Service Worker registered:', registration);
        })
            .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
    });
}
