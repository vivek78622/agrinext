"use client";

import { useState, createContext, useContext, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const SidebarContext = createContext({ isHovered: false, setIsHovered: (value: boolean) => { } });

export const useSidebarContext = () => useContext(SidebarContext);

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <SidebarContext.Provider value={{ isHovered, setIsHovered }}>
            <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-accent-green/30">
                {/* Sidebar (Desktop Only - Hidden on Mobile) */}
                <div className="hidden md:block">
                    <Sidebar />
                </div>

                {/* Mobile Navigation (Bottom - Mobile Only) */}
                <MobileNav />

                {/* Main Content Area */}
                <main className="flex-1 pb-20 md:pb-0">
                    <motion.div
                        initial={false}
                        animate={{ paddingLeft: isHovered ? 260 : 80 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="hidden md:block h-full"
                    >
                        {children}
                    </motion.div>
                    <div className="md:hidden h-full">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarContext.Provider>
    );
}
