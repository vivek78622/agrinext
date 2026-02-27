import { MapPin, Calendar, Globe } from "lucide-react";

interface AdvisorHeaderProps {
    language: "en" | "mr";
    setLanguage: (lang: "en" | "mr") => void;
    locationName?: string;
}

export default function AdvisorHeader({ language, setLanguage, locationName }: AdvisorHeaderProps) {
    const isEnglish = language === "en";

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                {/* Logo & Title Area */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                        🌱
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {isEnglish ? "Smart Crop Advisor" : "स्मार्ट पीक सल्लागार"}
                        </h1>
                        <p className="text-sm text-green-700 font-medium mt-0.5">
                            {isEnglish ? "NASA Satellite Enabled" : "NASA उपग्रह डेटा आधारित"}
                        </p>
                    </div>
                </div>

                {/* Location & Season - Now more prominent */}
                <div className="flex flex-wrap gap-3">
                    {locationName ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">
                                {locationName}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg border border-yellow-200 animate-pulse">
                            <MapPin className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-800">
                                {isEnglish ? "Detecting Location..." : "स्थान शोधत आहे..."}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-800">
                            {isEnglish ? "Kharif Season" : "खरीप हंगाम"}
                        </span>
                    </div>
                </div>

                {/* Language Switcher */}
                {/* Language Switcher - Sliding Toggle */}
                <div
                    onClick={() => setLanguage(isEnglish ? "mr" : "en")}
                    className="relative flex items-center bg-gray-200 rounded-full p-1 cursor-pointer w-32 h-10 select-none ml-auto md:ml-0"
                >
                    <div className={`absolute w-1/2 h-8 bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out transform ${isEnglish ? 'translate-x-0' : 'translate-x-full'}`}></div>

                    <span className={`flex-1 text-center text-xs font-bold z-10 transition-colors duration-300 ${isEnglish ? 'text-gray-900' : 'text-gray-500'}`}>
                        English
                    </span>
                    <span className={`flex-1 text-center text-xs font-bold z-10 transition-colors duration-300 ${!isEnglish ? 'text-gray-900' : 'text-gray-500'}`}>
                        मराठी
                    </span>
                </div>
            </div>
        </div>
    );
}
