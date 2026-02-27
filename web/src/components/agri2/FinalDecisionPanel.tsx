"use client";

import { FinalDecision } from "@/types/agri2";
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, Tooltip, Scatter, Cell } from "recharts";
import { motion } from "framer-motion";
import { ArrowRight, Sliders, DollarSign, ShieldAlert } from "lucide-react";

interface FinalDecisionPanelProps {
    decision: FinalDecision;
}

export function FinalDecisionPanel({ decision }: FinalDecisionPanelProps) {
    const data = [
        { x: 10, y: 32400, z: 200, name: 'Soybean (Recommended)', type: 'Recommended' },
        { x: 5, y: 28000, z: 100, name: 'Maize (Safe)', type: 'Safe' },
        { x: 30, y: 45000, z: 100, name: 'Cotton (High Risk)', type: 'High Risk' },
    ];

    return (
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 mt-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                Strategic Decision Matrix
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="h-64 bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                    <div className="text-xs text-slate-500 mb-2 font-medium uppercase text-center">Risk vs. Reward Landscape</div>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <XAxis type="number" dataKey="x" name="Risk" unit="%" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Risk Factor', position: 'bottom', offset: 0, fill: '#64748b', fontSize: 10 }} />
                            <YAxis type="number" dataKey="y" name="Profit" unit="₹" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Profit/Acre', angle: -90, position: 'left', fill: '#64748b', fontSize: 10 }} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                            <Scatter name="Crops" data={data} fill="#8884d8">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={
                                        entry.type === 'Recommended' ? '#10b981' :
                                            entry.type === 'Safe' ? '#3b82f6' : '#ef4444'
                                    } />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {/* Options Table */}
                <div className="space-y-4">
                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-2 py-1 bg-emerald-500 text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg">
                            Selected
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-lg font-bold text-white">{decision.crop}</h4>
                                <p className="text-xs text-emerald-300">Balanced high yield with moderate risk</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-emerald-400">₹{decision.profit_per_acre.toLocaleString()}</div>
                                <div className="text-xs text-slate-400">Net Profit</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 opacity-75 hover:opacity-100 transition-opacity">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-base font-semibold text-slate-200">Maize</h4>
                                <p className="text-xs text-blue-400">Safe Alternative (Low Risk)</p>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-slate-300">₹28,000</div>
                                <div className="text-xs text-slate-500">Net Profit</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
