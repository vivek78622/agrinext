"use client";

import React from 'react';
import { Sprout, TrendingUp, TrendingDown, Droplets, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCrop } from '@/contexts/CropContext';
import { useSmartFarm } from '@/hooks/useSmartFarm';
import clsx from 'clsx';

// Derive soil health status from live value vs crop thresholds
function getSoilHealth(soil: number, min: number, max: number, dryRun: boolean) {
    if (dryRun) return { label: 'Tank Low', color: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/20', icon: AlertTriangle, pct: 0 };
    if (soil < min - 15) return { label: 'Very Dry', color: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/20', icon: TrendingDown, pct: 10 };
    if (soil < min) return { label: 'Dry', color: 'text-accent-yellow', bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/20', icon: TrendingDown, pct: 40 };
    if (soil <= max) return { label: 'Optimal', color: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/20', icon: TrendingUp, pct: 92 };
    if (soil <= max + 10) return { label: 'Wet', color: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'border-accent-blue/20', icon: Droplets, pct: 70 };
    return { label: 'Waterlog', color: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/20', icon: AlertTriangle, pct: 20 };
}

export default function CropHealth() {
    const { t } = useLanguage();
    const { selectedCrop } = useCrop();
    const { data, loading, connected } = useSmartFarm();

    const soil = data?.soil ?? 0;
    const dryRun = (data as any)?.dryRunActive === true;
    const health = getSoilHealth(soil, selectedCrop.min, selectedCrop.max, dryRun);
    const HealthIcon = health.icon;

    // How full is soil within the crop's optimal range (0–100 display %)
    const rangeSpan = selectedCrop.max - selectedCrop.min;
    const soilInRange = Math.round(
        Math.min(100, Math.max(0, ((soil - selectedCrop.min) / rangeSpan) * 100))
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors h-full"
        >
            {/* Hover glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-accent-green/10 blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative h-full flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-accent-green/10 border border-accent-green/20">
                            <Sprout className="w-5 h-5 text-accent-green" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{t('dash.crop_health')}</h3>
                    </div>
                    {/* Live dot */}
                    <div className={clsx(
                        "flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium",
                        connected ? "text-accent-green bg-accent-green/10" : "text-gray-500 bg-white/5"
                    )}>
                        <span className={clsx("w-1.5 h-1.5 rounded-full", connected ? "bg-accent-green animate-pulse" : "bg-gray-500")} />
                        {connected ? "Live" : "Offline"}
                    </div>
                </div>

                {/* Current Crop chip */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-400">{t('dash.current_crop')}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-green/20 text-accent-green border border-accent-green/20">
                            {t('dash.active')}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{selectedCrop.icon}</span>
                            <h3 className="text-2xl font-bold text-accent-green">{selectedCrop.name}</h3>
                        </div>
                        <span className="text-xs text-gray-400">
                            {selectedCrop.min}%–{selectedCrop.max}%
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Soil in range */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-accent-green" />
                            <span className="text-xs text-gray-400">Soil Level</span>
                        </div>
                        <p className="text-lg font-bold text-white">
                            {loading ? "…" : connected ? `${Math.round(soil)}%` : "—"}
                        </p>
                    </div>

                    {/* Health status */}
                    <div className={clsx("p-3 rounded-xl border", health.bg, health.border)}>
                        <div className="flex items-center gap-2 mb-1">
                            <HealthIcon className={clsx("w-4 h-4", health.color)} />
                            <span className="text-xs text-gray-400">{t('dash.health')}</span>
                        </div>
                        <p className={clsx("text-lg font-bold", health.color)}>
                            {loading ? "…" : connected ? health.label : "—"}
                        </p>
                    </div>
                </div>

                {/* Range progress bar */}
                {connected && (
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Min {selectedCrop.min}%</span>
                            <span className={clsx("font-semibold", health.color)}>{health.label}</span>
                            <span>Max {selectedCrop.max}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={clsx("h-full rounded-full transition-all duration-1000", {
                                    "bg-accent-red": health.label === "Very Dry" || health.label === "Tank Low" || health.label === "Waterlog",
                                    "bg-accent-yellow": health.label === "Dry",
                                    "bg-accent-green": health.label === "Optimal",
                                    "bg-accent-blue": health.label === "Wet",
                                })}
                                style={{ width: `${soilInRange}%` }}
                            />
                        </div>

                        {/* Dry-run notice */}
                        {dryRun && (
                            <p className="text-xs text-accent-red font-semibold mt-2 flex items-center gap-1 animate-pulse">
                                <AlertTriangle className="w-3 h-3" />
                                Tank &lt; 20% — Dry-run protection active
                            </p>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
