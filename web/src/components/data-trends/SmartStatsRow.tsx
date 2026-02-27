import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Thermometer, Cylinder, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SmartStatsRow() {
    const { t } = useLanguage();

    const stats = [
        {
            id: 1,
            label: t('trends.avg_moisture'),
            value: '62%',
            change: `+5% ${t('trends.this_week')}`,
            icon: Droplets,
            color: '#00E676',
            glow: 'rgba(0, 230, 118, 0.5)',
        },
        {
            id: 2,
            label: t('trends.avg_temp'),
            value: '27°C',
            change: `+2°C ${t('trends.this_week')}`,
            icon: Thermometer,
            color: '#FFA726',
            glow: 'rgba(255, 167, 38, 0.5)',
        },
        {
            id: 3,
            label: t('trends.water_used'),
            value: '450L',
            change: `−10L ${t('trends.this_week')}`,
            icon: Cylinder,
            color: '#29B6F6',
            glow: 'rgba(41, 182, 246, 0.5)',
        },

    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] backdrop-blur-md p-5 md:p-6 group hover:border-[rgba(255,255,255,0.2)] transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-xs md:text-sm font-medium mb-1">{stat.label}</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</h3>
                                <p className={`text-[10px] md:text-xs font-medium ${stat.change.includes('+') || stat.change === t('dash.optimal') ? 'text-green-400' : 'text-blue-400'}`}>
                                    {stat.change}
                                </p>
                            </div>

                            <div
                                className="p-2.5 md:p-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] group-hover:scale-110 transition-transform duration-300"
                                style={{ boxShadow: `0 0 15px ${stat.glow}` }}
                            >
                                <Icon size={20} color={stat.color} className="md:w-6 md:h-6" />
                            </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div
                            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                            style={{ backgroundColor: stat.color }}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}
