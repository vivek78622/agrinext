import type { Metadata } from "next";
import { Poppins, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CropProvider } from "@/contexts/CropContext";
import { AuthProvider } from "@/contexts/AuthContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriTech | Smart Irrigation Dashboard",
  description: "Professional AgriTech dashboard for smart irrigation monitoring and control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mr" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined|Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} ${notoSansDevanagari.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <LanguageProvider>
            <CropProvider>
              {children}
            </CropProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
