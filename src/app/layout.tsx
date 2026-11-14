import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Archivo } from "next/font/google";
import "./globals.css";
import { EditorialNav } from "@/components/layout/EditorialNav";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HeritageVerse | SDG 11 Cultural Heritage Preservation",
  description: "An archive of light cast in stone. Interactive digital heritage discovery, virtual tours, and community conservation platform focused on Maharashtra, India. In direct support of UN SDG Target 11.4.",
  keywords: ["heritage", "preservation", "SDG 11", "virtual tour", "360 panorama", "Pune", "Maharashtra", "Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} ${archivo.variable}`}>
      <body className="min-h-screen flex flex-col font-sans archival-grain text-[#282522] bg-[#F5F1E8] selection:bg-[#B18A55]/20 selection:text-[#282522]">
        <Suspense fallback={null}>
          <EditorialNav />
        </Suspense>
        <main className="flex-1">
          <Suspense fallback={<div className="p-12 text-center text-xs text-[#968D85]">Loading heritage dossier...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
