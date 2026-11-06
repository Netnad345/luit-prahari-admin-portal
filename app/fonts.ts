// Next.js (App Router): load the kit's fonts with next/font/google and expose them as CSS variables.
import { Tiro_Bangla, Hind_Siliguri, IBM_Plex_Mono } from "next/font/google";

export const display = Tiro_Bangla({ weight: "400", subsets: ["latin", "bengali"], variable: "--font-display" });
export const sans = Hind_Siliguri({ weight: ["400", "500", "600", "700"], subsets: ["latin", "bengali"], variable: "--font-sans" });
export const mono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono" });

// In app/layout.tsx: <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
// Then import "./tokens.css" and "./components.css". Remove the @import line at the top of components.css when using next/font.
