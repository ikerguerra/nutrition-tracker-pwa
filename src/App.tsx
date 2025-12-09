import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { FoodsProvider } from '@context/FoodsContext';
import ProtectedRoute from '@components/layout/ProtectedRoute';
import LoginPage from '@features/auth/LoginPage';
import RegisterPage from '@features/auth/RegisterPage';
import DashboardPage from '@features/dashboard/DashboardPage';
import ProfilePage from '@features/profile/ProfilePage';
import { Toaster } from 'react-hot-toast';
import '@styles/global.css';

function App() {
    return (
        <AuthProvider>
            <FoodsProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>

                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: 'var(--color-bg-elevated)',
                                color: 'var(--color-text-primary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                            },
                            success: {
                                iconTheme: {
                                    primary: 'var(--color-success)',
                                    secondary: 'var(--color-bg-elevated)',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: 'var(--color-error)',
                                    secondary: 'var(--color-bg-elevated)',
                                },
                            },
                        }}
                    />
                </BrowserRouter>
            </FoodsProvider>
        </AuthProvider>
    );
}

export default App;
