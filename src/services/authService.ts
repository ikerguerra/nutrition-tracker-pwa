import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'}/auth`;

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
    if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
};

const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
    if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

const getCurrentToken = () => {
    return localStorage.getItem('accessToken');
};

const authService = {
    login,
    register,
    logout,
    getCurrentToken,
};

export default authService;
