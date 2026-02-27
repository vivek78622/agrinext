"use client";

import Card from "../ui/Card";
import { Waves } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSmartFarm } from "@/hooks/useSmartFarm";
import clsx from "clsx";

export default function TankLevel() {
    const { t } = useLanguage();
    const { data, loading, connected } = useSmartFarm();

    const pct = data?.tank ?? 0;

    const levelColor =
        pct < 20 ? "from-accent-red via-accent-red/80 to-accent-red/60" :
            pct < 50 ? "from-accent-yellow via-accent-yellow/70 to-accent-yellow/50" :
                "from-accent-blue via-accent-blue/80 to-accent-blue/60";

    return (
        <Card
            title={t('dash.tank_level')}
            className="h-full"
            action={<Waves className="w-5 h-5 text-accent-blue" />}
        >
            <div className="flex flex-col items-center justify-center h-full mt-2 gap-3">
                {loading ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-gray-400">Connecting...</span>
                    </div>
                ) : !connected ? (
                    <div className="flex flex-col items-center gap-2 opacity-60">
                        <Waves className="w-10 h-10 text-gray-500" />
                        <span className="text-sm text-gray-400">ESP32 Offline</span>
                    </div>
                ) : (
                    <>
                        <div className="relative w-32 h-44 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                            {/* Water fill */}
                            <div
                                className={clsx(
                                    "absolute bottom-0 left-0 w-full bg-gradient-to-t transition-all duration-1000",
                                    levelColor
                                )}
                                style={{ height: `${pct}%` }}
                            >
                                {/* Surface shimmer */}
                                <div className="absolute top-0 left-0 w-full h-3 bg-white/30 blur-[4px]" />
                                <div className="absolute top-0 left-0 w-full h-1 bg-white/50" />
                            </div>
                            {/* Percentage label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                <span className="text-3xl font-bold text-white drop-shadow-md">
                                    {Math.round(pct)}%
                                </span>
                                <span className="text-xs text-white/70 mt-1">Tank Level</span>
                            </div>
                        </div>
                        {/* Low tank warning */}
                        {pct < 20 && (
                            <p className="text-xs text-accent-red font-semibold animate-pulse">
                                ⚠ Tank critically low!
                            </p>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
}
