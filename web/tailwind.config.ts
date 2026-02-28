
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "accent-green": "var(--accent-green)",
                "accent-yellow": "var(--accent-yellow)",
                "accent-blue": "var(--accent-blue)",
                "accent-red": "var(--accent-red)",

                // Crop Advisor / Agri 2 specific colors
                primary: "var(--color-primary)",
                "primary-dark": "var(--color-primary-dark)",
                "primary-light": "var(--color-primary-light)",
                "text-primary": "var(--color-text-primary)",
                "text-secondary": "var(--color-text-secondary)",
                "text-muted": "var(--color-text-muted)",
                "ui-muted": "var(--color-ui-muted)",
                "ui-accent": "var(--color-ui-accent)",
                "surface-white": "var(--color-surface-white)",
                "border-light": "var(--color-border-light)",
                "section-header": "var(--color-text-muted)",

                // Farm Health Check Theme
                "farm-background": "var(--farm-background)",
                "farm-surface": "var(--farm-surface)",
                "farm-success": "var(--farm-success)",
                "farm-warning": "var(--farm-warning)",
                "farm-danger": "var(--farm-danger)",
                "farm-text-primary": "var(--farm-text-primary)",
                "farm-text-muted": "var(--farm-text-muted)",
                "farm-accent": "var(--farm-accent)",

                // Stitch Design Component Colors
                "stitch-primary": "var(--color-stitch-primary)",
                "stitch-primary-dark": "var(--color-stitch-primary-dark)",
                "stitch-background-light": "var(--color-stitch-background-light)",
                "stitch-background-soft": "var(--color-stitch-background-soft)",
                "stitch-surface": "var(--color-stitch-surface)",
                "stitch-surface-dark": "var(--color-stitch-surface-dark)",
                "stitch-text-main": "var(--color-stitch-text-main)",
                "stitch-text-muted": "var(--color-stitch-text-muted)",
            },
            fontFamily: {
                sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
                inter: ["var(--font-inter)", "system-ui", "sans-serif"],
            },
            boxShadow: {
                card: "0 2px 16px rgba(0, 0, 0, 0.06)",
                sidebar: "2px 0 12px rgba(0, 0, 0, 0.04)"
            }
        },
    },
    plugins: [],
};

export default config;
