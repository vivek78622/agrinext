"use client";

import React from 'react';
import ControlHeader from '@/components/control/ControlHeader';
import MainControlCard from '@/components/control/MainControlCard';
import QuickActions from '@/components/control/QuickActions';
import AnalyticsPanel from '@/components/control/AnalyticsPanel';
import CropSelector from '@/components/control/CropSelector';
import PumpCard from '@/components/control/PumpCard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ControlPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen p-4 md:p-8 pb-20 md:pb-8 relative overflow-x-hidden">
            {/* Global Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 mt-6">

                {/* Header - Full Width */}
                <div className="lg:col-span-12">
                    <ControlHeader />
                </div>

                {/* Main Control Unit - Left Large Block */}
                <div className="lg:col-span-7 xl:col-span-8 min-h-[500px]">
                    <MainControlCard />
                </div>

                {/* Right Side Panel - Quick Actions & Analytics */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                    {/* Pump Status Card */}
                    <PumpCard zone="Zone A" label="Pump" />

                    {/* Crop Selector Panel */}
                    <div className="p-6 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 rounded-full bg-accent-green" />
                            Crop Management
                        </h3>
                        <CropSelector />
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="p-6 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 rounded-full bg-emerald-500" />
                            {t('control.mode')}
                        </h3>
                        <QuickActions />
                    </div>

                    {/* Analytics Panel */}
                    <div className="p-6 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl flex-grow">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 rounded-full bg-blue-500" />
                            {t('control.live_metrics')}
                        </h3>
                        <AnalyticsPanel />
                    </div>
                </div>

            </div>

        </div>
    );
}
