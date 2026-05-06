import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/una-aplicacin-web/index.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
