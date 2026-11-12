import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Marca el bio link como "inicio" para que las páginas estáticas sepan cuántos pasos volver (public/nav-back.js)
try { sessionStorage.setItem('bl_cur', '0'); } catch {}

createRoot(document.getElementById('root')!).render(<App />);
