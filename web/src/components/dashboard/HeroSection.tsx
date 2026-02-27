"use client";

import { motion } from "framer-motion";
import { Thermometer, Droplets, CloudRain, Zap, PlayCircle, CalendarClock } from "lucide-react";
import clsx from "clsx";

const stats = [
    { icon: Thermometer, label: "Temperature", value: "28°C", color: "text-accent-yellow" },
    { icon: Droplets, label: "Soil Moisture", value: "65%", color: "text-accent-green" },
    { icon: CloudRain, label: "Humidity", value: "72%", color: "text-accent-blue" },
    { icon: Zap, label: "Pump Power", value: "350W", color: "text-accent-red" },
];

export default function HeroSection() {
    return (
        <div className="relative w-full h-[320px] rounded-[32px] overflow-hidden group mb-8">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop")' }}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

            {/* Content Container */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10">

                {/* Top: Status Pills */}
                <div className="flex flex-wrap gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 px-4 py-2 rounded-full glass-panel bg-black/40 border-white/10 backdrop-blur-md hover:bg-black/60 transition-colors"
                        >
                            <stat.icon className={clsx("w-5 h-5", stat.color)} />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{stat.label}</span>
                                <span className="text-sm font-bold text-white">{stat.value}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom: Main Info & Actions */}
                <div className="flex items-end justify-between">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-2"
                        >
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-red-400 font-bold tracking-widest text-sm uppercase">System Active</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
                        >
                            Smart Irrigation <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-emerald-500">
                                Zone A
                            </span>
                        </motion.h2>
                        <p className="text-gray-300 text-lg max-w-md">
                            Optimal conditions maintained. Next scheduled watering in 2 hours based on soil moisture trends.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-black font-bold hover:bg-accent-green/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,230,118,0.4)]">
                            <PlayCircle className="w-5 h-5" />
                            Irrigate Now
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl glass-panel bg-white/5 text-white font-bold hover:bg-white/10 transition-all hover:scale-105 border border-white/10">
                            <CalendarClock className="w-5 h-5" />
                            Scheduler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
