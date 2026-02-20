import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { FoodsProvider } from '@context/FoodsContext';
import ProtectedRoute from '@components/layout/ProtectedRoute';
import LoginPage from '@features/auth/LoginPage';
import RegisterPage from '@features/auth/RegisterPage';
import AuthCallbackPage from '@features/auth/AuthCallbackPage';
import DashboardPage from '@features/dashboard/DashboardPage';
import ProfilePage from '@features/profile/ProfilePage';
import TemplatesPage from '@features/mealTemplates/TemplatesPage';
import RecipesPage from '@features/recipes/RecipesPage';
import NutritionBreakdownPage from '@features/stats/NutritionBreakdownPage';
import StatsPage from '@features/stats/StatsPage';
import { CalendarView } from '@features/calendar/CalendarView';
import { AchievementsPage } from '@features/achievements/AchievementsPage';
import { Toaster } from 'react-hot-toast';
import '@styles/global.css';

import { ThemeProvider } from '@components/common/ThemeProvider';

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
            <AuthProvider>
                <FoodsProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/auth/callback" element={<AuthCallbackPage />} />
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
                            <Route
                                path="/calendar"
                                element={
                                    <ProtectedRoute>
                                        <CalendarView />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/templates"
                                element={
                                    <ProtectedRoute>
                                        <TemplatesPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/recipes"
                                element={
                                    <ProtectedRoute>
                                        <RecipesPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/nutrition-breakdown"
                                element={
                                    <ProtectedRoute>
                                        <NutritionBreakdownPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/stats"
                                element={
                                    <ProtectedRoute>
                                        <StatsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/achievements"
                                element={
                                    <ProtectedRoute>
                                        <AchievementsPage />
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
                            }}
                        />
                    </BrowserRouter>
                </FoodsProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
