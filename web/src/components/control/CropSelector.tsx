"use client";

import React, { useState } from 'react';
import { Sprout, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCrop, crops } from '@/contexts/CropContext';

export default function CropSelector() {
    const { selectedCrop, setSelectedCrop } = useCrop();
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectCrop = (crop: typeof crops[0]) => {
        setSelectedCrop(crop);
        setIsOpen(false);
    };

    return (
        <>
            {/* Current Crop Display - Clickable */}
            <div
                onClick={() => setIsOpen(true)}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer mb-4"
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-400">Current Crop</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-green/20 text-accent-green border border-accent-green/20">
                        Active
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedCrop.icon}</span>
                    <h3 className="text-2xl font-bold text-accent-green">{selectedCrop.name}</h3>
                </div>
            </div>

            {/* Crop Selection Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-accent-green/10 border border-accent-green/20">
                                    <Sprout className="w-5 h-5 text-accent-green" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Select Crop</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                                {crops.map((crop) => (
                                    <motion.button
                                        key={crop.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSelectCrop(crop)}
                                        className={`p-4 rounded-xl border transition-all ${selectedCrop.id === crop.id
                                                ? 'bg-accent-green/10 border-accent-green/30'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-3xl">{crop.icon}</span>
                                            <span className={`text-sm font-medium ${selectedCrop.id === crop.id ? 'text-accent-green' : 'text-white'
                                                }`}>
                                                {crop.name}
                                            </span>
                                            {selectedCrop.id === crop.id && (
                                                <div className="w-5 h-5 rounded-full bg-accent-green flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-black" />
                                                </div>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full mt-6 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
