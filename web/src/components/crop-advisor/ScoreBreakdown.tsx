import React, { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { FinalDecision, ScoreComponent } from "@/services/cropAdvisor/types";

interface ScoreBreakdownProps {
    decision: FinalDecision;
    score: number;
    language: "en" | "mr";
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ decision, score, language }) => {

    // --- ROBUST FRONTEND CALCULATION FALLBACK ---
    // If backend provides explicit breakdown, use it.
    // Otherwise, calculate it here to ensure "Math Section" matches "Verdict Score".

    let positiveFactors = decision.scoreBreakdown?.filter(x => x.type === 'positive') || [];
    let penalties = decision.scoreBreakdown?.filter(x => x.type === 'penalty') || [];

    // Fallback Calculation Logic
    if (positiveFactors.length === 0 && penalties.length === 0) {
        // 1. Calculate Positives (Good Conditions)
        const goodModels = decision.modelResults.filter(m => m.score >= 60);
        positiveFactors = goodModels.map(m => ({
            label: `${m.model} (${m.score}/100)`,
            value: Math.round(m.score * 0.15), // Approximate weight contribution
            type: 'positive',
            reason: m.summary
        }));

        // 2. Calculate Penalties (Critical Issues)
        const criticalModels = decision.modelResults.filter(m => m.score < 40 || m.ui_state === 'danger');
        penalties = criticalModels.map(m => ({
            label: `${m.model} Risk`,
            value: 15, // Standard Penalty
            type: 'penalty',
            reason: "Critical Failure (<40 Score) triggers -15 penalty."
        }));
    }

    const totalPositive = positiveFactors.reduce((acc, curr) => acc + curr.value, 0);
    const totalPenalty = penalties.reduce((acc, curr) => acc + curr.value, 0);

    // Calculate displayed final score based on the math above to ensure consistency
    const mathDerivedScore = Math.max(0, totalPositive - totalPenalty);
    // If we are using fallback logic, override the passed score for visual consistency
    // (Or display the passed score if it's within a margin of error?)
    // Let's trust the math we just showed the user.
    const displayScore = (decision.scoreBreakdown && decision.scoreBreakdown.length > 0) ? score : mathDerivedScore;

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-farm-text-primary mb-6 border-b pb-4">
                {language === "en" ? "The Math Behind Your Score" : "तुमच्या गुणांमागील गणित"}
            </h3>

            {/* Good Conditions */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-farm-success uppercase tracking-wider">
                        {language === "en" ? "Good Conditions (Positive)" : "चांगली परिस्थिती (सकारात्मक)"}
                    </h4>
                    <span className="text-farm-success font-bold">+{totalPositive} pts</span>
                </div>

                <div className="space-y-3">
                    {positiveFactors.length > 0 ? positiveFactors.map((factor, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700 font-medium">{factor.label}</span>
                            </div>
                            <span className="text-gray-900 font-mono font-medium">+{factor.value}</span>
                        </div>
                    )) : (
                        <div className="text-gray-400 text-sm italic">
                            {language === "en" ? "No strong positive factors." : "कोणतेही मोठे सकारात्मक घटक नाहीत."}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-dashed border-gray-200">
                    <span className="text-gray-500 text-sm">SUBTOTAL</span>
                    <span className="text-gray-900 font-bold">{totalPositive}</span>
                </div>
            </div>

            {/* Critical Issues */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-farm-danger uppercase tracking-wider">
                        {language === "en" ? "Critical Issues (Penalties)" : "गंभीर समस्या (दंड)"}
                    </h4>
                    <span className="text-farm-danger font-bold">-{totalPenalty} pts</span>
                </div>

                <div className="space-y-4">
                    {penalties.length > 0 ? penalties.map((penalty, idx) => (
                        <div key={idx} className="bg-red-50 rounded-lg p-3 border border-red-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-red-900 font-bold">{penalty.label}</span>
                                <span className="text-red-700 font-mono font-bold">-{penalty.value}</span>
                            </div>
                            <div className="text-sm text-red-800 flex items-start gap-2">
                                <span className="mt-1">└──</span>
                                <div>
                                    {penalty.reason}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-green-600 text-sm italic flex items-center gap-2">
                            <CheckCircle2 size={16} />
                            {language === "en" ? "No critical penalties!" : "कोणताही दंड नाही!"}
                        </div>
                    )}
                </div>
            </div>

            {/* Final Score */}
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
                <span className="text-farm-text-primary font-bold text-lg">
                    {language === "en" ? "FINAL SCORE" : "अंतिम गुण"}
                </span>
                <span className="text-3xl font-black text-farm-text-primary">
                    {displayScore}<span className="text-lg text-gray-400 font-normal">/100</span>
                </span>
            </div>
        </div>
    );
};

export default ScoreBreakdown;
