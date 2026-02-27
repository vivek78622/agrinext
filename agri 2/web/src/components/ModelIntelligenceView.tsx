"use client";

import { ModelResult } from "@/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, AreaChart, Area, CartesianGrid, YAxis } from "recharts";
import { AlertCircle, FileText, Database, ShieldCheck, TrendingUp } from "lucide-react";

interface ModelIntelligenceViewProps {
    model: ModelResult | null;
}

export function ModelIntelligenceView({ model }: ModelIntelligenceViewProps) {
    const [activeTab, setActiveTab] = useState<'summary' | 'data' | 'risk'>('summary');

    if (!model) {
        return (
            <div className="h-full flex items-center justify-center text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-800 border-dashed">
                <p>Select a model to view detailed intelligence</p>
            </div>
        );
    }

    const tabs = [
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'data', label: 'Data Evidence', icon: Database },
        { id: 'risk', label: 'Risk Analysis', icon: ShieldCheck },
    ] as const;

    return (
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-gradient-to-r from-slate-900 to-slate-900/50">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        {model.name}
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${model.score >= 80 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                            }`}>Score: {model.score}</span>
                    </h2>
                    <p className="text-slate-400 text-sm">{model.summary}</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-500 mb-1">Confidence</div>
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-1.5 h-4 rounded-sm ${i < 4 ? 'bg-emerald-500' : 'bg-slate-700'
                                }`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/30 px-6 pt-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 pt-2 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id
                                    ? 'border-emerald-500 text-emerald-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-900/20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={model.id + activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {activeTab === 'summary' && (
                            <div className="space-y-6">
                                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                                    <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        Key Insights
                                    </h4>
                                    <ul className="space-y-2">
                                        {model.detailed_reasoning.map((reason, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1.5 shrink-0" />
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Placeholder chart */}
                                <div className="h-48 w-full bg-slate-800/20 rounded-xl border border-slate-700/50 p-4">
                                    <div className="text-xs text-slate-500 mb-2 font-medium uppercase">Trend Analysis</div>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[
                                            { name: 'Jan', val: 40 }, { name: 'Feb', val: 30 }, { name: 'Mar', val: 60 },
                                            { name: 'Apr', val: 80 }, { name: 'May', val: 70 }, { name: 'Jun', val: 90 },
                                        ]}>
                                            <defs>
                                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                                itemStyle={{ color: '#10b981' }}
                                            />
                                            <Area type="monotone" dataKey="val" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div className="grid grid-cols-2 gap-4">
                                {model.data_points ? Object.entries(model.data_points).map(([key, value]) => (
                                    <div key={key} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                                        <div className="text-xs text-slate-500 font-medium uppercase mb-1">{key.replace(/_/g, ' ')}</div>
                                        <div className="text-xl font-mono text-emerald-400">{value}</div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 text-center text-slate-500 py-10">
                                        No specific data points available for this model.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'risk' && (
                            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-red-200 mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    Risk Factors
                                </h4>
                                {model.risk ? Object.entries(model.risk).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center py-2 border-b border-red-500/10 last:border-0">
                                        <span className="text-sm text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                                        <span className="text-sm font-mono text-red-300">{value}%</span>
                                    </div>
                                )) : (
                                    <p className="text-sm text-slate-500">No high risks detected.</p>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
