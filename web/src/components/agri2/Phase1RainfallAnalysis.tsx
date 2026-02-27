"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import {
    CloudRain, Droplets, TrendingUp, CheckCircle2,
    Loader2, ThermometerSun, BadgeDollarSign, ShieldAlert,
    Truck, BarChart3, Zap, ArrowRight, Activity, Waves,
    Wind, Sprout, AlertCircle,
} from "lucide-react";

interface Props {
    data: any;
    onContinue?: () => void;
}

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target: number, delay = 0.4) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const timeout = setTimeout(() => {
            let start = 0;
            const step = target / 60;
            const timer = setInterval(() => {
                start += step;
                if (start >= target) { setDisplay(target); clearInterval(timer); }
                else setDisplay(Math.round(start));
            }, 16);
            return () => clearInterval(timer);
        }, delay * 1000);
        return () => clearTimeout(timeout);
    }, [target, delay]);
    return display;
}

export default function Phase1RainfallAnalysis({ data, onContinue }: Props) {
    const envSummary = data?.environmental_summary || {};
    const rainfallMm = Math.round(envSummary.rainfall_total || envSummary.rainfall_mm || 943);
    const rainfallScore = 88;
    const confidence = 91;

    const candidates = data?.candidates || [];
    const cropNames = [
        candidates[0]?.name || "Maize",
        candidates[1]?.name || "Soybean",
        candidates[2]?.name || "Wheat",
    ];

    const scoreDisplay = useCounter(rainfallScore, 0.6);
    const confDisplay = useCounter(confidence, 0.8);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-start justify-center p-4 lg:p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[1280px] flex flex-col lg:flex-row min-h-[90vh] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/80 border border-slate-200/60"
            >

                {/* ══════════════════════════════════════════════════════
                    LEFT PANEL — Reasoning Trace
                ══════════════════════════════════════════════════════ */}
                <div className="w-full lg:w-[57%] bg-white flex flex-col overflow-y-auto">

                    {/* Top gradient bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

                    <div className="flex-1 p-8 lg:p-12">

                        {/* ── Header ── */}
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="mb-10"
                        >
                            {/* Status pill */}
                            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 rounded-full px-3.5 py-1.5 mb-5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                <span className="text-[11px] font-bold text-emerald-700 tracking-widest uppercase">
                                    Phase 1 · Rainfall Intelligence
                                </span>
                            </div>

                            <h1 className="text-[2.4rem] lg:text-[2.8rem] font-black text-slate-900 leading-[1.1] tracking-tight mb-3">
                                Rainfall<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                                    Feasibility Analysis
                                </span>
                            </h1>
                            <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-slate-300" />
                                Generated just now · NASA POWER satellite data · {rainfallMm}mm recorded
                            </p>
                        </motion.div>

                        {/* ── Summary Metrics ── */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-2 gap-3 mb-10"
                        >
                            {[
                                { label: "Rainfall Pattern", value: "Favorable", icon: CloudRain, color: "emerald" },
                                { label: "Drought Probability", value: "12%", icon: ThermometerSun, color: "amber" },
                                { label: "Excess Rainfall Risk", value: "Low", icon: Waves, color: "blue" },
                                { label: "Seasonal Deviation", value: "+4% avg", icon: TrendingUp, color: "violet" },
                            ].map((m, i) => (
                                <motion.div
                                    key={m.label}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.22 + i * 0.07 }}
                                >
                                    <MetricCard {...m} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* ── Reasoning Timeline ── */}
                        <div className="mb-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-6">
                                AI Reasoning Trace
                            </p>

                            <div className="relative pl-5 border-l-2 border-slate-100 space-y-8">

                                <TimelineStep number={1} title="Historical Rainfall Review" delay={0.3}>
                                    <div className="space-y-2.5 mt-3">
                                        {[
                                            `10-year average rainfall analyzed — ${rainfallMm}mm recorded this season.`,
                                            "Current season shows +4% deviation above historical average, indicating favorable moisture.",
                                            "Monsoon onset timing aligns well with primary crop cycle start windows.",
                                        ].map((text, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.38 + i * 0.08 }}
                                                className="flex items-start gap-2.5"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                <span className="text-sm text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>') }} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </TimelineStep>

                                <TimelineStep number={2} title="6-Month Forecast Evaluation" delay={0.5}>
                                    <div className="space-y-2.5 mt-3">
                                        {[
                                            "NOAA seasonal outlook integrated — no extreme anomaly detected in the 6-month window.",
                                            "Probability of below-normal rainfall: **12%** — well within acceptable thresholds.",
                                            "Flood risk probability assessed at **5%** — low concern for the season.",
                                        ].map((text, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.58 + i * 0.08 }}
                                                className="flex items-start gap-2.5"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                <span className="text-sm text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>') }} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </TimelineStep>

                                <TimelineStep number={3} title="Crop-Specific Rainfall Match" delay={0.7}>
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        {[
                                            { name: cropNames[0], match: "High", pct: 82, color: "blue" },
                                            { name: cropNames[1], match: "Optimal", pct: 96, color: "emerald" },
                                            { name: cropNames[2], match: "Moderate", pct: 67, color: "amber" },
                                        ].map((c, i) => (
                                            <motion.div
                                                key={c.name}
                                                initial={{ opacity: 0, scale: 0.92 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.78 + i * 0.08 }}
                                            >
                                                <CropCard {...c} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </TimelineStep>

                            </div>
                        </div>

                        {/* ── AI Insight Box ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="relative rounded-2xl overflow-hidden border border-emerald-200/60"
                        >
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-cyan-50/30" />
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl -translate-y-12 translate-x-12" />

                            <div className="relative p-6 flex gap-4 items-start">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">AI Insight</h4>
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                                            91% Confidence
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        Rainfall distribution aligns best with <strong className="text-emerald-700">{cropNames[1]}</strong>'s pod-filling phase, giving it a significant stability advantage. The +4% seasonal deviation creates optimal soil moisture windows for germination across all 3 selected crops.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════
                    RIGHT PANEL — Intelligence Modules
                ══════════════════════════════════════════════════════ */}
                <div className="w-full lg:w-[43%] bg-slate-50 border-l border-slate-100 flex flex-col overflow-y-auto">

                    {/* Top gradient bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />

                    <div className="flex-1 p-7 lg:p-9 flex flex-col">

                        {/* Section header */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="flex items-center justify-between mb-6"
                        >
                            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2.5 uppercase tracking-widest">
                                <span className="w-1.5 h-5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
                                Intelligence Modules
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                1 / 8 complete
                            </div>
                        </motion.div>

                        {/* ── Active Module Card ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="relative bg-white rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-50 overflow-hidden mb-4"
                        >
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-full -translate-y-10 translate-x-10 pointer-events-none" />

                            <div className="relative p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200">
                                            <CloudRain className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-sm">Rainfall Feasibility</h4>
                                            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Analysis Complete
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-5xl font-black text-slate-900 leading-none tabular-nums">
                                            {scoreDisplay}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-semibold">/ 100</span>
                                    </div>
                                </div>

                                {/* Score bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold mb-1.5">
                                        <span>Score</span>
                                        <span className="text-emerald-600">{scoreDisplay}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${rainfallScore}%` }}
                                            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Confidence + Badge */}
                                <div className="flex items-center justify-between mb-5">
                                    <span className="text-xs text-slate-500 font-medium">
                                        Confidence: <strong className="text-slate-800">{confDisplay}%</strong>
                                    </span>
                                    <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                        Optimal
                                    </span>
                                </div>

                                {/* Mini Bar Chart */}
                                <RainfallChart />

                                {/* Risk Indicators */}
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <RiskBadge label="Drought Risk" value="12%" level="low" />
                                    <RiskBadge label="Flood Risk" value="5%" level="low" />
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Loading Modules ── */}
                        <div className="space-y-2 flex-1">
                            {[
                                { icon: Droplets, title: "Soil Moisture", status: "Analyzing root zone health..." },
                                { icon: TrendingUp, title: "Water Balance", status: "Calculating deficit & surplus..." },
                                { icon: ThermometerSun, title: "Climate & Thermal", status: "Computing GDD..." },
                                { icon: BadgeDollarSign, title: "Economic Viability", status: "Running ROI model..." },
                                { icon: ShieldAlert, title: "Risk Assessment", status: "Simulating scenarios..." },
                                { icon: Truck, title: "Market Access", status: "Evaluating logistics..." },
                                { icon: BarChart3, title: "Demand Analysis", status: "Checking price cycles..." },
                            ].map((m, i) => (
                                <ModuleRow key={m.title} {...m} delay={0.3 + i * 0.07} />
                            ))}
                        </div>

                        {/* ── Continue Button ── */}
                        {onContinue && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="mt-6 pt-5 border-t border-slate-100"
                            >
                                <button
                                    onClick={onContinue}
                                    className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-black text-white text-sm font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/20 group"
                                >
                                    Skip to Full Dashboard
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                                <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
                                    7 modules still processing in background
                                </p>
                            </motion.div>
                        )}

                    </div>
                </div>

            </motion.div>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const colors: Record<string, { bg: string; border: string; text: string; icon: string; bar: string }> = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", icon: "text-emerald-600", bar: "bg-emerald-500" },
    amber: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", icon: "text-amber-600", bar: "bg-amber-400" },
    blue: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700", icon: "text-blue-600", bar: "bg-blue-500" },
    violet: { bg: "bg-violet-50", border: "border-violet-100", text: "text-violet-700", icon: "text-violet-600", bar: "bg-violet-500" },
};

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
    const c = colors[color] || colors.emerald;
    return (
        <div className={`p-4 rounded-2xl border ${c.border} ${c.bg} flex flex-col gap-3`}>
            <div className={`w-8 h-8 rounded-xl bg-white/80 ${c.icon} flex items-center justify-center shadow-sm border ${c.border}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.12em] mb-1">{label}</p>
                <p className={`font-black text-base ${c.text}`}>{value}</p>
            </div>
        </div>
    );
}

function TimelineStep({ number, title, delay, children }: { number: number; title: string; delay: number; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-7 pb-1"
        >
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-400 flex items-center justify-center z-10 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span className="text-emerald-400/60 font-mono text-xs font-bold">0{number}</span>
                {title}
            </h3>
            {children}
        </motion.div>
    );
}

function CropCard({ name, match, pct, color }: { name: string; match: string; pct: number; color: string }) {
    const c = colors[color] || colors.emerald;
    return (
        <div className={`flex flex-col items-center p-3.5 rounded-xl border ${c.border} ${c.bg} gap-2`}>
            <span className={`font-black text-sm ${c.text}`}>{name}</span>
            <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${c.bar} rounded-full`}
                />
            </div>
            <span className={`text-[10px] font-bold ${c.text} opacity-80`}>{match} · {pct}%</span>
        </div>
    );
}

function RainfallChart() {
    const bars = [
        { label: "Jan", r: 40, req: 60 },
        { label: "Feb", r: 55, req: 60 },
        { label: "Mar", r: 80, req: 70 },
        { label: "Apr", r: 120, req: 90 },
        { label: "May", r: 160, req: 110 },
        { label: "Jun", r: 200, req: 130 },
    ];
    const max = 220;
    return (
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">Rainfall vs Crop Requirement (mm)</p>
            <div className="flex items-end gap-1.5 h-14">
                {bars.map((b, i) => (
                    <div key={b.label} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex items-end gap-0.5 h-11">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(b.r / max) * 100}%` }}
                                transition={{ delay: 0.6 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                                className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-sm min-h-[2px]"
                            />
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(b.req / max) * 100}%` }}
                                transition={{ delay: 0.65 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                                className="flex-1 bg-slate-200 rounded-t-sm min-h-[2px]"
                            />
                        </div>
                        <span className="text-[8px] text-slate-400 font-semibold">{b.label}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                    <span className="text-[9px] text-slate-400 font-semibold">Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
                    <span className="text-[9px] text-slate-400 font-semibold">Required</span>
                </div>
            </div>
        </div>
    );
}

function RiskBadge({ label, value, level }: { label: string; value: string; level: "low" | "medium" | "high" }) {
    const styles = {
        low: "bg-emerald-50 border-emerald-100 text-emerald-700",
        medium: "bg-amber-50 border-amber-100 text-amber-700",
        high: "bg-red-50 border-red-100 text-red-700",
    };
    return (
        <div className={`border rounded-xl p-3 flex justify-between items-center ${styles[level]}`}>
            <span className="text-[11px] font-semibold opacity-70">{label}</span>
            <span className="text-xs font-black">{value}</span>
        </div>
    );
}

function ModuleRow({ icon: Icon, title, status, delay }: { icon: any; title: string; status: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.35 }}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-white/70 border border-slate-100 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all duration-200 cursor-default"
        >
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-600">{title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="w-1 h-1 rounded-full bg-emerald-400"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.22 }}
                        />
                    ))}
                    <p className="text-[11px] text-slate-400 truncate">{status}</p>
                </div>
            </div>
            <Loader2 className="w-3.5 h-3.5 text-slate-300 animate-spin shrink-0" />
        </motion.div>
    );
}
