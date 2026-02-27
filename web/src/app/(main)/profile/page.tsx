"use client";

import { motion } from 'framer-motion';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LanguageSelector from '@/components/profile/LanguageSelector';
import SettingsPanel from '@/components/profile/SettingsPanel';
import { LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { signOut } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfilePage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        console.log('Logout button clicked');

        const confirmed = window.confirm('Are you sure you want to logout?');
        console.log('Confirmation result:', confirmed);

        if (confirmed) {
            setIsLoggingOut(true);
            console.log('Starting logout process...');

            try {
                await signOut();
                console.log('Logout successful, redirecting to login...');
                router.push('/login');
            } catch (error) {
                console.error('Logout error:', error);
                alert('Failed to logout. Please try again.');
                setIsLoggingOut(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white p-4 md:p-8 pb-20 md:pb-8">
            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Header */}
                <ProfileHeader />



                {/* Main Content */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Language Selector */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <LanguageSelector />
                    </motion.div>

                    {/* Settings Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <SettingsPanel />
                    </motion.div>

                    {/* Logout Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogOut className="w-5 h-5" />
                        {isLoggingOut ? 'Logging out...' : t('action.logout')}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
