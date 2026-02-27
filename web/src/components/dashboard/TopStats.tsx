"use client";

import { Thermometer, Droplets, Waves, Zap } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSmartFarm } from "@/hooks/useSmartFarm";

export default function TopStats() {
    const { t } = useLanguage();
    const { data, loading, connected } = useSmartFarm();

    const stats = [
        {
            label: t('dash.soil_moisture'),
            value: loading ? "…" : connected ? `${Math.round(data?.soil ?? 0)}%` : "–",
            icon: Droplets,
            color: "text-accent-blue",
            bg: "bg-accent-blue/10",
            border: "border-accent-blue/20",
            live: true,
        },
        {
            label: t('dash.tank_level'),
            value: loading ? "…" : connected ? `${Math.round(data?.tank ?? 0)}%` : "–",
            icon: Waves,
            color: "text-accent-blue",
            bg: "bg-accent-blue/10",
            border: "border-accent-blue/20",
            live: true,
        },
        {
            label: "Pump Status",
            value: loading ? "…" : connected ? (data?.pump ? "ON" : "OFF") : "–",
            icon: Zap,
            color: connected && data?.pump ? "text-accent-green" : "text-white",
            bg: connected && data?.pump ? "bg-accent-green/10" : "bg-white/10",
            border: connected && data?.pump ? "border-accent-green/20" : "border-white/20",
            live: true,
        },
    ];

    return (
        <div className="relative overflow-hidden rounded-3xl mb-8 group">
            {/* Hero Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop")',
                }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

            <div className="relative z-10 p-8">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{t('dash.overview')}</h2>
                        <p className="text-gray-300 max-w-xl">{t('dash.overview.desc')}</p>
                    </div>
                    {/* Live indicator */}
                    <div className={clsx(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm",
                        connected
                            ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                            : "border-white/10 bg-white/5 text-gray-400"
                    )}>
                        <span className={clsx(
                            "w-2 h-2 rounded-full",
                            connected ? "bg-accent-green animate-pulse" : "bg-gray-500"
                        )} />
                        {loading ? "Connecting…" : connected ? "ESP32 Live" : "ESP32 Offline"}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "relative overflow-hidden rounded-2xl p-5 backdrop-blur-md border transition-all duration-300 hover:-translate-y-1",
                                "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={clsx("p-3 rounded-xl bg-black/20 backdrop-blur-sm", stat.color)}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                    <h3 className={clsx("text-2xl font-bold mt-0.5", stat.color)}>
                                        {stat.value}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
