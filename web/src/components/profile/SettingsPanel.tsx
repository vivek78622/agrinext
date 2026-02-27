"use client";

import { useState } from 'react';
import { Moon, Sun, Bell, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPanel() {
    const { t } = useLanguage();
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">{t('section.preferences')}</h2>

            <div className="space-y-4">
                {/* Theme Setting */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? (
                                <Moon className="w-5 h-5 text-accent-green" />
                            ) : (
                                <Sun className="w-5 h-5 text-accent-green" />
                            )}
                            <div>
                                <h3 className="text-white font-medium">{t('setting.theme')}</h3>
                                <p className="text-xs text-gray-400">{t('setting.theme.desc')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={`relative w-14 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-accent-green' : 'bg-gray-600'
                                }`}
                        >
                            <motion.div
                                layout
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg ${theme === 'dark' ? 'left-1' : 'left-8'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Notifications Setting */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            {notifications ? (
                                <Bell className="w-5 h-5 text-accent-green" />
                            ) : (
                                <BellOff className="w-5 h-5 text-gray-500" />
                            )}
                            <div>
                                <h3 className="text-white font-medium">{t('setting.notifications')}</h3>
                                <p className="text-xs text-gray-400">{t('setting.notifications.desc')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${notifications ? 'bg-accent-green' : 'bg-gray-600'
                                }`}
                        >
                            <motion.div
                                layout
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg ${notifications ? 'left-8' : 'left-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
