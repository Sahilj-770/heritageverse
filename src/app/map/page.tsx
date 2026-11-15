"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Monument } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { HeritageMap } from "@/components/map/HeritageMap";
import { MonumentModelViewer } from "@/components/monuments/MonumentModelViewer";
import { 
  MapPin, 
  Compass, 
  Navigation, 
  Layers, 
  Info, 
  Globe2, 
  Map as MapIcon, 
  Box, 
  Eye, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Ticket
} from "lucide-react";

// Dynamically import CesiumHeritageGlobe with SSR disabled (CesiumJS requires WebGL and browser globals)
const CesiumHeritageGlobe = dynamic(
  () => import("@/components/map/CesiumHeritageGlobe").then((mod) => mod.CesiumHeritageGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[660px] rounded-3xl bg-[#1E1B18] border border-[#3D3835] flex flex-col items-center justify-center p-8 text-center text-[#E4DDD0] shadow-xl">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#B18A55]/30 border-t-[#B18A55] animate-spin flex items-center justify-center">
            <Globe2 className="w-8 h-8 text-[#B18A55]" />
          </div>
        </div>
        <h3 className="font-serif-editorial text-2xl font-bold text-[#FAF4E5] tracking-wide">
          Initializing 3D Heritage Globe
        </h3>
        <p className="text-xs text-[#A69E96] mt-2 max-w-md leading-relaxed">
          Loading CesiumJS WebGL engine, high-resolution OpenStreetMap base layers, and historical coordinate index...
        </p>
        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#282522] border border-[#3D3835] text-[10px] text-[#B18A55] uppercase tracking-wider font-bold">
          <span>Survey of India Compliant Geodesy</span>
        </div>
      </div>
    ),
  }
);

export default function InteractiveMapPage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const [engineMode, setEngineMode] = useState<"3d" | "2d">("3d");
  const [showModelViewer, setShowModelViewer] = useState(false);

  useEffect(() => {
    const list = HeritageStore.getMonuments();
    setMonuments(list);
    if (list.length > 0) {
      setSelectedMonument(list[0]);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header with Engine Mode Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E4DDD0]">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-[#B18A55] font-bold flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#713C3C]" />
            National Spatial Cartographic System
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#282522]">
            Spatial Heritage Atlas & 3D Globe
          </h1>
          <p className="text-sm text-[#6B635D] max-w-2xl leading-relaxed">
            Examine the geographical distribution of 17 premier Indian monuments across planetary curvature, geodetic coordinates, and high-fidelity architectural models.
          </p>
        </div>

        {/* Engine Switcher + Directory View Link */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dual Engine Switcher */}
          <div className="flex items-center p-1 bg-[#E4DDD0]/60 rounded-2xl border border-[#D5CCC0]">
            <button
              onClick={() => setEngineMode("3d")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                engineMode === "3d"
                  ? "bg-[#713C3C] text-[#FAF4E5] shadow-sm"
                  : "text-[#6B635D] hover:text-[#282522]"
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>3D Globe (CesiumJS)</span>
            </button>

            <button
              onClick={() => setEngineMode("2d")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                engineMode === "2d"
                  ? "bg-[#282522] text-[#F5F1E8] shadow-sm"
                  : "text-[#6B635D] hover:text-[#282522]"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>2D Atlas (MapLibre)</span>
            </button>
          </div>

          <Link
            href="/explore"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-[#282522] border border-[#E4DDD0] hover:bg-[#F5F1E8] hover:border-[#B18A55] transition-colors shadow-2xs"
          >
            Directory View
          </Link>
        </div>
      </div>

      {/* Main Map + Inspection Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Primary Interactive Cartography Pane */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative">
            {engineMode === "3d" ? (
              <CesiumHeritageGlobe
                monuments={monuments}
                selectedMonumentId={selectedMonument?.id}
                onSelectMonument={(m) => setSelectedMonument(m)}
                onOpenModelViewer={(m) => {
                  setSelectedMonument(m);
                  setShowModelViewer(true);
                }}
              />
            ) : (
              <HeritageMap
                monuments={monuments}
                selectedMonumentId={selectedMonument?.id}
                onSelectMonument={(m) => setSelectedMonument(m)}
                height="660px"
              />
            )}
          </div>

          {/* Quick Engine Status Indicator Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#E4DDD0]/40 border border-[#D5CCC0] text-xs text-[#6B635D]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-medium">
                Active Engine:{" "}
                <strong className="text-[#282522]">
                  {engineMode === "3d" ? "CesiumJS WebGL 3D Planetary Ellipsoid" : "MapLibre GL Vector Tile Rasterizer"}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Grounding: <strong>WGS84 Ellipsoid</strong></span>
              <span>Coordinates: <strong>Survey of India Verified</strong></span>
            </div>
          </div>
        </div>

        {/* Selected Monument Dossier & Four Core Actions */}
        <div className="lg:col-span-4 space-y-5">
          {selectedMonument ? (
            <div className="bg-white rounded-3xl border border-[#E4DDD0] p-6 shadow-sm space-y-5">
              
              {/* Photo & Category Pill */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#282522] border border-[#E4DDD0]">
                <img
                  src={selectedMonument.coverImage}
                  alt={selectedMonument.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#282522]/90 text-[#B18A55] backdrop-blur-md border border-[#B18A55]/30">
                    {selectedMonument.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                  <span className="font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                    {selectedMonument.period}
                  </span>
                  <span className="font-mono text-[10px] text-[#E4DDD0]">
                    {selectedMonument.coordinates.lat.toFixed(4)}°N, {selectedMonument.coordinates.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>

              {/* Title & Vernacular Name */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#713C3C]">
                  {selectedMonument.region}
                </span>
                <h3 className="font-serif-editorial text-2xl font-bold text-[#282522] mt-0.5">
                  {selectedMonument.name}
                </h3>
                {selectedMonument.vernacularName && (
                  <div className="text-xs text-[#B18A55] font-semibold mt-0.5">
                    {selectedMonument.vernacularName}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[#6B635D] mt-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B18A55] shrink-0" />
                  <span>{selectedMonument.location}, {selectedMonument.state}</span>
                </div>
              </div>

              {/* Executive Summary */}
              <p className="text-xs text-[#6B635D] leading-relaxed line-clamp-3">
                {selectedMonument.shortDescription}
              </p>

              {/* 3D Reconstruction Status Pill */}
              <div className="p-3 rounded-2xl bg-[#F5F1E8] border border-[#E4DDD0] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-[#713C3C]" />
                  <div>
                    <div className="text-[11px] font-bold text-[#282522]">
                      3D Model & Mesh Status
                    </div>
                    <div className="text-[10px] text-[#6B635D]">
                      {selectedMonument.model3d?.surveyMethod || "Photogrammetry Survey"}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  selectedMonument.model3d?.status === "available"
                    ? "bg-[#713C3C] text-[#FAF4E5]" 
                    : "bg-[#E4DDD0] text-[#713C3C]"
                }`}>
                  {selectedMonument.model3d?.status === "available" ? "Mesh Available" : "Field Survey"}
                </span>
              </div>

              {/* Visitor Telemetry Brief */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#F5F1E8]/70 border border-[#E4DDD0] space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-[#6B635D] font-bold uppercase tracking-wider">
                    <Clock className="w-3 h-3 text-[#B18A55]" />
                    <span>Timings</span>
                  </div>
                  <div className="font-semibold text-[#282522] truncate text-[11px]">
                    {selectedMonument.visitorInformation.timings}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F1E8]/70 border border-[#E4DDD0] space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-[#6B635D] font-bold uppercase tracking-wider">
                    <Ticket className="w-3 h-3 text-[#B18A55]" />
                    <span>Entry Fee</span>
                  </div>
                  <div className="font-semibold text-[#282522] truncate text-[11px]">
                    {selectedMonument.visitorInformation.entryFee}
                  </div>
                </div>
              </div>

              {/* 4 CORE PURPOSEFUL ACTIONS */}
              <div className="space-y-2 pt-2">
                
                {/* 1. Explore Monument Dossier */}
                <Link
                  href={`/heritage/${selectedMonument.slug}`}
                  className="w-full py-3 rounded-xl bg-[#282522] text-[#F5F1E8] hover:bg-[#713C3C] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Explore Monument Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B18A55]" />
                </Link>

                {/* 2. Plan a Trip */}
                <Link
                  href="/plan-trip"
                  className="w-full py-2.5 rounded-xl bg-[#713C3C] text-[#FAF4E5] hover:bg-[#8D4A4A] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Plan a Trip to Here</span>
                </Link>

                {/* Grid for 360° Tour & 3D Model Inspector */}
                <div className="grid grid-cols-2 gap-2">
                  {/* 3. Launch 360° Spherical Survey or Archival Photo Study */}
                  {selectedMonument.tourScenes && selectedMonument.tourScenes.length > 0 ? (
                    <Link
                      href={`/tour/${selectedMonument.slug}`}
                      className="py-2.5 px-3 rounded-xl bg-[#B18A55] text-[#282522] hover:bg-[#C7A574] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>
                        {selectedMonument.tourScenes[0]?.sceneType === "equirectangular_360"
                          ? "360° Tour"
                          : "Visual Survey"}
                      </span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="py-2.5 px-3 rounded-xl bg-[#E4DDD0]/60 text-[#A69E96] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>360° Pending</span>
                    </button>
                  )}

                  {/* 4. Inspect 3D Reconstruction */}
                  <button
                    onClick={() => setShowModelViewer(true)}
                    className="py-2.5 px-3 rounded-xl bg-[#FAF4E5] text-[#713C3C] border border-[#B18A55]/40 hover:bg-[#E4DDD0] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Box className="w-3.5 h-3.5 text-[#713C3C]" />
                    <span>Inspect 3D</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E4DDD0] p-8 text-center text-xs text-[#6B635D]">
              Select a marker on the map or globe to examine monument details.
            </div>
          )}

          {/* Cartographic Disclosure Card */}
          <div className="p-4 rounded-2xl bg-[#F5F1E8] border border-[#E4DDD0] text-xs text-[#6B635D] space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#282522]">
              <ShieldCheck className="w-4 h-4 text-[#713C3C]" />
              Geospatial Regulations & Provenance
            </div>
            <p className="leading-relaxed text-[11px] text-[#6B635D]">
              Georeferenced against Survey of India and OpenStreetMap basemaps under the National Geospatial Policy 2022. Ground coordinates are accurate to WGS84 benchmarks.
            </p>
          </div>
        </div>

      </div>

      {/* 3D Monument Model Inspector Modal Overlay */}
      {showModelViewer && selectedMonument && (
        <MonumentModelViewer
          monument={selectedMonument}
          onClose={() => setShowModelViewer(false)}
        />
      )}

    </div>
  );
}
