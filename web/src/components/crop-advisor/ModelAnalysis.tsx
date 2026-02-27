import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { ModelResult } from "@/services/cropAdvisor/types";

interface ModelAnalysisProps {
    modelResults: ModelResult[];
    language: "en" | "mr";
}

const ModelAnalysis: React.FC<ModelAnalysisProps> = ({ modelResults, language }) => {
    // Categorize models
    const goodModels = modelResults.filter(m => m.ui_state === 'success');
    const watchoutModels = modelResults.filter(m => m.ui_state === 'warning');
    const blockerModels = modelResults.filter(m => m.ui_state === 'danger');

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 space-y-4">
            {/* The Good */}
            <CategorySection
                title={language === "en" ? "THE GOOD" : "चांगल्या गोष्टी"}
                count={goodModels.length}
                total={modelResults.length}
                color="green"
                models={goodModels}
                defaultExpanded={true}
                language={language}
                icon={<CheckCircle2 className="text-green-600" size={20} />}
            />

            {/* The Watchouts */}
            <CategorySection
                title={language === "en" ? "THE WATCHOUTS" : "लक्ष द्यावे"}
                count={watchoutModels.length}
                total={modelResults.length}
                color="amber"
                models={watchoutModels}
                defaultExpanded={false}
                language={language}
                icon={<AlertTriangle className="text-amber-600" size={20} />}
            />

            {/* The Blockers */}
            <CategorySection
                title={language === "en" ? "THE BLOCKERS - MUST ADDRESS" : "गंभीर समस्या - सोडवणे आवश्यक"}
                count={blockerModels.length}
                total={modelResults.length}
                color="red"
                models={blockerModels}
                defaultExpanded={true}
                language={language}
                icon={<AlertCircle className="text-red-600" size={20} />}
            />
        </div>
    );
};

interface CategorySectionProps {
    title: string;
    count: number;
    total: number;
    color: "green" | "amber" | "red";
    models: ModelResult[];
    defaultExpanded: boolean;
    language: "en" | "mr";
    icon: React.ReactNode;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, count, total, color, models, defaultExpanded, language, icon }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    if (count === 0) return null;

    const colorClasses = {
        green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", headerBg: "hover:bg-green-100" },
        amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", headerBg: "hover:bg-amber-100" },
        red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", headerBg: "hover:bg-red-100" },
    };

    const theme = colorClasses[color];

    return (
        <div className={`border ${theme.border} rounded-xl overflow-hidden`}>
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className={`w-full flex items-center justify-between p-4 ${theme.bg} ${theme.headerBg} transition-colors`}
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className={`font-bold tracking-wide text-sm ${theme.text}`}>
                        {title} ({count}/{total})
                    </span>
                </div>
                {expanded ? <ChevronUp className={theme.text} size={20} /> : <ChevronDown className={theme.text} size={20} />}
            </button>

            {/* Content */}
            {expanded && (
                <div className="bg-white divide-y divide-gray-100">
                    {models.map((model, idx) => (
                        <div key={idx} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-900">{model.model}</h4>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${color === 'green' ? 'bg-green-100 text-green-700' :
                                        color === 'amber' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {model.score}/100
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-2">
                                {model.summary}
                            </p>

                            <div className="text-xs text-gray-400 font-mono">
                                Evidence: {model.evidence}
                            </div>

                            {/* Solution Button for Blockers/Watchouts */}
                            {color !== 'green' && (
                                <div className="mt-3 pt-3 border-t border-dashed border-gray-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                                        {language === "en" ? "Recommendation:" : "शिफारस:"}
                                    </p>
                                    <div className="flex gap-2">
                                        {/* Mock Actions */}
                                        <button className="text-xs bg-white border border-gray-200 px-2 py-1 rounded shadow-sm hover:bg-gray-50 text-blue-600 font-medium">
                                            💡 {language === "en" ? "View Solution" : "उपाय पहा"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModelAnalysis;
