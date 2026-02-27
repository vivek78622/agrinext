"use client";

import Card from "../ui/Card";
import { Droplets } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSmartFarm } from "@/hooks/useSmartFarm";
import clsx from "clsx";

export default function SoilMonitor() {
    const { t } = useLanguage();
    const { data, loading, connected } = useSmartFarm();

    const value = data?.soil ?? 0;
    const circumference = 2 * Math.PI * 80; // r=80
    const offset = circumference - (value / 100) * circumference;

    const label =
        value < 40 ? "DRY" :
            value < 65 ? "LOW" :
                value < 85 ? "OPTIMAL" : "WET";

    const labelColor =
        value < 40 ? "text-accent-red" :
            value < 65 ? "text-accent-yellow" :
                value < 85 ? "text-accent-blue" : "text-accent-green";

    return (
        <Card
            title={t('dash.soil_monitor')}
            className="h-full"
            action={<Droplets className="w-5 h-5 text-accent-blue" />}
        >
            <div className="flex flex-col items-center justify-center h-full mt-2">
                {loading ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-gray-400">Connecting to sensor...</span>
                    </div>
                ) : !connected ? (
                    <div className="flex flex-col items-center gap-2 opacity-60">
                        <Droplets className="w-10 h-10 text-gray-500" />
                        <span className="text-sm text-gray-400">ESP32 Offline</span>
                        <span className="text-xs text-gray-500">Waiting for data…</span>
                    </div>
                ) : (
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        {/* Circular Gauge */}
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Track */}
                            <circle
                                cx="96" cy="96" r="80"
                                stroke="currentColor" strokeWidth="12"
                                fill="transparent" className="text-white/5"
                            />
                            {/* Progress */}
                            <circle
                                cx="96" cy="96" r="80"
                                stroke="currentColor" strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                className={clsx(
                                    "transition-all duration-1000",
                                    value < 40 ? "text-accent-red drop-shadow-[0_0_20px_rgba(255,82,82,0.6)]" :
                                        value < 85 ? "text-accent-blue drop-shadow-[0_0_20px_rgba(66,165,245,0.6)]" :
                                            "text-accent-green drop-shadow-[0_0_20px_rgba(0,230,118,0.6)]"
                                )}
                                strokeLinecap="round"
                            />
                        </svg>
                        {/* Center Text */}
                        <div className="absolute flex flex-col items-center">
                            <span className="text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                                {Math.round(value)}%
                            </span>
                            <span className={clsx("text-sm font-bold uppercase mt-2 tracking-widest", labelColor)}>
                                {label}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
