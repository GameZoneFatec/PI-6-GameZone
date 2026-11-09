import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import MainProvider from '@providers/Main.provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MainProvider>
        <App />
      </MainProvider>
    </BrowserRouter>
  </StrictMode>
);
