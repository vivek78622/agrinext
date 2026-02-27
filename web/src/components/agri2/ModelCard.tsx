"use client";
import React, { useState } from 'react';

interface ModelCardProps {
    number: string;
    title: string;
    subtitle: string;
    score: string;
    status: string;
    children: React.ReactNode;
}

export default function ModelCard({ number, title, subtitle, score, status, children }: ModelCardProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`border rounded-2xl bg-white shadow-sm transition-all duration-300 overflow-hidden border-l-4 ${open ? 'ring-1 ring-emerald-500 border-l-emerald-500' : 'border-slate-200 border-l-slate-300 hover:border-l-emerald-400'}`}>
            {/* Header */}
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold font-mono">
                        {number}
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-base text-slate-800 flex items-center gap-2">
                            {title}
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {status}
                            </span>
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {subtitle}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Score</span>
                        <span className="text-emerald-600 font-bold font-mono text-base">{score}/100</span>
                    </div>
                    <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </div>
            </button>

            {/* Expand Area */}
            <div className={`transition-all duration-300 ease-in-out ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 pb-6 pt-4 text-slate-600 border-t border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
