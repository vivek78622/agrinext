"use client";

import Card from "../ui/Card";
import { CloudSun, Sun, CloudRain, Cloud } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const forecast = [
    { time: "1h", temp: "28°", icon: Sun, color: "text-accent-yellow" },
    { time: "2h", temp: "29°", icon: Sun, color: "text-accent-yellow" },
    { time: "3h", temp: "30°", icon: CloudSun, color: "text-accent-yellow" },
    { time: "4h", temp: "28°", icon: Cloud, color: "text-gray-400" },
    { time: "5h", temp: "27°", icon: CloudRain, color: "text-accent-blue" },
];

export default function WeatherWidget() {
    const { t } = useLanguage();

    return (
        <Card
            title={t('dash.weather')}
            className="h-full"
            action={<CloudSun className="w-5 h-5 text-accent-yellow" />}
        >

            <div className="flex justify-between items-end mt-6 h-28 px-2">
                {forecast.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 group w-full">
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-auto">{item.time}</span>
                        <div className="w-full max-w-[24px] rounded-full bg-white/5 relative group-hover:bg-white/10 transition-colors h-full max-h-[80px]">
                            <div
                                className="absolute bottom-0 left-0 w-full rounded-full bg-gradient-to-t from-accent-yellow/20 to-accent-yellow transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(255,235,59,0.3)]"
                                style={{ height: `${(parseInt(item.temp) - 20) * 8}px` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-white">{item.temp}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
