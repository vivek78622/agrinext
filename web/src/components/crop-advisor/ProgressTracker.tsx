"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Circle } from "lucide-react";
import type { JobProgress } from "@/services/cropAdvisor/jobTypes";

interface ProgressTrackerProps {
    progress: JobProgress | null;
    language: "en" | "mr";
    onCancel: () => void;
}

// Bilingual 9-model labels
const MODEL_LABELS: Record<"en" | "mr", string[]> = {
    en: [
        "Rainfall Analysis",
        "Soil Moisture Check",
        "Water Balance",
        "Climate Fit",
        "Economic Viability",
        "Risk Assessment",
        "Market Access",
        "Demand Trends",
        "Final Synthesis",
    ],
    mr: [
        "पर्जन्यमान विश्लेषण",
        "मृदा ओलावा तपासणी",
        "जल संतुलन",
        "हवामान अनुकूलता",
        "आर्थिक व्यवहार्यता",
        "जोखीम मूल्यांकन",
        "बाजारपेठ पोहोच",
        "मागणी प्रवाह",
        "अंतिम संश्लेषण",
    ],
};

const MODEL_ICONS = ["🌧️", "💧", "⚖️", "☀️", "💰", "⚠️", "🏪", "📈", "🧠"];

export default function ProgressTracker({ progress, language, onCancel }: ProgressTrackerProps) {
    const currentModel = progress?.current_model ?? 0;
    const totalModels = progress?.total_models ?? 9;
    const percentage = progress?.percentage ?? 0;
    const message = progress?.message ?? (language === "en" ? "Initialising..." : "सुरू होत आहे...");
    const labels = MODEL_LABELS[language];

    // SVG ring params
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-500">
            <div className="relative w-full max-w-lg">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-100/50 rounded-full blur-[90px] -z-10" />

                {/* Main card */}
                <div className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 space-y-7 relative overflow-hidden">
                    {/* Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />

                    {/* Header row: ring + text */}
                    <div className="flex items-center gap-5">
                        {/* Circular Progress Ring */}
                        <div className="relative shrink-0 w-28 h-28">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                                {/* Track */}
                                <circle cx="64" cy="64" r={radius} fill="none" stroke="#e5f5ee" strokeWidth="10" />
                                {/* Progress */}
                                <motion.circle
                                    cx="64" cy="64" r={radius}
                                    fill="none"
                                    stroke="url(#progressGrad)"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset: dashOffset }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                />
                                <defs>
                                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {/* Percentage text in center */}
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-2xl font-black text-emerald-700 tabular-nums">{percentage}%</span>
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">
                                    {language === "en" ? "Done" : "पूर्ण"}
                                </span>
                            </div>
                        </div>

                        {/* Text info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mb-1">
                                {language === "en" ? "9-Model AI Analysis" : "९-मॉडेल AI विश्लेषण"}
                            </p>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={message}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                                        {currentModel > 0 && currentModel <= 9
                                            ? `${MODEL_ICONS[currentModel - 1]} ${labels[currentModel - 1]}`
                                            : (language === "en" ? "Starting Analysis..." : "विश्लेषण सुरू होत आहे...")}
                                    </h3>
                                </motion.div>
                            </AnimatePresence>
                            <p className="text-xs text-gray-400 mt-1">
                                {language === "en"
                                    ? `Step ${currentModel} of ${totalModels} models`
                                    : `${totalModels} पैकी ${currentModel} मॉडेल`}
                            </p>

                            {/* Pulsing dots */}
                            <div className="mt-3 flex gap-1.5">
                                {[0, 200, 400].map((delay, i) => (
                                    <div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                                        style={{ animation: `bounce 1s infinite ${delay}ms` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step checklist */}
                    <div className="space-y-2">
                        {labels.map((label, idx) => {
                            const modelNum = idx + 1;
                            const isCompleted = modelNum < currentModel;
                            const isCurrent = modelNum === currentModel;
                            const isPending = modelNum > currentModel;

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${isCurrent
                                        ? "bg-emerald-50 border border-emerald-100 shadow-sm"
                                        : isCompleted
                                            ? "bg-transparent"
                                            : "bg-transparent opacity-40"
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className="shrink-0">
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : isCurrent ? (
                                            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-300" />
                                        )}
                                    </div>

                                    {/* Model info */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-semibold truncate ${isCurrent ? "text-emerald-900" : isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                                            <span className="mr-1.5">{MODEL_ICONS[idx]}</span>
                                            <span>Model {modelNum} · {label}</span>
                                        </div>
                                        {isCurrent && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-[10px] text-emerald-500 font-medium mt-0.5 animate-pulse"
                                            >
                                                {language === "en" ? "Processing..." : "प्रक्रिया करत आहे..."}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Completed badge */}
                                    {isCompleted && (
                                        <span className="text-[10px] font-bold text-emerald-500 shrink-0">✓</span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Cancel */}
                    <div className="text-center pt-1">
                        <button
                            onClick={onCancel}
                            className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
                        >
                            {language === "en" ? "Cancel Analysis" : "विश्लेषण रद्द करा"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
