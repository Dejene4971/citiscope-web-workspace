import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1 style={{ color: '#1976d2' }}>🏙️ CitiScope Admin Dashboard</h1>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        Project setup successful! 🚀
      </p>
      <p>Ready for development</p>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}