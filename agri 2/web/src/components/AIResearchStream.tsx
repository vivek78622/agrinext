"use client";

import { ModelResult } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface AIResearchStreamProps {
    models: ModelResult[];
    selectedModelId: number | null;
    onSelectModel: (id: number) => void;
}

export function AIResearchStream({ models, selectedModelId, onSelectModel }: AIResearchStreamProps) {
    return (
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    AI Research Stream
                </h3>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                {models.map((model, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={model.id}
                        onClick={() => onSelectModel(model.id)}
                        className={cn(
                            "group cursor-pointer rounded-xl p-3 border transition-all duration-200 relative",
                            selectedModelId === model.id
                                ? "bg-emerald-900/10 border-emerald-500/50 shadow-md"
                                : "bg-slate-800/20 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700"
                        )}
                    >
                        {selectedModelId === model.id && (
                            <div className="absolute left-0 top-3 bottom-3 w-1 bg-emerald-500 rounded-r-full" />
                        )}

                        <div className="flex justify-between items-start mb-1 pl-2">
                            <h4 className={cn(
                                "font-medium text-sm transition-colors",
                                selectedModelId === model.id ? "text-emerald-300" : "text-slate-200"
                            )}>
                                {model.name}
                            </h4>
                            <span className={cn(
                                "text-xs font-bold px-1.5 py-0.5 rounded border ml-2",
                                model.score >= 80 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                    model.score >= 60 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                        "bg-red-500/10 border-red-500/20 text-red-400"
                            )}>
                                {model.score}
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 pl-2 group-hover:text-slate-400 transition-colors">
                            {model.summary}
                        </p>

                        <div className="mt-2 pl-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                {model.status === 'Green' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                {model.status === 'Yellow' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />}
                                {model.status === 'Red' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                <span className={cn(
                                    "text-[10px] uppercase font-semibold tracking-wide",
                                    model.status === 'Green' ? "text-emerald-500" :
                                        model.status === 'Yellow' ? "text-yellow-500" : "text-red-500"
                                )}>
                                    {model.status === 'Green' ? 'Optimal' : model.status === 'Yellow' ? 'Caution' : 'Critical'}
                                </span>
                            </div>

                            <ChevronRight className={cn(
                                "w-4 h-4 text-slate-600 transition-transform duration-200",
                                selectedModelId === model.id ? "translate-x-1 text-emerald-500" : "group-hover:translate-x-0.5"
                            )} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
