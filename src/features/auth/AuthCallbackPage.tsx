import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    const processed = React.useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const accessToken = searchParams.get('token');
        const refreshToken = searchParams.get('refresh');

        if (accessToken && refreshToken) {
            loginWithToken(accessToken, refreshToken);
            navigate('/', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [searchParams, loginWithToken, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Autenticando...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
