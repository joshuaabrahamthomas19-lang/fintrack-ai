import React from 'react';
import { createRoot } from 'react-dom/client';
// FIX: Using relative path for sibling component.
import App from './App';
import { AppProvider } from '@/components/ThemeContext';
import '@/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);