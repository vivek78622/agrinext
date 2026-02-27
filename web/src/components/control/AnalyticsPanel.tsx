import React from 'react';
import { Droplets, Thermometer, Wind } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AnalyticsPanel() {
    const { t } = useLanguage();

    return (
        <div className="w-full grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-white/40 uppercase tracking-wider mb-1">{t('trends.moisture')}</span>
                <span className="text-xl font-bold text-blue-400">62%</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-white/40 uppercase tracking-wider mb-1">{t('trends.temp')}</span>
                <span className="text-xl font-bold text-orange-400">24°C</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs text-white/40 uppercase tracking-wider mb-1">{t('trends.humidity')}</span>
                <span className="text-xl font-bold text-cyan-400">45%</span>
            </div>
        </div>
    );
}
