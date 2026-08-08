import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { JarvisProvider } from './state/JarvisContext';
import { AuthProvider } from './state/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <JarvisProvider>
        <App />
      </JarvisProvider>
    </AuthProvider>
  </React.StrictMode>
);
