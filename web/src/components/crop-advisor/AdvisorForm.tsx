"use client";

import { useState } from "react";
import {
    CloudRain,
    Droplets,
    Waves,
    Check,
    Ruler,
    Wallet,
    ArrowRight,
    TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

interface AdvisorFormProps {
    language: "en" | "mr";
    onSubmit: (data: any) => void;
}

export default function AdvisorForm({ language, onSubmit }: AdvisorFormProps) {
    const isEnglish = language === "en";

    // Form State
    const [landSize, setLandSize] = useState("");
    const [unit, setUnit] = useState<"acre" | "hectare">("acre");
    const [waterSource, setWaterSource] = useState<string>("");
    const [budget, setBudget] = useState<string>("");

    const handleSubmit = () => {
        if (!landSize || !waterSource || !budget) return;
        onSubmit({ landSize, unit, waterSource, budget });
    };

    const isFormValid = landSize && waterSource && budget;

    const waterOptions = [
        {
            id: "rainfed",
            icon: CloudRain,
            label: isEnglish ? "Rainfed Only" : "केवळ पावसावर",
            desc: isEnglish ? "No irrigation facility" : "सिंचन सुविधा नाही",
            color: "text-blue-500 bg-blue-50 border-blue-200"
        },
        {
            id: "limited",
            icon: Droplets,
            label: isEnglish ? "Limited Water" : "मर्यादित पाणी",
            desc: isEnglish ? "Well / Borewell (Few hours)" : "विहीर / बोअरवेल (काही तास)",
            color: "text-cyan-600 bg-cyan-50 border-cyan-200"
        },
        {
            id: "adequate",
            icon: Waves,
            label: isEnglish ? "Adequate Water" : "पुरेशी पाणी",
            desc: isEnglish ? "Canal / River / 24x7" : "कॅनॉल / नदी / २४ तास",
            color: "text-blue-700 bg-blue-100 border-blue-300"
        }
    ];

    const budgetOptions = [
        { id: "low", label: "₹15k - ₹25k", desc: isEnglish ? "Low Input" : "कमी खर्च" },
        { id: "medium", label: "₹25k - ₹40k", desc: isEnglish ? "Medium" : "मध्यम" },
        { id: "high", label: "₹40k - ₹80k+", desc: isEnglish ? "High Yield" : "जास्त उत्पादन" }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm">1</span>
                    {isEnglish ? "Land Details" : "जमिनीचा तपशील"}
                </h2>
                <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Ruler className="w-5 h-5" />
                        </div>
                        <input
                            type="number"
                            value={landSize}
                            onChange={(e) => setLandSize(e.target.value)}
                            placeholder={isEnglish ? "Enter area (e.g. 2.5)" : "क्षेत्र प्रविष्ट करा (उदा. २.५)"}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium text-lg"
                        />
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setUnit("acre")}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${unit === 'acre' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {isEnglish ? "Acres" : "एकर"}
                        </button>
                        <button
                            onClick={() => setUnit("hectare")}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${unit === 'hectare' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {isEnglish ? "Hectares" : "हेक्टर"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Water Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm">2</span>
                        {isEnglish ? "Water Availability" : "पाणी उपलब्धता"}
                    </h2>
                    <div className="space-y-3">
                        {waterOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setWaterSource(option.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${waterSource === option.id
                                    ? `${option.color} ring-2 ring-offset-1 ring-${option.color.split('-')[1]}-400`
                                    : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-blue-50/30'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${waterSource === option.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                                    <option.icon className={`w-5 h-5 ${waterSource === option.id ? 'text-current' : 'text-gray-500'}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-base">{option.label}</div>
                                    <div className={`text-xs ${waterSource === option.id ? 'text-current opacity-80' : 'text-gray-500'}`}>{option.desc}</div>
                                </div>
                                {waterSource === option.id && <Check className="w-5 h-5" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Budget Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-sm">3</span>
                        {isEnglish ? "Budget / Acre" : "बजेट / एकर"}
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {budgetOptions.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setBudget(opt.id)}
                                className={`group relative overflow-hidden p-4 rounded-xl border-2 transition-all text-left ${budget === opt.id
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-100 bg-white hover:border-orange-200'
                                    }`}
                            >
                                <div className="flex justify-between items-center relative z-10">
                                    <div>
                                        <div className={`font-bold text-lg ${budget === opt.id ? 'text-orange-900' : 'text-gray-700'}`}>{opt.label}</div>
                                        <div className="text-xs text-gray-500 font-medium">{opt.desc}</div>
                                    </div>
                                    {budget === opt.id ? (
                                        <div className="p-1 rounded-full bg-orange-500 text-white">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <Wallet className="w-5 h-5 text-gray-300 group-hover:text-orange-300 transition-colors" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${isFormValid
                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:scale-[1.01] hover:shadow-green-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isEnglish ? "Check Best Crop Suggestions" : "सर्वोत्तम पिके शोधा"}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

        </div>
    );
}
