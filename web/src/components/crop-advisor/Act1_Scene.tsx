"use client";

import { EnvironmentalData, UserInput } from '@/services/cropAdvisor/types';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, CloudRain, Droplets } from 'lucide-react';

interface Act1SceneProps {
    envData: EnvironmentalData;
    userInput: UserInput;
    district?: string;
    state?: string;
}

/**
 * Act 1: The Scene
 * Sets the stage by displaying the farm's environmental conditions.
 * Creates narrative context for the analysis.
 */
export default function Act1Scene({
    envData,
    userInput,
    district,
    state
}: Act1SceneProps) {
    const locationName = district && state
        ? `${district}, ${state}`
        : `${userInput.location.lat.toFixed(2)}°N, ${userInput.location.lon.toFixed(2)}°E`;

    const conditions = [
        {
            icon: Thermometer,
            label: 'Temperature',
            value: `${envData.avgTemp.toFixed(1)}°C`,
            detail: `Range: ${envData.minTemp.toFixed(1)}°C - ${envData.maxTemp.toFixed(1)}°C`,
            color: 'text-orange-400'
        },
        {
            icon: CloudRain,
            label: 'Rainfall',
            value: `${envData.rainfallTotalMm.toFixed(0)} mm`,
            detail: `Consistency: ${(100 - envData.rainfallConsistency).toFixed(0)}%`,
            color: 'text-blue-400'
        },
        {
            icon: Droplets,
            label: 'Soil Moisture',
            value: `${envData.soilMoisturePercent.toFixed(1)}%`,
            detail: userInput.waterAvailability,
            color: 'text-cyan-400'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">The Scene</h2>
                    <p className="text-sm text-slate-400">{locationName}</p>
                </div>
            </div>

            {/* Land Details */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
                <p className="text-slate-300 text-sm">
                    <span className="text-white font-medium">
                        {userInput.landArea.value} {userInput.landArea.unit}
                    </span>
                    {' '}of farmland with{' '}
                    <span className="text-white font-medium">
                        {userInput.waterAvailability.toLowerCase()}
                    </span>
                    {' '}water availability and a budget of{' '}
                    <span className="text-emerald-400 font-medium">
                        ₹{userInput.budgetPerAcre.toLocaleString()}/acre
                    </span>
                </p>
            </div>

            {/* Environmental Conditions Grid */}
            <div className="grid grid-cols-3 gap-4">
                {conditions.map((condition, index) => (
                    <motion.div
                        key={condition.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-slate-800/60 rounded-xl p-4 text-center"
                    >
                        <condition.icon className={`w-6 h-6 mx-auto mb-2 ${condition.color}`} />
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            {condition.label}
                        </p>
                        <p className="text-lg font-semibold text-white">{condition.value}</p>
                        <p className="text-xs text-slate-400 mt-1">{condition.detail}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
