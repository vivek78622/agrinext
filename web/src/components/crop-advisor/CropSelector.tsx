"use client";

import { useState } from "react";
import { CropCandidate } from "@/services/cropAdvisor/pipeline";

interface CropSelectorProps {
    candidates: CropCandidate[];
    currentSeason: string;
    environmentalSummary: {
        avg_temp: number;
        rainfall_mm: number;
        soil_moisture: number;
    };
    selectedCrops: string[];
    onToggleCrop: (cropId: string) => void;
    onConfirm: () => void;
    onBack: () => void;
    language: "en" | "mr";
}

export default function CropSelector({
    candidates,
    currentSeason,
    environmentalSummary,
    selectedCrops,
    onToggleCrop,
    onConfirm,
    onBack,
    language
}: CropSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const t = {
        title: language === "en" ? "Select Crops for Analysis" : "विश्लेषणासाठी पिके निवडा",
        subtitle: language === "en"
            ? `Select up to 5 crops. We found ${candidates.length} suitable options based on your conditions.`
            : `5 पिकांपर्यंत निवडा. तुमच्या परिस्थितीनुसार आम्हाला ${candidates.length} योग्य पर्याय सापडले.`,
        searchPlaceholder: language === "en" ? "Search crops (e.g., Rice, Tomato)..." : "पिके शोधा (उदा. तांदूळ, टोमॅटो)...",
        season: language === "en" ? "Current Season" : "सध्याचा हंगाम",
        temp: language === "en" ? "Temperature" : "तापमान",
        rainfall: language === "en" ? "Rainfall" : "पाऊस",
        score: language === "en" ? "Match Score" : "जुळणी स्कोर",
        cost: language === "en" ? "Input Cost" : "इनपुट खर्च",
        duration: language === "en" ? "Duration" : "कालावधी",
        market: language === "en" ? "Market" : "बाजार",
        perishable: language === "en" ? "Perishable" : "नाशवंत",
        nonPerishable: language === "en" ? "Non-Perishable" : "टिकाऊ",
        analyze: language === "en" ? "Analyze Selected Crops" : "निवडलेल्या पिकांचे विश्लेषण करा",
        back: language === "en" ? "← Change Inputs" : "← इनपुट बदला",
        selectHint: language === "en" ? "Select 1-5 crops" : "1-5 पिके निवडा",
        selected: language === "en" ? "Selected" : "निवडले",
        tapToSelect: language === "en" ? "Tap to Select" : "निवडण्यासाठी टॅप करा",
        limitReached: language === "en" ? "Limit Reached (5)" : "मर्यादा गाठली (5)"
    };

    const getScoreColor = (score: number) => {
        if (score >= 170) return "text-green-600 bg-green-50";
        if (score >= 140) return "text-emerald-600 bg-emerald-50";
        if (score >= 110) return "text-yellow-600 bg-yellow-50";
        return "text-orange-600 bg-orange-50";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 170) return { en: "Excellent", mr: "उत्कृष्ट" };
        if (score >= 140) return { en: "Good", mr: "चांगले" };
        if (score >= 110) return { en: "Fair", mr: "ठीक" };
        return { en: "Low", mr: "कमी" };
    };

    // Filter and Sort Candidates
    const filteredCandidates = candidates
        .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            // Selected crops first
            const aSelected = selectedCrops.includes(a.id);
            const bSelected = selectedCrops.includes(b.id);
            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            // Then by score
            return b.score - a.score;
        });

    return (
        <div className="animate-in fade-in duration-500">
            {/* Environment Summary Bar */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-100">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-green-600">🗓️</span>
                        <span className="font-medium text-gray-700">{t.season}:</span>
                        <span className="font-bold text-green-700">{currentSeason}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-orange-500">🌡️</span>
                        <span className="font-medium text-gray-700">{t.temp}:</span>
                        <span className="font-bold text-orange-600">{environmentalSummary.avg_temp}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-blue-500">🌧️</span>
                        <span className="font-medium text-gray-700">{t.rainfall}:</span>
                        <span className="font-bold text-blue-600">{Math.round(environmentalSummary.rainfall_mm)}mm</span>
                    </div>
                </div>
            </div>

            {/* Header & Search */}
            <div className="text-center mb-8 sticky top-0 bg-[#F8F9FA] z-10 py-4 shadow-sm backdrop-blur-sm bg-opacity-90">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
                <p className="text-gray-500 text-sm md:text-base mb-4">{t.subtitle}</p>

                <div className="relative max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none shadow-sm transition-all text-gray-700"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Selection Count Badge */}
                <div className="mt-4 flex justify-center">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-all
                        ${selectedCrops.length === 5
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }
                    `}>
                        {selectedCrops.length}/5 {t.selected}
                    </span>
                </div>
            </div>

            {/* Crop Cards */}
            <div className="space-y-4 mb-8">
                {filteredCandidates.map((crop) => {
                    const isSelected = selectedCrops.includes(crop.id);
                    const canSelect = isSelected || selectedCrops.length < 5;
                    const scoreLabel = getScoreLabel(crop.score);

                    return (
                        <div
                            key={crop.id}
                            onClick={() => canSelect && onToggleCrop(crop.id)}
                            className={`
                                relative rounded-2xl p-5 transition-all duration-300
                                border-2 group
                                ${isSelected
                                    ? "border-green-500 bg-green-50/50 shadow-lg shadow-green-100 cursor-pointer"
                                    : canSelect
                                        ? "border-gray-200 bg-white hover:border-green-300 hover:shadow-md cursor-pointer"
                                        : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                                }
                            `}
                        >
                            {/* Selection Indicator / Action Button */}
                            <div className={`
                                absolute top-4 right-4 w-8 h-8 rounded-full border-2 flex items-center justify-center
                                transition-all duration-200 z-10
                                ${isSelected
                                    ? "border-green-500 bg-green-500 hover:bg-green-600 hover:scale-110"
                                    : canSelect
                                        ? "border-gray-300 bg-white group-hover:border-green-400 text-transparent group-hover:text-green-400"
                                        : "border-gray-200 bg-gray-100"
                                }
                            `}>
                                {isSelected ? (
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : canSelect && (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Crop Name & Season */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{crop.name}</h3>
                                        {!canSelect && !isSelected && (
                                            <span className="text-xs text-red-500 font-medium px-1.5 py-0.5 bg-red-50 rounded">
                                                {t.limitReached}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {crop.season.map(s => (
                                            <span
                                                key={s}
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium
                                                    ${s === currentSeason ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
                                                `}
                                            >
                                                {s}
                                            </span>
                                        ))}
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                            ${crop.is_perishable ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}
                                        `}>
                                            {crop.is_perishable ? t.perishable : t.nonPerishable}
                                        </span>
                                    </div>
                                </div>

                                {/* Score */}
                                <div className={`
                                    px-4 py-2 rounded-xl text-center min-w-[100px]
                                    ${getScoreColor(crop.score)}
                                `}>
                                    <div className="text-2xl font-bold">{crop.score}</div>
                                    <div className="text-xs font-medium">/200 {scoreLabel[language]}</div>
                                </div>
                            </div>

                            {/* Details Row */}
                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="text-gray-400">{t.cost}:</span>{" "}
                                    <span className="font-medium">{crop.input_cost_range}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">{t.duration}:</span>{" "}
                                    <span className="font-medium">{crop.duration_days}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">{t.market}:</span>{" "}
                                    <span className={`font-medium ${crop.market_potential === "High" ? "text-green-600" :
                                        crop.market_potential === "Medium" ? "text-yellow-600" : "text-gray-500"
                                        }`}>{crop.market_potential}</span>
                                </div>
                            </div>

                            {/* Score Breakdown (Mini Bar) */}
                            <div className="mt-3 flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
                                <div
                                    className="bg-orange-400 transition-all"
                                    style={{ width: `${(crop.score_breakdown.temperature / 35) * 100}%` }}
                                    title="Temperature"
                                />
                                <div
                                    className="bg-blue-400 transition-all"
                                    style={{ width: `${(crop.score_breakdown.water / 30) * 100}%` }}
                                    title="Water"
                                />
                                <div
                                    className="bg-green-400 transition-all"
                                    style={{ width: `${(crop.score_breakdown.season / 25) * 100}%` }}
                                    title="Season"
                                />
                                <div
                                    className="bg-purple-400 transition-all"
                                    style={{ width: `${(crop.score_breakdown.budget / 30) * 100}%` }}
                                    title="Budget"
                                />
                                <div
                                    className="bg-pink-400 transition-all"
                                    style={{ width: `${(crop.score_breakdown.market / 25) * 100}%` }}
                                    title="Market"
                                />
                            </div>
                        </div>
                    );
                })}

                {filteredCandidates.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No crops match your search for "{searchTerm}".</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 sticky bottom-4 z-20">
                <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-all bg-white shadow-sm"
                >
                    {t.back}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={selectedCrops.length === 0}
                    className={`
                        flex-1 px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg
                        ${selectedCrops.length > 0
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-200 scale-100"
                            : "bg-gray-300 cursor-not-allowed"
                        }
                    `}
                >
                    {t.analyze} ({selectedCrops.length}/5)
                </button>
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">{t.selectHint}</p>
        </div>
    );
}
