"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useSmartFarm } from "@/hooks/useSmartFarm";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface FeedEvent {
    id: number;
    type: "warning" | "info" | "success";
    title: string;
    message: string;
    time: string;
    color: string;
}

function formatTime(d: Date) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ActivityFeed() {
    const { t } = useLanguage();
    const { data, connected } = useSmartFarm();
    const [events, setEvents] = useState<FeedEvent[]>([]);
    const idRef = useRef(1);
    const prevPump = useRef<number | null>(null);
    const prevMode = useRef<string | null>(null);
    const prevSoil = useRef<number | null>(null);
    const prevTank = useRef<number | null>(null);

    useEffect(() => {
        if (!data) return;

        const newEvents: FeedEvent[] = [];
        const now = new Date();

        // Pump state change
        if (prevPump.current !== null && prevPump.current !== data.pump) {
            newEvents.push({
                id: idRef.current++,
                type: data.pump ? "success" : "info",
                title: data.pump ? "Pump Turned ON" : "Pump Turned OFF",
                message: `Pump state changed to ${data.pump ? "ON" : "OFF"} by ${data.mode === "AUTO" ? "auto logic" : "manual command"}`,
                time: formatTime(now),
                color: data.pump ? "bg-accent-green" : "bg-accent-blue",
            });
        }

        // Mode change
        if (prevMode.current !== null && prevMode.current !== data.mode) {
            newEvents.push({
                id: idRef.current++,
                type: "info",
                title: `Mode → ${data.mode}`,
                message: `Irrigation mode switched to ${data.mode}`,
                time: formatTime(now),
                color: data.mode === "AUTO" ? "bg-accent-green" : "bg-accent-yellow",
            });
        }

        // Soil low warning
        if (prevSoil.current !== null && prevSoil.current >= 40 && data.soil < 40) {
            newEvents.push({
                id: idRef.current++,
                type: "warning",
                title: "Soil Moisture Low",
                message: `Soil dropped to ${Math.round(data.soil)}% — pump may activate`,
                time: formatTime(now),
                color: "bg-accent-red",
            });
        }

        // Tank low warning
        if (prevTank.current !== null && prevTank.current >= 20 && data.tank < 20) {
            newEvents.push({
                id: idRef.current++,
                type: "warning",
                title: "Tank Level Critical",
                message: `Tank at ${Math.round(data.tank)}% — refill required`,
                time: formatTime(now),
                color: "bg-accent-red",
            });
        }

        if (newEvents.length > 0) {
            setEvents((prev) => [...newEvents, ...prev].slice(0, 10));
        }

        prevPump.current = data.pump;
        prevMode.current = data.mode;
        prevSoil.current = data.soil;
        prevTank.current = data.tank;
    }, [data]);

    return (
        <div className="bg-card-bg/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{t('dash.activity')}</h2>
                <div className={clsx(
                    "flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium",
                    connected ? "text-accent-green bg-accent-green/10" : "text-gray-500 bg-white/5"
                )}>
                    <span className={clsx(
                        "w-1.5 h-1.5 rounded-full",
                        connected ? "bg-accent-green animate-pulse" : "bg-gray-500"
                    )} />
                    {connected ? "Live" : "Offline"}
                </div>
            </div>

            {/* Current readings summary */}
            {connected && data && (
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {[
                        { label: "Soil", value: `${Math.round(data.soil)}%` },
                        { label: "Tank", value: `${Math.round(data.tank)}%` },
                        { label: "Pump", value: data.pump ? "ON" : "OFF" },
                        { label: "Mode", value: data.mode },
                    ].map((item) => (
                        <div key={item.label} className="bg-white/5 rounded-xl px-3 py-2 flex flex-col">
                            <span className="text-xs text-gray-400">{item.label}</span>
                            <span className="text-sm font-bold text-white">{item.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Event timeline */}
            <div className="pl-4 border-l-2 border-white/5 space-y-6 relative">
                <div className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                {events.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm">
                        {connected
                            ? "No events yet — monitoring live…"
                            : "Waiting for ESP32 to connect…"}
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="relative group">
                            <div className={clsx(
                                "absolute -left-[21px] top-1.5 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-125",
                                event.color
                            )} />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500 mb-0.5">{event.time}</span>
                                <h4 className="text-sm font-bold text-white group-hover:text-accent-green transition-colors">
                                    {event.title}
                                </h4>
                                <p className="text-xs text-gray-400">{event.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
