"use client";

import React from 'react';
import { X, CheckCircle2, Settings, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const historyItems = [
    {
        action: "Valve ON (Manual)",
        time: "3:42 PM",
        status: "success",
        icon: CheckCircle2,
        color: "#00E676"
    },
    {
        action: "Auto Mode Activated",
        time: "2:15 PM",
        status: "info",
        icon: Settings,
        color: "#42A5F5"
    },
    {
        action: "Valve OFF",
        time: "1:00 PM",
        status: "warning",
        icon: AlertCircle,
        color: "#FF5252"
    }
];

export default function HistorySidebar({ isOpen, onClose }: HistorySidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-80 bg-[#0D0D0D] border-l border-[rgba(255,255,255,0.1)] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50 p-6 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white">Command History</h3>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4">
                            {historyItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] flex items-start gap-3"
                                >
                                    <item.icon className="w-5 h-5 mt-0.5" style={{ color: item.color }} />
                                    <div>
                                        <p className="text-white font-medium text-sm">{item.action}</p>
                                        <p className="text-white/40 text-xs mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
