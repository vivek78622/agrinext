'use client';

import React from 'react';
import MainChartPanel from '@/components/data-trends/MainChartPanel';
import SmartStatsRow from '@/components/data-trends/SmartStatsRow';
import AnalyticsRow from '@/components/data-trends/AnalyticsRow';

export default function DataTrendsPage() {
    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white p-4 md:p-8 pb-20 md:pb-8">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* 1. Stats Row */}
                <SmartStatsRow />

                {/* 2. Main Content: Chart (Full Width) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-12 h-[500px] lg:h-[600px]">
                        <MainChartPanel />
                    </div>
                </div>

                {/* 3. Bottom Analytics */}
                <AnalyticsRow />
            </div>
        </div>
    );
}
