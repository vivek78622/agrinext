import React from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ControlHeader() {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl shadow-black/50 group"
        >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            {/* Title Section */}
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {t('control.title')}
                    </h1>
                </div>
                <p className="text-white/50 text-sm md:text-base flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('control.system_operational')}
                    <span className="text-white/20">|</span>
                    <span className="text-emerald-400 font-medium">{t('control.zone')} A</span>
                </p>
            </div>
        </motion.div>
    );
}
