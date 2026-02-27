
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";

interface AIDecisionEngineProps {
    status: "initializing" | "processing_model_1" | "model_1_completed" | "processing_remaining" | "completed";
}

export default function AIDecisionEngine({ status }: AIDecisionEngineProps) {
    const [progress, setProgress] = useState(0);

    // Simulate progress based on status
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === "initializing") {
            setProgress(5);
        } else if (status === "processing_model_1") {
            // Animate 5 -> 40%
            let p = 5;
            interval = setInterval(() => {
                p += 1;
                if (p > 40) p = 40;
                setProgress(p);
            }, 50);
        } else if (status === "model_1_completed") {
            // Jump to 45% then wait
            setProgress(45);
        } else if (status === "processing_remaining") {
            // Animate 45 -> 90%
            let p = 45;
            interval = setInterval(() => {
                p += 0.5;
                if (p > 90) p = 90;
                setProgress(p);
            }, 100);
        } else if (status === "completed") {
            setProgress(100);
        }

        return () => clearInterval(interval);
    }, [status]);


    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center font-sans">

            {/* Top Icon */}
            <div className="mb-8 relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-2 border-dashed border-green-200 flex items-center justify-center"
                >
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                        <RotateCw className="w-5 h-5 text-green-600 animate-spin-slow" />
                    </div>
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Decision Engine</h2>
            <p className="text-gray-500 mb-10 text-sm">Analyzing environmental signals...</p>

            {/* Current Task Section */}
            <div className="w-full max-w-sm bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">CURRENT TASK</p>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-800">
                        {status === "initializing" && "Initializing secure context..."}
                        {status === "processing_model_1" && "Running rainfall feasibility analysis..."}
                        {status === "model_1_completed" && "Rainfall analysis complete."}
                        {(status === "processing_remaining" || status === "completed") && "Synthesizing full report..."}
                    </span>
                    <span className="text-xs font-bold text-green-600">{Math.round(progress)}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 text-left w-full max-w-sm">
                <CheckItem label="Environmental data secured" checked={progress > 10} />
                <CheckItem label="Crop profiles validated" checked={progress > 20} />
                <CheckItem label="Running rainfall model" checked={progress > 30} processing={status === "processing_model_1"} />
                <CheckItem label="Cross-referencing soil data" checked={status === "processing_remaining" || status === "completed"} processing={status === "processing_remaining"} />
            </div>

        </div>
    );
}

function CheckItem({ label, checked, processing }: { label: string, checked: boolean, processing?: boolean }) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${checked ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-300"}`}>
                {checked ? <CheckCircle2 className="w-3.5 h-3.5" /> : processing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-green-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
            </div>
            <span className={`${checked ? "text-gray-700" : "text-gray-400"} ${processing ? "text-gray-900 font-medium" : ""}`}>{label}</span>
        </div>
    )
}
