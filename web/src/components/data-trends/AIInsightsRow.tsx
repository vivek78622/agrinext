import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, Thermometer, Cylinder } from 'lucide-react';

const insights = [
    {
        id: 1,
        icon: Droplets,
        text: "Soil moisture optimal in 3 zones — irrigation not needed for 6 hours.",
        color: "#00E676"
    },
    {
        id: 2,
        icon: Thermometer,
        text: "Temperature expected to rise 2°C by 3 PM. Monitor greenhouse fans.",
        color: "#FFA726"
    },
    {
        id: 3,
        icon: Cylinder,
        text: "Tank refill predicted in 5 hours based on current flow trends.",
        color: "#29B6F6"
    },
    {
        id: 4,
        icon: Sparkles,
        text: "Nitrogen levels stable. Next fertilization cycle recommended in 2 days.",
        color: "#AB47BC"
    }
];

export default function AIInsightsRow() {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-[#00E676]" size={20} />
                <h3 className="text-lg font-semibold text-white">Smart AI Insights 🌿</h3>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
                {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="min-w-[280px] md:min-w-[320px] snap-start p-5 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[#121212] to-[#1A1A1A] relative overflow-hidden group"
                        >
                            {/* Accent Line */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-1"
                                style={{ backgroundColor: insight.color, boxShadow: `0 0 10px ${insight.color}` }}
                            />

                            <div className="flex items-start gap-4 pl-2">
                                <div className="mt-1">
                                    <Icon size={20} color={insight.color} />
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {insight.text}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
