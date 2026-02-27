import { CloudRain, ThermometerSun, Sprout, Droplets, Info, Loader2, AlertCircle } from "lucide-react";
import { WeatherData, AnalysisResult } from "@/services/nasaService";

interface FarmConditionsProps {
    language: "en" | "mr";
    weather?: WeatherData | null;
    analysis?: AnalysisResult | null;
    loading?: boolean;
    error?: string | null;
}

export default function FarmConditions({ language, weather, analysis, loading, error }: FarmConditionsProps) {
    const isEnglish = language === "en";

    // 1. Loading State
    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 animate-pulse">
                <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50 h-32 flex flex-col justify-between">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            <div className="h-6 w-24 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isEnglish ? "Fetching live data from NASA..." : "NASA उपग्रहावरून माहिती मिळवत आहे..."}</span>
                </div>
            </div>
        );
    }

    // 2. Error State
    if (error) {
        return (
            <div className="bg-red-50 rounded-xl p-5 shadow-sm border border-red-100 mb-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                    <h3 className="text-red-800 font-bold">{isEnglish ? "Data Unavailable" : "माहिती अनुपलब्ध"}</h3>
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    // 3. No Data State (Do not render guessed values)
    if (!weather || !analysis) {
        return null;
    }

    // 4. Real Data Rendering
    const metrics = [
        {
            icon: CloudRain,
            label: isEnglish ? "Rainfall (6 Mo)" : "पाऊस (६ महिने)",
            value: `${weather.rainfall} mm`,
            // Subtext now shows Consistency (CV) if available in new AI Model data structure
            subtext: weather.rainfallConsistency
                ? (weather.rainfallConsistency < 20
                    ? (isEnglish ? "Stable (CV <20%)" : "स्थिर")
                    : weather.rainfallConsistency < 30
                        ? (isEnglish ? "Variable (CV 20-30%)" : "बदलणारा")
                        : (isEnglish ? "Erratic (CV >30%)" : "असात्य"))
                : analysis.rainfall.label,
            color: weather.rainfallConsistency
                ? (weather.rainfallConsistency < 30 ? "text-green-500" : "text-red-500")
                : analysis.rainfall.color,
            bgColor: "bg-blue-50"
        },
        {
            icon: ThermometerSun,
            label: isEnglish ? "Temperature" : "तापमान",
            value: `${weather.temp}°C`,
            subtext: analysis.temperature.label,
            color: analysis.temperature.color,
            bgColor: "bg-orange-50"
        },
        {
            icon: Sprout,
            label: isEnglish ? "Soil Moisture" : "जमिनीतील ओलावा",
            value: `${weather.soilMoisture}%`,
            subtext: analysis.soilMoisture.label,
            color: analysis.soilMoisture.color,
            bgColor: "bg-green-50"
        },
        {
            icon: Droplets,
            label: isEnglish ? "Water Avail." : "पाणी उपलब्धता",
            // Dynamic value from new analyzeFarmConditions logic
            value: analysis.waterAvailability.status,
            subtext: analysis.waterAvailability.label,
            color: analysis.waterAvailability.color,
            bgColor: "bg-cyan-50"
        }
    ];

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    {isEnglish ? "Farm Conditions" : "शेताची स्थिती"}
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {isEnglish ? "NASA Live Data" : "NASA थेट माहिती"}
                    </span>
                </h2>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md border border-green-100">
                    {isEnglish ? "Updated Today" : "आज अपडेट केले"}
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                    <div key={index} className={`p-4 rounded-xl border border-gray-100 ${metric.bgColor} transition-transform hover:scale-105`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm ${metric.color}`}>
                                <metric.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">{metric.label}</span>
                        </div>
                        <div className="font-bold text-gray-900 text-lg">
                            {metric.value}
                        </div>
                        {metric.subtext && (
                            <div className="text-xs text-gray-500 font-medium mt-1">{metric.subtext}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
