"use client";

import React from 'react';
import { Bot, Hand, AlertOctagon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSmartFarm } from '@/hooks/useSmartFarm';

export default function QuickActions() {
    const { t } = useLanguage();
    const { data, loading, authReady, sendCommand } = useSmartFarm();

    // Live mode from Firebase (what the ESP32 field node is actually in)
    const mode = (data?.mode ?? 'AUTO').toUpperCase() as 'AUTO' | 'MANUAL';
    const isManual = mode === 'MANUAL';
    const pumpOn = !!data?.pump;
    const connected = !!data; // has live data

    // Buttons work as long as auth is ready — no need for live ESP32
    const canAct = authReady && !loading;

    const handleSetAuto = async () => {
        if (mode === 'AUTO') return;          // already AUTO
        if (pumpOn) await sendCommand('pump_off');   // safety: turn off pump first
        await sendCommand('mode_auto');
    };

    const handleSetManual = async () => {
        if (mode === 'MANUAL') return;        // already MANUAL
        await sendCommand('mode_manual');
    };

    const handleEmergencyStop = async () => {
        await sendCommand('pump_off');
        await sendCommand('mode_auto');       // revert to AUTO after e-stop
    };

    return (
        <div className="w-full flex flex-col gap-6">

            {/* ── Mode Switcher ── */}
            <div className="relative p-1 rounded-2xl bg-black/40 border border-white/10 flex">
                {/* Animated background indicator */}
                <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`absolute inset-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-br
                        ${isManual
                            ? 'from-blue-500 to-blue-600 left-[50%]'
                            : 'from-emerald-500 to-emerald-600 left-1'}`}
                />

                {/* AUTO button */}
                <button
                    onClick={handleSetAuto}
                    disabled={!canAct}
                    className={`relative flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-xl transition-colors z-10
                        ${!isManual ? 'text-white' : 'text-white/40 hover:text-white/60'}
                        disabled:opacity-60`}
                >
                    {loading && !isManual ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Bot className="w-6 h-6" />
                    )}
                    <span className="text-sm font-bold tracking-wide">{t('control.auto')}</span>
                </button>

                {/* MANUAL button */}
                <button
                    onClick={handleSetManual}
                    disabled={!canAct}
                    className={`relative flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-xl transition-colors z-10
                        ${isManual ? 'text-white' : 'text-white/40 hover:text-white/60'}
                        disabled:opacity-60`}
                >
                    {loading && isManual ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Hand className="w-6 h-6" />
                    )}
                    <span className="text-sm font-bold tracking-wide">{t('control.manual')}</span>
                </button>
            </div>

            {/* ── Contextual Info / Action ── */}
            <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                {!isManual ? (
                    /* AUTO: informational panel */
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/20 shrink-0">
                            <Bot className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold">{t('control.ai_opt')}</h4>
                            <p className="text-xs text-white/50">{t('control.ai_desc')}</p>
                        </div>
                    </div>
                ) : (
                    /* MANUAL: emergency stop button */
                    <button
                        onClick={handleEmergencyStop}
                        disabled={!canAct}
                        className="w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20
                            hover:bg-red-500/20 transition-all flex items-center justify-center
                            gap-3 group disabled:opacity-60"
                    >
                        <AlertOctagon className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                        <span className="text-red-400 font-bold tracking-wide">{t('control.emergency_stop')}</span>
                    </button>
                )}
            </motion.div>

            {/* ── Live connection status chip ── */}
            {data ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ESP32 connected · field01
                </div>
            ) : (
                <div className="flex items-center gap-2 text-xs text-white/30">
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    Waiting for ESP32…
                </div>
            )}

        </div>
    );
}
