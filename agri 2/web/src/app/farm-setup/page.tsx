"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Soil Data with Marathi translations and colors
const SOIL_OPTIONS = [
    { value: "Black", label: "Black", marathi: "काळी माती", color: "#3D2B1F", desc: "Cotton, Soybean", image: "/images/soils/Black%20Soil.png" },
    { value: "Red", label: "Red", marathi: "लाल माती", color: "#C1440E", desc: "Groundnut, Millets", image: "/images/soils/Red%20Soil.png" },
    { value: "Loamy", label: "Loamy", marathi: "चिकणमाती", color: "#8B6914", desc: "Wheat, Vegetables", image: "/images/soils/Loamy%20Soil.png" },
    { value: "Alluvial", label: "Alluvial", marathi: "गाळाची माती", color: "#C4A35A", desc: "Rice, Sugarcane", image: "/images/soils/Alluvial%20Soil.png" },
    { value: "Sandy", label: "Sandy", marathi: "वालुकामय", color: "#D4B483", desc: "Groundnut, Bajra", image: "/images/soils/Sandy%20Soil.png" },
    { value: "Clayey", label: "Clayey", marathi: "चिकट माती", color: "#7B6B52", desc: "Rice, Jute", image: "/images/soils/Clay%20Soil.png" },
];

export default function FarmSetupPage() {
    const [area, setArea] = useState("");
    const [unit, setUnit] = useState<"acre" | "hectare">("acre");
    const [waterSource, setWaterSource] = useState<"rain" | "limited" | "sufficient" | null>(null);
    const [budget, setBudget] = useState<"low" | "medium" | "high" | null>(null);
    const [soilType, setSoilType] = useState<string | null>(null);
    const [hoveredSoil, setHoveredSoil] = useState<string | null>(null);

    // Location State
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Submission State
    const [submitLoading, setSubmitLoading] = useState(false);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    const router = useRouter();

    const handleGetLocation = () => {
        setLocationLoading(true);
        setLocationError(null);
        setValidationMessage(null);

        if (!navigator.geolocation) {
            setLocationError("Geolocation not supported");
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                // Fetch city name via reverse geocoding
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.county ||
                        "Unknown";
                    const state = data.address.state || "";
                    setLocationName(`${city}, ${state}`);
                } catch {
                    setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                setLocationError("Location access denied. Click to retry.");
                setLocationLoading(false);
            },
            { timeout: 10000 }
        );
    };

    // Auto-fetch location on mount
    useEffect(() => {
        handleGetLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isFormValid = () => {
        return (
            location !== null &&
            area !== "" &&
            parseFloat(area) > 0 &&
            waterSource !== null &&
            budget !== null
        );
    };

    const handleSubmit = async () => {
        setValidationMessage(null);

        if (!isFormValid()) {
            setValidationMessage("कृपया सर्व आवश्यक माहिती भरा (Location, Area, Water, Budget).");
            return;
        }

        setSubmitLoading(true);

        try {
            // Map frontend values to backend expectation
            const waterMap: Record<string, string> = {
                "rain": "Rainfed",
                "limited": "Limited",
                "sufficient": "Adequate"
            };

            // Convert to acres if needed
            const finalArea = unit === "hectare" ? (parseFloat(area) * 2.471).toFixed(2) : area;

            const queryParams: Record<string, string> = {
                lat: location!.lat.toString(),
                lon: location!.lng.toString(),
                area: finalArea,
                water: waterMap[waterSource!] || "Adequate",
                budget: budget === "low" ? "20000" : budget === "medium" ? "40000" : "80000"
            };

            if (soilType) {
                queryParams.soil = soilType;
            }

            const query = new URLSearchParams(queryParams).toString();
            router.push(`/crop-analysis?${query}`);

        } catch (error) {
            console.error("Submission Error:", error);
            setValidationMessage("डेटा प्रक्रिया करण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
            setSubmitLoading(false);
        }
    };

    // Helper for radio button circle
    const RadioCircle = ({ checked, colorClass = "bg-primary border-primary" }: { checked: boolean, colorClass?: string }) => (
        <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${checked ? `${colorClass}` : "border-gray-300 bg-transparent"
            }`}>
            {checked && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
        </div>
    );

    return (
        <div className="min-h-screen flex bg-background text-text-primary font-sans overflow-hidden">

            {/* Sidebar - Matching image: Leaf logo, Grid, Chart, Sliders (inactive), Plus (active), Profile bottom */}
            <aside className="w-20 bg-surface-white flex flex-col items-center py-6 shadow-sidebar z-20 flex-shrink-0 border-r border-border-light hidden md:flex">
                <div className="mb-10">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <span className="material-icons-outlined text-2xl">spa</span>
                    </div>
                </div>

                <nav className="flex-1 w-full flex flex-col gap-8 items-center">
                    <button className="text-section-header hover:text-primary transition-colors">
                        <span className="material-icons-outlined text-2xl">grid_view</span>
                    </button>
                    <button className="text-section-header hover:text-primary transition-colors">
                        <span className="material-icons-outlined text-2xl">show_chart</span>
                    </button>
                    <button className="text-section-header hover:text-primary transition-colors">
                        <span className="material-icons-outlined text-2xl">tune</span>
                    </button>

                    {/* Active 'Add' Item */}
                    <div className="relative w-full flex justify-center py-2">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>
                        <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-primary shadow-sm">
                            <span className="material-icons-outlined text-2xl">add_circle_outline</span>
                        </div>
                    </div>
                </nav>

                <div className="mt-auto">
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-section-header hover:text-primary transition-colors">
                        <span className="material-icons-outlined text-xl">person_outline</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Header */}
                <header className="bg-surface-white px-8 py-4 flex flex-col md:flex-row justify-between items-center shadow-sm z-10 border-b border-gray-100 gap-4 md:gap-0">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-primary">
                                <span className="material-icons-outlined">psychology_alt</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-text-primary leading-tight">स्मार्ट पीक सल्लागार</h1>
                                <p className="text-xs text-primary font-medium tracking-wide">NASA उपग्रह डेटा आधारित</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {/* Location Pill - Clickable for GPS */}
                        <button
                            onClick={handleGetLocation}
                            disabled={locationLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${location
                                ? "bg-green-50 border-green-200 text-green-700 shadow-sm"
                                : locationError
                                    ? "bg-red-50 border-red-200 text-red-600 cursor-pointer hover:bg-red-100"
                                    : "bg-gray-50 border-gray-100 text-ui-muted hover:bg-gray-100"
                                }`}
                        >
                            <span className={`material-icons-outlined text-lg ${locationLoading ? "animate-spin" : ""}`}>
                                {location ? "my_location" : locationLoading ? "refresh" : "location_on"}
                            </span>
                            <span>
                                {locationLoading
                                    ? "Locating..."
                                    : location
                                        ? locationName || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                                        : locationError || "Enable GPS Location"}
                            </span>
                        </button>

                        {/* Season Pill - Primary Green */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#E8F5E9] rounded-lg border border-primary/20 text-sm text-primary font-bold shadow-sm">
                            <span className="material-icons-outlined text-lg">calendar_month</span>
                            <span>खरीप हंगाम</span>
                        </div>

                        {/* Language Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button className="px-3 py-1 text-xs font-medium text-section-header hover:text-text-primary transition-colors">English</button>
                            {/* Yellowish Accent for Active State */}
                            <button className="px-3 py-1 text-xs font-bold bg-ui-accent text-gray-900 rounded shadow-sm">मराठी</button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-5xl mx-auto bg-surface-white rounded-3xl shadow-card p-6 md:p-10 border border-border-light mb-20 relative">

                        {/* Section 1: Land Details */}
                        <div className="mb-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-md flex items-center justify-center font-bold text-sm">1</div>
                                <h2 className="text-lg font-bold text-text-primary">जमिनीचा तपशील</h2>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-stretch">
                                <div className="flex-1 relative group">
                                    <span className="material-icons-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">agriculture</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="क्षेत्र प्रविष्ट करा (उदा. 2.5)"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary placeholder-gray-400 transition-all outline-none font-medium"
                                    />
                                </div>

                                <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 flex-shrink-0 h-[58px]">
                                    <button
                                        onClick={() => setUnit("acre")}
                                        className={`px-6 h-full rounded-lg font-bold text-sm transition-all shadow-sm ${unit === "acre" ? "bg-white text-primary shadow-md" : "bg-transparent text-gray-500 hover:bg-gray-200/50"
                                            }`}
                                    >
                                        एकर
                                    </button>
                                    <button
                                        onClick={() => setUnit("hectare")}
                                        className={`px-6 h-full rounded-lg font-bold text-sm transition-all shadow-sm ${unit === "hectare" ? "bg-white text-primary shadow-md" : "bg-transparent text-gray-500 hover:bg-gray-200/50"
                                            }`}
                                    >
                                        हेक्टर
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                            {/* Section 2: Water Source */}
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">2</div>
                                    <h2 className="text-lg font-bold text-text-primary">पाणी उपलब्धता</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Water Option 1: Rain Only */}
                                    <div
                                        onClick={() => setWaterSource("rain")}
                                        className={`cursor-pointer group flex items-center p-4 rounded-2xl border-2 transition-all duration-200 ${waterSource === "rain" ? "border-sky-500/30 bg-sky-50" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${waterSource === "rain" ? "bg-white text-sky-600 shadow-sm" : "bg-gray-100 text-gray-400"
                                            }`}>
                                            <span className="material-icons-outlined">water_drop</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-primary">केवळ पावसावर</h3>
                                            <p className="text-xs text-text-secondary mt-1">सिंचन सुविधा नाही</p>
                                        </div>
                                        <RadioCircle checked={waterSource === "rain"} colorClass="bg-sky-500 border-sky-500" />
                                    </div>

                                    {/* Water Option 2: Limited */}
                                    <div
                                        onClick={() => setWaterSource("limited")}
                                        className={`cursor-pointer group flex items-center p-4 rounded-2xl border-2 transition-all duration-200 ${waterSource === "limited" ? "border-blue-500/30 bg-blue-50" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${waterSource === "limited" ? "bg-white text-blue-600 shadow-sm" : "bg-gray-100 text-gray-400"
                                            }`}>
                                            <span className="material-icons-outlined">opacity</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-primary">मर्यादित पाणी</h3>
                                            <p className="text-xs text-text-secondary mt-1">विहीर / बोअरवेल</p>
                                        </div>
                                        <RadioCircle checked={waterSource === "limited"} colorClass="bg-blue-500 border-blue-500" />
                                    </div>

                                    {/* Water Option 3: Sufficient */}
                                    <div
                                        onClick={() => setWaterSource("sufficient")}
                                        className={`cursor-pointer group flex items-center p-4 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${waterSource === "sufficient" ? "border-green-500/30 bg-green-50 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${waterSource === "sufficient" ? "bg-white text-green-600 shadow-sm" : "bg-gray-100 text-gray-400"
                                            }`}>
                                            <span className="material-icons-outlined">waves</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-text-primary">पुरेशी पाणी</h3>
                                            <p className="text-xs text-text-secondary mt-1">कॅनॉल / नदी / 24 तास</p>
                                        </div>
                                        {/* Adequate Badge - only show when selected */}
                                        {waterSource === "sufficient" && (
                                            <span className="mr-3 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-100 px-2 py-1 rounded-md">Adequate</span>
                                        )}
                                        <RadioCircle checked={waterSource === "sufficient"} colorClass="bg-green-500 border-green-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Budget */}
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">3</div>
                                    <h2 className="text-lg font-bold text-text-primary">बजेट / एकर</h2>
                                </div>

                                <div className="space-y-3">
                                    {/* Budget Option 1: Low Cost */}
                                    <div
                                        onClick={() => setBudget("low")}
                                        className={`cursor-pointer flex items-center p-4 rounded-2xl border-2 transition-all duration-200 ${budget === "low" ? "border-orange-200 bg-orange-50/60 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${budget === "low" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"
                                            }`}>
                                            <span className="material-icons-outlined text-[20px]">account_balance_wallet</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-extrabold text-[18px] leading-tight tracking-tight ${budget === "low" ? "text-orange-700" : "text-text-primary"}`}>₹15k – ₹25k</h3>
                                            <p className={`text-[11px] font-semibold mt-0.5 px-2 py-0.5 rounded-full inline-block ${budget === "low" ? "bg-orange-100 text-orange-600" : "text-gray-400"}`}>कमी खर्च</p>
                                        </div>
                                        <RadioCircle checked={budget === "low"} colorClass="bg-orange-500 border-orange-500" />
                                    </div>

                                    {/* Budget Option 2: Medium */}
                                    <div
                                        onClick={() => setBudget("medium")}
                                        className={`cursor-pointer flex items-center p-4 rounded-2xl border-2 transition-all duration-200 ${budget === "medium" ? "border-blue-200 bg-blue-50/60 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${budget === "medium" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                                            }`}>
                                            <span className="material-icons-outlined text-[20px]">payments</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-extrabold text-[18px] leading-tight tracking-tight ${budget === "medium" ? "text-blue-700" : "text-text-primary"}`}>₹25k – ₹40k</h3>
                                            <p className={`text-[11px] font-semibold mt-0.5 px-2 py-0.5 rounded-full inline-block ${budget === "medium" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}>मध्यम</p>
                                        </div>
                                        <RadioCircle checked={budget === "medium"} colorClass="bg-blue-500 border-blue-500" />
                                    </div>

                                    {/* Budget Option 3: High Yield */}
                                    <div
                                        onClick={() => setBudget("high")}
                                        className={`cursor-pointer flex items-center p-4 rounded-2xl border-2 transition-all duration-200 ${budget === "high" ? "border-green-200 bg-green-50/60 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${budget === "high" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                                            }`}>
                                            <span className="material-icons-outlined text-[20px]">trending_up</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-extrabold text-[18px] leading-tight tracking-tight ${budget === "high" ? "text-green-700" : "text-text-primary"}`}>₹40k – ₹80k+</h3>
                                            <p className={`text-[11px] font-semibold mt-0.5 px-2 py-0.5 rounded-full inline-block ${budget === "high" ? "bg-green-100 text-green-600" : "text-gray-400"}`}>जास्त उत्पादन</p>
                                        </div>
                                        <RadioCircle checked={budget === "high"} colorClass="bg-green-600 border-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Soil Type */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">4</div>
                                <div>
                                    <h2 className="text-lg font-bold text-text-primary">माती प्रकार</h2>
                                    <p className="text-xs text-text-muted mt-0.5">(ऐच्छिक — अधिक अचूक शिफारसींसाठी)</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {SOIL_OPTIONS.map((s) => (
                                    <div key={s.value} className="relative">
                                        <button
                                            onClick={() => setSoilType(soilType === s.value ? null : s.value)}
                                            onMouseEnter={() => setHoveredSoil(s.value)}
                                            onMouseLeave={() => setHoveredSoil(null)}
                                            className={`w-full flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${soilType === s.value
                                                ? "border-primary bg-[#F1F8E9] shadow-md transform scale-[1.02]"
                                                : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full shadow-inner border border-black/10 flex-shrink-0"
                                                style={{ backgroundColor: s.color }}
                                            />
                                            <div className="text-center">
                                                <span className="block text-[11px] font-semibold text-gray-700 leading-tight">{s.marathi}</span>
                                                <span className="block text-[9px] text-gray-400 text-center leading-tight mt-0.5">{s.desc}</span>
                                            </div>
                                            {soilType === s.value && (
                                                <div className="absolute top-1.5 right-1.5">
                                                    <span className="material-icons-outlined text-primary" style={{ fontSize: '14px' }}>check_circle</span>
                                                </div>
                                            )}
                                        </button>

                                        {/* Hover Image Tooltip */}
                                        {hoveredSoil === s.value && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
                                                <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-36">
                                                    <div
                                                        className="w-full h-24 bg-cover bg-center"
                                                        style={{ backgroundColor: s.color, backgroundImage: `url(${s.image})` }}
                                                    />
                                                    <div className="px-2 py-1.5 text-center">
                                                        <p className="text-[11px] font-bold text-gray-800">{s.marathi}</p>
                                                        <p className="text-[9px] text-gray-500">{s.desc}</p>
                                                    </div>
                                                </div>
                                                {/* Arrow */}
                                                <div className="w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 mx-auto -mt-1.5 shadow-sm" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Button - Logic for Disabled State */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            {validationMessage && (
                                <div className="mb-4 text-center text-red-500 text-sm font-medium animate-pulse">
                                    {validationMessage}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={submitLoading || !isFormValid()}
                                className={`w-full group py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 text-[15px] font-bold active:scale-[0.99]
                                    ${submitLoading
                                        ? "bg-gray-100 text-gray-400 cursor-wait shadow-none"
                                        : isFormValid()
                                            ? "bg-[#4CAF50] hover:bg-[#388E3C] text-white shadow-lg shadow-green-200"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                    }`}
                            >
                                {submitLoading ? (
                                    <>
                                        <span className="material-icons-outlined text-[20px] animate-spin">refresh</span>
                                        <span>Analyzing Space Data...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons-outlined text-[20px]">auto_awesome</span>
                                        <span>सर्वोत्तम पिके शोधा</span>
                                        <span className="material-icons-outlined text-[20px] group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
                                    </>
                                )}
                            </button>

                            {/* Visual Readiness Indicators */}
                            <div className="flex justify-center gap-6 mt-4 opacity-70">
                                <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${location ? "text-green-600" : "text-gray-400"}`}>
                                    <span className="material-icons-outlined text-sm">{location ? "check_circle" : "radio_button_unchecked"}</span>
                                    GPS Location
                                </div>
                                <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${area && parseFloat(area) > 0 ? "text-green-600" : "text-gray-400"}`}>
                                    <span className="material-icons-outlined text-sm">{area && parseFloat(area) > 0 ? "check_circle" : "radio_button_unchecked"}</span>
                                    Land Area
                                </div>
                            </div>
                        </div>

                    </div>

                    <footer className="mt-8 text-center text-xs text-ui-muted pb-8">
                        <p>© 2024 Smart Peak Advisory. Powered by Satellite Intelligence.</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}
