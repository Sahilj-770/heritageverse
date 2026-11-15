import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F1E8" },
    { media: "(prefers-color-scheme: dark)", color: "#100E0D" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://heritageverse.vercel.app"),
  title: {
    default: "HeritageVerse | SDG 11 Cultural Heritage Preservation",
    template: "%s | HeritageVerse",
  },
  description: "An archive of light cast in stone. Interactive 3D digital heritage museum, virtual tours, geospatial globe, and community conservation platform in support of UN SDG Target 11.4.",
  keywords: [
    "heritage",
    "cultural preservation",
    "SDG 11",
    "3D digital museum",
    "virtual tour",
    "360 panorama",
    "Shaniwar Wada",
    "Taj Mahal",
    "Maharashtra",
    "Archaeological Survey of India",
  ],
  authors: [{ name: "HeritageVerse Cultural Archive Initiative" }],
  creator: "HeritageVerse Digital Architecture Lab",
  publisher: "HeritageVerse",
  openGraph: {
    title: "HeritageVerse — 3D Digital Heritage Museum & National Archive",
    description: "Interactive 3D exterior architectural explorer, first-person walkthrough, 360° virtual tours, and citizen conservation platform.",
    url: "https://heritageverse.vercel.app",
    siteName: "HeritageVerse",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/monuments/shaniwar-wada.jpg",
        width: 1200,
        height: 630,
        alt: "HeritageVerse — Shaniwar Wada 3D Digital Heritage Museum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HeritageVerse — 3D Digital Heritage Museum",
    description: "Explore India's iconic monuments in interactive 3D, first-person walkthroughs, and verified historical reconstructions.",
    images: ["/images/monuments/shaniwar-wada.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
