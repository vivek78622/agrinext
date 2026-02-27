"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    TrendingUp,
    Settings2,
    User,
    Sprout
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useSidebarContext } from "@/app/(main)/layout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Sidebar() {
    const { isHovered, setIsHovered } = useSidebarContext();
    const pathname = usePathname();
    const { t } = useLanguage();

    const menuItems = [
        { icon: LayoutDashboard, label: t('nav.dashboard'), href: "/" },
        { icon: TrendingUp, label: t('nav.trends'), href: "/data-trends" },
        { icon: Settings2, label: t('nav.control'), href: "/control" },
        { icon: Sprout, label: t('nav.advisor'), href: "/crop-advisor" },
    ];

    const bottomItems = [
        { icon: User, label: t('nav.profile'), href: "/profile" },
    ];

    return (
        <motion.aside
            initial={{ width: 80 }}
            animate={{ width: isHovered ? 260 : 80 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-screen z-50 glass-panel border-r border-glass-border hidden md:flex flex-col py-6 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo Area */}
            <div className="flex items-center justify-start px-5 h-16 mb-8 relative">
                <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center shadow-lg shadow-accent-green/20">
                    <Sprout className="text-white w-6 h-6" />
                </div>
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 overflow-hidden whitespace-nowrap"
                        >
                            <h1 className="font-bold text-xl tracking-wide text-white">
                                AgriTech
                            </h1>
                            <p className="text-xs text-gray-400 font-medium">{t('app.subtitle')}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Menu */}
            <nav className="flex-1 px-3 space-y-2">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.href}
                        item={item}
                        isHovered={isHovered}
                        isActive={pathname === item.href}
                    />
                ))}
            </nav>

            {/* Bottom Menu */}
            <div className="px-3 space-y-2 mt-auto">
                {bottomItems.map((item) => (
                    <MenuItem
                        key={item.href}
                        item={item}
                        isHovered={isHovered}
                        isActive={pathname === item.href}
                    />
                ))}
            </div>
        </motion.aside>
    );
}

function MenuItem({ item, isHovered, isActive = false }: { item: any, isHovered: boolean, isActive?: boolean }) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={clsx(
                "flex items-center h-12 px-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                    ? "bg-accent-green/10 text-accent-green"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-green rounded-r-full"
                />
            )}

            <div className="flex items-center justify-center w-8 h-8 min-w-[32px]">
                <Icon className={clsx("w-6 h-6 transition-transform duration-300", isActive && "scale-110 drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]")} />
            </div>

            <AnimatePresence>
                {isHovered && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-3 font-medium whitespace-nowrap"
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>

            {isActive && isHovered && (
                <motion.div
                    layoutId="glow"
                    className="absolute inset-0 bg-accent-green/5 rounded-xl -z-10"
                />
            )}
        </Link>
    );
}
