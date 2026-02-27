"use client";

import { useState } from "react";
import { AlertTriangle, WifiOff, Droplets, Zap, ShieldOff } from "lucide-react";
import clsx from "clsx";
import { useSmartFarm } from "@/hooks/useSmartFarm";
import { useCrop } from "@/contexts/CropContext";

interface PumpCardProps {
    zone?: string;
    label?: string;
}

export default function PumpCard({ zone = "Zone A", label = "Pump" }: PumpCardProps) {
    const { data, loading, connected, authReady, sendCommand } = useSmartFarm();
    const { selectedCrop } = useCrop();
    const [sending, setSending] = useState(false);

    // ── derived state ──────────────────────────────────────────────────────────
    const isOn = (data?.pump ?? 0) === 1;
    const isAuto = (data?.mode ?? "AUTO").toUpperCase() !== "MANUAL";
    const dryRun = data?.dryRunActive === true;
    const nodeId = data?.id ?? "field01";

    // Use live threshold from ESP32 if available, fall back to selected crop
    const soil = data?.soil ?? 0;
    const tank = data?.tank ?? 0;
    const minSoil = data?.minSoil && data.minSoil > 0 ? data.minSoil : selectedCrop.min;
    const maxSoil = data?.maxSoil && data.maxSoil > 0 ? data.maxSoil : selectedCrop.max;
    const cropLabel = data?.crop ? data.crop.charAt(0).toUpperCase() + data.crop.slice(1) : selectedCrop.name;

    // Soil bar fill — clamp to 0–100
    const soilPct = Math.min(100, Math.max(0, soil));
    const minPct = Math.min(100, Math.max(0, minSoil));
    const maxPct = Math.min(100, Math.max(0, maxSoil));

    // Auto-pump would fire if soil drops below min
    const isAutoWillIrrigate = isAuto && soilPct < minPct && !dryRun;
    const isAutoSaturated = isAuto && soilPct >= maxPct;

    // ── actions ───────────────────────────────────────────────────────────────
    // Mode toggle — only needs auth, not connected
    const canSendMode = authReady && !sending;

    // Pump toggle — needs MANUAL mode + auth + not dry-run
    const canTogglePump = authReady && !isAuto && !dryRun && !sending;

    const handleTogglePump = async () => {
        if (!canTogglePump) return;
        setSending(true);
        try { await sendCommand(isOn ? "pump_off" : "pump_on"); }
        finally { setTimeout(() => setSending(false), 1500); }
    };

    const handleToggleMode = async () => {
        if (!canSendMode) return;
        setSending(true);
        try {
            if (isAuto) {
                await sendCommand("mode_manual");
            } else {
                // Turn pump off before going back to AUTO
                if (isOn) await sendCommand("pump_off");
                await sendCommand("mode_auto");
            }
        } finally {
            setTimeout(() => setSending(false), 1500);
        }
    };

    return (
        <div className={clsx(
            "relative rounded-2xl border overflow-hidden transition-all duration-500",
            isOn && !dryRun
                ? "border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 to-black/50"
                : dryRun
                    ? "border-red-500/30 bg-gradient-to-b from-red-950/30 to-black/50"
                    : "border-white/10 bg-black/30",
            "backdrop-blur-xl"
        )}>

            {/* Ambient top glow */}
            <div className={clsx(
                "absolute inset-x-0 top-0 h-32 pointer-events-none transition-opacity duration-700",
                isOn && !dryRun
                    ? "opacity-100 bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,0.2),transparent_70%)]"
                    : dryRun
                        ? "opacity-100 bg-[radial-gradient(ellipse_at_50%_0%,rgba(239,68,68,0.15),transparent_70%)]"
                        : "opacity-0"
            )} />

            {/* Running pulse border */}
            {isOn && !dryRun && (
                <div className="absolute inset-0 rounded-2xl border border-emerald-500/20 animate-pulse pointer-events-none" />
            )}

            <div className="relative z-10 p-5 flex flex-col gap-4">

                {/* ── Header row ── */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={clsx(
                            "p-2 rounded-xl transition-colors",
                            isOn ? "bg-emerald-500/20" : "bg-white/5"
                        )}>
                            <Droplets className={clsx(
                                "w-4 h-4 transition-colors",
                                isOn ? "text-emerald-400" : "text-white/40"
                            )} />
                        </div>
                        <div>
                            <p className="text-sm text-white font-semibold leading-tight">{label}</p>
                            <p className="text-[10px] text-gray-500">{zone} · {nodeId}</p>
                        </div>
                    </div>

                    {/* Connection + live indicator */}
                    {loading ? (
                        <span className="text-[10px] text-white/30 animate-pulse">Connecting…</span>
                    ) : connected ? (
                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-[10px] text-white/30">
                            <WifiOff className="w-3 h-3" /> Offline
                        </span>
                    )}
                </div>

                {/* ── Dry-run protection banner ── */}
                {dryRun && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                        <ShieldOff className="w-4 h-4 shrink-0 animate-pulse" />
                        Dry-run protection — Tank &lt; 20%
                    </div>
                )}

                {/* ── AUTO mode irrigation status ── */}
                {isAuto && !dryRun && connected && (
                    <div className={clsx(
                        "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border",
                        isAutoWillIrrigate
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            : isOn
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : isAutoSaturated
                                    ? "bg-white/5 border-white/10 text-white/40"
                                    : "bg-white/5 border-white/10 text-white/40"
                    )}>
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                        {isAutoWillIrrigate
                            ? `Soil ${soilPct.toFixed(0)}% < ${minPct}% min — pump starting…`
                            : isOn
                                ? `Irrigating until ${maxPct}% (${soilPct.toFixed(0)}% now)`
                                : isAutoSaturated
                                    ? `Soil saturated at ${soilPct.toFixed(0)}%`
                                    : `Auto — waiting (soil ${soilPct.toFixed(0)}%)`}
                    </div>
                )}

                {/* ── Soil moisture bar ── */}
                {connected && (
                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Soil Moisture</span>
                            <span className={clsx(
                                "font-bold",
                                soilPct < minPct ? "text-red-400"
                                    : soilPct > maxPct ? "text-blue-400"
                                        : "text-emerald-400"
                            )}>
                                {soilPct.toFixed(1)}%
                            </span>
                        </div>

                        {/* Track */}
                        <div className="relative w-full h-3 rounded-full bg-white/5 overflow-visible">
                            {/* Optimal zone shading */}
                            <div
                                className="absolute top-0 h-full rounded-full bg-emerald-500/15"
                                style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
                            />
                            {/* Fill */}
                            <div
                                className={clsx(
                                    "absolute top-0 left-0 h-full rounded-full transition-all duration-1000",
                                    soilPct < minPct
                                        ? "bg-gradient-to-r from-red-500 to-orange-400"
                                        : soilPct > maxPct
                                            ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                            : "bg-gradient-to-r from-emerald-500 to-green-400"
                                )}
                                style={{ width: `${soilPct}%` }}
                            />
                            {/* Min marker */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-white/40 rounded"
                                style={{ left: `${minPct}%` }}
                            />
                            {/* Max marker */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-white/40 rounded"
                                style={{ left: `${maxPct}%` }}
                            />
                        </div>

                        {/* Min / crop / Max labels */}
                        <div className="flex justify-between mt-1 text-[9px] text-gray-600">
                            <span className="text-red-400/80">Min {minPct}%</span>
                            <span className="text-white/30">{cropLabel}</span>
                            <span className="text-blue-400/80">Max {maxPct}%</span>
                        </div>
                    </div>
                )}

                {/* ── Pump toggle + mode row ── */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    {/* Pump toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleTogglePump}
                            disabled={!canTogglePump}
                            title={
                                !authReady ? "Authenticating…"
                                    : isAuto ? "Switch to MANUAL to control manually"
                                        : dryRun ? "Pump locked — tank too low"
                                            : sending ? "Sending…"
                                                : isOn ? "Turn pump OFF"
                                                    : "Turn pump ON"
                            }
                            className={clsx(
                                "w-14 h-7 rounded-full relative transition-all duration-300",
                                !canTogglePump ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                                isOn ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : "bg-white/10"
                            )}
                        >
                            <div className={clsx(
                                "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300",
                                isOn ? "left-7" : "left-0.5"
                            )} />
                        </button>

                        {/* Big status */}
                        <span className={clsx(
                            "text-2xl font-black tracking-tight transition-colors",
                            dryRun ? "text-red-400"
                                : isOn ? "text-emerald-400"
                                    : "text-white/50"
                        )}>
                            {sending ? "…" : dryRun ? "LOCK" : isOn ? "ON" : "OFF"}
                        </span>
                    </div>

                    {/* Mode toggle */}
                    <button
                        onClick={handleToggleMode}
                        disabled={!canSendMode}
                        title={isAuto ? "Click to switch to MANUAL control" : "Click to return to AUTO (AI) mode"}
                        className={clsx(
                            "px-3 py-1.5 rounded-full text-xs font-bold border transition-all",
                            !canSendMode ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                            isAuto
                                ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                                : "border-blue-400 text-blue-300 bg-blue-500/10 hover:bg-blue-500/20"
                        )}
                    >
                        {isAuto ? "AUTO" : "MANUAL"}
                    </button>
                </div>

                {/* ── MANUAL hint (shown when in AUTO) ── */}
                {isAuto && !loading && (
                    <p className="text-[9px] text-white/20 text-center -mt-2">
                        Tap AUTO → switch to MANUAL to override pump
                    </p>
                )}

                {/* ── Offline hint ── */}
                {!connected && !loading && authReady && (
                    <p className="text-[9px] text-white/20 text-center -mt-2">
                        Commands queued — ESP32 picks them up when online
                    </p>
                )}

            </div>

            {/* Bottom running bar */}
            {isOn && !dryRun && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
            )}
        </div>
    );
}
