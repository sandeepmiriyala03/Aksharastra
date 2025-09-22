import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root container element from the HTML
const container = document.getElementById('app');

if (!container) {
  throw new Error('Failed to find the root element with id "app"');
}

// Create React root
const root = ReactDOM.createRoot(container);

// Render the React app wrapped with Suspense and StrictMode
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);
