import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import i18n from '../i18n';

// Re-initialize i18n with in-memory resources so tests don't rely on
// i18next-http-backend (which tries to load JSON files via HTTP and times out in CI).
// When resources are provided, i18next bypasses the backend entirely.
i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    resources: {
        en: {
            translation: {
                common: {
                    today: 'Today',
                    yesterday: 'Yesterday',
                    tomorrow: 'Tomorrow',
                    loading: 'Loading...',
                    error: 'An error occurred',
                    save: 'Save',
                    cancel: 'Cancel',
                    delete: 'Delete',
                    edit: 'Edit',
                    add: 'Add',
                    close: 'Close',
                    confirm: 'Confirm',
                    back: 'Back',
                    next: 'Next',
                    prev: 'Prev',
                    search: 'Search...',
                    noData: 'No data available',
                    selected: 'Selected',
                    previousDay: 'Previous day',
                    nextDay: 'Next day',
                },
            },
        },
    },
    interpolation: { escapeValue: false },
    initAsync: false,
});

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
