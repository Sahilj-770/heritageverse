"use client";

import { useEffect, useState } from "react";
import { Monument } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { HeritageMap } from "@/components/map/HeritageMap";
import { MapPin, Compass, Navigation, Layers, Info } from "lucide-react";
import Link from "next/link";

export default function InteractiveMapPage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);

  useEffect(() => {
    const list = HeritageStore.getMonuments();
    setMonuments(list);
    if (list.length > 0) {
      setSelectedMonument(list[0]);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#B18A55] font-bold flex items-center gap-1.5 mb-2">
            <Compass className="w-4 h-4 text-[#713C3C]" />
            National Geographic Spatial Index
          </div>
          <h1 className="font-serif-editorial text-4xl font-bold text-[#282522]">
            Interactive Cultural Heritage Map of India
          </h1>
          <p className="text-sm text-[#6B635D] mt-1 max-w-2xl">
            Explore verified GPS coordinates, spatial distribution, and architectural relationships between UNESCO World Heritage sites, royal citadels, rock-cut monuments, and sacred temple complexes across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#282522] text-[#F5F1E8] hover:bg-[#713C3C] transition-colors shadow-xs"
          >
            Switch to Directory View
          </Link>
        </div>
      </div>

      {/* Map + Detail Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Map Container */}
        <div className="lg:col-span-8">
          <HeritageMap
            monuments={monuments}
            selectedMonumentId={selectedMonument?.id}
            onSelectMonument={(m) => setSelectedMonument(m)}
            height="640px"
          />
        </div>

        {/* Selected Monument Detail Card */}
        <div className="lg:col-span-4 space-y-6">
          {selectedMonument ? (
            <div className="bg-white rounded-3xl border border-[#E4DDD0] p-6 shadow-md space-y-5">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#282522]">
                <img
                  src={selectedMonument.coverImage}
                  alt={selectedMonument.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#282522]/85 text-[#B18A55] backdrop-blur-md">
                    {selectedMonument.category}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#713C3C]">
                  {selectedMonument.period}
                </span>
                <h3 className="font-serif-editorial text-2xl font-bold text-[#282522] mt-0.5">
                  {selectedMonument.name}
                </h3>
                {selectedMonument.vernacularName && (
                  <div className="text-xs text-[#B18A55] font-semibold">
                    {selectedMonument.vernacularName}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[#6B635D] mt-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B18A55]" />
                  <span>{selectedMonument.location}, {selectedMonument.state}</span>
                </div>
              </div>

              <p className="text-xs text-[#6B635D] leading-relaxed line-clamp-3">
                {selectedMonument.shortDescription}
              </p>

              <div className="p-3.5 rounded-2xl bg-[#F5F1E8] text-xs space-y-2 border border-[#E4DDD0]">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B635D] font-medium">Coordinates:</span>
                  <span className="font-mono text-[#282522] font-bold">
                    {selectedMonument.coordinates.lat.toFixed(4)}° N, {selectedMonument.coordinates.lng.toFixed(4)}° E
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B635D] font-medium">Visiting Hours:</span>
                  <span className="text-[#282522] font-semibold truncate max-w-[170px]">
                    {selectedMonument.visitorInformation.timings}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/heritage/${selectedMonument.slug}`}
                  className="flex-1 py-3 rounded-xl bg-[#282522] text-[#F5F1E8] hover:bg-[#713C3C] text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-xs"
                >
                  View Dossier
                </Link>

                {selectedMonument.tourScenes && selectedMonument.tourScenes.length > 0 && (
                  <Link
                    href={`/tour/${selectedMonument.slug}`}
                    className="flex-1 py-3 rounded-xl bg-[#B18A55] text-[#282522] hover:bg-[#C7A574] text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-xs"
                  >
                    Launch 360°
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E4DDD0] p-8 text-center text-xs text-[#6B635D]">
              Select a marker on the map to examine monument details.
            </div>
          )}

          {/* Map Cartographic Note */}
          <div className="p-4 rounded-2xl bg-[#F5F1E8] border border-[#E4DDD0] text-xs text-[#6B635D] space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#282522]">
              <Info className="w-4 h-4 text-[#B18A55]" />
              Spatial Verification Standards
            </div>
            <p className="leading-relaxed text-[11px]">
              Coordinates are georeferenced against Survey of India and OpenStreetMap basemaps to ensure physical fidelity during actual ground excursions.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
