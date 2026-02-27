"use client";

import { Sprout, Map, Wheat, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FarmDetails() {
    const { t } = useLanguage();

    const farmData = [
        {
            icon: Map,
            label: t('farm.name'),
            value: 'Green Valley Farm',
            color: 'text-emerald-400',
        },
        {
            icon: Sprout,
            label: t('farm.size'),
            value: '12.5 hectares',
            color: 'text-green-400',
        },
        {
            icon: Wheat,
            label: t('farm.crops'),
            value: 'Rice, Wheat, Sugarcane',
            color: 'text-amber-400',
        },
        {
            icon: Mountain,
            label: t('farm.soil'),
            value: 'Loamy Clay',
            color: 'text-orange-400',
        },
    ];

    return (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
                <Sprout className="w-5 h-5 text-accent-green" />
                <h3 className="text-lg font-semibold text-white">{t('section.farm')}</h3>
            </div>

            <div className="space-y-4">
                {farmData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                        <div className="p-2 rounded-lg bg-white/5">
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                            <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                            <div className="text-sm font-medium text-white">{item.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 px-4 py-3 rounded-xl bg-accent-green/10 hover:bg-accent-green/20 border border-accent-green/20 text-accent-green text-sm font-medium transition-all"
            >
                Edit Farm Details
            </motion.button>
        </div>
    );
}
