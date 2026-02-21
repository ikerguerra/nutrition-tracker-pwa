import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.tsx'
import './i18n';
import { initSentry } from './sentry';

initSentry();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Sentry.ErrorBoundary fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Ha ocurrido un error inesperado. Por favor, recarga la página.</div>}>
            <App />
        </Sentry.ErrorBoundary>
    </StrictMode>,
)
