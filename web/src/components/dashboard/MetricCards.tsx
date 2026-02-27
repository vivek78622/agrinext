"use client";

import Card from "../ui/Card";
import { Droplets, Thermometer, CloudRain } from "lucide-react";

export default function MetricCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Soil Monitor */}
            <Card title="Soil Monitor" subtitle="Zone A Sensors">
                <div className="flex items-center justify-between">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Circular Gauge Background */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-white/5"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray="351.86"
                                strokeDashoffset="123" // 65% filled
                                className="text-accent-green drop-shadow-[0_0_10px_rgba(0,230,118,0.5)]"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">65%</span>
                            <span className="text-xs text-accent-green font-bold uppercase">Optimal</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center">
                                <Droplets className="w-5 h-5 text-accent-green" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Moisture</p>
                                <p className="text-sm font-bold text-white">Good</p>
                            </div>
                        </div>
                        <div className="h-px w-full bg-white/10" />
                        <div className="text-xs text-gray-400">
                            Last updated: <span className="text-white">2m ago</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Card 2: Tank Level */}
            <Card title="Water Tank" subtitle="Main Reservoir">
                <div className="flex items-end gap-6 h-32">
                    {/* Tank Visual */}
                    <div className="relative w-16 h-full bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                        <div
                            className="absolute bottom-0 left-0 w-full bg-accent-blue/80 transition-all duration-1000"
                            style={{ height: '85%' }}
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-accent-blue/50 blur-sm" />
                            {/* Bubbles animation could go here */}
                        </div>
                        {/* Markers */}
                        <div className="absolute inset-0 flex flex-col justify-between py-2 px-1">
                            {[100, 75, 50, 25].map((mark) => (
                                <div key={mark} className="w-2 h-px bg-white/20 self-end" />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-full py-2">
                        <div>
                            <h4 className="text-4xl font-bold text-white mb-1">850<span className="text-lg text-gray-400 ml-1">L</span></h4>
                            <p className="text-sm text-gray-400">Capacity: 1000L</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Refill ETA</span>
                                <span className="text-accent-blue">4 days</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5">
                                <div className="bg-accent-blue h-1.5 rounded-full w-[85%] shadow-[0_0_10px_rgba(66,165,245,0.5)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Card 3: Environment */}
            <Card title="Environment" subtitle="Field Conditions">
                <div className="flex flex-col justify-between h-32">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-accent-yellow/10">
                                <Thermometer className="w-6 h-6 text-accent-yellow" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">28°C</p>
                                <p className="text-xs text-gray-400">Temperature</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-accent-red flex items-center gap-1">
                            ↑ 2°
                        </span>
                    </div>

                    <div className="h-px w-full bg-white/10 my-2" />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-accent-blue/10">
                                <CloudRain className="w-6 h-6 text-accent-blue" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">72%</p>
                                <p className="text-xs text-gray-400">Humidity</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-accent-green flex items-center gap-1">
                            ↓ 5%
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
