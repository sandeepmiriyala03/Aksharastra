import React, { useEffect, useState } from 'react';

type ApiResponse = {
  message: string;
};

function App() {
  const [apiMessage, setApiMessage] = useState<string>('Loading...');

  useEffect(() => {
    fetch('https://aksharastra-oncm.onrender.com/')  // Replace with your backend URL
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: ApiResponse = await res.json();
        setApiMessage(data.message);
      })
      .catch((err) => {
        setApiMessage('Error: ' + err.message);
      });
  }, []);

  return (
    <div className="App" style={{ padding: '1rem' }}>
      <h1>Welcome to Aksharastra Frontend!</h1>
      <p>{apiMessage}</p>
    </div>
  );
}

export default App;
