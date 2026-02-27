"use client";

import React from 'react';
import { Power, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSmartFarm } from '@/hooks/useSmartFarm';
import { useCrop } from '@/contexts/CropContext';
import clsx from 'clsx';

export default function MainControlCard() {
    const { t } = useLanguage();
    const { data, loading, connected, authReady, sendCommand } = useSmartFarm();
    const { selectedCrop } = useCrop();

    const isOn = !!data?.pump;
    const mode = (data?.mode ?? 'AUTO').toUpperCase() as 'AUTO' | 'MANUAL';
    const isManual = mode === 'MANUAL';
    const dryRun = data?.dryRunActive === true;
    const soil = data?.soil ?? 0;
    const minSoil = data?.minSoil && data.minSoil > 0 ? data.minSoil : selectedCrop.min;
    const maxSoil = data?.maxSoil && data.maxSoil > 0 ? data.maxSoil : selectedCrop.max;

    // Pump button only works in MANUAL — auth must be ready
    const canToggle = authReady && isManual && !dryRun;

    const togglePump = async () => {
        if (!canToggle) return;
        await sendCommand(isOn ? 'pump_off' : 'pump_on');
    };

    // Status label shown inside the circle
    const statusLabel = loading ? '...'
        : !connected ? 'OFFLINE'
            : dryRun ? 'LOCKED'
                : isOn ? t('control.active')
                    : t('control.offline');

    const subLabel = loading ? 'Connecting…'
        : !connected ? 'Waiting for ESP32'
            : dryRun ? 'Tank < 20% — dry-run protection'
                : !isManual ? `AUTO — soil ${soil.toFixed(0)}% (${minSoil}–${maxSoil}%)`
                    : isOn ? t('control.system_running')
                        : t('control.tap_to_start');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-full min-h-[500px] rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col items-center justify-center overflow-hidden group"
        >
            {/* Ambient Background */}
            <div className={clsx(
                'absolute inset-0 transition-opacity duration-1000',
                isOn && !dryRun ? 'opacity-100' : 'opacity-30',
                'bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5'
            )} />
            <div className={clsx(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000',
                dryRun ? 'bg-red-500/15'
                    : isOn ? 'bg-emerald-500/20'
                        : 'bg-white/3'
            )} />

            {/* Top badges */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                {/* Connection */}
                {connected ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        field01 · Live
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 text-xs text-white/30">
                        <WifiOff className="w-3.5 h-3.5" /> Offline
                    </span>
                )}

                {/* Mode badge */}
                <span className={clsx(
                    'px-3 py-1 rounded-full text-xs font-bold border',
                    isManual
                        ? 'border-blue-400 text-blue-400 bg-blue-400/10'
                        : 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                )}>
                    {mode}
                </span>
            </div>

            {/* Main Circular Control */}
            <div className="relative z-10">
                <div className="absolute inset-0 rounded-full border border-white/5 scale-150" />
                <div className={clsx(
                    'absolute inset-0 rounded-full border border-dashed transition-all duration-1000',
                    isOn ? 'border-emerald-500/30 rotate-180 scale-125' : 'border-white/10 scale-110'
                )} />

                <motion.button
                    whileHover={{ scale: canToggle ? 1.05 : 1 }}
                    whileTap={{ scale: canToggle ? 0.95 : 1 }}
                    onClick={togglePump}
                    disabled={!canToggle}
                    title={!isManual ? 'Switch to MANUAL in the Control Mode panel first' : dryRun ? 'Pump locked — tank too low' : ''}
                    className={clsx(
                        'relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-500',
                        !canToggle ? 'cursor-not-allowed' : 'cursor-pointer',
                        isOn ? 'shadow-[0_0_50px_rgba(16,185,129,0.3)]' : dryRun ? 'shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'shadow-[0_0_30px_rgba(239,68,68,0.05)]'
                    )}
                >
                    {/* Glass surface */}
                    <div className={clsx(
                        'absolute inset-0 rounded-full backdrop-blur-md border transition-all duration-500',
                        isOn ? 'bg-emerald-500/10 border-emerald-500/30'
                            : dryRun ? 'bg-red-500/10 border-red-500/20'
                                : 'bg-white/5 border-white/10'
                    )} />

                    {/* Inner content */}
                    <div className="relative z-20 flex flex-col items-center gap-1 text-center px-4">
                        <div className={clsx(
                            'p-4 rounded-full mb-2 transition-all duration-500',
                            isOn ? 'bg-emerald-500 text-black shadow-[0_0_20px_#10B981]'
                                : dryRun ? 'bg-red-500/20 text-red-400'
                                    : 'bg-white/10 text-white/50'
                        )}>
                            <Power className="w-12 h-12" />
                        </div>

                        <span className={clsx(
                            'text-2xl font-bold tracking-wider transition-colors duration-300',
                            isOn ? 'text-white' : dryRun ? 'text-red-400' : 'text-white/40'
                        )}>
                            {statusLabel}
                        </span>

                        <span className={clsx(
                            'text-xs tracking-wide font-medium leading-tight',
                            isOn ? 'text-emerald-400' : dryRun ? 'text-red-400/70' : 'text-white/25'
                        )}>
                            {subLabel}
                        </span>
                    </div>

                    {/* Animated ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                        <circle
                            cx="128" cy="128" r="124"
                            stroke="currentColor" strokeWidth="2" fill="none"
                            className={clsx(
                                'transition-all duration-1000',
                                isOn ? 'text-emerald-500/50' : 'text-white/5'
                            )}
                            strokeDasharray="779"
                            strokeDashoffset={isOn ? '0' : '779'}
                        />
                    </svg>
                </motion.button>
            </div>

            {/* Bottom hint */}
            {!isManual && !loading && (
                <p className="absolute bottom-6 text-xs text-white/20 text-center z-10">
                    Switch to <span className="text-blue-400 font-semibold">MANUAL</span> in the panel on the right to control manually
                </p>
            )}
        </motion.div>
    );
}
