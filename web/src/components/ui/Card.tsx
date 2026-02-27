"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    action?: ReactNode;
    noPadding?: boolean;
}

export default function Card({
    children,
    className,
    title,
    subtitle,
    action,
    noPadding = false
}: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={clsx(
                "glass-panel rounded-3xl overflow-hidden relative group transition-all duration-300",
                "hover:shadow-[0_8px_32px_0_rgba(0,230,118,0.1)] hover:border-accent-green/30",
                className
            )}
        >
            {/* Header */}
            {(title || action) && (
                <div className="flex items-center justify-between p-6 pb-2">
                    <div>
                        {title && <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}

            {/* Content */}
            <div className={clsx("relative z-10", !noPadding && "p-6")}>
                {children}
            </div>

            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/5 rounded-full blur-3xl -z-10 group-hover:bg-accent-green/10 transition-all duration-500" />
        </motion.div>
    );
}
