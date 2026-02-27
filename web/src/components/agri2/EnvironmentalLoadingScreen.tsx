"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Satellite,
    CheckCircle2,
    Loader2,
    Database,
    Sprout,
    ThermometerSun,
    Droplets,
    Zap,
    Leaf,
    BrainCircuit
} from "lucide-react";

interface EnvironmentalStats {
    avg_temp: number;
    rainfall_total: number;
    heat_stress_days?: number;
}

interface EnvironmentalLoadingScreenProps {
    stats?: EnvironmentalStats | null;
    progress?: number; // 0-100, if provided overrides internal timer
}

export default function EnvironmentalLoadingScreen({ stats: realStats, progress: externalProgress }: EnvironmentalLoadingScreenProps) {
    const [internalProgress, setInternalProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [showStats, setShowStats] = useState(false);

    // Steps Configuration
    const steps = [
        { id: 1, text: "Connecting to NASA Climate API", icon: Satellite },
        { id: 2, text: "Fetching last 6 months rainfall data", icon: Droplets },
        { id: 3, text: "Analyzing temperature patterns", icon: ThermometerSun },
        { id: 4, text: "Calculating water availability index", icon: Database },
        { id: 5, text: "Generating crop compatibility matrix", icon: Sprout },
    ];

    // AI Thinking Messages
    const thinkingMessages = [
        "Evaluating 100+ crops...",
        "Simulating seasonal risk...",
        "Calculating ROI projections...",
        "Optimizing for your soil...",
    ];
    const [thinkingIndex, setThinkingIndex] = useState(0);

    // Use external progress if available, otherwise internal fake progress
    const displayProgress = externalProgress !== undefined ? externalProgress : internalProgress;

    useEffect(() => {
        if (externalProgress !== undefined) {
            // If controlled externally, do basically nothing but handle step calculation based on progress
            const step = Math.floor((externalProgress / 100) * steps.length);
            setCurrentStep(Math.min(step, steps.length - 1));
            if (externalProgress > 20) setShowStats(true); // Show stats early
            return;
        }

        // Default Internal Progress Bar Animation (0 -> 90% over 5s, hang at 90)
        const interval = setInterval(() => {
            setInternalProgress((prev) => {
                if (prev >= 90) {
                    return 90; // Hang at 90%
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [externalProgress]);

    useEffect(() => {
        if (externalProgress === undefined) {
            // Internal Step Animation
            if (currentStep < steps.length) {
                const timeout = setTimeout(() => {
                    setCurrentStep((prev) => prev + 1);
                }, 1000);
                return () => clearTimeout(timeout);
            } else {
                setShowStats(true);
            }
        }
    }, [currentStep, externalProgress, steps.length]);

    useEffect(() => {
        // Rotate thinking messages every 1.5s
        const interval = setInterval(() => {
            setThinkingIndex((prev) => (prev + 1) % thinkingMessages.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Format real stats or placeholders
    const displayStats = [
        {
            label: "Avg Temp",
            value: realStats ? `${realStats.avg_temp.toFixed(1)}°C` : "Analyzing...",
            icon: ThermometerSun,
            color: "text-orange-500",
            bg: "bg-orange-50"
        },
        {
            label: "Rainfall",
            value: realStats ? `${realStats.rainfall_total.toFixed(0)}mm` : "Fetching...",
            icon: Droplets,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            label: "Heat Stress",
            value: realStats ? (realStats.heat_stress_days && realStats.heat_stress_days > 5 ? "High" : "Low") : "Calculating...",
            icon: Zap,
            color: "text-green-500",
            bg: "bg-green-50"
        },
    ];

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center">

            {/* 1. Orb / Satellite Animation */}
            <div className="relative mb-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 rounded-full border border-dashed border-emerald-200 flex items-center justify-center"
                >
                    {/* Outer Ring */}
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center shadow-sm">
                        <Satellite className="w-8 h-8 text-emerald-600" />
                    </div>
                </motion.div>

                {/* Pulsing Effect */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-emerald-100 rounded-full -z-10"
                />
            </div>

            {/* 2. Main Title */}
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
            >
                Analyzing Your Farm Environment...
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 mb-10 max-w-md mx-auto"
            >
                Fetching NASA climate data and processing seasonal intelligence for precise recommendations.
            </motion.p>

            {/* 3. Step-by-Step Checklist */}
            <div className="w-full max-w-md space-y-3 mb-10 text-left">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 text-sm font-medium"
                        >
                            <div className={`w-5 h-5 flex items-center justify-center rounded-full transition-colors duration-300 
                ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isCurrent ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-300'}`}>

                                {isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : isCurrent ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                )}
                            </div>

                            <span className={`transition-colors duration-300 ${isCompleted || isCurrent ? 'text-gray-800' : 'text-gray-400'}`}>
                                {step.text}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* 4. Progress Bar */}
            <div className="w-full max-w-md bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    initial={{ width: "0%" }}
                    animate={{ width: `${displayProgress}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>
            <div className="w-full max-w-md flex justify-between text-xs text-gray-400 mb-8">
                <span>Processing...</span>
                <span>{Math.round(displayProgress)}%</span>
            </div>

            {/* 5. Real-Time Stats (Fade In) */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-lg mb-8">
                <AnimatePresence>
                    {showStats && displayStats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col items-center"
                        >
                            <div className={`w-8 h-8 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-2`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                            <div className="text-xs text-gray-400">{stat.label}</div>
                            <div className="text-sm font-bold text-gray-800">{stat.value}</div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* 6. AI Thinking Text */}
            <div className="h-6 overflow-hidden flex items-center justify-center gap-2 text-sm text-emerald-600 font-medium">
                <BrainCircuit className="w-4 h-4 animate-pulse" />
                <AnimatePresence mode="wait">
                    <motion.span
                        key={thinkingIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {thinkingMessages[thinkingIndex]}
                    </motion.span>
                </AnimatePresence>
            </div>

        </div>
    );
}
