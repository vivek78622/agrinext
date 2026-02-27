"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 md:h-20 z-40 px-4 md:pl-24 md:pr-8 flex items-center justify-between glass-panel border-b border-glass-border bg-background/50 backdrop-blur-xl">
            {/* Left: Page Title & Live Badge */}
            <div className="flex items-center gap-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/20">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green"></span>
                    </span>
                    <span className="text-xs font-semibold text-accent-green uppercase tracking-wider">Live Sync</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-accent-green transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search farm data..."
                        className="block w-64 pl-10 pr-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/50 transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors group">
                    <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full border border-background"></span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white group-hover:text-accent-green transition-colors">Farmer Vivek</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white/10 flex items-center justify-center text-white font-bold shadow-lg">
                        V
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
            </div>
        </header>
    );
}
