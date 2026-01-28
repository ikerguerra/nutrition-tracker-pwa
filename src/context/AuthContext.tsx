import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { LoginRequest, RegisterRequest } from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    user: any | null;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const decodeToken = (token: string) => {
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const base64Url = parts[1];
            if (!base64Url) return null;
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const token = authService.getCurrentToken();
        if (token) {
            setIsAuthenticated(true);
            setUser(decodeToken(token));
        }
        setLoading(false);
    }, []);

    const login = async (data: LoginRequest) => {
        const res = await authService.login(data);
        setIsAuthenticated(true);
        setUser(decodeToken(res.accessToken));
    };

    const register = async (data: RegisterRequest) => {
        const res = await authService.register(data);
        setIsAuthenticated(true);
        setUser(decodeToken(res.accessToken));
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
