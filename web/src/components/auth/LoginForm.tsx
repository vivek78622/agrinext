'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '@/services/auth';


type AuthMode = 'signin' | 'signup';

const LoginForm = () => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    });

    const toggleMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setErrors({ name: '', email: '', password: '' });
        setFormData({ name: '', email: '', password: '' });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', email: '', password: '' };

        if (mode === 'signup' && !formData.name) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (mode === 'signup') {
                await signUpWithEmail(formData.email, formData.password, formData.name);
                console.log('Signup successful');
            } else {
                await signInWithEmail(formData.email, formData.password);
                console.log('Login successful');
            }

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (error: any) {
            setErrors({
                ...errors,
                password: error.message || 'Authentication failed. Please try again.'
            });
            console.error('Auth error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);

        try {
            await signInWithGoogle();
            console.log('Google login successful');

            // Redirect to home page
            window.location.href = '/';
        } catch (error: any) {
            setErrors({
                ...errors,
                password: error.message || 'Google sign-in failed. Please try again.'
            });
            console.error('Google auth error:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent-green)]/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[var(--accent-blue)]/20 rounded-full blur-3xl" />

                <div className="relative z-10 space-y-8">
                    <div className="text-center space-y-2">
                        <motion.h1
                            key={mode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                        >
                            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                        </motion.h1>
                        <p className="text-gray-400 text-sm">
                            {mode === 'signin'
                                ? 'Enter your credentials to access your farm dashboard'
                                : 'Join the future of smart farming today'}
                        </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex p-1 bg-[rgba(255,255,255,0.05)] rounded-xl border border-[rgba(255,255,255,0.05)]">
                        <button
                            onClick={() => setMode('signin')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${mode === 'signin'
                                ? 'bg-[var(--accent-green)] text-black shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${mode === 'signup'
                                ? 'bg-[var(--accent-green)] text-black shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {mode === 'signup' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        placeholder="John Doe"
                                        icon={<User size={18} />}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        error={errors.name}
                                        className="mb-4"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="admin@agritech.com"
                                icon={<Mail size={18} />}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={errors.email}
                            />

                            <div className="space-y-2">
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<Lock size={18} />}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    error={errors.password}
                                />
                                {mode === 'signin' && (
                                    <div className="flex justify-end">
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-[var(--accent-green)] hover:text-[var(--accent-green)]/80 transition-colors"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                                rightIcon={!isLoading && <ArrowRight size={18} />}
                            >
                                {isLoading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#0A0A0A] px-2 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full"
                                onClick={handleGoogleLogin}
                                leftIcon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                }
                            >
                                Google
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default LoginForm;
