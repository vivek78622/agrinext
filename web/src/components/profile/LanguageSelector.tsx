"use client";

import { Globe, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const languages = [
    { code: 'en' as const, name: 'English', nativeName: 'English' },
    { code: 'hi' as const, name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr' as const, name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta' as const, name: 'Tamil', nativeName: 'தமிழ்' },
];

export default function LanguageSelector() {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent-green/10">
                    <Globe className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                    <h3 className="text-white font-semibold">{t('setting.language')}</h3>
                    <p className="text-xs text-gray-400">{t('setting.language.desc')}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                    <motion.button
                        key={lang.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setLanguage(lang.code)}
                        className={`relative p-4 rounded-xl border transition-all ${language === lang.code
                                ? 'border-accent-green bg-accent-green/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="text-sm font-medium text-white">{lang.name}</div>
                                <div className="text-xs text-gray-400">{lang.nativeName}</div>
                            </div>
                            {language === lang.code && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center"
                                >
                                    <Check className="w-4 h-4 text-white" />
                                </motion.div>
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
