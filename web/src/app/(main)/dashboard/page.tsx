"use client";

import TopStats from "@/components/dashboard/TopStats";
import SoilMonitor from "@/components/dashboard/SoilMonitor";
import CropHealth from "@/components/dashboard/CropHealth";
import TankLevel from "@/components/dashboard/TankLevel";
import SmartValve from "@/components/dashboard/SmartValve";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import IrrigationLog from "@/components/dashboard/IrrigationLog";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
    return (
        <div className="p-4 md:p-8 pb-20 md:pb-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8">
            {/* Top Stats Row */}
            <TopStats />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column (3 cols wide) */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[320px]">
                        <SoilMonitor />
                        <CropHealth />
                        <TankLevel />
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[280px]">
                        <SmartValve />
                        <WeatherWidget />
                        <IrrigationLog />
                    </div>
                </div>

                {/* Right Column (1 col wide) */}
                <div className="lg:col-span-1 h-full">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}
