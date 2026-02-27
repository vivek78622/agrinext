"use client";

import { LayoutDashboard, TrendingUp, Power, User, Sprout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MobileNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const navItems = [
        { icon: LayoutDashboard, label: t('nav.home'), href: "/" },
        { icon: TrendingUp, label: t('nav.trends'), href: "/data-trends" },
        { icon: Power, label: t('nav.control'), href: "/control" },
        { icon: Sprout, label: t('nav.advisor'), href: "/crop-advisor" },
        { icon: User, label: t('nav.profile'), href: "/profile" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="glass-panel border-t border-glass-border bg-black/80 backdrop-blur-xl pb-safe">
                <div className="flex items-center justify-around h-16 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                                    isActive ? "text-accent-green" : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                <div className={clsx(
                                    "p-1.5 rounded-xl transition-all",
                                    isActive && "bg-accent-green/10"
                                )}>
                                    <item.icon className={clsx("w-5 h-5", isActive && "fill-current")} />
                                </div>
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
