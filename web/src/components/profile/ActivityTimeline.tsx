"use client";

import { Clock, Droplets, Thermometer, Power, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActivityTimeline() {
    const activities = [
        {
            icon: Droplets,
            title: 'Irrigation Started',
            time: '2 hours ago',
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
        },
        {
            icon: Thermometer,
            title: 'Temperature Alert',
            time: '5 hours ago',
            color: 'text-orange-400',
            bgColor: 'bg-orange-400/10',
        },
        {
            icon: Power,
            title: 'System Check Complete',
            time: '8 hours ago',
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
        },
        {
            icon: TrendingUp,
            title: 'Moisture Level Optimized',
            time: '12 hours ago',
            color: 'text-accent-green',
            bgColor: 'bg-accent-green/10',
        },
    ];

    return (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-accent-green" />
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 group"
                    >
                        <div className={`p-2 rounded-lg ${activity.bgColor} group-hover:scale-110 transition-transform`}>
                            <activity.icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white mb-1">{activity.title}</div>
                            <div className="text-xs text-gray-400">{activity.time}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
