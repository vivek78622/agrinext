"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
// import AIDecisionEngine from "@/components/AIDecisionEngine"; // Kept for reference if needed later
// import RainfallAnalysisView from "@/components/RainfallAnalysisView"; // Kept for reference if needed later
import EnvironmentalLoadingScreen from "@/components/EnvironmentalLoadingScreen"; // Replaced by inline new design

function FullAnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [status, setStatus] = useState<string>("initializing");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [fullResult, setFullResult] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"loading" | "full">("loading");

  // Start Analysis on Mount
  useEffect(() => {
    const startAnalysis = async () => {
      try {
        if (analysisId || status !== "initializing") return;

        const cropIdsParam = searchParams.get("crop_ids");
        const cropIdParam = searchParams.get("crop_id");
        const latStr = searchParams.get("lat");
        const lonStr = searchParams.get("lon");
        const areaStr = searchParams.get("area");
        const budgetStr = searchParams.get("budget");
        const water = searchParams.get("water") || "Adequate";
        const soil = searchParams.get("soil") || "Loamy";

        if (!latStr || !lonStr) {
          console.error("Missing location");
          return;
        }

        let selectedIds: string[] = [];
        if (cropIdsParam) {
          selectedIds = cropIdsParam
            .split(",")
            .filter((s) => s.trim().length > 0);
        } else if (cropIdParam) {
          selectedIds = [cropIdParam];
        }

        if (selectedIds.length === 0) return;

        const payload = {
          selected_crop_ids: selectedIds,
          location: {
            lat: parseFloat(latStr),
            lon: parseFloat(lonStr),
          },
          land_area: parseFloat(areaStr || "5"),
          water_availability: water,
          budget_per_acre: parseFloat(budgetStr || "50000"),
          soil_type: soil,
        };

        const res = await fetch(
          "http://localhost:8000/api/crop-advisor/analysis/start",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        if (!res.ok) throw new Error("Failed to start analysis");

        const data = await res.json();
        setAnalysisId(data.analysis_id);
        setStatus("processing_model_1");
      } catch (e) {
        console.error("Analysis start error:", e);
      }
    };

    if (!analysisId) startAnalysis();
  }, [searchParams]);

  // Poll for updates
  useEffect(() => {
    if (!analysisId || status === "completed") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/crop-advisor/analysis/${analysisId}`,
        );
        if (!res.ok) return;

        const data = await res.json();
        setStatus(data.status);
        if (data.completed_steps) {
          setCompletedSteps(data.completed_steps);
        }

        if (data.status === "completed") {
          setFullResult(data.full_result);
          // Slight delay before successful transition
          setTimeout(() => setViewMode("full"), 1500); // Increased delay to show 100% state
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [analysisId, status]);

  // Render logic
  if (viewMode === "loading") {
    const totalSteps = 9;
    const currentStepCount = completedSteps.length;
    // Calculate percentage. If status is completed, force 100%.
    // Otherwise, map steps 0-8 to 0-90% range to leave room for final completion.
    const percentage =
      status === "completed"
        ? 100
        : Math.min(Math.round((currentStepCount / totalSteps) * 100), 95);

    // Map status to user-friendly text
    const getStatusText = (s: string) => {
      switch (s) {
        case "initializing":
          return "Initializing AI Engine...";
        case "processing_model_1":
          return "analyzing rainfall patterns...";
        case "processing_model_2":
          return "calibrating soil sensor data...";
        case "processing_model_3":
          return "evaluating irrigation needs...";
        case "processing_model_4":
          return "checking thermal suitability...";
        case "processing_model_5":
          return "calculating economic models...";
        case "processing_model_6":
          return "assessing risk factors...";
        case "processing_model_7":
          return "optimizing logistics routes...";
        case "processing_model_8":
          return "forecasting market demand...";
        case "processing_model_9":
          return "synthesizing final decision...";
        case "completed":
          return "Analysis Complete";
        default:
          return "Processing...";
      }
    };
    const statusText = getStatusText(status);

    return (
      <div className="min-h-screen flex flex-col font-display antialiased text-[#1E293B] overflow-hidden bg-white relative">
        {/* Radial Gradient Background - explicit match to design */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-[#f0fdf4] to-[#f8fafc] opacity-80"></div>

        {/* Top Navigation */}
        <nav className="absolute top-0 w-full px-8 py-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <span className="material-icons text-[#11d452] text-2xl">eco</span>
            <span className="font-bold text-lg tracking-tight text-[#0f172a]">
              CropAdvisory
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">
              Dashboard
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              Analysis
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              Settings
            </a>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center w-full px-4 relative z-10">
          {/* Central Processing Container */}
          <div className="relative w-full max-w-2xl flex flex-col items-center text-center space-y-16">
            {/* Header Group */}
            <div className="space-y-6 animate-fade-in-up flex flex-col items-center">
              <div className="w-20 h-20 bg-[#f0fdf4] rounded-2xl flex items-center justify-center ring-1 ring-[#dcfce7] shadow-[0_4px_20px_-4px_rgba(17,212,82,0.15)]">
                {status === "completed" ? (
                  <span className="material-icons text-[#11d452] text-4xl animate-scale-in">
                    check_circle
                  </span>
                ) : (
                  <span className="material-icons text-[#11d452] text-4xl animate-spin-slow">
                    autorenew
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#0f172a]">
                  AI Decision Engine
                </h1>
                <p className="text-lg text-gray-400 font-light flex items-center justify-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full bg-[#11d452] ${status !== "completed" ? "animate-pulse" : ""}`}
                  ></span>
                  {status === "completed"
                    ? "Generation successful"
                    : "Analyzing environmental signals..."}
                </p>
              </div>
            </div>

            {/* Progress Group */}
            <div
              className="w-full max-w-xl space-y-4 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              {/* Dynamic Status Text Area */}
              <div className="flex justify-between items-end px-1 mb-2">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#11d452] mb-1">
                    Current Task
                  </span>
                  <span className="text-base font-medium text-gray-800 transition-all duration-500 capitalize">
                    {statusText}
                  </span>
                </div>
                <span className="text-lg font-bold text-[#11d452] tabular-nums">
                  {percentage}%
                </span>
              </div>

              {/* Minimalist Progress Bar */}
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
                {/* Progress Fill */}
                <div
                  className="absolute top-0 left-0 h-full bg-[#11d452] rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(17,212,82,0.6)]"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              {/* Metadata Icons - Purely visual as per design */}
              <div className="flex justify-center gap-16 pt-12 opacity-40">
                <div className="flex flex-col items-center gap-3">
                  <span className="material-icons text-gray-400 text-2xl">
                    water_drop
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Moisture
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="material-icons text-gray-400 text-2xl">
                    wb_sunny
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Solar
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="material-icons text-gray-400 text-2xl">
                    grass
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Soil
                  </span>
                </div>
              </div>
            </div>

            {/* Completion Notification */}
            <div
              className={`transition-all duration-700 transform ${status === "completed" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-full py-3 px-6 flex items-center gap-3">
                <div className="bg-[#dcfce7] rounded-full p-1">
                  <span className="material-icons text-[#11d452] text-sm">
                    check
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  Rainfall Analysis Complete
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Metadata */}
        <footer className="absolute bottom-8 w-full px-8 flex justify-between items-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] z-50">
          <span>
            Session ID: {analysisId?.substring(0, 6) || "INIT"} • Secure
            Connection
          </span>

          {/* Skip Button */}
          <button
            onClick={() => {
              // Immediately complete
              setStatus("completed");
              setCompletedSteps(
                Array.from({ length: 9 }, (_, i) => `step_${i + 1}`),
              );
              // Force transition
              setViewMode("full");
            }}
            className="text-gray-400 hover:text-stitch-primary transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Skip Animation</span>
            <span className="material-icons text-sm">fast_forward</span>
          </button>
        </footer>
      </div>
    );
  }

  if (viewMode === "full") {
    // Data Extraction
    const bestCrop = fullResult?.final_decision?.best_crop || "Unknown Crop";
    const confidence = fullResult?.final_decision?.confidence_score || 0;
    const reasoningTrace =
      fullResult?.final_decision?.reasoning_summary ||
      "Analysis completed successfully.";

    // Attempting to mock/derive other values if not present
    const estYield = "48 bu/ac"; // Placeholder as requested by Stitch Design
    const marketPrice = "1,245.50"; // Placeholder
    const soilTemp = "62°F"; // Placeholder
    const soilMatch = 98; // Placeholder based on design

    return (
      <div className="bg-stitch-background-light text-stitch-text-main font-display antialiased min-h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center text-emerald-600">
              <span className="material-icons text-xl">biotech</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 tracking-tight">
                Agri-Advisor AI
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                Decision Intelligence Lab
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] bg-slate-50 border border-slate-100 px-3 py-1 rounded-full font-medium">
              <span className="material-symbols-outlined text-[14px]">
                terminal
              </span>
              <span>SYSTEM_TRACE: LAB-2941-X</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 bg-slate-50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold text-slate-800">
                LIVE ENGINE
              </span>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold ring-4 ring-emerald-50">
              JD
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 flex overflow-hidden">
          <section className="w-[60%] h-full overflow-y-auto border-r border-slate-200 bg-white p-10 relative">
            <div className="mb-16 border-l-4 border-emerald-500 pl-8 py-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100 uppercase tracking-widest">
                  Primary Recommendation
                </span>
                <span className="text-slate-500 text-xs">Runtime: 1,420ms</span>
              </div>
              <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">
                {bestCrop}{" "}
                <span className="text-slate-300 font-light italic text-2xl">
                  {bestCrop === "Soybean" ? "Glycine max" : ""}
                </span>
              </h1>
              <div className="flex items-center gap-8 mt-6">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                    Composite Score
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-600">
                    94<span className="text-slate-300 text-sm">/100</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-100"></div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                    Confidence
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-800">
                    {confidence}%
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-100"></div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                    Yield Forecast
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-800">
                    {estYield}{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative timeline-container before:absolute before:left-[3.25rem] before:top-4 before:bottom-0 before:w-px before:bg-slate-200 before:z-0">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-12 ml-14">
                Technical Reasoning Trace
              </h3>
              <div className="model-node relative pl-14 pb-12 mb-12 border-b border-slate-100/60 transition-all hover:bg-slate-50/50">
                <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center z-20 shadow-sm ring-1 ring-slate-200">
                  <span className="font-mono font-bold text-slate-800">01</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-black flex items-center">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-xl">
                      water_drop
                    </span>
                    Rainfall Feasibility Analysis
                    <span className="px-2 py-0.5 ml-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Optimal
                    </span>
                  </h4>
                  <div className="flex items-center gap-6 font-mono text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Score
                      </span>
                      <span className="text-emerald-600 font-bold">82/100</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Confidence
                      </span>
                      <span className="text-slate-800 font-bold">88%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-800 text-[14px] leading-relaxed">
                    Initial evaluation of the 6-month cumulative rainfall
                    indicates that total precipitation (812mm) aligns closely
                    with the crop’s optimal water requirement (780–900mm range).
                    Historical deviation from the 10-year mean shows a +6%
                    anomaly, which remains within safe agronomic tolerance.
                  </p>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 technical-data text-[13px]">
                    <div className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                      Distribution Modeling
                    </div>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>{" "}
                        Early vegetative stage receives adequate rainfall.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>{" "}
                        Flowering stage shows minimal dry-spell probability
                        (4%).
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>{" "}
                        No high-intensity flooding events projected.
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-3 gap-4 technical-data text-[12px]">
                    <div className="p-3 border border-slate-100 rounded bg-white">
                      <div className="text-slate-500 text-[9px] mb-1 font-bold">
                        DROUGHT PROB.
                      </div>
                      <div className="font-bold text-emerald-600">LOW (5%)</div>
                    </div>
                    <div className="p-3 border border-slate-100 rounded bg-white">
                      <div className="text-slate-500 text-[9px] mb-1 font-bold">
                        EXCESS RISK
                      </div>
                      <div className="font-bold text-amber-500">
                        MODERATE (12%)
                      </div>
                    </div>
                    <div className="p-3 border border-slate-100 rounded bg-white">
                      <div className="text-slate-500 text-[9px] mb-1 font-bold">
                        VARIABILITY
                      </div>
                      <div className="font-bold text-slate-800">STABLE</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 italic text-slate-500 text-[13px]">
                    <span className="font-bold text-slate-700 not-italic mr-2">
                      Conclusion:
                    </span>{" "}
                    Rainfall conditions are agronomically favorable with
                    manageable variability risk.
                  </div>
                </div>
              </div>
              <div className="model-node relative pl-14 pb-12 mb-12 border-b border-slate-100/60 transition-all hover:bg-slate-50/50">
                <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center z-20 shadow-sm ring-1 ring-slate-200">
                  <span className="font-mono font-bold text-slate-800">02</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-black flex items-center">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-xl">
                      grass
                    </span>
                    Soil Moisture &amp; Root Zone Health
                    <span className="px-2 py-0.5 ml-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Optimal
                    </span>
                  </h4>
                  <div className="flex items-center gap-6 font-mono text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Score
                      </span>
                      <span className="text-emerald-600 font-bold">84/100</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Confidence
                      </span>
                      <span className="text-slate-800 font-bold">91%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-800 text-[14px] leading-relaxed">
                    Soil moisture index indicates 72% field capacity saturation.
                    Root-zone moisture depth (0–30cm) remains stable, suggesting
                    strong early-stage germination support.
                  </p>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 technical-data text-[13px]">
                    <div className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                      Nutrient Interaction Matrix
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[10px]">
                          NITROGEN
                        </span>
                        <span className="font-bold">
                          12ppm{" "}
                          <span className="text-[10px] text-emerald-500">
                            (LOW)
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[10px]">
                          PHOSPHORUS
                        </span>
                        <span className="font-bold">
                          45ppm{" "}
                          <span className="text-[10px] text-emerald-500">
                            (OPT)
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-[10px]">
                          POTASSIUM
                        </span>
                        <span className="font-bold">
                          180ppm{" "}
                          <span className="text-[10px] text-emerald-500">
                            (HIGH)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 technical-data text-[12px]">
                    <div className="p-3 border border-slate-100 rounded bg-white flex justify-between items-center">
                      <span className="text-slate-500 uppercase font-bold text-[9px]">
                        Irrigation Urgency
                      </span>
                      <span className="font-bold text-emerald-600">LOW</span>
                    </div>
                    <div className="p-3 border border-slate-100 rounded bg-white flex justify-between items-center">
                      <span className="text-slate-500 uppercase font-bold text-[9px]">
                        Root Stability
                      </span>
                      <span className="font-bold text-emerald-600">STRONG</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 italic text-slate-500 text-[13px]">
                    <span className="font-bold text-slate-700 not-italic mr-2">
                      Conclusion:
                    </span>{" "}
                    Soil conditions are compatible with deep-rooted and
                    nitrogen-fixing crops.
                  </div>
                </div>
              </div>
              <div className="model-node relative pl-14 pb-12 mb-12 border-b border-slate-100/60 transition-all hover:bg-slate-50/50">
                <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center z-20 shadow-sm ring-1 ring-slate-200">
                  <span className="font-mono font-bold text-slate-800">03</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-black flex items-center">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-xl">
                      waves
                    </span>
                    Water Balance Simulation
                    <span className="px-2 py-0.5 ml-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Optimal
                    </span>
                  </h4>
                  <div className="flex items-center gap-6 font-mono text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Score
                      </span>
                      <span className="text-emerald-600 font-bold">80/100</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Confidence
                      </span>
                      <span className="text-slate-800 font-bold">86%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-800 text-[14px] leading-relaxed">
                    Evapotranspiration model (ET₀) estimates seasonal water
                    demand at 765mm. Available rainfall + irrigation capacity
                    yields 783mm effective water availability.
                  </p>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 technical-data text-[13px]">
                    <div className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                      Monte Carlo Simulation (1,000 Iterations)
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">
                          No Water Stress Probability
                        </span>
                        <span className="font-bold text-emerald-600">
                          92.0%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span>Mild Stress: 6%</span>
                        <span>Moderate Stress: 2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 italic text-slate-500 text-[13px]">
                    <span className="font-bold text-slate-700 not-italic mr-2">
                      Conclusion:
                    </span>{" "}
                    Water balance is stable with low deficit risk.
                  </div>
                </div>
              </div>
              <div className="model-node relative pl-14 pb-12 mb-12 border-b border-slate-100/60 transition-all hover:bg-slate-50/50">
                <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center z-20 shadow-sm ring-1 ring-slate-200">
                  <span className="font-mono font-bold text-slate-800">04</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-black flex items-center">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-xl">
                      thermostat
                    </span>
                    Climate &amp; Thermal Regime
                    <span className="px-2 py-0.5 ml-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Optimal
                    </span>
                  </h4>
                  <div className="flex items-center gap-6 font-mono text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Score
                      </span>
                      <span className="text-emerald-600 font-bold">88/100</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Confidence
                      </span>
                      <span className="text-slate-800 font-bold">93%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-800 text-[14px] leading-relaxed">
                    Growing Degree Days (GDD) accumulation forecast matches 94%
                    of crop’s optimal requirement.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 technical-data text-[12px]">
                      <div className="text-[9px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        Heat Stress Analysis
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">
                          Days above threshold
                        </span>
                        <span className="font-bold text-amber-600">3</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-slate-700">Duration Impact</span>
                        <span className="font-bold text-emerald-600">
                          MINIMAL
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 technical-data text-[12px]">
                      <div className="text-[9px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        Climate Deviation
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Temp Variance</span>
                        <span className="font-bold text-slate-800">±1.2°C</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-slate-700">Risk Phase</span>
                        <span className="font-bold text-emerald-600">NONE</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 italic text-slate-500 text-[13px]">
                    <span className="font-bold text-slate-700 not-italic mr-2">
                      Conclusion:
                    </span>{" "}
                    Thermal regime highly compatible with crop physiology.
                  </div>
                </div>
              </div>
              <div className="model-node relative pl-14 pb-12 mb-12 border-b border-slate-100/60 transition-all hover:bg-slate-50/50">
                <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center z-20 shadow-sm ring-1 ring-slate-200">
                  <span className="font-mono font-bold text-slate-800">05</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-black flex items-center">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-xl">
                      account_balance
                    </span>
                    Economic Viability
                    <span className="px-2 py-0.5 ml-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                      Moderate
                    </span>
                  </h4>
                  <div className="flex items-center gap-6 font-mono text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Score
                      </span>
                      <span className="text-emerald-600 font-bold">85/100</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Confidence
                      </span>
                      <span className="text-slate-800 font-bold">89%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 technical-data text-[13px]">
                    <div className="grid grid-cols-3 gap-6 mb-4 pb-4 border-b border-slate-200/60">
                      <div>
                        <div className="text-slate-500 text-[9px] font-bold uppercase">
                          Est. Cost/Acre
                        </div>
                        <div className="font-bold">₹24,500</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[9px] font-bold uppercase">
                          Proj. Yield
                        </div>
                        <div className="font-bold">19 quintals</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[9px] font-bold uppercase">
                          Mkt. Price Est.
                        </div>
                        <div className="font-bold">₹5,200/q</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-slate-500 text-[9px] font-bold uppercase">
                          Expected Net Profit
                        </div>
                        <div className="text-2xl font-bold text-emerald-600">
                          ₹74,300
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-500 text-[9px] font-bold uppercase">
                          ROI Prob.
                        </div>
                        <div className="font-bold text-slate-800">
                          76% POSITIVE
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 italic text-slate-500 text-[13px]">
                    <span className="font-bold text-slate-700 not-italic mr-2">
                      Conclusion:
                    </span>{" "}
                    Strong economic feasibility under current conditions.
                  </div>
                </div>
              </div>
              <div className="model-node relative pl-14 pb-12 mb-12 border-b border-slate-100/60 transition-all hover:bg-slate-50/50">
                <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center z-20 shadow-sm ring-1 ring-slate-200">
                  <span className="font-mono font-bold text-slate-800">06</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-black flex items-center">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-xl">
                      warning
                    </span>
                    Composite Risk Index
                    <span className="px-2 py-0.5 ml-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                      Moderate
                    </span>
                  </h4>
                  <div className="flex items-center gap-6 font-mono text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Score
                      </span>
                      <span className="text-amber-600 font-bold">74/100</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Confidence
                      </span>
                      <span className="text-slate-800 font-bold">85%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 technical-data text-[13px]">
                    <div className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                      Risk Breakdown
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                      <div className="flex justify-between">
                        <span>Weather Risk</span>
                        <span className="font-bold">38/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Volatility</span>
                        <span className="font-bold">42/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pest Risk</span>
                        <span className="font-bold">28/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Institutional Risk</span>
                        <span className="font-bold">18/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-[12px] text-amber-800 technical-data">
                    <span className="font-bold uppercase mr-2">
                      Stress Test:
                    </span>{" "}
                    Under 15% price drop, profit remains positive. Under 20%
                    rainfall deviation, yield reduces 8%.
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 italic text-slate-500 text-[13px]">
                    <span className="font-bold text-slate-700 not-italic mr-2">
                      Conclusion:
                    </span>{" "}
                    Manageable systemic risk; Moderate-Low classification.
                  </div>
                </div>
              </div>
              <div className="model-node relative pl-14 pb-12 mb-12 border-b border-slate-100/60 transition-all hover:bg-slate-50/50">
                <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center z-20 shadow-sm ring-1 ring-slate-200">
                  <span className="font-mono font-bold text-slate-800">07</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-black flex items-center">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-xl">
                      local_shipping
                    </span>
                    Market Access
                    <span className="px-2 py-0.5 ml-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Optimal
                    </span>
                  </h4>
                  <div className="flex items-center gap-6 font-mono text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Score
                      </span>
                      <span className="text-emerald-600 font-bold">90/100</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Confidence
                      </span>
                      <span className="text-slate-800 font-bold">92%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 technical-data text-[12px]">
                    <div className="p-3 border border-slate-100 rounded bg-white">
                      <div className="text-slate-500 text-[9px] mb-1 font-bold">
                        NEAREST MANDI
                      </div>
                      <div className="font-bold text-slate-800">
                        18 km{" "}
                        <span className="text-emerald-500 font-normal ml-1">
                          (LOW COST)
                        </span>
                      </div>
                    </div>
                    <div className="p-3 border border-slate-100 rounded bg-white">
                      <div className="text-slate-500 text-[9px] mb-1 font-bold">
                        COLD STORAGE
                      </div>
                      <div className="font-bold text-emerald-600">PRESENT</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 italic text-slate-500 text-[13px]">
                    <span className="font-bold text-slate-700 not-italic mr-2">
                      Conclusion:
                    </span>{" "}
                    Market accessibility provides strong competitive advantage.
                  </div>
                </div>
              </div>
              <div className="model-node relative pl-14 pb-12 mb-12 border-b border-slate-100/60 transition-all hover:bg-slate-50/50">
                <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center z-20 shadow-sm ring-1 ring-slate-200">
                  <span className="font-mono font-bold text-slate-800">08</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-black flex items-center">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-xl">
                      trending_up
                    </span>
                    Demand &amp; Price Outlook
                    <span className="px-2 py-0.5 ml-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Optimal
                    </span>
                  </h4>
                  <div className="flex items-center gap-6 font-mono text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Score
                      </span>
                      <span className="text-emerald-600 font-bold">87/100</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">
                        Confidence
                      </span>
                      <span className="text-slate-800 font-bold">90%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-800 text-[14px] leading-relaxed">
                    Positive market sentiment observed across commodity
                    channels. Oversupply probability remains low (14%) for the
                    projected harvest window.
                  </p>
                  <div className="flex gap-4 technical-data text-[12px]">
                    <div className="flex-1 p-3 bg-emerald-50 border border-emerald-100 rounded text-emerald-700 flex flex-col items-center">
                      <span className="text-[9px] font-bold uppercase opacity-60">
                        Short-term
                      </span>
                      <span className="font-bold text-sm">BULLISH</span>
                    </div>
                    <div className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 flex flex-col items-center">
                      <span className="text-[9px] font-bold uppercase opacity-60">
                        Medium-term
                      </span>
                      <span className="font-bold text-sm">STABLE</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 italic text-slate-500 text-[13px]">
                    <span className="font-bold text-slate-700 not-italic mr-2">
                      Conclusion:
                    </span>{" "}
                    Demand fundamentals are supportive for this cycle.
                  </div>
                </div>
              </div>
              <div className="model-node relative pl-14 pb-20">
                <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-emerald-500 bg-emerald-600 flex items-center justify-center z-20 shadow-lg shadow-emerald-200">
                  <span className="font-mono font-bold text-white">09</span>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-emerald-50 border-2 border-emerald-500/50 rounded-2xl p-8 relative overflow-hidden group hover:border-emerald-600 hover:shadow-xl transition-all shadow-lg shadow-emerald-100/30">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <span className="material-symbols-outlined text-[120px]">
                      verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-2xl font-black text-black">
                      Final Decision Engine
                    </h4>
                    <div className="flex items-center gap-6 font-mono">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-emerald-600 font-bold uppercase">
                          Engine Output
                        </span>
                        <span className="text-4xl text-emerald-700 font-extrabold drop-shadow-sm">
                          94%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="technical-data">
                      <div className="text-[11px] font-black text-emerald-700 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">
                          calculate
                        </span>{" "}
                        Weighted Composite Formula
                      </div>
                      <div className="p-5 bg-white border border-emerald-200 rounded-xl text-[13px] leading-relaxed text-slate-800">
                        <code className="text-emerald-800 font-bold">
                          Overall Score =
                        </code>
                        <br />
                        (Climate × 0.15) + (Water × 0.12) + (Soil × 0.10) +
                        (Economic × 0.18) + (Market × 0.12) + (Demand × 0.13) +
                        (Risk Adjustment × -0.10)
                        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4 text-[11px]">
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded">
                            Rainfall Volatility (-2)
                          </span>
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded">
                            Market Fluctuation (-1)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="text-[11px] font-black text-slate-500 mb-4 uppercase tracking-[0.2em]">
                          Final Ranking
                        </div>
                        <div className="space-y-3 technical-data">
                          <div className="flex items-center justify-between p-3 bg-emerald-600 text-white rounded-lg shadow-md shadow-emerald-100">
                            <span className="font-bold">1. Soybean</span>
                            <span className="font-black">94</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-slate-800">
                            <span className="font-bold">2. Jowar</span>
                            <span className="font-bold">82</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-slate-500">
                            <span className="font-bold">3. Tomato</span>
                            <span className="font-bold text-slate-300">68</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-slate-500 mb-4 uppercase tracking-[0.2em]">
                          Recommended Strategy
                        </div>
                        <div className="p-4 bg-white border border-emerald-100 rounded-xl h-full flex flex-col justify-center text-center">
                          <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                            Cropping System
                          </span>
                          <div className="text-lg font-bold text-emerald-700">
                            STANDALONE
                          </div>
                          <div className="text-[11px] text-slate-500 mt-2">
                            Monocrop optimized for max ROI
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-lg shadow-emerald-100/50">
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">
                        Final Trace Conclusion
                      </div>
                      <p className="text-sm font-medium leading-relaxed">
                        Soybean demonstrates the highest risk-adjusted return
                        under current environmental and economic conditions.
                        Recommendation is locked and ready for deployment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="w-[40%] h-full bg-slate-50 border-l border-slate-200 p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Live Simulation Data
              </h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    settings_input_component
                  </span>
                </button>
                <button className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    ios_share
                  </span>
                </button>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-end mb-6">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Engine Confidence
                  </h3>
                  <span className="text-3xl font-mono font-black text-emerald-500">
                    {confidence}%
                  </span>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2 uppercase">
                      Soil Alignment
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: "98%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2 uppercase">
                      Climate Fit
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-emerald-500/70 rounded-full"
                        style={{ width: "88%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2 uppercase">
                      Economic Return
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-emerald-500/40 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-6">
                  Dynamic Risk Simulation
                </h3>
                <div className="aspect-square w-full bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <svg className="w-48 h-48 opacity-20" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="45"
                      stroke="#cbd5e1"
                      strokeWidth="0.5"
                    ></circle>
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="30"
                      stroke="#cbd5e1"
                      strokeWidth="0.5"
                    ></circle>
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="15"
                      stroke="#cbd5e1"
                      strokeWidth="0.5"
                    ></circle>
                    <path
                      d="M50 5 L50 95 M5 50 L95 50"
                      stroke="#cbd5e1"
                      strokeWidth="0.5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-40 h-40 fill-emerald-500/20 stroke-emerald-500 stroke-[1.5]"
                      viewBox="0 0 100 100"
                    >
                      <polygon points="50,15 85,50 65,85 35,85 15,50" />
                    </svg>
                  </div>
                  <span className="absolute top-4 text-[9px] font-black text-slate-500 uppercase">
                    Drought
                  </span>
                  <span className="absolute right-4 text-[9px] font-black text-slate-500 uppercase">
                    Pest
                  </span>
                  <span className="absolute bottom-4 text-[9px] font-black text-slate-500 uppercase">
                    Market
                  </span>
                  <span className="absolute left-4 text-[9px] font-black text-slate-500 uppercase">
                    Frost
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <div className="text-[9px] font-black text-red-500 uppercase mb-1">
                      Critical Risk
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      Root Rot
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <div className="text-[9px] font-black text-emerald-600 uppercase mb-1">
                      Mitigation
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      Drainage Alt
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Market: ZS Futures
                    </div>
                    <div className="text-lg font-mono font-black text-slate-800">
                      1,245.50{" "}
                      <span className="text-xs text-emerald-500 ml-2 font-bold">
                        +1.2%
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">
                    trending_up
                  </span>
                </div>
                <div className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Satellite Ortho
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      Field_Sec4_A2.jp2
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Processed 4h ago
                    </div>
                  </div>
                  <div
                    className="w-10 h-10 rounded border border-slate-100 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3QBbYfgepgaIYoFQ5wz2yMd3XkPGNM5g4vbZta6blzS9M6rR3t8aP-S3WB2jtOI3vWJtfa5JZgjaa9WaRJ-vaptsUAesofsDCCO6gTlsi4ZBfVVoinSbNja1WQ5ow-63qmPFMZ8mUdlB0TpEbWjDLnenoLBbBO7xaQWYBQHBWA6XxMstgvrLfTe2GZluLwWPyDwKyvFVWZUH4xPjKnBJndr6UsSkrmLUHmOH4xHaWSMQ8PjNamgF5wf0tZSSQms2ro0Khcm3F1yk')",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return null;
}

export default function FullAnalysisPage() {
  return (
    <Suspense fallback={<EnvironmentalLoadingScreen />}>
      {" "}
      {/* Keeping old loader for suspense state */}
      <FullAnalysisContent />
    </Suspense>
  );
}
