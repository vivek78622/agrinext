"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PrescreenResponse, CropCandidate } from "@/types/agri2";
import EnvironmentalLoadingScreen from "@/components/agri2/EnvironmentalLoadingScreen";
import Phase1RainfallAnalysis from "@/components/agri2/Phase1RainfallAnalysis";

// Helper for query params
function useQuery() {
    return useSearchParams();
}

/**
 * Build a human-readable category label from the data the backend already sends.
 * No hardcoded crop name lookups — uses season[] and market_potential from the API.
 */
function getCropCategory(season: string[], marketPotential: string): string {
    const seasonLabel = season.length === 1 ? season[0] : season.includes("Annual") ? "Annual" : "Multi-Season";
    const type = marketPotential === "High" ? "Commercial" : marketPotential === "Low" ? "Subsistence" : "General";
    return `${seasonLabel} ${type} Crop`;
}

/**
 * Real ROI % from actual financial data the API now sends.
 * ROI = (Revenue - Cost) / Cost × 100
 */
function calculateROI(crop: CropCandidate): number {
    const revenue = (crop.yield_quintal_per_acre || 0) * (crop.market_price_per_quintal || 0);
    const cost = crop.input_cost_per_acre || 1;
    return Math.round(((revenue - cost) / cost) * 100);
}

/** Net profit per acre from real data */
function getNetProfit(crop: CropCandidate, _budget: number): string {
    const revenue = (crop.yield_quintal_per_acre || 0) * (crop.market_price_per_quintal || 0);
    const cost = crop.input_cost_per_acre || 0;
    const net = revenue - cost;
    if (net >= 100000) return `₹${(net / 100000).toFixed(1)}L`;
    if (net >= 1000) return `₹${(net / 1000).toFixed(0)}k`;
    if (net < 0) return `-₹${Math.abs(net).toFixed(0)}`;
    return `₹${net.toFixed(0)}`;
}

function CropAnalysisContent() {
    const searchParams = useQuery();
    const router = useRouter();

    // State
    const [viewState, setViewState] = useState<"loading" | "phase1" | "dashboard">("loading");
    const [data, setData] = useState<PrescreenResponse | null>(null);
    const [selectedCrops, setSelectedCrops] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<"All" | "High Profit" | "Low Risk">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const budget = parseFloat(searchParams.get("budget") || "50000");

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // Fetch Data on Mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const latParam = searchParams.get("lat");
                const lonParam = searchParams.get("lon");

                // Guard: require real GPS coordinates
                if (!latParam || !lonParam) {
                    throw new Error("GPS location is required. Please go back and enable location.");
                }

                const lat = parseFloat(latParam);
                const lon = parseFloat(lonParam);

                if (isNaN(lat) || isNaN(lon)) {
                    throw new Error("Invalid GPS coordinates received.");
                }

                const soilParam = searchParams.get("soil");
                const payload: Record<string, unknown> = {
                    location: { lat, lon },
                    land_area: parseFloat(searchParams.get("area") || "5"),
                    water_availability: searchParams.get("water") || "Adequate",
                    budget_per_acre: budget,
                };
                if (soilParam) payload.soil_type = soilParam;

                // Log exactly what is being sent to the backend → NASA API
                console.log("📡 Sending to backend (→ NASA API):", {
                    lat,
                    lon,
                    area: payload.land_area,
                    water: payload.water_availability,
                    budget: payload.budget_per_acre,
                    soil: soilParam || "not specified",
                });

                const res = await fetch("http://localhost:8000/api/crop-advisor/prescreen", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) throw new Error(`Server error: ${res.status}`);

                const result: PrescreenResponse = await res.json();

                setTimeout(() => {
                    setData(result);
                    setViewState("dashboard");
                }, 1000);

            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to fetch analysis");
                setViewState("dashboard"); // Show error state
            }
        };

        fetchData();
    }, [searchParams]);

    // Handlers
    const toggleSelection = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSet = new Set(selectedCrops);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            if (newSet.size < 3) {
                newSet.add(id);
            } else {
                alert("You can only compare 3 crops at a time.");
            }
        }
        setSelectedCrops(newSet);
    };

    const handleCompare = () => {
        const ids = Array.from(selectedCrops).join(",");
        router.push(`/crop-advisor/compare?ids=${ids}`);
    };

    const handleSelectPlan = () => {
        const cropIds = selectedCrops.size > 0
            ? Array.from(selectedCrops).join(",")
            : data?.candidates[0]?.id || "";

        // Preserve all existing params (lat, lon, budget, etc.)
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set("crop_ids", cropIds);

        router.push(`/crop-advisor/full-analysis?${currentParams.toString()}`);
    };

    // Filter + Search Logic
    const filteredCrops = data?.candidates.filter((c: CropCandidate) => {
        // Filter tab
        if (filter === "High Profit" && calculateROI(c) < 50) return false;
        if (filter === "Low Risk" && (c.score_breakdown.risk_penalty || 0) > 5) return false;

        // Search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
                c.name.toLowerCase().includes(q) ||
                getCropCategory(c.season, c.market_potential).toLowerCase().includes(q) ||
                c.season.some((s: string) => s.toLowerCase().includes(q)) ||
                c.market_potential.toLowerCase().includes(q)
            );
        }
        return true;
    }) || [];

    if (viewState === "loading") {
        return <EnvironmentalLoadingScreen />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <div className="bg-white rounded-2xl p-10 shadow-sm text-center max-w-md">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons-outlined text-red-500 text-3xl">error_outline</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/farm-setup")}
                        className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    if (viewState === "phase1") {
        return (
            <Phase1RainfallAnalysis
                data={data}
                onContinue={() => setViewState("dashboard")}
            />
        );
    }

    const envSummary = data.environmental_summary;

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-32">

            {/* Header */}
            <header className="bg-white px-8 py-4 border-b border-gray-200 sticky top-0 z-30 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-green-200 shadow-lg">
                        <span className="material-icons-outlined">grid_view</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-none">Unified Analyst Lab</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-green-600 font-medium tracking-wide">System Online</span>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className={`hidden md:flex items-center bg-gray-50 border rounded-xl px-4 py-2.5 w-96 transition-all ${searchFocused ? "ring-2 ring-green-500/20 border-green-300" : "border-gray-200"}`}>
                    <span className="material-icons-outlined text-gray-400 mr-2 text-lg">search</span>
                    <input
                        ref={searchRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Search crops, seasons, market..."
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                    />
                    {searchQuery ? (
                        <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                            <span className="material-icons-outlined text-sm">close</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-1 ml-2">
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded shadow-sm">⌘</kbd>
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded shadow-sm">K</kbd>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors relative">
                        <span className="material-icons-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-green-500/50 transition-all">
                        <img
                            src="https://ui-avatars.com/api/?name=VP&background=e2e8f0&color=64748b"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 py-8">

                {/* Section A: Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <SummaryCard
                        icon="thermostat"
                        label="AVG TEMP"
                        value={`${envSummary.avg_temp.toFixed(1)}°C`}
                        sub={envSummary.avg_temp > 35 ? "⚠ High" : "Normal"}
                        subColor={envSummary.avg_temp > 35 ? "text-red-500 bg-red-50" : "text-green-500 bg-green-50"}
                        color="text-orange-500"
                        bg="bg-orange-50"
                    />
                    <SummaryCard
                        icon="water_drop"
                        label="RAINFALL"
                        value={`${envSummary.rainfall_mm.toFixed(0)}mm`}
                        sub="6-month"
                        subColor="text-blue-500 bg-blue-50"
                        color="text-blue-500"
                        bg="bg-blue-50"
                    />
                    <SummaryCard
                        icon="account_balance_wallet"
                        label="CAPITAL"
                        value={budget >= 100000 ? `₹${(budget / 100000).toFixed(1)}L` : `₹${(budget / 1000).toFixed(0)}k`}
                        sub="per acre"
                        subColor="text-green-600 bg-green-50"
                        color="text-green-600"
                        bg="bg-green-50"
                    />

                    {/* Dark AI Report Card */}
                    <div className="bg-[#1A2333] rounded-2xl p-5 flex flex-col justify-center text-white relative overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-[40px] transform translate-x-10 -translate-y-10"></div>
                        <div className="relative z-10 flex justify-between items-end h-full">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-indigo-200 font-semibold mb-2">AI REPORT</p>
                                <h3 className="font-bold text-lg leading-tight">{data.current_season} Analysis</h3>
                                <p className="text-xs text-gray-400 mt-1">{filteredCrops.length} crops analyzed</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                                <span className="material-icons-outlined text-sm">arrow_forward</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section B: Crop List Header */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Crop Analysis
                            <span className="ml-2 text-sm font-normal text-gray-400">({filteredCrops.length} results)</span>
                        </h2>
                        {searchQuery && (
                            <p className="text-xs text-gray-500 mt-1">Showing results for "<span className="font-semibold text-gray-700">{searchQuery}</span>"</p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-1 rounded-xl border border-gray-200 flex gap-1 shadow-sm">
                            {(["All", "High Profit", "Low Risk"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f
                                        ? "bg-[#1A2333] text-white shadow-md"
                                        : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section C: Crop Cards */}
                {filteredCrops.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
                        <span className="material-icons-outlined text-gray-300 text-5xl mb-4 block">search_off</span>
                        <p className="text-gray-500 font-medium">No crops match your search</p>
                        <button onClick={() => { setSearchQuery(""); setFilter("All"); }} className="mt-4 text-green-600 text-sm font-semibold hover:underline">Clear filters</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCrops.map((crop, index) => (
                            <CropCard
                                key={crop.id}
                                crop={crop}
                                rank={index + 1}
                                isTop3={data.recommended_top_ids.includes(crop.id)}
                                isSelected={selectedCrops.has(crop.id)}
                                onToggle={(e) => toggleSelection(crop.id, e)}
                                budget={budget}
                            />
                        ))}
                    </div>
                )}

            </main>

            {/* Section D: Sticky Action Bar */}
            <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${selectedCrops.size > 0 ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
                }`}>
                <div className="bg-[#111827] text-white pl-6 pr-2 py-2 rounded-full shadow-2xl flex items-center gap-6 border border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 text-[#111827] flex items-center justify-center font-bold text-xs ring-2 ring-[#111827]">
                            {selectedCrops.size}
                        </div>
                        <span className="text-sm font-medium text-gray-200">Selected</span>
                        <button
                            onClick={() => setSelectedCrops(new Set())}
                            className="text-xs text-gray-500 hover:text-white transition-colors ml-2"
                        >
                            Dismiss
                        </button>
                    </div>

                    <div className="h-4 w-px bg-gray-700"></div>

                    {selectedCrops.size === 2 && (
                        <button
                            onClick={handleCompare}
                            className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors px-2"
                        >
                            <span className="material-icons-outlined text-lg">compare_arrows</span>
                            Compare
                        </button>
                    )}

                    <button
                        onClick={handleSelectPlan}
                        className="bg-white text-gray-900 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                        Select Plan
                        <span className="material-icons-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>

        </div>
    );
}

// --- Components ---

function SummaryCard({ icon, label, value, sub, subColor, color, bg }: any) {
    return (
        <div className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-gray-100">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
                <span className="material-icons-outlined text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    {sub && <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${subColor}`}>{sub}</span>}
                </div>
            </div>
        </div>
    );
}

function CropCard({ crop, rank, isTop3, isSelected, onToggle, budget }: {
    crop: CropCandidate; rank: number; isTop3: boolean; isSelected: boolean;
    onToggle: (e: React.MouseEvent) => void; budget: number;
}) {
    const roi = calculateROI(crop);
    const netProfit = getNetProfit(crop, budget);
    const category = getCropCategory(crop.season, crop.market_potential);

    let scoreColor = "text-yellow-600";
    let suitabilityLabel = "Moderate";
    let suitabilityColor = "text-yellow-600 bg-yellow-50";

    if (crop.score >= 120) {
        suitabilityLabel = "Excellent";
        suitabilityColor = "text-green-600 bg-green-50";
        scoreColor = "text-green-600";
    } else if (crop.score >= 90) {
        suitabilityLabel = "Very Good";
        suitabilityColor = "text-teal-600 bg-teal-50";
        scoreColor = "text-teal-600";
    } else if (crop.score >= 60) {
        suitabilityLabel = "Good";
        suitabilityColor = "text-blue-600 bg-blue-50";
        scoreColor = "text-blue-600";
    } else if (crop.score < 40) {
        suitabilityLabel = "High Risk";
        suitabilityColor = "text-red-500 bg-red-50";
        scoreColor = "text-red-500";
    }

    const bd = crop.score_breakdown;

    return (
        <div
            onClick={onToggle}
            className={`group relative bg-white rounded-2xl p-1 transition-all duration-300 border cursor-pointer ${isSelected
                ? "border-green-500 ring-1 ring-green-500 shadow-md transform scale-[1.005]"
                : isTop3
                    ? "border-transparent shadow-sm hover:shadow-lg hover:border-green-200"
                    : "border-transparent shadow-sm hover:shadow-md"
                }`}
        >
            {/* Left Border Accent for Top Choices */}
            {isTop3 && (
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-green-500 rounded-r-full"></div>
            )}

            <div className="flex flex-col lg:flex-row items-center p-5 gap-6 lg:gap-8 h-full">

                {/* 1. Selection & Identity */}
                <div className="flex items-center gap-5 w-full lg:w-[28%] pl-2">
                    {/* Checkbox */}
                    <div
                        className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all ${isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300 group-hover:border-blue-400 bg-white"
                            }`}
                    >
                        {isSelected && <span className="material-icons-outlined text-white text-xs">check</span>}
                    </div>

                    {/* Icon Box */}
                    <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow-sm transition-colors ${isTop3 ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                        }`}>
                        <span className="material-icons-outlined">spa</span>
                    </div>

                    {/* Text Info */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-base text-gray-900 leading-tight truncate">{crop.name}</h3>
                            {isTop3 && (
                                <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase tracking-wide border border-green-200 flex-shrink-0">
                                    #{rank} Choice
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium truncate">{category}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            {crop.season.slice(0, 2).map((s: string) => (
                                <span key={s} className="text-[9px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{s}</span>
                            ))}
                            {crop.is_perishable && (
                                <span className="text-[9px] font-semibold bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded">Perishable</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Score Badge */}
                <div className="flex flex-col items-center justify-center min-w-[80px]">
                    <span className={`text-4xl font-extrabold tracking-tight ${scoreColor}`}>{crop.score}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full ${suitabilityColor}`}>
                        {suitabilityLabel}
                    </span>
                </div>

                {/* 3. Visual Bar Charts — 6 scoring dimensions, 100-pt model */}
                <div className="flex-1 w-full grid grid-cols-6 gap-2 h-16 items-end pb-1 border-l border-r border-gray-100 px-4">
                    <ChartBar label="Climate" value={bd.temperature || 0} max={25} color="bg-blue-500" />
                    <ChartBar label="Water" value={bd.water || 0} max={20} warning={(bd.water || 0) < 8} />
                    <ChartBar label="GDD" value={bd.gdd || 0} max={15} color="bg-purple-500" />
                    <ChartBar label="Market" value={bd.market || 0} max={10} highlight={(bd.market || 0) > 7} />
                    <ChartBar label="ROI" value={bd.roi || 0} max={10} highlight={(bd.roi || 0) > 7} color="bg-emerald-500" />
                    <ChartBar label="Soil" value={bd.soil || 0} max={10} color="bg-amber-500" />
                </div>

                {/* 4. Financials */}
                <div className="w-full lg:w-[15%] flex flex-col items-end pr-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Proj. ROI</p>
                    <div className={`text-2xl font-bold transition-colors ${roi > 0 ? "text-gray-900 group-hover:text-blue-600" : "text-gray-400"}`}>
                        {roi}%
                    </div>
                    <div className="flex items-center gap-1 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-semibold text-gray-600">
                            {roi > 0 ? `+${netProfit}` : "—"}
                            <span className="text-[9px] font-normal text-gray-400 ml-1">net/acre</span>
                        </span>
                    </div>
                    <div className="mt-1">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${crop.market_potential === "High" ? "bg-green-50 text-green-600" : crop.market_potential === "Medium" ? "bg-blue-50 text-blue-500" : "bg-gray-50 text-gray-400"}`}>
                            {crop.market_potential} Market
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}

function ChartBar({ label, value, max, color, warning, highlight }: any) {
    const safeMax = max || 100;
    const safeVal = Math.max(0, value || 0);
    const pct = Math.min(100, Math.max(5, (safeVal / safeMax) * 100));

    let barColor = "bg-gray-200";
    if (color) barColor = color;
    if (warning) barColor = "bg-orange-400";
    if (highlight) barColor = "bg-yellow-400";

    return (
        <div className="flex flex-col items-center gap-2 h-full justify-end group/bar cursor-help relative">
            <div className="relative w-full bg-gray-100 rounded-sm h-full overflow-hidden flex items-end">
                <div
                    className={`w-full rounded-sm transition-all duration-700 ease-out group-hover/bar:brightness-90 ${barColor}`}
                    style={{ height: `${pct}%` }}
                ></div>
            </div>
            <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">{label}</span>

            {/* Hover Tooltip */}
            <div className="absolute -top-8 bg-[#1A2333] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {safeVal}/{safeMax}
            </div>
        </div>
    );
}

export default function CropAnalysisPage() {
    return (
        <Suspense fallback={<EnvironmentalLoadingScreen />}>
            <CropAnalysisContent />
        </Suspense>
    );
}

