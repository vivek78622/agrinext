'use client';

import React, { useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <main className="min-h-screen w-full flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm">Loading...</p>
                </div>
            </main>
        );
    }

    // Don't render login form if user is already authenticated
    if (user) {
        return null;
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/login_background.png"
                    alt="Smart Farm Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full px-4 flex flex-col items-center gap-8">
                {/* Logo or Brand Element */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-green)] to-[#00C853] flex items-center justify-center shadow-[0_0_30px_rgba(0,230,118,0.4)]">
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-black"
                        >
                            <path d="M12 22v-8" />
                            <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
                            <path d="M15 7a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4 4Z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold tracking-tight text-white leading-none">
                            Agri<span className="text-[var(--accent-green)]">Tech</span>
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                            Farm Intelligence
                        </span>
                    </div>
                </div>

                <LoginForm />

                <footer className="text-center text-xs text-gray-500 mt-8">
                    <p>© 2024 AgriTech Intelligence. All rights reserved.</p>
                    <div className="flex gap-4 justify-center mt-2">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </footer>
            </div>
        </main>
    );
}
