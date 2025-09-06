import './index.css';

import { createRoot } from 'react-dom/client';
import { App } from './App';
import ApplicationContextProvider from './context/context';

createRoot(document.getElementById('root')!).render(
  <ApplicationContextProvider>
    <App />
  </ApplicationContextProvider>
);
