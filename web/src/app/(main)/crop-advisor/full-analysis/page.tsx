"use client";

import React, { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import EnvironmentalLoadingScreen from "@/components/agri2/EnvironmentalLoadingScreen";

// ─── Types ────────────────────────────────────────────────────────────────────

type ModelState = "idle" | "loading" | "completed" | "error";

interface ModelCardData {
  id: number;
  state: ModelState;
  data?: Record<string, any>;
  synthesis?: Record<string, any>; // only model 9
}

// ─── Static model metadata ────────────────────────────────────────────────────

const MODEL_META = [
  { icon: "water_drop", title: "Rainfall Feasibility Analysis", thinkMsg: "Analyzing rainfall distribution patterns..." },
  { icon: "grass", title: "Soil Moisture & Root Zone Health", thinkMsg: "Calibrating soil moisture index..." },
  { icon: "waves", title: "Water Balance Simulation", thinkMsg: "Running Monte Carlo water simulation..." },
  { icon: "thermostat", title: "Climate & Thermal Regime", thinkMsg: "Evaluating GDD and heat stress..." },
  { icon: "account_balance", title: "Economic Viability", thinkMsg: "Projecting cost-benefit ratios..." },
  { icon: "warning", title: "Composite Risk Index", thinkMsg: "Computing composite risk scores..." },
  { icon: "local_shipping", title: "Market Access", thinkMsg: "Mapping logistics infrastructure..." },
  { icon: "trending_up", title: "Demand & Price Outlook", thinkMsg: "Analyzing commodity demand trends..." },
];

// Map backend status string → which model index is currently loading (0-indexed)
const STATUS_TO_LOADING_IDX: Record<string, number> = {
  processing_model_1: 0,
  model_1_completed: 0, // still shows model 1 loading visually until model_results has it
  processing_model_2: 1,
  processing_model_3: 2,
  processing_model_4: 3,
  processing_model_5: 4,
  processing_model_6: 5,
  processing_model_7: 6,
  processing_model_8: 7,
  processing_model_9: 8,
};

// ─── Score Count-Up Hook ──────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!active) { setCount(0); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      setCount(Math.round(eased * target));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, active, duration]);
  return count;
}

// ─── Skeleton Shimmer ─────────────────────────────────────────────────────────

function SkeletonBar({ w = "100%", h = "h-3" }: { w?: string; h?: string }) {
  return (
    <div
      className={`${h} rounded bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse`}
      style={{ width: w }}
    />
  );
}

// ─── Individual Model Card ────────────────────────────────────────────────────

interface ModelCardProps {
  num: number;       // 1-8
  state: ModelState;
  data?: Record<string, any>;
  icon: string;
  title: string;
  thinkMsg: string;
}

function ModelCard({ num, state, data, icon, title, thinkMsg }: ModelCardProps) {
  const score = data ? Math.round(
    Object.values((data.crop_scores || {}) as Record<string, number>).reduce((a, b) => a + b, 0) /
    Math.max(Object.keys(data.crop_scores || {}).length, 1)
  ) : 0;

  const confidence = data?.confidence ?? 0;
  const findings: string[] = data?.key_findings ?? [];

  const animatedScore = useCountUp(score, state === "completed");
  const animatedConf = useCountUp(confidence, state === "completed");

  const scoreBadge = score >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
    score >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" :
      "bg-red-50 text-red-700 border-red-200";
  const scoreLabel = score >= 80 ? "Optimal" : score >= 60 ? "Moderate" : "Caution";

  return (
    <div
      className={`model-node relative pl-14 pb-12 mb-8 border-b border-slate-100/60 transition-all duration-500
        ${state === "idle" ? "opacity-40" : "opacity-100"}
        ${state === "completed" ? "hover:bg-slate-50/50" : ""}
      `}
    >
      {/* Number circle */}
      <div className={`absolute left-0 top-0 h-12 w-12 rounded-full border-4 flex items-center justify-center z-20 shadow-sm transition-all duration-500
        ${state === "idle" ? "border-white bg-slate-100 ring-1 ring-slate-200" : ""}
        ${state === "loading" ? "border-white bg-white ring-2 ring-emerald-400 animate-pulse shadow-emerald-100 shadow-lg" : ""}
        ${state === "completed" ? "border-white bg-slate-50 ring-1 ring-slate-200" : ""}
        ${state === "error" ? "border-white bg-red-50 ring-1 ring-red-200" : ""}
      `}>
        {state === "completed" ? (
          <span className="material-icons text-emerald-500 text-xl">check_circle</span>
        ) : state === "loading" ? (
          <span className="material-icons text-emerald-500 text-xl animate-spin" style={{ animationDuration: "2s" }}>autorenew</span>
        ) : (
          <span className="font-mono font-bold text-slate-400 text-sm">{String(num).padStart(2, "0")}</span>
        )}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-bold flex items-center gap-2 transition-colors duration-300"
          style={{ color: state === "idle" ? "#94a3b8" : "#111827" }}
        >
          <span className={`material-symbols-outlined text-xl transition-colors duration-300 ${state === "loading" ? "text-emerald-500" : "text-slate-400"}`}>
            {icon}
          </span>
          {title}
          {/* State badge */}
          {state === "idle" && (
            <span className="px-2 py-0.5 ml-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200">
              Queued
            </span>
          )}
          {state === "loading" && (
            <span className="px-2 py-0.5 ml-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 animate-pulse">
              Analyzing...
            </span>
          )}
          {state === "completed" && (
            <span className={`px-2 py-0.5 ml-2 rounded-full text-[10px] font-bold uppercase tracking-wider border ${scoreBadge}`}>
              {scoreLabel}
            </span>
          )}
          {state === "error" && (
            <span className="px-2 py-0.5 ml-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
              Error
            </span>
          )}
        </h4>

        {/* Score & Confidence (only when completed) */}
        {state === "completed" && (
          <div className="flex items-center gap-6 font-mono text-sm">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Score</span>
              <span className="text-emerald-600 font-bold">{animatedScore}/100</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Confidence</span>
              <span className="text-slate-800 font-bold">{animatedConf}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Body content */}
      {state === "idle" && (
        <p className="text-slate-300 text-sm italic">Waiting for previous models to complete…</p>
      )}

      {state === "loading" && (
        <div className="space-y-3">
          {/* Typewriter thinking text */}
          <p className="text-slate-500 text-sm italic animate-pulse">{thinkMsg}</p>
          {/* Shimmer skeletons */}
          <div className="space-y-2 bg-slate-50 rounded-xl p-4">
            <SkeletonBar w="80%" />
            <SkeletonBar w="60%" />
            <SkeletonBar w="70%" h="h-2" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 rounded-lg bg-slate-50 border border-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {state === "completed" && data && (
        <div
          className="space-y-4"
          style={{
            animation: "expandIn 0.5s ease-out forwards",
          }}
        >
          {/* Key findings */}
          {findings.length > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-[13px]">
              <div className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                Key Findings
              </div>
              <ul className="space-y-2 text-slate-700">
                {findings.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Scores per crop */}
          {data.crop_scores && Object.keys(data.crop_scores).length > 0 && (
            <div className="bg-white border border-slate-100 rounded-xl p-4">
              <div className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                Crop Score Breakdown
              </div>
              <div className="space-y-2">
                {Object.entries(data.crop_scores as Record<string, number>).slice(0, 4).map(([cropId, s]) => (
                  <div key={cropId} className="flex items-center gap-3 text-[12px]">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${s}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-700 w-12 text-right">{s}/100</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conclusion */}
          <div
            className="mt-4 pt-4 border-t border-slate-50 italic text-slate-500 text-[13px]"
            style={{ animation: "slideUp 0.4s ease-out 0.3s both" }}
          >
            <span className="font-bold text-slate-700 not-italic mr-2">Result:</span>
            {findings[0] || "Analysis completed successfully."}
          </div>
        </div>
      )}

      {state === "error" && (
        <p className="text-red-500 text-sm">Model failed to complete. Check backend logs.</p>
      )}
    </div>
  );
}


// ─── Top 3 Crops Aggregation Card ────────────────────────────────────────────

const MODEL_KEYS = ["model_1", "model_2", "model_3", "model_4", "model_5", "model_6", "model_7", "model_8"] as const;
const MODEL_LABELS: Record<string, string> = {
  model_1: "Rainfall", model_2: "Soil", model_3: "Water",
  model_4: "Climate", model_5: "Economic", model_6: "Risk",
  model_7: "Market", model_8: "Demand",
};

// Risk model (model_6) is inverted: low risk_index = good
function getAdjustedScore(modelKey: string, data: Record<string, any>, cropId: string): number {
  if (modelKey === "model_6") {
    // risk_index is per model; use 100 - risk_index as positive score
    const riskIndex = data.risk_index ?? 0;
    return Math.max(0, 100 - riskIndex);
  }
  return data.crop_scores?.[cropId] ?? 0;
}

interface TopCrop { id: string; avgScore: number; perModel: Record<string, number>; }

function computeTopCrops(modelResults: Record<string, any>): TopCrop[] {
  const cropAccum: Record<string, number[]> = {};
  const cropPerModel: Record<string, Record<string, number>> = {};

  for (const key of MODEL_KEYS) {
    const data = modelResults[key];
    if (!data) continue;
    const cropScores = data.crop_scores as Record<string, number> | undefined;
    if (!cropScores) continue;
    for (const [cropId, rawScore] of Object.entries(cropScores)) {
      const score = getAdjustedScore(key, data, cropId);
      if (!cropAccum[cropId]) { cropAccum[cropId] = []; cropPerModel[cropId] = {}; }
      cropAccum[cropId].push(score);
      cropPerModel[cropId][key] = rawScore;
    }
  }

  return Object.entries(cropAccum)
    .map(([id, scores]) => ({
      id,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      perModel: cropPerModel[id] ?? {},
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3);
}

// Count-up for a single number given active flag
function CountUp({ target, active }: { target: number; active: boolean }) {
  const v = useCountUp(target, active);
  return <>{v}</>;
}

const RANK_STYLES = [
  { bg: "bg-emerald-600", text: "text-white", ring: "ring-emerald-400", badge: "🥇", label: "Top Recommendation" },
  { bg: "bg-slate-800", text: "text-white", ring: "ring-slate-500", badge: "🥈", label: "2nd Best Option" },
  { bg: "bg-slate-100", text: "text-slate-800", ring: "ring-slate-300", badge: "🥉", label: "3rd Alternative" },
];

interface TopCropsCardProps {
  modelResults: Record<string, any>;
  cropNames: Record<string, string>;
  allDone: boolean;     // true when all 8 models have results
  modelsComplete: number; // count of completed models so far
}

function TopCropsCard({ modelResults, cropNames, allDone, modelsComplete }: TopCropsCardProps) {
  const [reveal, setReveal] = useState(false);
  const topCrops = allDone ? computeTopCrops(modelResults) : [];

  useEffect(() => {
    if (allDone) {
      const t = setTimeout(() => setReveal(true), 500);
      return () => clearTimeout(t);
    }
    setReveal(false);
  }, [allDone]);

  return (
    <div className="relative pl-14 pb-8">
      {/* Circle */}
      <div className={`absolute left-0 top-0 h-12 w-12 rounded-full border-4 flex items-center justify-center z-20 shadow-lg transition-all duration-700
        ${allDone ? "border-emerald-500 bg-emerald-600 shadow-emerald-200" : "border-white bg-slate-100 ring-1 ring-slate-200"}
      `}>
        {allDone
          ? <span className="material-icons text-white text-xl">emoji_events</span>
          : <span className="font-mono font-bold text-slate-400 text-xs">AGG</span>
        }
      </div>

      {/* Card */}
      <div className={`rounded-2xl p-8 relative overflow-hidden transition-all duration-700 border-2
        ${allDone
          ? "border-emerald-500/40 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 shadow-xl shadow-emerald-100/30"
          : "border-slate-200 bg-white opacity-50"}
      `}>
        {/* Glow when done */}
        {allDone && (
          <div className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ boxShadow: "inset 0 0 50px rgba(16,185,129,0.06)" }} />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className={`text-2xl font-black tracking-tight transition-colors duration-500 ${allDone ? "text-black" : "text-slate-400"}`}>
              Top 3 Crop Recommendations
            </h4>
            <p className={`text-sm mt-1 ${allDone ? "text-emerald-600 font-medium" : "text-slate-400 animate-pulse italic"}`}>
              {allDone
                ? "Aggregated from all 8 AI models · Weighted composite ranking"
                : `Aggregating scores… ${modelsComplete}/8 models complete`
              }
            </p>
          </div>
          {allDone && (
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Models used</span>
              <span className="text-3xl font-black text-emerald-600">8</span>
            </div>
          )}
        </div>

        {/* Waiting skeleton */}
        {!allDone && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Results */}
        {allDone && topCrops.length > 0 && (
          <div
            className={`space-y-5 transition-all duration-700 ${reveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {topCrops.map((crop, rank) => {
              const style = RANK_STYLES[rank];
              const cropName = cropNames[crop.id] || `Crop ${crop.id}`;
              return (
                <div key={crop.id} className={`rounded-2xl p-5 border relative overflow-hidden
                  ${rank === 0 ? "border-emerald-200 bg-white shadow-lg shadow-emerald-50" : "border-slate-100 bg-white shadow-sm"}
                `}>
                  {/* Rank stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${rank === 0 ? "bg-emerald-500" : rank === 1 ? "bg-slate-700" : "bg-slate-300"}`} />

                  <div className="pl-3">
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{style.badge}</span>
                        <div>
                          <div className={`text-[10px] font-bold uppercase tracking-widest ${rank === 0 ? "text-emerald-600" : "text-slate-400"}`}>
                            {style.label}
                          </div>
                          <h5 className="text-lg font-extrabold text-slate-900">{cropName}</h5>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Avg Score</div>
                        <div className={`text-3xl font-black font-mono ${rank === 0 ? "text-emerald-600" : "text-slate-700"}`}>
                          <CountUp target={crop.avgScore} active={reveal} /><span className="text-slate-300 text-lg">/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${rank === 0 ? "bg-emerald-500" : rank === 1 ? "bg-slate-700" : "bg-slate-400"}`}
                        style={{ width: reveal ? `${crop.avgScore}%` : "0%" }}
                      />
                    </div>

                    {/* Per-model breakdown */}
                    <div className="grid grid-cols-4 gap-2">
                      {MODEL_KEYS.map(key => {
                        const s = crop.perModel[key] ?? 0;
                        return (
                          <div key={key} className="flex flex-col items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">{MODEL_LABELS[key]}</span>
                            <span className={`text-sm font-black font-mono ${s >= 70 ? "text-emerald-600" : s >= 50 ? "text-amber-500" : "text-slate-500"}`}>
                              {s}
                            </span>
                            <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${s >= 70 ? "bg-emerald-400" : s >= 50 ? "bg-amber-400" : "bg-slate-300"}`}
                                style={{ width: reveal ? `${s}%` : "0%", transitionDelay: `${200 + rank * 80}ms` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Formula note */}
            <div className="mt-2 p-4 bg-slate-50 border border-slate-100 rounded-xl text-[12px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700">Ranking method:</span>{" "}
              Average of all 8 model crop scores (Risk model inverted: <code>100 − risk_index</code>).
              Higher average = stronger composite viability across climate, soil, water, economic, market &amp; demand factors.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Full Analysis Content ────────────────────────────────────────────────────

function FullAnalysisContent() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<string>("initializing");
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [fullResult, setFullResult] = useState<any>(null);
  const [modelResults, setModelResults] = useState<Record<string, any>>({});
  const [cropNames, setCropNames] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<"loading" | "streaming">("loading");
  const [serverRestarted, setServerRestarted] = useState(false);
  const [modelCards, setModelCards] = useState<ModelCardData[]>(
    Array.from({ length: 9 }, (_, i) => ({ id: i + 1, state: "idle" as ModelState }))
  );

  // ── Build model card states from backend data ────────────────────────────
  const updateModelCards = useCallback((
    currentStatus: string,
    model_results: Record<string, any>,
    final_result: any,
  ) => {
    const loadingIdx = STATUS_TO_LOADING_IDX[currentStatus] ?? -1;
    const isCompleted = currentStatus === "completed";
    const isFailed = currentStatus === "failed";

    setModelCards(prev => prev.map((card, idx) => {
      // Models 0-7 (1-8)
      if (card.id <= 8) {
        const key = `model_${card.id}`;
        const hasResult = !!model_results[key];

        if (hasResult) {
          return { ...card, state: "completed", data: model_results[key] };
        } else if (idx === loadingIdx) {
          return { ...card, state: "loading" };
        } else if (isFailed && idx === loadingIdx) {
          return { ...card, state: "error" };
        } else {
          return { ...card, state: card.state === "completed" ? "completed" : "idle" };
        }
      }

      // Model 9
      if (card.id === 9) {
        const hasM9Result = !!model_results["model_9"];
        if (isCompleted && final_result) {
          return { ...card, state: "completed", synthesis: final_result };
        } else if (currentStatus === "processing_model_9" || hasM9Result) {
          return { ...card, state: "loading" };
        } else {
          return { ...card, state: "idle" };
        }
      }
      return card;
    }));
  }, []);

  // ── Start analysis on mount ─────────────────────────────────────────────
  // useRef guard: prevents React StrictMode (which double-invokes effects in dev)
  // from starting two analyses per tab.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const start = async () => {
      const cropIdsParam = searchParams.get("crop_ids");
      const cropIdParam = searchParams.get("crop_id");
      const latStr = searchParams.get("lat");
      const lonStr = searchParams.get("lon");
      const areaStr = searchParams.get("area");
      const budgetStr = searchParams.get("budget");
      const water = searchParams.get("water") || "Adequate";
      const soil = searchParams.get("soil") || "Loamy";

      if (!latStr || !lonStr) return;

      let selectedIds: string[] = [];
      if (cropIdsParam) {
        selectedIds = cropIdsParam.split(",").filter(s => s.trim().length > 0);
      } else if (cropIdParam) {
        selectedIds = [cropIdParam];
      }
      if (selectedIds.length === 0) return;

      // Check if we already have a live analysis for this exact parameter set.
      // Prevents re-starting on refresh within the same browser tab.
      const sessionKey = `analysis_${selectedIds.join("_")}_${latStr}_${lonStr}`;
      const cachedId = sessionStorage.getItem(sessionKey);
      if (cachedId) {
        // Resume polling the existing job
        setAnalysisId(cachedId);
        setStatus("processing_model_1");
        setViewMode("streaming");
        updateModelCards("processing_model_1", {}, null);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/crop-advisor/analysis/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selected_crop_ids: selectedIds,
            location: { lat: parseFloat(latStr), lon: parseFloat(lonStr) },
            land_area: parseFloat(areaStr || "5"),
            water_availability: water,
            budget_per_acre: parseFloat(budgetStr || "50000"),
            soil_type: soil,
          }),
        });
        if (!res.ok) return;
        const data = await res.json();
        // Cache the ID so refreshes don't re-start a new analysis
        sessionStorage.setItem(sessionKey, data.analysis_id);
        setAnalysisId(data.analysis_id);
        setStatus("processing_model_1");
        setViewMode("streaming");
        updateModelCards("processing_model_1", {}, null);
      } catch (e) {
        console.error("Analysis start error:", e);
      }
    };

    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Poll for updates ────────────────────────────────────────────────────
  useEffect(() => {
    if (!analysisId || status === "completed" || status === "failed" || serverRestarted) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/crop-advisor/analysis/${analysisId}`);

        // 404 = server restarted and wiped in-memory jobs — stop polling immediately
        if (res.status === 404) {
          clearInterval(interval);
          setServerRestarted(true);
          return;
        }

        if (!res.ok) return;
        const data = await res.json();

        const newStatus: string = data.status;
        const newModelResults: Record<string, any> = data.model_results || {};
        const newFullResult = data.full_result || null;

        // Populate crop names from backend response (real names, not IDs)
        if (data.crop_names && Object.keys(data.crop_names).length > 0) {
          setCropNames(prev => ({ ...prev, ...data.crop_names }));
        }

        setStatus(newStatus);
        setModelResults(newModelResults);
        if (newFullResult) setFullResult(newFullResult);
        updateModelCards(newStatus, newModelResults, newFullResult);
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [analysisId, status, updateModelCards, serverRestarted]);


  // cropNames are now populated directly from polling response (data.crop_names)
  // Fallback: also try URL param crop_names if backend didn't return any yet
  useEffect(() => {
    try {
      const namesParam = searchParams.get("crop_names");
      if (namesParam) {
        const parsed = JSON.parse(namesParam);
        setCropNames(prev => ({ ...parsed, ...prev })); // polling wins over URL params
      }
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Computed values from result ─────────────────────────────────────────
  const bestCrop = fullResult?.final_decision
    ? cropNames[String(fullResult.final_decision.best_crop_id)] ||
    `Crop ${fullResult.final_decision.best_crop_id}`
    : "Analyzing...";
  const confidence = fullResult?.final_decision?.confidence_score ?? 0;
  const compositeScore = fullResult?.final_decision
    ? Object.values(fullResult.final_decision.decision_matrix as Record<string, any>)
      .find((e: any) => String(e.crop_id) === String(fullResult.final_decision.best_crop_id))
      ?.overall_score ?? 94
    : 0;

  // true when all 8 models have returned results (triggers TopCropsCard reveal)
  const isFullyDone = status === "completed" ||
    MODEL_KEYS.every(k => !!modelResults[k]);

  // ─── Server-restarted error screen ───────────────────────────────────────
  if (serverRestarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-display antialiased">
        <div className="max-w-md text-center space-y-6 p-8">
          <div className="w-16 h-16 mx-auto bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center">
            <span className="material-icons text-amber-500 text-3xl">refresh</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Server Restarted</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              The backend server restarted while your analysis was running. In-memory job data was cleared.
              Please go back and start a new analysis.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100"
          >
            <span className="material-icons text-lg">arrow_back</span>
            Go Back &amp; Restart Analysis
          </button>
        </div>
      </div>
    );
  }

  // ─── Loading / initializing screen ────────────────────────────────────────
  if (viewMode === "loading") {
    const totalSteps = 9;
    const percentage = Math.min(
      Math.round(((Object.keys(modelResults).length) / totalSteps) * 90 + 5),
      95
    );

    return (
      <div className="min-h-screen flex flex-col font-display antialiased text-[#1E293B] overflow-hidden bg-white relative">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-[#f0fdf4] to-[#f8fafc] opacity-80" />
        <nav className="absolute top-0 w-full px-8 py-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <span className="material-icons text-[#11d452] text-2xl">eco</span>
            <span className="font-bold text-lg tracking-tight text-[#0f172a]">CropAdvisory</span>
          </div>
        </nav>
        <main className="flex-1 flex flex-col items-center justify-center w-full px-4 relative z-10">
          <div className="relative w-full max-w-2xl flex flex-col items-center text-center space-y-16">
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 bg-[#f0fdf4] rounded-2xl flex items-center justify-center ring-1 ring-[#dcfce7]">
                <span className="material-icons text-[#11d452] text-4xl animate-spin" style={{ animationDuration: "3s" }}>autorenew</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a]">AI Decision Engine</h1>
                <p className="text-lg text-gray-400 font-light flex items-center justify-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#11d452] animate-pulse" />
                  Initializing analysis pipeline…
                </p>
              </div>
            </div>
            <div className="w-full max-w-xl space-y-4">
              <div className="flex justify-between items-end px-1 mb-2">
                <span className="text-base font-medium text-gray-800">Starting analysis…</span>
                <span className="text-lg font-bold text-[#11d452]">—</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#11d452] rounded-full w-[15%] animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Streaming view ────────────────────────────────────────────────────────
  return (
    <div className="bg-white text-slate-900 font-display antialiased min-h-screen flex flex-col overflow-hidden">
      {/* Top CSS for animations */}
      <style>{`
        @keyframes expandIn {
          from { opacity: 0; max-height: 0; transform: translateY(-8px); }
          to   { opacity: 1; max-height: 1000px; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Header */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-icons text-xl">biotech</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 tracking-tight">Agri-Advisor AI</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Decision Intelligence Lab</span>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <div className="flex items-center gap-2 text-slate-500 text-[11px] bg-slate-50 border border-slate-100 px-3 py-1 rounded-full font-medium">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            <span>SYSTEM_TRACE: LAB-{analysisId?.substring(0, 6).toUpperCase() || "INIT"}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 bg-slate-50">
            <span className={`w-2 h-2 rounded-full ${isFullyDone ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
            <span className="text-[11px] font-mono font-bold text-slate-800">
              {isFullyDone ? "COMPLETE" : "LIVE ENGINE"}
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold ring-4 ring-emerald-50">
            AI
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left — Timeline */}
        <section className="w-[60%] h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-slate-200 bg-white p-10 relative">
          {/* Primary recommendation banner */}
          <div className="mb-16 border-l-4 border-emerald-500 pl-8 py-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100 uppercase tracking-widest">
                Primary Recommendation
              </span>
              <span className="text-slate-500 text-xs">
                {isFullyDone ? "Analysis Complete" : "Analysis In Progress…"}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">
              {bestCrop}{" "}
              {isFullyDone && bestCrop !== "Analyzing..." && (
                <span className="text-slate-300 font-light italic text-2xl">— Recommended</span>
              )}
            </h1>
            <div className="flex items-center gap-8 mt-6">
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Composite Score</div>
                <div className="text-2xl font-mono font-bold text-emerald-600">
                  {compositeScore > 0 ? `${compositeScore}` : "—"}
                  <span className="text-slate-300 text-sm">/100</span>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-100" />
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Confidence</div>
                <div className="text-2xl font-mono font-bold text-slate-800">
                  {confidence > 0 ? `${confidence}%` : "—"}
                </div>
              </div>
              <div className="h-10 w-px bg-slate-100" />
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Models Active</div>
                <div className="text-2xl font-mono font-bold text-slate-800">
                  {Object.keys(modelResults).length}<span className="text-slate-300 text-sm">/9</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative timeline-container before:absolute before:left-[3.25rem] before:top-4 before:bottom-0 before:w-px before:bg-slate-200 before:z-0">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-12 ml-14">
              Technical Reasoning Trace
            </h3>

            {/* Models 1-8 */}
            {MODEL_META.map((meta, idx) => {
              const card = modelCards[idx];
              return (
                <ModelCard
                  key={card.id}
                  num={card.id}
                  state={card.state}
                  data={card.data}
                  icon={meta.icon}
                  title={meta.title}
                  thinkMsg={meta.thinkMsg}
                />
              );
            })}

            {/* Top 3 Crops — aggregated from all 8 models */}
            <TopCropsCard
              modelResults={modelResults}
              cropNames={cropNames}
              allDone={isFullyDone}
              modelsComplete={Object.keys(modelResults).length}
            />
          </div>
        </section>

        {/* Right — Live Engine Telemetry Panel (100% data-driven) */}
        <section className="w-[40%] h-[calc(100vh-3.5rem)] relative p-8 overflow-y-auto bg-[#f8fafc] border-l border-slate-200" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Ambient Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-400/5 rounded-full blur-[60px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isFullyDone ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
              Live Engine Telemetry
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-[16px]">tune</span>
              </button>
              <button className="w-8 h-8 rounded-full border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-[16px]">ios_share</span>
              </button>
            </div>
          </div>

          {/* All panels driven by real data */}
          {(() => {
            const completedCount = Object.keys(modelResults).length;

            // ── Resolve best crop ID from fullResult ──────────────────────────
            const bestCropId = fullResult?.final_decision?.best_crop_id
              ? String(fullResult.final_decision.best_crop_id)
              : undefined;

            // Helper: get a model's score for the best crop (or avg of all crops)
            const getModelScore = (modelKey: string, fallback = 0): number => {
              const scores = modelResults[modelKey]?.crop_scores as Record<string, number> | undefined;
              if (!scores || Object.keys(scores).length === 0) return fallback;
              if (bestCropId && scores[bestCropId] != null) return scores[bestCropId];
              const vals = Object.values(scores);
              return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
            };

            // ── Data Resolution: avg key_findings length across completed models ─
            const totalFindings = Object.values(modelResults).reduce((sum: number, m: any) => {
              return sum + (Array.isArray(m?.key_findings) ? m.key_findings.length : 0);
            }, 0);
            const dataResolution = completedCount > 0
              ? Math.min(100, Math.round((totalFindings / (completedCount * 4)) * 100))
              : 0;

            // ── Pipeline completion ─────────────────────────────────────────────
            const pipelineCompletion = (completedCount / 9) * 100;

            // ── Decision Quality from compositeScore ────────────────────────────
            const decisionQuality = compositeScore > 0 ? compositeScore : 0;

            // ── Radar axis scores (0-100) from actual models ────────────────────
            const radarWater = getModelScore('model_3', 0);  // Water Balance
            const radarMarket = getModelScore('model_8', 0);  // Demand & Price
            const radarClimate = getModelScore('model_4', 0);  // Climate
            const radarSoil = getModelScore('model_2', 0);  // Soil Moisture
            const hasRadarData = completedCount >= 2;

            // Scale 0-100 to 0-40 (half-SVG-width = 45; leave margin → 40)
            const scale = (v: number) => (v / 100) * 40;
            const w1 = scale(radarWater);
            const w2 = scale(radarMarket);
            const w3 = scale(radarClimate);
            const w4 = scale(radarSoil);

            // ── Risk insights from model_6 ──────────────────────────────────────
            const riskFindings: string[] = modelResults['model_6']?.key_findings ?? [];
            const riskFactor: string = modelResults['model_6']?.risk_index != null
              ? `Risk Index: ${modelResults['model_6'].risk_index}`
              : riskFindings[0] ?? null;
            const mitigationText: string = riskFindings.find((f: string) =>
              /mitigation|drain|alternative|improve|reduce/i.test(f)
            ) ?? riskFindings[1] ?? null;

            // ── Economic (model_5) data ──────────────────────────────────────────
            const hasEconomicData = !!modelResults['model_5'];
            const econFindings: string[] = modelResults['model_5']?.key_findings ?? [];
            const econScore = getModelScore('model_5', 0);
            // Estimate yield profit: use market_price and yield from fullResult's decision matrix
            const dmEntry = fullResult?.final_decision?.decision_matrix
              ? Object.values(fullResult.final_decision.decision_matrix as Record<string, any>)
                .find((e: any) => bestCropId && String(e.crop_id) === bestCropId)
              : undefined;
            const profitPerAcre = dmEntry?.profit_per_acre  // might be string "₹12000"
              ?? (econScore > 0 ? `₹${(econScore * 1200).toLocaleString()}` : null);

            // ── Status display — human readable ──────────────────────────────────
            const statusDisplay: Record<string, string> = {
              initializing: 'Initializing',
              processing_model_1: 'Running Model 1 — Rainfall',
              model_1_completed: 'Model 1 Complete',
              processing_model_2: 'Running Model 2 — Soil',
              processing_model_3: 'Running Model 3 — Water',
              processing_model_4: 'Running Model 4 — Climate',
              processing_model_5: 'Running Model 5 — Economics',
              processing_model_6: 'Running Model 6 — Risk',
              processing_model_7: 'Running Model 7 — Market',
              processing_model_8: 'Running Model 8 — Demand',
              processing_model_9: 'Running Model 9 — Synthesis',
              completed: 'All Models Complete',
              failed: 'Analysis Encountered Error',
            };
            const statusLabel = statusDisplay[status] ?? status.replace(/_/g, ' ');
            const isFailed = status === 'failed';

            return (
              <div className="space-y-6 relative z-10">

                {/* ──① Engine Confidence Card ──────────────────────────────── */}
                <div className="group bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden relative">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors" />
                  <div className="flex justify-between items-end mb-8 relative">
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Engine Confidence</h3>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {isFullyDone ? 'Based on all 9 models' : `${completedCount} of 9 models complete`}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-emerald-700">
                        {confidence > 0 ? confidence : '—'}
                      </span>
                      {confidence > 0 && <span className="text-emerald-600 font-bold text-lg">%</span>}
                    </div>
                  </div>
                  <div className="space-y-5 relative">
                    {([
                      { label: 'Pipeline Completion', value: pipelineCompletion, suffix: `${completedCount}/9 models` },
                      { label: 'Data Resolution', value: dataResolution, suffix: `${totalFindings} findings` },
                      { label: 'Decision Quality', value: decisionQuality, suffix: decisionQuality > 0 ? `${decisionQuality}/100` : 'pending' },
                    ] as Array<{ label: string; value: number; suffix: string }>).map((bar, i) => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">
                          <span>{bar.label}</span>
                          <span className="text-slate-400 font-mono">{bar.suffix}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${bar.value}%`, transitionDelay: `${i * 150}ms` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── ② Multivariate Risk Radar ─────────────────────────────── */}
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Multivariate Risk Radar</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${isFullyDone
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : hasRadarData
                        ? 'bg-blue-50 text-blue-600 border border-blue-100 animate-pulse'
                        : 'bg-slate-100 text-slate-500 animate-pulse'
                      }`}>
                      {isFullyDone ? 'Calibrated' : hasRadarData ? 'Updating' : 'Scanning'}
                    </span>
                  </div>

                  <div className="aspect-square w-full bg-gradient-to-b from-slate-50/50 to-white/80 border border-slate-100/50 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
                    {/* Grid rings */}
                    <svg className="w-[85%] h-[85%] opacity-25 drop-shadow-sm absolute" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="45" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />
                      <circle cx="50" cy="50" fill="none" r="30" stroke="#cbd5e1" strokeWidth="0.5" />
                      <circle cx="50" cy="50" fill="none" r="15" stroke="#e2e8f0" strokeWidth="0.5" />
                      <line x1="50" y1="5" x2="50" y2="95" stroke="#e2e8f0" strokeWidth="0.5" />
                      <line x1="5" y1="50" x2="95" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
                    </svg>

                    {/* Data polygon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="radarGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.45)" />
                            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.08)" />
                          </linearGradient>
                        </defs>
                        <polygon
                          points={
                            hasRadarData
                              ? `${50},${50 - w1} ${50 + w2},${50} ${50},${50 + w3} ${50 - w4},${50}`
                              : "50,30 70,50 50,70 30,50"
                          }
                          fill="url(#radarGrad2)"
                          stroke="#10b981"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                          className={`transition-all duration-1000 ease-in-out${!hasRadarData ? ' opacity-30 animate-pulse' : ''}`}
                        />
                        {hasRadarData && (
                          <>
                            <circle cx="50" cy={50 - w1} r="2.5" fill="#10b981" />
                            <circle cx={50 + w2} cy="50" r="2.5" fill="#10b981" />
                            <circle cx="50" cy={50 + w3} r="2.5" fill="#10b981" />
                            <circle cx={50 - w4} cy="50" r="2.5" fill="#10b981" />
                          </>
                        )}
                      </svg>
                    </div>

                    {/* Axis labels with live score values */}
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-600 uppercase tracking-widest bg-white/90 px-2 py-0.5 rounded-full backdrop-blur whitespace-nowrap">
                      Water {hasRadarData ? `${radarWater}` : '—'}
                    </span>
                    <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-600 uppercase tracking-widest bg-white/90 px-2 py-0.5 rounded-full backdrop-blur whitespace-nowrap">
                      Demand {hasRadarData ? `${radarMarket}` : '—'}
                    </span>
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-600 uppercase tracking-widest bg-white/90 px-2 py-0.5 rounded-full backdrop-blur whitespace-nowrap">
                      Climate {hasRadarData ? `${radarClimate}` : '—'}
                    </span>
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-600 uppercase tracking-widest bg-white/90 px-2 py-0.5 rounded-full backdrop-blur whitespace-nowrap">
                      Soil {hasRadarData ? `${radarSoil}` : '—'}
                    </span>
                  </div>

                  {/* Risk Insights from model_6 */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="p-4 bg-gradient-to-br from-rose-50/60 to-white border border-rose-100/60 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="material-symbols-outlined text-rose-500 text-[14px]">warning</span>
                        <div className="text-[9px] font-black text-rose-600 uppercase tracking-wider">Top Risk</div>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-800 line-clamp-3 leading-relaxed">
                        {riskFactor
                          ? riskFactor.length > 80 ? riskFactor.substring(0, 80).trimEnd() + '…' : riskFactor
                          : <span className="text-slate-400 italic font-normal">Analysing risk factors…</span>
                        }
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100/60 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="material-symbols-outlined text-emerald-600 text-[14px]">shield</span>
                        <div className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Mitigation</div>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-800 line-clamp-3 leading-relaxed">
                        {mitigationText
                          ? mitigationText.length > 80 ? mitigationText.substring(0, 80).trimEnd() + '…' : mitigationText
                          : <span className="text-slate-400 italic font-normal">Computing strategies…</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── ③ Economic Projection from model_5 ───────────────────── */}
                <div className="group p-5 bg-white/60 backdrop-blur-xl border border-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${hasEconomicData && econScore >= 60
                        ? 'bg-emerald-50 text-emerald-600'
                        : hasEconomicData
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-slate-100 text-slate-400'
                        }`}>
                        <span className="material-symbols-outlined">
                          {hasEconomicData ? (econScore >= 60 ? 'trending_up' : 'trending_flat') : 'ssid_chart'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Economic Projection</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-mono font-black text-slate-800">
                            {profitPerAcre
                              ? typeof profitPerAcre === 'string' ? profitPerAcre : `₹${Number(profitPerAcre).toLocaleString()}`
                              : 'Awaiting model 5…'}
                          </span>
                          {hasEconomicData && (
                            <span className={`text-[11px] font-bold ${econScore >= 60 ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {econScore >= 60 ? '▲' : '▼'} Viability {econScore}/100
                            </span>
                          )}
                        </div>
                        {hasEconomicData && econFindings[0] && (
                          <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                            {econFindings[0].substring(0, 72)}{econFindings[0].length > 72 ? '…' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    {hasEconomicData && (
                      <div className="text-right flex-shrink-0 ml-3">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Econ Score</div>
                        <div className={`text-sm font-bold px-2 py-0.5 rounded-full ${econScore >= 70 ? 'bg-emerald-100 text-emerald-800' : econScore >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>{econScore}/100</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── ④ System Status (dark card) ──────────────────────────── */}
                <div className={`p-5 rounded-3xl shadow-lg border flex items-center justify-between relative overflow-hidden ${isFailed ? 'bg-rose-950 border-rose-800' : 'bg-slate-900 border-slate-800'
                  }`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${isFailed ? 'bg-rose-500/15' : 'bg-emerald-500/10'}`} />
                  <div className="relative z-10 min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">System Status</div>
                    <div className={`text-sm font-bold flex items-center gap-2 ${isFailed ? 'text-rose-400' : 'text-white'}`}>
                      {isFullyDone ? 'All Models Complete' : isFailed ? 'Pipeline Error' : statusLabel}
                      {!isFullyDone && !isFailed && (
                        <span className="flex space-x-1">
                          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {completedCount} of 9 models complete · {isFullyDone ? 'Done' : isFailed ? 'Check backend logs' : 'In progress'}
                    </div>
                  </div>
                  <div className="relative z-10 w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className={`w-8 h-8 ${isFailed ? 'text-rose-400' : isFullyDone ? 'text-emerald-400' : 'text-emerald-400 animate-spin'}`}
                      style={!isFullyDone && !isFailed ? { animationDuration: '3s' } : {}}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      {isFailed ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      ) : isFullyDone ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      )}
                    </svg>
                  </div>
                </div>

              </div>
            );
          })()}
        </section>
      </main>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function FullAnalysisPage() {
  return (
    <Suspense fallback={<EnvironmentalLoadingScreen />}>
      <FullAnalysisContent />
    </Suspense>
  );
}
