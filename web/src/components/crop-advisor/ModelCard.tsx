"use client";

import { useEffect, useRef, useState } from "react";

export type ModelState = "idle" | "loading" | "completed" | "error";

export interface ModelData {
    model_name: string;
    crop_scores: Record<string, number>;
    risk_factors: Record<string, any>;
    key_findings: string[];
    confidence: number;
}

interface ModelCardProps {
    id: number;
    title: string;
    subtitle: string;
    icon: string;
    thinkingLines: string[];
    state: ModelState;
    data?: ModelData;
    cropNames?: Record<string, string>;
    isExpanded: boolean;
    onToggle: () => void;
}

// Animated count-up hook
function useCountUp(target: number, active: boolean, duration = 1200) {
    const [count, setCount] = useState(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!active) { setCount(0); return; }
        const start = performance.now();
        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.round(eased * target));
            if (progress < 1) rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [target, active, duration]);

    return count;
}

// Typewriter rotating thinking lines
function ThinkingText({ lines }: { lines: string[] }) {
    const [idx, setIdx] = useState(0);
    const [dots, setDots] = useState(3);

    useEffect(() => {
        const dotInterval = setInterval(() => setDots(d => d === 3 ? 1 : d + 1), 400);
        const lineInterval = setInterval(() => setIdx(i => (i + 1) % lines.length), 2200);
        return () => { clearInterval(dotInterval); clearInterval(lineInterval); };
    }, [lines.length]);

    return (
        <span className="text-emerald-400 font-mono text-xs">
            {lines[idx]}{".".repeat(dots)}
        </span>
    );
}

export default function ModelCard({
    id, title, subtitle, icon, thinkingLines,
    state, data, cropNames = {}, isExpanded, onToggle
}: ModelCardProps) {
    // Average score across all crops
    const avgScore = data
        ? Math.round(Object.values(data.crop_scores).reduce((a, b) => a + b, 0) / Math.max(Object.values(data.crop_scores).length, 1))
        : 0;

    const displayScore = useCountUp(avgScore, state === "completed");
    const displayConf = useCountUp(data?.confidence ?? 0, state === "completed", 1400);

    const [glowing, setGlowing] = useState(false);
    const prevState = useRef<ModelState>("idle");

    useEffect(() => {
        if (prevState.current !== "completed" && state === "completed") {
            setGlowing(true);
            const t = setTimeout(() => setGlowing(false), 1800);
            return () => clearTimeout(t);
        }
        prevState.current = state;
    }, [state]);

    const stateColors = {
        idle: "border-white/5 bg-gray-900/40",
        loading: "border-emerald-500/20 bg-gray-900/60",
        completed: glowing
            ? "border-emerald-400/80 bg-gray-900/80 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            : "border-emerald-500/30 bg-gray-900/60",
        error: "border-red-500/40 bg-gray-900/60",
    };

    return (
        <div
            className={`relative rounded-2xl border transition-all duration-500 overflow-hidden ${stateColors[state]} ${state === "completed" ? "cursor-pointer hover:border-emerald-400/60" : ""}`}
            onClick={state === "completed" ? onToggle : undefined}
        >
            {/* Loading shimmer overlay */}
            {state === "loading" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div
                        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.06), transparent)",
                        }}
                    />
                </div>
            )}
            {/* Brief Completion Glow Overlay */}
            {glowing && (
                <div className="absolute inset-0 pointer-events-none z-10 animate-[borderGlow_1.5s_ease-out_forwards]">
                    <div className="absolute inset-0 bg-emerald-500/10" />
                </div>
            )}

            <div className="relative z-10 p-4">
                {/* Header Row */}
                <div className="flex items-center gap-3 mb-3">
                    {/* State Circle */}
                    <div className={`relative flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${state === "idle" ? "bg-gray-800 text-gray-500 border border-gray-700" :
                        state === "loading" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 animate-pulse" :
                            state === "completed" ? "bg-emerald-500 text-white border border-emerald-400" :
                                "bg-red-500/20 text-red-400 border border-red-500/40"
                        }`}>
                        {state === "completed" ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : state === "error" ? (
                            <span>!</span>
                        ) : (
                            <span>{id}</span>
                        )}
                    </div>

                    {/* Icon + Title */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-base">{icon}</span>
                            <span className={`font-semibold text-sm truncate transition-colors ${state === "idle" ? "text-gray-500" :
                                state === "loading" ? "text-emerald-300" :
                                    state === "completed" ? "text-white" :
                                        "text-red-400"
                                }`}>{title}</span>
                        </div>
                        <p className={`text-xs mt-0.5 truncate ${state === "idle" ? "text-gray-600" : "text-gray-500"}`}>
                            {subtitle}
                        </p>
                    </div>

                    {/* State Badge */}
                    <div className="flex-shrink-0">
                        {state === "idle" && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-800 px-2 py-1 rounded-full border border-gray-700">
                                Queued
                            </span>
                        )}
                        {state === "loading" && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/30 animate-pulse">
                                Analyzing
                            </span>
                        )}
                        {state === "completed" && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold tabular-nums text-emerald-400">{displayScore}/100</span>
                                <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                                </svg>
                            </div>
                        )}
                        {state === "error" && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/30">
                                Error
                            </span>
                        )}
                    </div>
                </div>

                {/* Loading State Content */}
                {state === "loading" && (
                    <div className="space-y-2.5 mt-1">
                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                            <ThinkingText lines={thinkingLines} />
                        </div>
                        {/* Skeleton blocks */}
                        <div className="space-y-1.5">
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-gradient-to-r from-gray-700 to-gray-800 animate-pulse rounded-full" />
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-1/2 bg-gradient-to-r from-gray-700 to-gray-800 animate-pulse rounded-full" />
                            </div>
                        </div>
                        {/* Skeleton metric cards */}
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-10 bg-gray-800/80 rounded-xl border border-gray-700/50 animate-pulse" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Idle State */}
                {state === "idle" && (
                    <div className="px-3 py-2 bg-gray-800/40 rounded-xl border border-gray-700/30">
                        <p className="text-xs text-gray-600 font-mono">█ Waiting for upstream models...</p>
                    </div>
                )}

                {/* Completed State - Collapsed Summary */}
                {state === "completed" && !isExpanded && data && (
                    <div className="space-y-2">
                        {/* Confidence bar */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-gray-500 font-mono uppercase w-16 flex-shrink-0">Confidence</span>
                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${displayConf}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono w-8 text-right">{displayConf}%</span>
                        </div>
                        {/* First key finding */}
                        {data.key_findings[0] && (
                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-1 animate-[fadeSlideUp_0.4s_ease_forwards]">
                                ↳ {data.key_findings[0]}
                            </p>
                        )}
                    </div>
                )}

                {/* Completed State - Expanded Full Details */}
                {state === "completed" && isExpanded && data && (
                    <div className="mt-3 space-y-3 border-t border-gray-800 pt-3">
                        {/* Confidence bar full */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-mono uppercase w-16 flex-shrink-0">Confidence</span>
                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${data.confidence}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono w-8 text-right">{data.confidence}%</span>
                        </div>

                        {/* Crop Scores Grid */}
                        {Object.keys(data.crop_scores).length > 0 && (
                            <div>
                                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-1.5">Crop Scores</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(data.crop_scores).map(([cropId, score]) => (
                                        <div key={cropId} className="bg-gray-800/60 rounded-xl p-2 border border-gray-700/40 text-center">
                                            <p className="text-[9px] text-gray-500 truncate mb-0.5">{cropNames[cropId] || `Crop ${cropId}`}</p>
                                            <p className={`text-base font-bold tabular-nums ${score >= 70 ? "text-emerald-400" : score >= 45 ? "text-yellow-400" : "text-red-400"}`}>
                                                {score}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Key Findings */}
                        <div>
                            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-2">Key Findings</p>
                            <ul className="space-y-1.5">
                                {data.key_findings.map((finding, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed animate-[fadeSlideUp_0.4s_ease_forwards]" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                                        <span className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                                        {finding}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {state === "error" && (
                    <div className="px-3 py-2 bg-red-500/5 rounded-xl border border-red-500/20">
                        <p className="text-xs text-red-400">Model failed to respond. Will retry...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
