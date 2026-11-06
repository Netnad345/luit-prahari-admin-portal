import type { Metadata } from "next";
import { display, sans, mono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://luitprahari.app'),
  title: "Luit Prahari | Assam PHED Drinking Water Intelligence",
  description: "Assam PHED drinking water sample chain of custody, geo-fenced verification, and AI-driven water quality intelligence.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Luit Prahari — Safe drinking water, verified at the source",
    description: "Assam PHED water quality monitoring, sample custody, and source risk intelligence.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--surface)] text-[var(--ink)] font-sans">
        {children}
      </body>
    </html>
  );
}
