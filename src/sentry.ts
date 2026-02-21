import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for frontend error tracking and performance monitoring.
 *
 * DSN is read from the VITE_SENTRY_DSN environment variable.
 * When the variable is empty or undefined (e.g. in local dev), Sentry is
 * effectively disabled — no data is sent anywhere.
 *
 * To enable:
 *   1. Create a project in https://sentry.io
 *   2. Copy the DSN from Project Settings → Client Keys
 *   3. Add VITE_SENTRY_DSN=<dsn> to .env.production (never commit!)
 *   4. For Vite builds the variable is inlined at build time.
 */
export function initSentry(): void {
    const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

    // If no DSN is configured, skip initialization entirely.
    if (!dsn) {
        if (import.meta.env.DEV) {
            console.info('[Sentry] DSN not configured — error tracking disabled in dev.');
        }
        return;
    }

    Sentry.init({
        dsn,
        environment: import.meta.env.MODE,                // 'development' | 'production'
        release: import.meta.env.VITE_APP_VERSION as string | undefined,

        // Capture 10 % of transactions for performance monitoring in production.
        tracesSampleRate: import.meta.env.PROD ? 0.1 : 0.0,

        // Session Replay: record 5 % of sessions, 100 % of sessions with an error.
        replaysSessionSampleRate: 0.05,
        replaysOnErrorSampleRate: 1.0,

        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
                maskAllText: true,          // Mask PII in replays
                blockAllMedia: false,
            }),
        ],

        // Do not send errors in local development unless a DSN is explicitly set.
        beforeSend(event) {
            if (import.meta.env.DEV) {
                console.warn('[Sentry] Event captured (not sent in dev):', event);
                return null;
            }
            return event;
        },
    });
}
