"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Monument } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { MonumentCard } from "@/components/monuments/MonumentCard";
import { 
  Compass, 
  ArrowRight, 
  Eye,
  MapPin,
  Clock,
  Bookmark,
  Sparkles,
  ShieldCheck,
  Globe2,
  Navigation,
  Car
} from "lucide-react";

export default function HomePage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);

  useEffect(() => {
    setMonuments(HeritageStore.getMonuments());

    // Duplicate mosaic cells once for seamless -50% CSS infinite marquee
    const cols = document.querySelectorAll(".mosaic-col");
    cols.forEach((col) => {
      if (col.children.length === 5) {
        const originalCells = Array.from(col.children);
        originalCells.forEach((cell) => {
          const clone = cell.cloneNode(true);
          col.appendChild(clone);
        });
      }
    });
  }, []);

  const featured = monuments.filter((m) => m.featured);

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION: HERITAGEVERSE SDG 11.4 ARCHIVAL MOSAIC */}
      <section className="relative min-h-[88vh] flex items-center bg-[#F5F1E8] text-[#282522] overflow-hidden border-b border-[#E4DDD0]">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20 z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Project Headline & Specific Value */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#713C3C]">
                <span className="w-6 h-[1.5px] bg-[#B18A55]" />
                UN SDG 11.4 • National Heritage Archive of India
              </div>

              <h1 className="font-display-archivo text-5xl sm:text-6xl md:text-7xl lg:text-[72px] font-black uppercase text-[#282522] leading-[0.93] tracking-[-0.05em]">
                <span className="block overflow-hidden">
                  <span className="block">Discover the</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="block text-[#713C3C]">Past.</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="block">Preserve it</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="block text-[#B18A55]">for the future.</span>
                </span>
              </h1>

              <p className="max-w-lg text-base sm:text-lg text-[#282522] leading-relaxed font-normal">
                HeritageVerse is an interactive digital preservation platform for India&apos;s architectural wonders. Explore verified 360° virtual tours, precise geocoordinates, peer-reviewed historical dossiers, and citizen-led conservation monitoring across the subcontinent.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/explore"
                  className="px-6 py-3.5 rounded-[20px] bg-[#282522] hover:bg-[#713C3C] text-[#F5F1E8] font-display-archivo text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5"
                >
                  Explore Directory
                </Link>

                <Link
                  href="/plan-trip"
                  className="px-6 py-3.5 rounded-[20px] bg-[#713C3C] hover:bg-[#8D4A4A] text-[#FAF4E5] font-display-archivo text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-[#C5A059]" />
                  Plan Trip
                </Link>

                <Link
                  href="/map"
                  className="px-5 py-3.5 rounded-[20px] bg-[#B18A55] hover:bg-[#C7A574] text-[#282522] font-display-archivo text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
                >
                  <Globe2 className="w-4 h-4 text-[#282522]" />
                  Map
                </Link>

                <Link
                  href="/tour/taj-mahal"
                  className="text-xs font-bold uppercase tracking-wider text-[#713C3C] hover:text-[#282522] transition-colors ml-1 flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-[#713C3C]" />
                  Launch 360° Tour →
                </Link>
              </div>

              {/* Verified Pilot Metrics */}
              <div className="pt-6 border-t border-[#E4DDD0] grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="font-display-archivo text-2xl font-black text-[#282522]">17 Sites</div>
                  <div className="text-[11px] text-[#6B635D] font-medium">Pan-India Heritage</div>
                </div>
                <div>
                  <div className="font-display-archivo text-2xl font-black text-[#713C3C]">360° Spatial</div>
                  <div className="text-[11px] text-[#6B635D] font-medium">Equirectangular Tours</div>
                </div>
                <div>
                  <div className="font-display-archivo text-2xl font-black text-[#B18A55]">Target 11.4</div>
                  <div className="text-[11px] text-[#6B635D] font-medium">Citizen Conservation</div>
                </div>
              </div>

            </div>

            {/* Right: Authentic Monument Photography Marquee Mosaic (Seamlessly blended into front page) */}
            <div 
              className="lg:col-span-6 relative h-[540px] sm:h-[640px] overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
              }}
            >
              
              <div className="absolute inset-0 flex justify-center gap-3.5 px-2 overflow-hidden pointer-events-none select-none">
                
                {/* Column 1 (colDown 20s infinite) */}
                <div 
                  className="mosaic-col flex flex-col gap-3.5 w-[140px] sm:w-[170px] shrink-0"
                  style={{ animation: "colDown 20s linear infinite" }}
                >
                  {/* Set 1 */}
                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/taj-mahal.jpg"
                      alt="Taj Mahal Agra"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Taj Mahal · Agra
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/ellora-caves.jpg"
                      alt="Kailasa Temple Ellora Caves"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Ellora · Kailasa
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/hampi-virupaksha.jpg"
                      alt="Hampi Virupaksha Temple Karnataka"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Hampi · Karnataka
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/qutub-minar.jpg"
                      alt="Qutub Minar Delhi"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Qutub Minar · Delhi
                    </div>
                  </div>

                  {/* Set 2 (Seamless loop duplicate) */}
                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/taj-mahal.jpg"
                      alt="Taj Mahal Agra"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Taj Mahal · Agra
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/ellora-caves.jpg"
                      alt="Kailasa Temple Ellora Caves"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Ellora · Kailasa
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/hampi-virupaksha.jpg"
                      alt="Hampi Virupaksha Temple Karnataka"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Hampi · Karnataka
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/qutub-minar.jpg"
                      alt="Qutub Minar Delhi"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Qutub Minar · Delhi
                    </div>
                  </div>
                </div>

                {/* Column 2 (colUp 20s infinite) */}
                <div 
                  className="mosaic-col flex flex-col gap-3.5 w-[140px] sm:w-[170px] shrink-0"
                  style={{ animation: "colUp 20s linear infinite" }}
                >
                  {/* Set 1 */}
                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/konark-sun-temple.jpg"
                      alt="Sun Temple Konark Odisha"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Konark · Odisha
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/amer-fort.jpg"
                      alt="Amer Fort Jaipur Rajasthan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Amer Fort · Jaipur
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/meenakshi-temple.jpg"
                      alt="Meenakshi Amman Temple Madurai"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Meenakshi · Madurai
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/shaniwar-wada.jpg"
                      alt="Shaniwar Wada Pune"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Shaniwar Wada · Pune
                    </div>
                  </div>

                  {/* Set 2 (Seamless loop duplicate) */}
                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/konark-sun-temple.jpg"
                      alt="Sun Temple Konark Odisha"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Konark · Odisha
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/amer-fort.jpg"
                      alt="Amer Fort Jaipur Rajasthan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Amer Fort · Jaipur
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/meenakshi-temple.jpg"
                      alt="Meenakshi Amman Temple Madurai"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Meenakshi · Madurai
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/shaniwar-wada.jpg"
                      alt="Shaniwar Wada Pune"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Shaniwar Wada · Pune
                    </div>
                  </div>
                </div>

                {/* Column 3 (colDown 20s infinite) */}
                <div 
                  className="mosaic-col flex flex-col gap-3.5 w-[140px] sm:w-[170px] shrink-0"
                  style={{ animation: "colDown 20s linear infinite" }}
                >
                  {/* Set 1 */}
                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/red-fort.jpg"
                      alt="Red Fort Lal Qila Delhi"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Red Fort · Delhi
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/victoria-memorial.jpg"
                      alt="Victoria Memorial Kolkata West Bengal"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Victoria Memorial · Kolkata
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/brihadisvara-temple.jpg"
                      alt="Brihadisvara Temple Thanjavur"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Brihadisvara · Tamil Nadu
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/hawa-mahal.jpg"
                      alt="Hawa Mahal Jaipur Rajasthan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Hawa Mahal · Jaipur
                    </div>
                  </div>

                  {/* Set 2 (Seamless loop duplicate) */}
                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/red-fort.jpg"
                      alt="Red Fort Lal Qila Delhi"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Red Fort · Delhi
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/victoria-memorial.jpg"
                      alt="Victoria Memorial Kolkata West Bengal"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Victoria Memorial · Kolkata
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/brihadisvara-temple.jpg"
                      alt="Brihadisvara Temple Thanjavur"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Brihadisvara · Tamil Nadu
                    </div>
                  </div>

                  <div className="h-[210px] sm:h-[225px] rounded-[22px] overflow-hidden shadow-lg shrink-0 border border-[#282522]/10 relative bg-[#282522]">
                    <img
                      src="/images/monuments/hawa-mahal.jpg"
                      alt="Hawa Mahal Jaipur Rajasthan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#282522]/85 backdrop-blur-sm text-[10px] text-[#FAF4E5] font-semibold py-1 px-2 rounded-lg text-center shadow-sm">
                      Hawa Mahal · Jaipur
                    </div>
                  </div>
                </div>

              </div>

              {/* Seamless Vignette Fades into Page Canvas */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#F5F1E8] via-[#F5F1E8]/80 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#F5F1E8] via-[#F5F1E8]/80 to-transparent pointer-events-none z-10" />

            </div>

          </div>
        </div>

        {/* Continuous CSS keyframes */}
        <style jsx>{`
          @keyframes colDown {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(0, -50%, 0); }
          }
          @keyframes colUp {
            0% { transform: translate3d(0, -50%, 0); }
            100% { transform: translate3d(0, 0, 0); }
          }
        `}</style>
      </section>

      {/* 2. NATIONAL MONUMENTS DIRECTORY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E4DDD0]">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#B18A55] font-bold mb-1">
              National Heritage Registry
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#282522]">
              Explore Iconic Indian Monuments
            </h2>
          </div>
          <Link
            href="/explore"
            className="mt-3 md:mt-0 text-xs font-bold uppercase tracking-wider text-[#713C3C] hover:text-[#282522] flex items-center gap-1 group"
          >
            Open full directory ({monuments.length} sites)
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(featured.length > 0 ? featured : monuments).slice(0, 6).map((monument) => (
            <MonumentCard key={monument.id} monument={monument} />
          ))}
        </div>
      </section>

      {/* 3. VIRTUAL TOUR CAPABILITY */}
      <section className="bg-[#E4DDD0]/40 py-16 border-y border-[#E4DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#713C3C]">
                Virtual Heritage Explorer
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#282522] leading-tight">
                360° Spherical Panoramic Surveys
              </h2>
              <p className="text-[#6B635D] text-sm leading-relaxed">
                Walk through historical chambers and monument grounds with real WebGL equirectangular panoramas. Look around in full 360 degrees, zoom in on masonry and woodwork, and inspect curated architectural hotspots with verified historical documentation.
              </p>
              
              <div className="space-y-2 text-xs font-semibold text-[#282522]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B18A55]" />
                  <span>Interactive drag, pitch, yaw, and field-of-view controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B18A55]" />
                  <span>Perspective-correct spatial navigation and chamber transitions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B18A55]" />
                  <span>Curator annotations explaining structural and historical details</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/tour/taj-mahal"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#282522] hover:bg-[#713C3C] text-[#F5F1E8] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <Eye className="w-4 h-4 text-[#B18A55]" />
                  Taj Mahal 360° Tour
                </Link>
                <Link
                  href="/tour/shaniwar-wada"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F5F1E8] text-[#282522] text-xs font-bold uppercase tracking-wider transition-colors border border-[#E4DDD0] shadow-sm"
                >
                  Shaniwar Wada 360°
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border border-[#E4DDD0] shadow-xl bg-[#282522] aspect-[16/10]">
                <img
                  src="/images/monuments/taj-mahal.jpg"
                  alt="Taj Mahal 360 Survey"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#B18A55]">
                      Active Spatial Survey
                    </div>
                    <div className="font-serif-editorial text-lg font-bold text-white">
                      Taj Mahal — Charbagh & Plinth
                    </div>
                  </div>
                  <Link
                    href="/tour/taj-mahal"
                    className="p-3 rounded-full bg-[#B18A55] text-[#282522] shadow-lg hover:scale-105 transition-transform"
                    title="Launch Tour"
                  >
                    <Compass className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3.5. HERITAGE TRIP PLANNER & EXPEDITION BUILDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-[#FAF8F5] border border-[#E4DDD0] rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E5] text-[#713C3C] text-[10px] font-bold uppercase tracking-wider border border-[#B18A55]/40">
                <Navigation className="w-3.5 h-3.5" />
                <span>New Feature • Intelligent Route Mapping</span>
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#282522]">
                Plan Multi-Stop Heritage Journeys with Animated Travel
              </h2>
              <p className="text-sm text-[#6B635D] leading-relaxed max-w-xl">
                Choose between car, motorcycle, cycle, and walking modes. Build custom circuits linking India&apos;s architectural wonders with real highway distances, turn-by-turn road geometry, and vehicle animations that orient along real highway tangents.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/plan-trip"
                  className="px-6 py-3 rounded-2xl bg-[#713C3C] text-[#FAF4E5] text-xs font-bold uppercase tracking-wider hover:bg-[#592F2F] transition-all shadow-md flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-[#C5A059]" />
                  <span>Launch Trip Planner</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-5 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E4DDD0] text-[#282522] text-xs font-bold uppercase tracking-wider hover:bg-[#E4DDD0] transition-colors"
                >
                  <span>View Heritage Passport</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E4DDD0] rounded-2xl p-6 space-y-3 shadow-inner">
              <span className="text-[10px] font-bold text-[#B18A55] uppercase tracking-wider block">
                Popular Verified Circuit
              </span>
              <h3 className="font-serif-editorial text-lg font-bold text-[#282522]">
                The Northern Golden Triangle
              </h3>
              <div className="space-y-2 text-xs text-[#6B635D]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-[10px]">A</span>
                  <span className="font-semibold text-[#282522]">Taj Mahal (Agra)</span>
                </div>
                <div className="pl-2.5 border-l-2 border-dashed border-[#B18A55] ml-2.5 h-4" />
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#B18A55] text-white flex items-center justify-center font-bold text-[10px]">2</span>
                  <span className="font-semibold text-[#282522]">Qutub Minar (Delhi)</span>
                </div>
                <div className="pl-2.5 border-l-2 border-dashed border-[#B18A55] ml-2.5 h-4" />
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#713C3C] text-white flex items-center justify-center font-bold text-[10px]">B</span>
                  <span className="font-semibold text-[#282522]">Red Fort (Old Delhi)</span>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-[#713C3C] font-bold flex items-center justify-between">
                <span>Total: 242 km • 4.2 hrs</span>
                <Link href="/plan-trip" className="hover:underline flex items-center gap-1">
                  <span>Open Route →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONSERVATION & COMMUNITY REPORTING (SDG 11.4 CORE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#282522] text-[#F5F1E8] rounded-3xl p-8 sm:p-12 border border-[#332F2C] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#4A4440] pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B18A55]">
                Target 11.4 Action Channel
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white mt-1">
                Participatory Conservation & Community Voices
              </h2>
            </div>
            <div className="flex gap-3">
              <Link
                href="/conservation#report"
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#713C3C] text-white hover:bg-[#874747] transition-colors"
              >
                Report a Concern
              </Link>
              <Link
                href="/community#submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#B18A55] text-[#282522] hover:bg-[#C7A574] transition-colors"
              >
                Submit Story
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#E4DDD0]">
            <div className="p-4 rounded-xl bg-[#332F2C] space-y-1.5">
              <strong className="text-white block font-bold">1. Document Field Issues</strong>
              <p className="text-[#968D85] leading-relaxed">
                Log visible cracks, invasive vegetation roots, water seepage, or vandalism observed during your visit to any Indian monument.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#332F2C] space-y-1.5">
              <strong className="text-white block font-bold">2. Peer-Curated Triage</strong>
              <p className="text-[#968D85] leading-relaxed">
                Observations enter a curator review dashboard before archiving, avoiding misinformation or false panic.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#332F2C] space-y-1.5">
              <strong className="text-white block font-bold">3. Preserve Intangible Lore</strong>
              <p className="text-[#968D85] leading-relaxed">
                Submit elder accounts, local oral folklore, and photographic records connected to India&apos;s cultural heritage sites.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
