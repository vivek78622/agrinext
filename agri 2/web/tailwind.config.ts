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
                background: "#FAFAFA", // Light gray to off-white
                foreground: "#000000", // Primary Text

                primary: "#4CAF50", // Bright green (General Primary)
                "primary-dark": "#388E3C",

                // Specific Palette Colors
                "text-primary": "#000000",
                "text-secondary": "#424242", // Dark gray
                "section-header": "#9E9E9E", // Medium gray dividers/headers

                // Budget Options
                "budget-low": "#FF9800", // Orange
                "budget-medium": "#2196F3", // Blue
                "budget-high": "#2E7D32", // Deep green

                // UI Elements
                "ui-muted": "#607D8B", // Location / Footer Elements (Muted gray-blue)
                "ui-accent": "#FFC107", // Language Toggle Highlight (Yellowish accent)

                "surface-white": "#FFFFFF",
                "border-light": "#E0E0E0",

                // Stitch Design Colors
                "stitch-primary": "#4cae4f",
                "stitch-primary-dark": "#3d8b3f",
                "stitch-background-light": "#ffffff",
                "stitch-background-soft": "#f9fafb",
                "stitch-background-dark": "#151d15",
                "stitch-surface": "#ffffff",
                "stitch-surface-dark": "#1e291e",
                "stitch-text-main": "#111827",
                "stitch-text-muted": "#6b7280",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0,0,0,0.05)',
                'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
                'sidebar': '2px 0 8px rgba(0,0,0,0.03)',
            }
        },
    },
    plugins: [],
};
export default config;
