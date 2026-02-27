"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import EnvironmentalLoadingScreen from "@/components/EnvironmentalLoadingScreen";

// ── Types ─────────────────────────────────────────────────────────────────────
type WaterSource = "rain" | "limited" | "sufficient";
type BudgetLevel = "low" | "medium" | "high";
type AreaUnit = "acre" | "hectare";
type SoilType = "Black" | "Red" | "Loamy" | "Alluvial" | "Sandy" | "Clayey";

// ── Constants ─────────────────────────────────────────────────────────────────
const WATER_MAP: Record<WaterSource, string> = {
  rain: "Rainfed",
  limited: "Limited",
  sufficient: "Adequate",
};

const BUDGET_MAP: Record<BudgetLevel, number> = {
  low: 20000,
  medium: 40000,
  high: 70000,
};

const SOIL_OPTIONS: { value: SoilType; label: string; marathi: string; color: string; desc: string; image: string }[] = [
  { value: "Black", label: "Black", marathi: "काळी माती", color: "#3D2B1F", desc: "Cotton, Soybean", image: "/images/soils/Black%20Soil.png" },
  { value: "Red", label: "Red", marathi: "लाल माती", color: "#C1440E", desc: "Groundnut, Millets", image: "/images/soils/Red%20Soil.png" },
  { value: "Loamy", label: "Loamy", marathi: "चिकणमाती", color: "#8B6914", desc: "Wheat, Vegetables", image: "/images/soils/Loamy%20Soil.png" },
  { value: "Alluvial", label: "Alluvial", marathi: "गाळाची माती", color: "#C4A35A", desc: "Rice, Sugarcane", image: "/images/soils/Alluvial%20Soil.png" },
  { value: "Sandy", label: "Sandy", marathi: "वालुकामय", color: "#D4B483", desc: "Groundnut, Bajra", image: "/images/soils/Sandy%20Soil.png" },
  { value: "Clayey", label: "Clayey", marathi: "चिकट माती", color: "#7B6B52", desc: "Rice, Jute", image: "/images/soils/Clay%20Soil.png" },
];

function detectSeason(): string {
  const m = new Date().getMonth() + 1; // 1-12
  if (m >= 6 && m <= 10) return "खरीप हंगाम";
  if (m >= 11 || m <= 3) return "रब्बी हंगाम";
  return "झैद हंगाम";
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();

  // Form state
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState<AreaUnit>("acre");
  const [waterSource, setWaterSource] = useState<WaterSource>("sufficient");
  const [budget, setBudget] = useState<BudgetLevel>("high");
  const [soilType, setSoilType] = useState<SoilType | null>(null);
  const [hoveredSoil, setHoveredSoil] = useState<SoilType | null>(null);

  // Location state
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Computed
  const currentSeason = detectSeason();
  const areaInAcres = area
    ? unit === "hectare"
      ? parseFloat(area) * 2.471
      : parseFloat(area)
    : null;
  const estimatedBudgetTotal = areaInAcres ? Math.round(areaInAcres * BUDGET_MAP[budget]) : null;

  // ── Location ────────────────────────────────────────────────────────────────
  const fetchLocation = useCallback(() => {
    setIsLoadingLocation(true);
    setLocationError(false);

    if (!navigator.geolocation) {
      setLocationError(true);
      setIsLoadingLocation(false);
      setShowLocationModal(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
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
          setShowLocationModal(false);
        } catch {
          setLocationName("Location found");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      () => {
        setLocationError(true);
        setIsLoadingLocation(false);
        setShowLocationModal(true);
      },
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // ── Analyze ─────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    setValidationError(null);

    // 1. Validate area
    const parsedArea = parseFloat(area);
    if (!area || isNaN(parsedArea) || parsedArea <= 0) {
      setValidationError("कृपया वैध क्षेत्रफळ प्रविष्ट करा");
      return;
    }

    // 2. Require real GPS — no hardcoded fallback
    let lat: number;
    let lon: number;

    if (coords) {
      lat = coords.lat;
      lon = coords.lon;
    } else {
      // Try one more time to get location
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 })
        );
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        setCoords({ lat, lon });
      } catch {
        // Block navigation — show GPS modal
        setShowLocationModal(true);
        setValidationError("विश्लेषणासाठी GPS स्थान आवश्यक आहे");
        return;
      }
    }

    const finalAreaAcres = unit === "hectare" ? parsedArea * 2.471 : parsedArea;

    const params: Record<string, string> = {
      lat: lat.toString(),
      lon: lon.toString(),
      area: finalAreaAcres.toFixed(4),
      water: WATER_MAP[waterSource],
      budget: BUDGET_MAP[budget].toString(),
    };
    if (soilType) params.soil = soilType;

    setIsAnalyzing(true);
    setAnalysisProgress(10);

    setTimeout(() => {
      setAnalysisProgress(50);
      setTimeout(() => {
        router.push(`/crop-analysis?${new URLSearchParams(params).toString()}`);
      }, 800);
    }, 1500);
  };

  // ── Loading Screen ──────────────────────────────────────────────────────────
  if (isAnalyzing) {
    return <EnvironmentalLoadingScreen stats={null} progress={analysisProgress} />;
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen flex bg-[#F4F6F9] text-[#1a1a1a] overflow-hidden"
      style={{ fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}
    >
      {/* ── Location Modal ─────────────────────────────────────────────────── */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500">
              <span className="material-icons-outlined text-3xl">location_off</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">GPS आवश्यक आहे</h3>
            <p className="text-gray-500 mb-7 text-sm leading-relaxed">
              तुमच्या स्थानावर आधारित वैयक्तिक पीक शिफारसी मिळवण्यासाठी GPS चालू करा.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setShowLocationModal(false); fetchLocation(); }}
                className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
              >
                <span className="material-icons-outlined text-lg">my_location</span>
                GPS चालू करा
              </button>
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl transition-colors"
              >
                नंतर करा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="w-[68px] bg-white flex flex-col items-center py-5 shadow-[2px_0_12px_rgba(0,0,0,0.04)] z-20 flex-shrink-0 border-r border-gray-100">
        <div className="mb-8">
          <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-[#4CAF50]">
            <span className="material-icons-outlined text-[22px]">spa</span>
          </div>
        </div>
        <nav className="flex-1 w-full flex flex-col gap-1 items-center">
          {[
            { icon: "grid_view", active: false },
            { icon: "show_chart", active: false },
            { icon: "tune", active: false },
          ].map(({ icon, active }) => (
            <a
              key={icon}
              href="#"
              className={`w-full flex justify-center py-3 transition-colors ${active ? "text-[#4CAF50]" : "text-gray-400 hover:text-[#4CAF50]"}`}
            >
              <span className="material-icons-outlined text-[22px]">{icon}</span>
            </a>
          ))}
          <div className="relative w-full flex justify-center py-3">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-[#4CAF50] rounded-r-full" />
            <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-[#4CAF50]">
              <span className="material-icons-outlined text-[22px]">add_circle_outline</span>
            </div>
          </div>
        </nav>
        <div className="mt-auto">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#4CAF50] transition-colors cursor-pointer">
            <span className="material-icons-outlined text-[20px]">person_outline</span>
          </div>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Header */}
        <header className="bg-white px-7 py-3.5 flex justify-between items-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] z-10 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#4CAF50]">
              <span className="material-icons-outlined text-[20px]">eco</span>
            </div>
            <div>
              <h1 className="text-[17px] font-bold text-gray-900 leading-tight tracking-tight">
                स्मार्ट पीक सल्लागार
              </h1>
              <p className="text-[11px] text-[#4CAF50] font-semibold tracking-wide">
                NASA उपग्रह डेटा आधारित
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Location Pill */}
            <button
              onClick={() => locationError ? setShowLocationModal(true) : undefined}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-[13px] font-medium transition-all select-none ${locationError
                ? "bg-red-50 border-red-200 text-red-600 cursor-pointer hover:bg-red-100"
                : "bg-gray-50 border-gray-200 text-gray-600 cursor-default"
                }`}
            >
              <span className={`material-icons-outlined text-[16px] ${isLoadingLocation ? "animate-spin" : ""}`}>
                {locationError ? "location_disabled" : isLoadingLocation ? "sync" : "location_on"}
              </span>
              <span className="max-w-[160px] truncate">
                {isLoadingLocation
                  ? "Locating..."
                  : locationError
                    ? "Location Disabled"
                    : locationName || "Detecting..."}
              </span>
            </button>

            {/* Season Pill — dynamic */}
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E8F5E9] rounded-lg border border-[#4CAF50]/25 text-[13px] text-[#2E7D32] font-semibold">
              <span className="material-icons-outlined text-[16px]">calendar_month</span>
              <span>{currentSeason}</span>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
              <button className="px-3 py-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-800 transition-colors rounded-md">
                English
              </button>
              <button className="px-3 py-1.5 text-[12px] font-bold bg-[#FFC107] text-gray-900 rounded-md shadow-sm">
                मराठी
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">

            {/* ── Split Layout: Form (left) + Summary (right) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

              {/* ── LEFT: Form Card ── */}
              <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-100 p-7 md:p-9">

                {/* Section 1: Land */}
                <FormSection number={1} title="जमिनीचा तपशील" active>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <span className="material-icons-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                        agriculture
                      </span>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        placeholder="क्षेत्रफळ (उदा. 2.5)"
                        value={area}
                        onChange={(e) => { setArea(e.target.value); setValidationError(null); }}
                        className={`w-full pl-11 pr-4 py-3.5 bg-[#F8F9FA] border rounded-xl focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] text-gray-800 placeholder-gray-400 transition-all outline-none text-[14px] ${validationError ? "border-red-300 bg-red-50" : "border-gray-200"
                          }`}
                      />
                    </div>
                    <div className="flex bg-[#F8F9FA] p-1.5 rounded-xl border border-gray-200 flex-shrink-0 h-[52px]">
                      {(["acre", "hectare"] as AreaUnit[]).map((u) => (
                        <button
                          key={u}
                          onClick={() => setUnit(u)}
                          className={`px-5 h-full rounded-lg font-semibold text-[13px] transition-all ${unit === u
                            ? "bg-white text-[#4CAF50] shadow-sm border border-gray-100"
                            : "bg-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                          {u === "acre" ? "एकर" : "हेक्टर"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {validationError && (
                    <p className="text-red-500 text-[12px] mt-2 flex items-center gap-1">
                      <span className="material-icons-outlined text-[14px]">error_outline</span>
                      {validationError}
                    </p>
                  )}
                  {areaInAcres && !isNaN(areaInAcres) && unit === "hectare" && (
                    <p className="text-[12px] text-gray-400 mt-2">
                      ≈ {areaInAcres.toFixed(2)} एकर
                    </p>
                  )}
                </FormSection>

                <Divider />

                {/* Sections 2 & 3 side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-7">

                  {/* Section 2: Water */}
                  <FormSection number={2} title="पाणी उपलब्धता">
                    <div className="space-y-2.5">
                      <WaterOption
                        selected={waterSource === "rain"}
                        onClick={() => setWaterSource("rain")}
                        icon="water_drop"
                        iconColor="#78909C"
                        title="केवळ पावसावर"
                        subtitle="सिंचन नाही"
                        badge="Rainfed"
                      />
                      <WaterOption
                        selected={waterSource === "limited"}
                        onClick={() => setWaterSource("limited")}
                        icon="opacity"
                        iconColor="#42A5F5"
                        title="मर्यादित पाणी"
                        subtitle="विहीर / बोअरवेल"
                        badge="Limited"
                      />
                      <WaterOption
                        selected={waterSource === "sufficient"}
                        onClick={() => setWaterSource("sufficient")}
                        icon="waves"
                        iconColor="#26C6DA"
                        title="पुरेशी पाणी"
                        subtitle="कॅनॉल / नदी / 24 तास"
                        badge="Adequate"
                      />
                    </div>
                  </FormSection>

                  {/* Section 3: Budget */}
                  <FormSection number={3} title="बजेट / एकर">
                    <div className="space-y-2.5">
                      <BudgetOption
                        selected={budget === "low"}
                        onClick={() => setBudget("low")}
                        amount="₹15k – ₹25k"
                        label="कमी खर्च"
                        icon="account_balance_wallet"
                        color="#FF9800"
                        bg="bg-orange-50"
                        border="border-[#FF9800]"
                      />
                      <BudgetOption
                        selected={budget === "medium"}
                        onClick={() => setBudget("medium")}
                        amount="₹25k – ₹40k"
                        label="मध्यम"
                        icon="payments"
                        color="#2196F3"
                        bg="bg-blue-50"
                        border="border-[#2196F3]"
                      />
                      <BudgetOption
                        selected={budget === "high"}
                        onClick={() => setBudget("high")}
                        amount="₹40k – ₹80k+"
                        label="जास्त उत्पादन"
                        icon="trending_up"
                        color="#2E7D32"
                        bg="bg-green-50"
                        border="border-[#2E7D32]"
                      />
                    </div>
                  </FormSection>
                </div>

                <Divider />

                {/* Section 4: Soil Type */}
                <FormSection number={4} title="माती प्रकार" subtitle="(ऐच्छिक — अधिक अचूक शिफारसींसाठी)">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {SOIL_OPTIONS.map((s) => (
                      <div key={s.value} className="relative">
                        <button
                          onClick={() => setSoilType(soilType === s.value ? null : s.value)}
                          onMouseEnter={() => setHoveredSoil(s.value as SoilType)}
                          onMouseLeave={() => setHoveredSoil(null)}
                          className={`w-full flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${soilType === s.value
                            ? "border-[#4CAF50] bg-[#F1F8E9] shadow-sm"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full shadow-inner border border-black/10 flex-shrink-0"
                            style={{ backgroundColor: s.color }}
                          />
                          <span className="text-[11px] font-semibold text-gray-700 leading-tight text-center">
                            {s.marathi}
                          </span>
                          <span className="text-[9px] text-gray-400 text-center leading-tight">{s.desc}</span>
                          {soilType === s.value && (
                            <div className="absolute top-1.5 right-1.5">
                              <span className="material-icons-outlined text-[#4CAF50]" style={{ fontSize: '13px' }}>check_circle</span>
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
                            <div className="w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 mx-auto -mt-1.5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </FormSection>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleAnalyze}
                    disabled={!coords || !area || parseFloat(area) <= 0}
                    className={`w-full group active:scale-[0.99] font-bold py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 text-[15px] ${coords && area && parseFloat(area) > 0
                      ? "bg-[#4CAF50] hover:bg-[#388E3C] text-white shadow-lg shadow-green-200 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      }`}
                  >
                    <span className="material-icons-outlined text-[20px]">auto_awesome</span>
                    <span>सर्वोत्तम पिके शोधा</span>
                    <span className="material-icons-outlined text-[20px] group-hover:translate-x-1 transition-transform duration-200">
                      arrow_forward
                    </span>
                  </button>
                  {/* Readiness indicators */}
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <div className={`flex items-center gap-1 text-[11px] font-medium ${coords ? "text-green-500" : "text-red-400"}`}>
                      <span className="material-icons-outlined text-[13px]">{coords ? "check_circle" : "cancel"}</span>
                      <span>GPS {coords ? "✓" : "आवश्यक"}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-[11px] font-medium ${area && parseFloat(area) > 0 ? "text-green-500" : "text-gray-400"}`}>
                      <span className="material-icons-outlined text-[13px]">{area && parseFloat(area) > 0 ? "check_circle" : "radio_button_unchecked"}</span>
                      <span>क्षेत्रफळ {area && parseFloat(area) > 0 ? "✓" : "आवश्यक"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Summary Panel ── */}
              <div className="flex flex-col gap-4">

                {/* Farm Summary Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-5">
                  <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                    शेत सारांश
                  </h3>

                  <SummaryRow
                    icon="location_on"
                    label="स्थान"
                    value={
                      isLoadingLocation
                        ? "शोधत आहे..."
                        : locationError
                          ? "उपलब्ध नाही"
                          : locationName || "—"
                    }
                    iconColor={locationError ? "#EF5350" : "#4CAF50"}
                  />
                  <SummaryRow
                    icon="crop_square"
                    label="क्षेत्रफळ"
                    value={
                      areaInAcres && !isNaN(areaInAcres)
                        ? `${areaInAcres.toFixed(2)} एकर`
                        : "—"
                    }
                    iconColor="#7E57C2"
                  />
                  <SummaryRow
                    icon="water_drop"
                    label="पाणी"
                    value={
                      waterSource === "rain"
                        ? "केवळ पाऊस"
                        : waterSource === "limited"
                          ? "मर्यादित"
                          : "पुरेशी"
                    }
                    iconColor="#42A5F5"
                  />
                  <SummaryRow
                    icon="payments"
                    label="बजेट/एकर"
                    value={`₹${(BUDGET_MAP[budget] / 1000).toFixed(0)}k`}
                    iconColor="#FF9800"
                  />
                  <SummaryRow
                    icon="layers"
                    label="माती"
                    value={soilType ? SOIL_OPTIONS.find((s) => s.value === soilType)?.marathi || soilType : "निवडलेले नाही"}
                    iconColor="#8D6E63"
                  />
                  <SummaryRow
                    icon="calendar_month"
                    label="हंगाम"
                    value={currentSeason}
                    iconColor="#26A69A"
                    last
                  />
                </div>



                {/* Info Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0 mt-0.5">
                      <span className="material-icons-outlined text-[18px]">satellite_alt</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800 mb-1">NASA डेटा वापरतो</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        तापमान, पाऊस, GDD आणि मातीचा ओलावा यांचे 6 महिन्यांचे उपग्रह डेटा विश्लेषण.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="mt-6 text-center text-[12px] text-gray-400">
              © 2024 Smart Peak Advisory · Powered by NASA Satellite Intelligence
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FormSection({
  number,
  title,
  subtitle,
  active,
  children,
}: {
  number: number;
  title: string;
  subtitle?: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-0">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0 ${active
            ? "bg-[#4CAF50] text-white shadow-sm shadow-green-200"
            : "bg-gray-100 text-gray-500"
            }`}
        >
          {number}
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-gray-900 leading-tight">{title}</h2>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-100 my-7" />;
}

function WaterOption({
  selected,
  onClick,
  icon,
  iconColor,
  title,
  subtitle,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex items-center p-3.5 rounded-xl border-2 transition-all duration-200 ${selected
        ? "border-[#4CAF50] bg-[#F1F8E9] shadow-sm"
        : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
        }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-colors ${selected ? "bg-white shadow-sm" : "bg-gray-100"
          }`}
      >
        <span className="material-icons-outlined text-[18px]" style={{ color: selected ? iconColor : "#9CA3AF" }}>
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[15px] text-gray-900">{title}</h3>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5"
          style={
            selected
              ? { backgroundColor: `${iconColor}22`, color: iconColor }
              : { backgroundColor: "#F3F4F6", color: "#9CA3AF" }
          }
        >
          {subtitle}
        </span>
      </div>
      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
        {selected && (
          <span className="text-[10px] font-bold text-[#4CAF50] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <RadioDot checked={selected} />
      </div>
    </div>
  );
}

function BudgetOption({
  selected,
  onClick,
  amount,
  label,
  icon,
  color,
  bg,
  border,
}: {
  selected: boolean;
  onClick: () => void;
  amount: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex items-center p-3.5 rounded-xl border-2 transition-all duration-200 ${selected ? `${border} ${bg} shadow-sm` : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
        }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${selected ? "bg-white shadow-sm" : "bg-gray-100"
          }`}
      >
        <span
          className="material-icons-outlined text-[18px]"
          style={{ color: selected ? color : "#9CA3AF" }}
        >
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[15px] text-gray-900">{amount}</h3>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5"
          style={
            selected
              ? { backgroundColor: `${color}18`, color }
              : { backgroundColor: "#F3F4F6", color: "#9CA3AF" }
          }
        >
          {label}
        </span>
      </div>
      <RadioDot checked={selected} color={color} />
    </div>
  );
}

function RadioDot({ checked, color = "#4CAF50" }: { checked: boolean; color?: string }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${checked ? "" : "border-gray-300 bg-transparent"
        }`}
      style={checked ? { borderColor: color, backgroundColor: color } : {}}
    >
      {checked && <div className="w-2 h-2 bg-white rounded-full" />}
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  iconColor,
  last,
}: {
  icon: string;
  label: string;
  value: string;
  iconColor: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 py-2.5 ${!last ? "border-b border-gray-50" : ""}`}>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <span className="material-icons-outlined text-[15px]" style={{ color: iconColor }}>
          {icon}
        </span>
      </div>
      <span className="text-[12px] text-gray-400 flex-shrink-0 w-16">{label}</span>
      <span className="text-[13px] font-semibold text-gray-800 truncate">{value}</span>
    </div>
  );
}
