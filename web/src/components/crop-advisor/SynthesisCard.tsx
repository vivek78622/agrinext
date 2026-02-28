"use client";

import { useEffect, useRef, useState } from "react";

interface DecisionEntry {
    crop_id: number;
    overall_score: number;
    risk_adjusted_score: number;
    risk_level: string;
    economic_outlook: string;
    climate_resilience: number;
}

interface SynthesisData {
    best_crop_id: number;
    alternative_crop_ids: number[];
    confidence_score: number;
    cropping_system: string;
    decision_matrix: Record<string, DecisionEntry>;
    reasoning_summary: string;
}

interface SynthesisCardProps {
    state: "locked" | "loading" | "completed" | "error";
    data?: SynthesisData;
    cropNames: Record<string, string>;
}

function useCountUp(target: number, active: boolean, duration = 1500) {
    const [count, setCount] = useState(0);
    const rafRef = useRef<number>(0);
    useEffect(() => {
        if (!active) { setCount(0); return; }
        const start = performance.now();
        const animate = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            setCount(Math.round(eased * target));
            if (p < 1) rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [target, active, duration]);
    return count;
}

export default function SynthesisCard({ state, data, cropNames }: SynthesisCardProps) {
    const confidence = useCountUp(data?.confidence_score ?? 0, state === "completed", 2000);
    const [reveal, setReveal] = useState(false);

    useEffect(() => {
        if (state === "completed") {
            const t = setTimeout(() => setReveal(true), 600);
            return () => clearTimeout(t);
        }
    }, [state]);

    const riskColor = (level: string) =>
        level === "Low" ? "text-emerald-400" : level === "Moderate" ? "text-yellow-400" : "text-red-400";
    const riskBg = (level: string) =>
        level === "Low" ? "bg-emerald-500/10 border-emerald-500/20" : level === "Moderate" ? "bg-yellow-500/10 border-yellow-500/20" : "bg-red-500/10 border-red-500/20";

    return (
        <div
            className={`relative rounded-2xl border transition-all duration-700 overflow-hidden ${state === "locked" ? "border-gray-800 bg-gray-900/30 opacity-60" :
                state === "loading" ? "border-emerald-500/40 bg-gray-900/80 shadow-[0_0_40px_rgba(16,185,129,0.15)]" :
                    state === "completed" ? "border-emerald-400/60 bg-gray-900/90 shadow-[0_0_50px_rgba(16,185,129,0.2)]" :
                        "border-red-500/40 bg-gray-900/60"
                }`}
        >
            {/* Animated border glow for loading/completed */}
            {(state === "loading" || state === "completed") && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 rounded-2xl animate-[borderGlow_3s_ease_infinite]"
                        style={{ boxShadow: "inset 0 0 30px rgba(16,185,129,0.1)" }} />
                </div>
            )}

            {/* Shimmer for loading */}
            {state === "loading" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite]"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.08), transparent)" }} />
                </div>
            )}

            {/* Lock Overlay */}
            {state === "locked" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gray-950/60 backdrop-blur-[2px] rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Waiting for Models 1–8</p>
                </div>
            )}

            <div className="relative z-10 p-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border transition-all ${state === "locked" ? "bg-gray-800 text-gray-600 border-gray-700" :
                        state === "loading" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 animate-pulse" :
                            "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        }`}>
                        {state === "completed" ? "✓" : "9"}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🧠</span>
                            <span className={`font-bold text-base ${state === "locked" ? "text-gray-600" : "text-white"}`}>
                                Final Synthesis Engine
                            </span>
                            {state === "loading" && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
                                    Synthesizing…
                                </span>
                            )}
                            {state === "completed" && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    Complete
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            9-Model Intelligence Aggregation & Decision
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {state === "loading" && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                            <span className="text-xs text-emerald-400 font-mono">Synthesizing intelligence from 8 models...</span>
                        </div>
                        {/* Skeleton */}
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />)}
                        </div>
                        <div className="h-8 bg-gray-800 rounded-xl animate-pulse w-2/3" />
                    </div>
                )}

                {/* Completed State */}
                {state === "completed" && data && (
                    <div className={`space-y-4 transition-all duration-700 ${reveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        {/* Best Crop Hero */}
                        <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-2xl border border-emerald-500/20 p-4">
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">★ Recommended Crop</p>
                            <div className="flex items-end justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-white">
                                        {cropNames[String(data.best_crop_id)] || `Crop ${data.best_crop_id}`}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1 capitalize">{data.cropping_system} System</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Confidence</p>
                                    <p className="text-3xl font-black text-emerald-400 tabular-nums">{confidence}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Alternatives */}
                        {data.alternative_crop_ids.length > 0 && (
                            <div>
                                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-2">Alternatives</p>
                                <div className="flex gap-2">
                                    {data.alternative_crop_ids.map((cid, i) => (
                                        <div key={cid} className="flex-1 bg-gray-800/60 rounded-xl p-2.5 border border-gray-700/40 text-center">
                                            <p className="text-[10px] text-gray-500"># {i + 2}</p>
                                            <p className="text-sm font-semibold text-gray-300 truncate">
                                                {cropNames[String(cid)] || `Crop ${cid}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Decision Matrix */}
                        {Object.keys(data.decision_matrix).length > 0 && (
                            <div>
                                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-2">Decision Matrix</p>
                                <div className="space-y-2">
                                    {Object.entries(data.decision_matrix).map(([cropId, entry]) => {
                                        const isWinner = String(entry.crop_id) === String(data.best_crop_id);
                                        return (
                                            <div key={cropId}
                                                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${isWinner ? "border-emerald-500/30 bg-emerald-500/5" : "border-gray-700/40 bg-gray-800/30"}`}>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        {isWinner && <span className="text-[10px] text-emerald-400">★</span>}
                                                        <span className="text-xs font-semibold text-gray-300 truncate">
                                                            {cropNames[String(entry.crop_id)] || `Crop ${entry.crop_id}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1200"
                                                                style={{ width: `${entry.overall_score}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-xs font-bold text-white">{entry.overall_score}</p>
                                                    <p className={`text-[9px] font-bold ${riskColor(entry.risk_level)}`}>{entry.risk_level} Risk</p>
                                                </div>
                                                <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold flex-shrink-0 ${riskBg(entry.risk_level)} ${riskColor(entry.risk_level)}`}>
                                                    {entry.economic_outlook}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Reasoning Summary */}
                        {data.reasoning_summary && (
                            <div className="bg-gray-800/40 rounded-xl p-3.5 border border-gray-700/40">
                                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-1.5">AI Reasoning</p>
                                <p className="text-xs text-gray-300 leading-relaxed">{data.reasoning_summary}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
