"use client";

import Card from "../ui/Card";
import { ClipboardList } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/contexts/LanguageContext";

export default function IrrigationLog() {
    const { t } = useLanguage();

    const logs = [
        { time: "3:42 PM", action: t('dash.valve_on'), type: t('dash.auto') },
        { time: "12:30 PM", action: t('dash.valve_off'), type: t('dash.manual') },
        { time: "8:15 AM", action: t('dash.valve_on'), type: t('dash.auto') },
    ];

    return (
        <Card
            title={t('dash.irrigation_log')}
            className="h-full"
            action={<ClipboardList className="w-5 h-5 text-accent-yellow" />}
        >

            <div className="flex flex-col gap-4 mt-4">
                {logs.map((log, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-xs text-gray-400">{log.time}</span>
                        <span className="text-sm font-medium text-white">{log.action}</span>
                        <span className={clsx(
                            "text-[10px] px-2 py-0.5 rounded-full uppercase font-bold",
                            log.type === t('dash.auto') ? "bg-accent-green/10 text-accent-green" : "bg-accent-blue/10 text-accent-blue"
                        )}>
                            {log.type}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
