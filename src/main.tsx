import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { clearBrowserCacheOnLoad } from './utils/cacheUtils.ts';

// Executa a limpeza do cache do navegador ao carregar/acessar o site
clearBrowserCacheOnLoad();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
