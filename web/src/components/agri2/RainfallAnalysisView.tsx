
"use client";

import { motion } from "framer-motion";
import { CloudRain, AlertTriangle, CheckCircle2, Droplets, Info } from "lucide-react";

interface RainfallAnalysisViewProps {
    data: any; // Model 1 Result
    onContinue?: () => void;
    analysisStatus: string;
}

export default function RainfallAnalysisView({ data, onContinue, analysisStatus }: RainfallAnalysisViewProps) {
    if (!data) return null;

    const { reasoning, assessment } = data;
    const score = assessment?.rainfall_score ?? 0;

    // Determine color based on score
    let scoreColor = "text-yellow-500";
    let scoreBg = "bg-yellow-50";
    if (score >= 80) { scoreColor = "text-green-600"; scoreBg = "bg-green-50"; }
    else if (score < 50) { scoreColor = "text-red-500"; scoreBg = "bg-red-50"; }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Panel: Reasoning */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                            <CloudRain className="w-3 h-3" />
                            Rainfall Analysis
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            Pre-Analysis: <br />
                            <span className="text-gray-500">Validation of Hydrological Fit</span>
                        </h1>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {reasoning || "Analyzing historical rainfall patterns against crop water requirements..."}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4 text-gray-400" />
                            Key Observations
                        </h3>
                        <ul className="space-y-3">
                            {/* Mock observations if not in reasoning, or extract if possible. 
                                 For now, static list based on typical response structure or hardcoded for visualization 
                              */}
                            <li className="flex gap-3 text-sm text-gray-700">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span>Alignment with seasonal monsoon signals is strong for selected crops.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-700">
                                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                                <span>detected potential dry spell in late July.</span>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Right Panel: Data & Score */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden flex flex-col justify-between"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-20 -translate-y-20"></div>

                    <div>
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Feasibility Score</h3>
                                <p className="text-sm text-gray-400">Based on 10-year historical average</p>
                            </div>
                            <div className={`px-4 py-2 rounded-2xl ${scoreBg} ${scoreColor} font-bold text-2xl`}>
                                {score}/100
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <RiskCard label="Drought Risk" value={`${assessment?.drought_risk_percent || 0}%`} color="orange" />
                            <RiskCard label="Excess Rain" value={`${assessment?.flood_risk_percent || 0}%`} color="blue" />
                        </div>

                        {/* Comparison Grid Placeholder */}
                        <div className="border-t border-gray-100 pt-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Crop Specific Impact</h4>
                            <div className="space-y-3">
                                {/* We might iterate keys of assessment if they were crop specific, but Model 1 is general context usually, 
                                    unless we ran it for specific crops. 
                                    Assuming the API returns crop-specifics inside 'assessment.breakdown' or similar. 
                                    For now simplified.
                                */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Overall Viability</span>
                                    <span className="font-bold text-gray-900">High</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Status */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {analysisStatus === "completed" ? "Analysis Ready" : "Processing remaining models..."}
                            </span>
                        </div>

                        {analysisStatus === "completed" && (
                            <button
                                onClick={onContinue}
                                className="bg-[#111827] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-all flex items-center gap-2"
                            >
                                View Full Report
                                <span className="material-icons-outlined text-sm">arrow_forward</span>
                            </button>
                        )}
                    </div>

                </motion.div>
            </div>
        </div>
    );
}

function RiskCard({ label, value, color }: { label: string, value: string, color: "orange" | "blue" }) {
    const bg = color === "orange" ? "bg-orange-50" : "bg-blue-50";
    const txt = color === "orange" ? "text-orange-600" : "text-blue-600";

    return (
        <div className={`p-4 rounded-xl ${bg} border border-transparent`}>
            <p className={`text-xs font-bold ${txt} uppercase mb-1`}>{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
    )
}
