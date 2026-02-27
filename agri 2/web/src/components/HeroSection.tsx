"use client";

import { FinalDecision } from "@/types";
import { motion } from "framer-motion";
import { TrendingUp, ShieldAlert, Award } from "lucide-react";

interface HeroSectionProps {
    decision: FinalDecision;
}

export function HeroSection({ decision }: HeroSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative overflow-hidden text-white"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 grid md:grid-cols-4 gap-6 items-center">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <Award className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">Top Recommendation</span>
                    </div>
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-white mb-2">
                        {decision.crop}
                    </h1>
                    <p className="text-slate-300">
                        Strongly recommended based on current soil and climate conditions.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="text-slate-400 text-sm mb-1">Projected Profit</div>
                        <div className="text-2xl font-semibold text-emerald-400">
                            ₹{decision.profit_per_acre.toLocaleString()}
                            <span className="text-xs text-slate-400 ml-1">/acre</span>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="text-slate-400 text-sm mb-1">Confidence</div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${decision.confidence}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium">{decision.confidence}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-4">

                <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">Risk Profile:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${decision.risk_level === 'Low' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
                            decision.risk_level === 'Moderate' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' :
                                'bg-red-500/20 border-red-500/30 text-red-300'
                        }`}>
                        {decision.risk_level} Risk
                    </span>
                </div>

                <div className="ml-auto">
                    <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors">
                        Explore Model Intelligence
                        <TrendingUp className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
