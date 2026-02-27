import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AnalyticsRow() {
    const { t } = useLanguage();

    const logs = [
        { time: '10:42 AM', param: t('trends.moisture'), change: '+2%', status: 'up' },
        { time: '10:15 AM', param: t('trends.water_lvl'), change: '-5L', status: 'down' },
        { time: '09:30 AM', param: t('trends.temp'), change: '+1.5°C', status: 'up' },
        { time: '08:45 AM', param: t('trends.humidity'), change: '-3%', status: 'down' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Logs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 p-6 rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Clock size={18} className="text-gray-400" />
                        {t('trends.recent_logs')}
                    </h3>
                    <button className="text-xs text-[#00E676] hover:underline">{t('trends.view_all')}</button>
                </div>

                <div className="space-y-4">
                    {logs.map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-transparent hover:border-[rgba(255,255,255,0.05)]">
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-500 font-mono">{log.time}</span>
                                <span className="text-sm text-gray-200 font-medium">{log.param}</span>
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-semibold ${log.status === 'up' ? 'text-[#00E676]' : 'text-[#29B6F6]'}`}>
                                {log.change}
                                {log.status === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Forecast Mini Graph */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(0,0,0,0.2)]"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Activity size={18} className="text-[#FFA726]" />
                    <h3 className="text-lg font-semibold text-white">{t('trends.forecast')}</h3>
                </div>

                <div className="h-full flex flex-col justify-between min-h-[180px]">
                    <div className="flex justify-between items-end h-32 gap-2 px-2">
                        {[40, 65, 50, 80, 60].map((h, i) => (
                            <div key={i} className="w-full bg-[rgba(255,255,255,0.05)] rounded-t-lg relative group overflow-hidden">
                                <div
                                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#00E676] to-transparent opacity-50 transition-all duration-500 group-hover:opacity-80"
                                    style={{ height: `${h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
