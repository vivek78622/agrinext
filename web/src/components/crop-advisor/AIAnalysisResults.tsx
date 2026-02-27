import { FinalDecision, UserInput, EnvironmentalData } from "@/services/cropAdvisor/types";
import { ArrowLeft, Loader2, Share2, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import VerdictCard from "./VerdictCard";
import ScoreBreakdown from "./ScoreBreakdown";
import ModelAnalysis from "./ModelAnalysis";
import DecisionMatrix from "./DecisionMatrix";

interface AIAnalysisResultsProps {
    decision: FinalDecision;
    input: UserInput;
    weather: EnvironmentalData;
    language: "en" | "mr";
    onBack: () => void;
    currentModelIndex: number;
    locationName: string;
}

export default function AIAnalysisResults({ decision, input, weather, language, onBack, currentModelIndex, locationName }: AIAnalysisResultsProps) {

    const isFinished = currentModelIndex >= decision.modelResults.length;
    const scrollRef = useRef<HTMLDivElement>(null);

    // Derived Logic
    const criticalRisks = decision.modelResults.filter(m => m.ui_state === 'danger');
    const criticalCount = criticalRisks.length;

    // Calculate Final Score from Breakdown if available, else fallback
    const calculatedScore = (decision.scoreBreakdown || []).reduce((acc, item) => {
        return item.type === 'positive' ? acc + item.value : acc - item.value;
    }, 0);

    const score = decision.scoreBreakdown ? Math.max(0, Math.min(100, calculatedScore)) : (decision.confidence === 'High' ? 88 : (decision.confidence === 'Medium' ? 65 : 25));

    const diagnosis = decision.confidence === 'High'
        ? (language === "en" ? "Highly Recommended" : "अत्यंत शिफारस केलेले")
        : (language === "en" ? "Recommended with Caution" : "सावधगिरीने शिफारस केली");

    const [showStickyHeader, setShowStickyHeader] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowStickyHeader(true);
            } else {
                setShowStickyHeader(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // If still analyzing, show the "Processing" view
    if (!isFinished) {
        const progressPercentage = Math.round((currentModelIndex / decision.modelResults.length) * 100);

        return (
            <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 overflow-hidden"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
                            <Loader2 className="w-8 h-8 text-farm-accent animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {language === 'en' ? "Analyzing Your Farm..." : "तुमच्या शेतीचे विश्लेषण करत आहे..."}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {language === 'en' ? "Please wait while our AI processes regional data." : "कृपया प्रतीक्षा करा, आमचे AI प्रादेशिक माहिती प्रक्रिया करत आहे."}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                            <span>Processing</span>
                            <span>{progressPercentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-3">
                        {decision.modelResults.map((model, index) => {
                            const isCompleted = index < currentModelIndex;
                            const isCurrent = index === currentModelIndex;
                            const isPending = index > currentModelIndex;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${isCurrent
                                            ? "bg-blue-50/50 border-blue-100 shadow-sm scale-[1.02]"
                                            : isCompleted
                                                ? "bg-white border-transparent opacity-80"
                                                : "bg-transparent border-transparent opacity-40"
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isCompleted ? "bg-green-100 text-green-600" : isCurrent ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                                        }`}>
                                        {isCompleted ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : isCurrent ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className={`font-medium text-sm truncate ${isCurrent ? "text-blue-900" : "text-gray-700"}`}>
                                            {model.model}
                                        </div>
                                        {isCurrent && (
                                            <div className="text-xs text-blue-500 font-medium animate-pulse mt-0.5">
                                                Processing...
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Footer Cancel Action (Optional) */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={onBack}
                            className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
                        >
                            {language === 'en' ? "Cancel Analysis" : "विश्लेषण रद्द करा"}
                        </button>
                    </div>

                </motion.div>
            </div>
        );
    }

    // FULL STORY VIEW (Upon Completion)
    return (
        <div ref={scrollRef} className="w-full max-w-5xl mx-auto pb-32 px-4 md:px-0">

            {/* Sticky Header */}
            <div className={`fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm border-b border-gray-100 transition-transform duration-300 ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`text-2xl font-bold ${score >= 80 ? 'text-farm-success' : score >= 50 ? 'text-farm-warning' : 'text-farm-danger'}`}>
                            {score}/100
                        </div>
                        <span className="text-sm font-bold text-gray-800 hidden sm:block">
                            {decision.best_crop}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onBack} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg">
                            {language === "en" ? "Back" : "मागे"}
                        </button>
                        <button className="px-4 py-2 text-sm font-bold bg-farm-accent text-white rounded-lg shadow-sm hover:bg-blue-700">
                            {language === "en" ? "Download" : "डाउनलोड"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Top Navigation / Breadcrumbs */}
            <div className="flex justify-between items-center mb-8 pt-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-farm-accent transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">{language === 'en' ? "New Search" : "नवीन शोध"}</span>
                </button>
                <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Printer size={20} />
                    </button>
                </div>
            </div>

            {/* Screen 1: The Verdict */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <VerdictCard
                    score={score}
                    cropName={decision.best_crop}
                    diagnosis={diagnosis}
                    criticalFactorsCount={criticalCount}
                    language={language}
                    onViewAnalysis={() => {
                        const el = document.getElementById('analysis-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onChangeCrop={onBack}
                    onSaveReport={async () => {
                        try {
                            const { saveAnalysis } = await import("@/services/cropAdvisor/history");
                            const result = await saveAnalysis(decision, input, weather, locationName);
                            if (result.success) {
                                alert(language === "en" ? "Report saved successfully!" : "अहवाल यशस्वीरित्या जतन केला!");
                            } else {
                                console.error(result.error);
                                alert("Failed to save report: " + result.error);
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                />
            </motion.div>

            {/* Screen 2: Score Paradox */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <ScoreBreakdown
                    decision={decision}
                    score={score}
                    language={language}
                />
            </motion.div>

            {/* Screen 3: Model Analysis */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                id="analysis-section"
            >
                <ModelAnalysis
                    modelResults={decision.modelResults}
                    language={language}
                />
            </motion.div>

            {/* Screen 4: Decision Matrix */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <DecisionMatrix
                    decision={decision}
                    language={language}
                />
            </motion.div>

        </div>
    );
}
