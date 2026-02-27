import React from 'react';
import ModelCard from './ModelCard';

export default function TimelineNodes() {
  return (
    <div className="space-y-4">

      <ModelCard 
        number="01" 
        title="Rainfall Feasibility Analysis
                    
                      Optimal" 
        subtitle="Precipitation and water stress evaluation" 
        score="85"
        status="Optimal"
      >
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
      </ModelCard>
    
      <ModelCard 
        number="02" 
        title="Soil Moisture &amp; Root Zone Health
                    
                      Optimal" 
        subtitle="Nutrient density and pH evaluation" 
        score="85"
        status="Optimal"
      >
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
      </ModelCard>
    
      <ModelCard 
        number="03" 
        title="Water Balance Simulation
                    
                      Optimal" 
        subtitle="Cycle deficit and irrigation needs" 
        score="85"
        status="Optimal"
      >
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
      </ModelCard>
    
      <ModelCard 
        number="04" 
        title="Climate &amp; Thermal Regime
                    
                      Optimal" 
        subtitle="Thermal regime and GDD suitability" 
        score="85"
        status="Optimal"
      >
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
      </ModelCard>
    
      <ModelCard 
        number="05" 
        title="Economic Viability
                    
                      Moderate" 
        subtitle="Cost sensitivity and profit projection" 
        score="85"
        status="Optimal"
      >
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
      </ModelCard>
    
      <ModelCard 
        number="06" 
        title="Composite Risk Index
                    
                      Moderate" 
        subtitle="Composite risk distribution" 
        score="85"
        status="Optimal"
      >
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
      </ModelCard>
    
      <ModelCard 
        number="07" 
        title="Market Access
                    
                      Optimal" 
        subtitle="Logistics and mandi distance" 
        score="85"
        status="Optimal"
      >
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
      </ModelCard>
    
      <ModelCard 
        number="08" 
        title="Demand &amp; Price Outlook
                    
                      Optimal" 
        subtitle="Market supply and sentiment" 
        score="85"
        status="Optimal"
      >
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
      </ModelCard>
    
      <ModelCard 
        number="09" 
        title="Final Decision Engine" 
        subtitle="Final output matrix" 
        score="94"
        status="Complete"
      >
        <div className="space-y-4">
        
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
      </ModelCard>
        </div>
  );
}
