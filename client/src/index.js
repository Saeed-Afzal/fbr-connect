// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Ant Design theme import
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4CAF50', // Primary color
          borderRadius: 8,         // Rounded corners
          fontFamily: 'Inter, sans-serif', // Modern font
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();
