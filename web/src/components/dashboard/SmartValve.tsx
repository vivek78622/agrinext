"use client";

import Card from "../ui/Card";
import { ShowerHead, Loader2, WifiOff, AlertTriangle } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSmartFarm } from "@/hooks/useSmartFarm";

export default function SmartValve() {
    const { t } = useLanguage();
    const { data, loading, connected, sendCommand } = useSmartFarm();
    const [sending, setSending] = useState(false);

    const isOn = (data?.pump ?? 0) === 1;
    const isAuto = data?.mode === "AUTO";
    const dryRun = (data as any)?.dryRunActive === true;

    const handleToggle = async () => {
        if (!connected || sending || dryRun || isAuto) return;
        setSending(true);
        try { await sendCommand(isOn ? "pump_off" : "pump_on"); }
        finally { setTimeout(() => setSending(false), 1500); }
    };

    const handleMode = async () => {
        if (!connected || sending) return;
        setSending(true);
        try { await sendCommand(isAuto ? "mode_manual" : "mode_auto"); }
        finally { setTimeout(() => setSending(false), 1500); }
    };

    return (
        <Card
            title={t('dash.smart_valve')}
            className="h-full"
            action={<ShowerHead className="w-5 h-5 text-accent-blue" />}
        >
            <div className="flex flex-col justify-between h-full mt-2 gap-4">

                {/* Offline */}
                {!connected && !loading && (
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <WifiOff className="w-3.5 h-3.5" /> ESP32 offline
                    </div>
                )}

                {/* Dry-run warning */}
                {dryRun && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-semibold animate-pulse">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        Dry-run protection — Tank &lt; 20%
                    </div>
                )}

                {/* Pump toggle row */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-sm text-white font-medium">Pump</span>
                        <p className="text-xs text-gray-400 mt-0.5">Zone A · field01</p>
                    </div>
                    <button
                        onClick={handleToggle}
                        disabled={!connected || loading || sending || dryRun || isAuto}
                        title={isAuto ? "Switch to MANUAL to control manually" : ""}
                        className={clsx(
                            "w-14 h-8 rounded-full relative transition-colors duration-300 disabled:opacity-40",
                            isOn ? "bg-accent-green shadow-[0_0_15px_rgba(0,230,118,0.4)]" : "bg-white/10"
                        )}
                    >
                        <div className={clsx(
                            "absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300",
                            isOn ? "left-7" : "left-1"
                        )} />
                    </button>
                </div>

                {/* Mode toggle row */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Mode</span>
                    <button
                        onClick={handleMode}
                        disabled={!connected || loading || sending}
                        className={clsx(
                            "px-3 py-1 rounded-full text-xs font-bold border transition-all disabled:opacity-40",
                            isAuto
                                ? "border-accent-green text-accent-green bg-accent-green/10"
                                : "border-accent-yellow text-accent-yellow bg-accent-yellow/10"
                        )}
                    >
                        {isAuto ? "AUTO" : "MANUAL"}
                    </button>
                </div>

                {/* Status display */}
                <div className="text-center mt-auto mb-1">
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Connecting…</span>
                        </div>
                    ) : (
                        <>
                            <h3 className={clsx(
                                "text-3xl font-bold mb-1 transition-colors",
                                dryRun ? "text-accent-red" : isOn ? "text-accent-green" : "text-white"
                            )}>
                                {sending
                                    ? <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                                    : dryRun ? "LOCKED"
                                        : isOn ? t('dash.on') : t('dash.off')
                                }
                            </h3>
                            <p className="text-xs text-gray-400">
                                {connected ? `Mode: ${data?.mode ?? "–"}` : "Offline"}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
}
