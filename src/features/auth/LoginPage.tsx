import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight, Chrome } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError(t('auth.invalidCredentials'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="min-h-screen w-full flex bg-background selection:bg-primary/30">
            {/* Visual Panel - Hidden on mobile */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-zinc-900 border-r border-border/50">
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80"
                    alt="Healthy food bowl"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />

                {/* Abstract Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-primary/80 via-zinc-900/40 to-zinc-900/90" />

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col justify-between p-12 h-full w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 text-white"
                    >
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                            <Activity className="size-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Nutrition Tracker</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-md"
                    >
                        <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
                            {t('auth.loginHeroTitle')}
                        </h1>
                        <p className="text-zinc-300 text-lg font-medium leading-relaxed">
                            {t('auth.loginHeroDesc')}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Subtle spotlight effect for dark mode */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none hidden dark:block" />

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-sm space-y-8 relative z-10"
                >
                    <div className="space-y-2 text-center lg:text-left">
                        <div className="flex justify-center lg:hidden mb-6">
                            <div className="bg-primary/10 p-3 rounded-2xl">
                                <Activity className="size-8 text-primary" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            {t('auth.welcomeBack')}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {t('auth.enterCredentials')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-semibold text-foreground/80">
                                    {t('auth.email')}
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="name@example.com"
                                    className="h-11 px-4"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="font-semibold text-foreground/80">
                                        {t('auth.password')}
                                    </Label>
                                    <Link to="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                        {t('auth.forgotPassword')}
                                    </Link>
                                </div>
                                <Input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="h-11 px-4"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg text-center font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-semibold group"
                            loading={loading}
                        >
                            {t('auth.login')}
                            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/60" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-3 text-muted-foreground font-medium tracking-wider">
                                {t('auth.orContinueWith')}
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 font-medium bg-background hover:bg-accent hover:text-accent-foreground transition-all border-border/80"
                        onClick={handleGoogleLogin}
                    >
                        <Chrome className="mr-2 size-4 text-zinc-600 dark:text-zinc-400" />
                        {t('auth.continueWithGoogle')}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground pt-4">
                        {t('auth.dontHaveAccount')}{' '}
                        <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                            {t('auth.signUpToday')}
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
