import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthCallbackPage from './AuthCallbackPage';
import { useAuth } from '@context/AuthContext';
import { vi } from 'vitest';

// Mock AuthContext
vi.mock('@context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('AuthCallbackPage', () => {
    const mockLoginWithToken = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            loginWithToken: mockLoginWithToken,
        });
    });

    it('should show loading spinner initially', () => {
        render(
            <MemoryRouter initialEntries={['/auth/callback?token=abc&refresh=def']}>
                <AuthCallbackPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Autenticando...')).toBeInTheDocument();
    });

    it('should call loginWithToken and navigate to home when tokens are present', async () => {
        render(
            <MemoryRouter initialEntries={['/auth/callback?token=access123&refresh=refresh123']}>
                <AuthCallbackPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockLoginWithToken).toHaveBeenCalledWith('access123', 'refresh123');
            expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
        });
    });

    it('should navigate to login when tokens are missing', async () => {
        render(
            <MemoryRouter initialEntries={['/auth/callback']}>
                <AuthCallbackPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
            expect(mockLoginWithToken).not.toHaveBeenCalled();
        });
    });
});
