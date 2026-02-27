import React from "react";
import { AlertTriangle, Download, RefreshCw, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface VerdictCardProps {
    score: number;
    cropName: string;
    diagnosis: string;
    criticalFactorsCount: number;
    language: "en" | "mr";
    onViewAnalysis: () => void;
    onChangeCrop: () => void;
    onSaveReport: () => void;
}

const VerdictCard: React.FC<VerdictCardProps> = ({
    score,
    cropName,
    diagnosis,
    criticalFactorsCount,
    language,
    onViewAnalysis,
    onChangeCrop,
    onSaveReport
}) => {
    // Determine color based on score
    const getColor = (s: number) => {
        if (s >= 90) return "text-farm-success"; // Optimal
        if (s >= 75) return "text-farm-primary"; // Good
        if (s >= 60) return "text-farm-warning"; // Acceptable
        if (s >= 40) return "text-orange-600";   // Marginal
        return "text-farm-danger";               // Critical
    };

    const getBgColor = (s: number) => {
        if (s >= 90) return "bg-green-50 border-green-200";
        if (s >= 75) return "bg-blue-50 border-blue-200";
        if (s >= 60) return "bg-amber-50 border-amber-200";
        if (s >= 40) return "bg-orange-50 border-orange-200";
        return "bg-red-50 border-red-200";
    };

    const scoreColor = getColor(score);
    const cardBg = getBgColor(score);

    return (
        <div className={`w-full max-w-2xl mx-auto rounded-[16px] border ${cardBg} p-6 shadow-sm`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🏥</span>
                    <h2 className="text-farm-text-primary text-sm font-bold tracking-wider uppercase">
                        {language === "en" ? "FINAL DIAGNOSIS" : "अंतिम निदान"}
                    </h2>
                </div>
                <button className="text-farm-text-muted hover:text-farm-primary transition-colors">
                    <InfoIcon />
                </button>
            </div>

            {/* Score and Crop */}
            <div className="flex flex-col items-center justify-center text-center mb-8">
                <div className="relative mb-2">
                    <span className={`text-[72px] font-bold leading-none ${scoreColor}`}>
                        {score}
                    </span>
                    <div className="w-full h-[2px] bg-gray-200 my-1"></div>
                    <span className="text-farm-text-muted text-lg font-medium">100</span>
                </div>

                <h1 className="text-2xl font-bold text-farm-text-primary mb-1 mt-4">
                    {cropName}
                </h1>

                <div className="flex items-center gap-2">
                    {/* Progress Bar Visual for Diagnosis */}
                    <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-full ${i < score / 10 ? (score >= 80 ? 'bg-farm-success' : score >= 50 ? 'bg-farm-warning' : 'bg-farm-danger') : 'bg-gray-200'}`}
                            />
                        ))}
                    </div>
                </div>
                <p className={`text-sm font-bold tracking-wide uppercase mt-2 ${scoreColor}`}>
                    {diagnosis}
                </p>
            </div>

            {/* Critical Factors Warning */}
            {criticalFactorsCount > 0 && (
                <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 flex items-start gap-3 mb-8">
                    <AlertTriangle className="text-farm-warning shrink-0" size={20} />
                    <p className="text-farm-text-primary text-sm font-medium">
                        {language === "en"
                            ? `⚠️ ${criticalFactorsCount} Critical Factors Override Good Conditions`
                            : `⚠️ ${criticalFactorsCount} गंभीर मुद्दे चांगल्या परिस्थितीवर मात करतात`
                        }
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                    onClick={onViewAnalysis}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-farm-accent text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <FileText size={18} />
                    {language === "en" ? "View Analysis" : "विश्लेषण पहा"}
                </button>
                <button
                    onClick={onChangeCrop}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-farm-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <RefreshCw size={18} />
                    {language === "en" ? "Change Crop" : "पीक बदला"}
                </button>
                <button
                    onClick={onSaveReport}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-farm-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <Download size={18} />
                    {language === "en" ? "Save Report" : "रिपोर्ट जतन करा"}
                </button>
            </div>
        </div>
    );
};

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export default VerdictCard;

