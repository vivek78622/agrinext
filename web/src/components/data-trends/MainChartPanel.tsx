import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ScriptableContext
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Download, Calendar, Droplets, Thermometer, CloudRain, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export default function MainChartPanel() {
    const [activeTab, setActiveTab] = useState('moisture');
    const [timeRange, setTimeRange] = useState('7d');
    const { t } = useLanguage();

    const tabs = [
        { id: 'moisture', label: t('trends.moisture'), icon: Droplets, color: '#00E676' },
        { id: 'temp', label: t('trends.temp'), icon: Thermometer, color: '#FFA726' },
        { id: 'water', label: t('trends.water_lvl'), icon: Activity, color: '#AB47BC' },
    ];

    // Configuration based on active tab
    const getChartConfig = () => {
        switch (activeTab) {
            case 'moisture':
                return {
                    label: `${t('trends.moisture')} (%)`,
                    color: '#00E676',
                    gradientStart: 'rgba(0, 230, 118, 0.4)',
                    gradientEnd: 'rgba(0, 230, 118, 0.0)',
                    data: [55, 58, 62, 60, 65, 63, 68]
                };
            case 'temp':
                return {
                    label: `${t('trends.temp')} (°C)`,
                    color: '#FFA726',
                    gradientStart: 'rgba(255, 167, 38, 0.4)',
                    gradientEnd: 'rgba(255, 167, 38, 0.0)',
                    data: [24, 25, 27, 26, 28, 29, 27]
                };

            case 'water':
                return {
                    label: `${t('trends.water_lvl')} (L)`,
                    color: '#AB47BC',
                    gradientStart: 'rgba(171, 71, 188, 0.4)',
                    gradientEnd: 'rgba(171, 71, 188, 0.0)',
                    data: [800, 780, 750, 700, 650, 600, 450]
                };
            default:
                return {
                    label: 'Data',
                    color: '#ffffff',
                    gradientStart: 'rgba(255, 255, 255, 0.4)',
                    gradientEnd: 'rgba(255, 255, 255, 0.0)',
                    data: [10, 20, 30, 40, 50, 60, 70]
                };
        }
    };

    const config = getChartConfig();

    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: config.label,
                data: config.data,
                borderColor: config.color,
                backgroundColor: (context: ScriptableContext<'line'>) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, config.gradientStart);
                    gradient.addColorStop(1, config.gradientEnd);
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#121212',
                pointBorderColor: config.color,
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: config.color,
                pointHoverBorderColor: '#fff',
            },
            // Dashed line for previous period comparison (mock data)
            {
                label: 'Previous',
                data: config.data.map(d => d * 0.9),
                borderColor: 'rgba(255,255,255,0.1)',
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(18, 18, 18, 0.9)',
                titleColor: '#fff',
                bodyColor: '#ccc',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function (context: any) {
                        if (context.datasetIndex === 1) return ''; // Return empty string instead of null
                        return `${context.parsed.y} ${activeTab === 'temp' ? '°C' : activeTab === 'water' ? 'L' : '%'}`;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.03)',
                },
                ticks: {
                    color: '#666',
                    font: { size: 11 }
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.03)',
                },
                ticks: {
                    color: '#666',
                    font: { size: 11 }
                },
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false,
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full p-6 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[#121212] to-[#1E1E1E] shadow-2xl relative overflow-hidden flex flex-col"
        >
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent opacity-50"></div>

            {/* Header & Controls */}
            <div className="flex flex-col gap-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            {t('trends.title')}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">{t('trends.desc')}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="appearance-none bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-gray-300 text-xs rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.08)] transition-colors cursor-pointer"
                            >
                                <option value="24h">Last 24h</option>
                                <option value="7d">Last 7d</option>
                                <option value="30d">Last 30d</option>
                            </select>
                            <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={12} />
                        </div>

                        <button className="p-1.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-gray-300 rounded-lg transition-all">
                            <Download size={14} />
                        </button>
                    </div>
                </div>

                {/* Integrated Metric Tabs */}
                <div className="flex p-1 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)] w-full overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 min-w-[100px] ${isActive
                                    ? 'bg-[rgba(255,255,255,0.08)] text-white shadow-lg border border-[rgba(255,255,255,0.05)]'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-[rgba(255,255,255,0.02)]'
                                    }`}
                            >
                                <Icon size={16} color={isActive ? tab.color : 'currentColor'} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 w-full min-h-[300px]">
                <Line data={data} options={options} />
            </div>
        </motion.div>
    );
}
