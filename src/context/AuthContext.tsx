import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { LoginRequest, RegisterRequest } from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = authService.getCurrentToken();
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (data: LoginRequest) => {
        await authService.login(data);
        setIsAuthenticated(true);
    };

    const register = async (data: RegisterRequest) => {
        await authService.register(data);
        setIsAuthenticated(true);
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, register, logout }}>
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
