import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { FinalDecision, DecisionOption } from "@/services/cropAdvisor/types";

interface DecisionMatrixProps {
    decision: FinalDecision;
    language: "en" | "mr";
}

const DecisionMatrix: React.FC<DecisionMatrixProps> = ({ decision, language }) => {

    // Use real data or fallback to empty array
    const options = decision.decisionMatrix || [];

    if (options.length === 0) {
        return null; // Don't show if no data (backward compatibility)
    }

    // Helper to get styling based on type
    const getCardStyle = (type: string) => {
        switch (type) {
            case 'gamble':
                return {
                    border: 'border-gray-100 bg-white hover:border-red-200',
                    badge: 'bg-red-100 text-red-700 border-red-200',
                    riskColor: 'bg-red-500',
                    button: 'bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200',
                    buttonText: language === "en" ? "Review Risks" : "धोका तपासा",
                    shadow: ''
                };
            case 'safe':
                return {
                    border: 'border-gray-100 bg-white hover:border-green-200',
                    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    riskColor: 'bg-emerald-500',
                    button: 'bg-white border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200',
                    buttonText: language === "en" ? "Consider Safe" : "विचार करा",
                    shadow: ''
                };
            case 'recommended':
            default:
                return {
                    border: 'border-farm-accent bg-blue-50/50',
                    badge: 'bg-blue-600 text-white border-blue-600',
                    riskColor: 'bg-green-500',
                    button: 'bg-farm-accent text-white hover:bg-blue-700 shadow-blue-200',
                    buttonText: language === "en" ? "Select Plan" : "योजना निवडा",
                    shadow: 'shadow-md transform md:-translate-y-4 z-10'
                };
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto mt-12 mb-12">
            <h3 className="text-xl font-bold text-farm-text-primary mb-6 flex items-center gap-2">
                <span>🎯</span> {language === "en" ? "YOUR OPTIONS" : "तुमचे पर्याय"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.filter(o => o.is_active).map((card, idx) => {
                    const style = getCardStyle(card.type);

                    return (
                        <div
                            key={idx}
                            className={`relative rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${style.border} ${style.shadow}`}
                        >
                            {/* Card Header Badge */}
                            <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${style.badge}`}>
                                {card.title}
                            </div>

                            <div className="mt-6 text-center">
                                <h2 className="text-2xl font-black text-gray-900 mb-1">{card.crop_name}</h2>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">{card.subtitle}</p>

                                <div className="w-full h-px bg-gray-200 mb-6"></div>

                                {/* Stats */}
                                <div className="flex justify-between items-center mb-2 px-2">
                                    <span className="text-gray-500 text-sm">{language === "en" ? "Est. Profit" : "अंदाजित नफा"}</span>
                                    <span className="font-bold text-gray-900 text-lg">{card.profit_per_acre}<span className="text-xs font-normal text-gray-400">/acre</span></span>
                                </div>

                                <div className="mb-6 px-2">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">{language === "en" ? "Risk Factor" : "धोका"}</span>
                                        <span className="font-bold text-gray-900">{card.risk_score}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${style.riskColor}`}
                                            style={{ width: `${card.risk_score}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Requirements List */}
                                <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 min-h-[100px]">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                                        {language === "en" ? "Requires:" : "आवश्यकता:"}
                                    </p>
                                    <ul className="space-y-2">
                                        {card.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Button */}
                                <button className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${style.button}`}>
                                    {style.buttonText}
                                    {card.type === 'recommended' && <ArrowRight size={18} />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DecisionMatrix;
