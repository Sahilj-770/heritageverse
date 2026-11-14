"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Monument } from "@/types/heritage";
import { 
  Compass, 
  Layers, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Eye, 
  BookOpen, 
  MapPin, 
  SlidersHorizontal,
  Box
} from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

interface HeritageMapProps {
  monuments: Monument[];
  selectedMonumentId?: string;
  onSelectMonument?: (monument: Monument) => void;
  height?: string;
}

const MAP_STYLES = [
  {
    id: "bright",
    label: "Google Natural Terrain",
    url: "https://tiles.openfreemap.org/styles/bright",
  },
  {
    id: "positron",
    label: "Museum Archive (Positron)",
    url: "https://tiles.openfreemap.org/styles/positron",
  },
  {
    id: "liberty",
    label: "Topographic Vector",
    url: "https://tiles.openfreemap.org/styles/liberty",
  },
];

export function HeritageMap({
  monuments,
  selectedMonumentId,
  onSelectMonument,
  height = "640px",
}: HeritageMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const activePopupRef = useRef<any>(null);
  const isInitialLoadRef = useRef(true);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);
  const [activeRegion, setActiveRegion] = useState<string>("All");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showArchetypeFilter, setShowArchetypeFilter] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const regions = [
    "All",
    "Northern India",
    "Western India",
    "Southern India",
    "Eastern India",
    "Central India",
  ];

  const categories = [
    "All",
    "Forts & Citadels",
    "Palaces & Mansions",
    "Rock-Cut Caves & Temples",
    "Sacred Temples & Shrines",
    "Museums & Archives",
    "Colonial & Civic Heritage",
  ];

  const filteredMonuments = monuments.filter((m) => {
    const regionMatch = activeRegion === "All" || m.region === activeRegion;
    const catMatch = activeCategory === "All" || m.category === activeCategory;
    return regionMatch && catMatch;
  });

  // 1. Initialize MapLibre GL Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const maplibregl = await import("maplibre-gl");

      if (typeof window !== "undefined") {
        maplibregl.setWorkerUrl("/maplibre-gl-worker.js");
      }

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map with Google Maps-like continuous physics
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLES[currentStyleIndex].url,
        center: [79.5, 22.5], // Geographic center of India
        zoom: 4.8,
        minZoom: 3.5,
        maxZoom: 18,
        pitch: 0,
        bearing: 0,
        dragRotate: true,
        pitchWithRotate: true,
        touchPitch: true,
        attributionControl: false,
      });

      // Add standard navigation controls (Zoom + Compass with smooth pitch visualization)
      map.addControl(
        new maplibregl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        }),
        "bottom-right"
      );

      map.on("load", () => {
        if (!isMounted) return;
        mapInstanceRef.current = map;
        setMapLoaded(true);
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentStyleIndex]);

  // 2. Smoothly fly to selected monument when prop changes (skipping initial load)
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !selectedMonumentId) return;

    // Skip auto-flying on initial load so user sees the pan-India overview first
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    const target = monuments.find((m) => m.id === selectedMonumentId);
    if (!target) return;

    const map = mapInstanceRef.current;
    
    // Google Maps-like smooth curved swoop
    map.flyTo({
      center: [target.coordinates.lng, target.coordinates.lat],
      zoom: 11,
      pitch: is3D ? 45 : 20,
      duration: 1500,
      curve: 1.42,
      speed: 1.2,
      essential: true,
    });

    // Trigger popup on the marker
    const markerObj = markersRef.current[target.id];
    if (markerObj) {
      markerObj.togglePopup();
    }
  }, [selectedMonumentId, mapLoaded, monuments, is3D]);

  // 3. Render Custom Pins & Popups
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    import("maplibre-gl").then((maplibregl) => {
      const map = mapInstanceRef.current;

      // Remove existing markers
      Object.values(markersRef.current).forEach((m: any) => m.remove());
      markersRef.current = {};

      filteredMonuments.forEach((monument) => {
        const isSelected = selectedMonumentId === monument.id;

        // Custom HTML Marker Element with Google Maps smooth styling
        const el = document.createElement("div");
        el.className = `heritage-pin-wrapper group cursor-pointer transition-transform duration-300 ${
          isSelected ? "scale-110 z-50" : "hover:scale-110 z-20"
        }`;
        el.style.width = "36px";
        el.style.height = "42px";
        el.style.display = "flex";
        el.style.flexDirection = "column";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";

        el.innerHTML = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            ${
              isSelected
                ? `<div style="
                    position: absolute;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(177, 138, 85, 0.35);
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                  "></div>`
                : ""
            }
            <div style="
              width: ${isSelected ? "34px" : "28px"};
              height: ${isSelected ? "34px" : "28px"};
              background-color: ${isSelected ? "#713C3C" : "#282522"};
              border: 2px solid #B18A55;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 14px rgba(0,0,0,0.4);
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            ">
              <div style="
                width: 9px;
                height: 9px;
                background-color: #F5F1E8;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          </div>
          <div style="
            width: 6px;
            height: 3px;
            background: rgba(0,0,0,0.3);
            border-radius: 50%;
            margin-top: 1px;
            filter: blur(1px);
          "></div>
        `;

        // Rich Editorial Popup Window
        const popupContent = `
          <div style="font-family: inherit; width: 260px; overflow: hidden; border-radius: 12px; background: #FFFFFF;">
            <div style="position: relative; width: 100%; height: 120px; overflow: hidden; background: #282522;">
              <img 
                src="${monument.coverImage}" 
                alt="${monument.name}" 
                style="width: 100%; height: 100%; object-fit: cover;" 
              />
              <div style="position: absolute; top: 8px; left: 8px; background: rgba(40,37,34,0.85); backdrop-filter: blur(4px); padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; color: #B18A55; text-transform: uppercase;">
                ${monument.category}
              </div>
            </div>
            
            <div style="padding: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
                <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #713C3C; font-weight: 700;">
                  ${monument.region}
                </span>
                <span style="font-size: 9px; color: #6B635D; font-weight: 600;">
                  ${monument.state}
                </span>
              </div>

              <h4 style="font-size: 15px; font-weight: 800; color: #282522; margin: 0 0 4px 0; line-height: 1.2;">
                ${monument.name}
              </h4>

              ${
                monument.vernacularName
                  ? `<div style="font-size: 11px; color: #B18A55; font-weight: 600; margin-bottom: 6px;">${monument.vernacularName}</div>`
                  : ""
              }

              <p style="font-size: 11px; color: #6B635D; margin: 0 0 12px 0; line-height: 1.4;">
                ${monument.shortDescription.slice(0, 90)}...
              </p>

              <div style="display: flex; gap: 8px;">
                <a href="/heritage/${monument.slug}" style="
                  flex: 1;
                  background: #282522;
                  color: #F5F1E8;
                  text-decoration: none;
                  padding: 7px 10px;
                  border-radius: 8px;
                  font-size: 11px;
                  font-weight: 700;
                  text-align: center;
                  display: block;
                ">Read Dossier</a>

                ${
                  monument.tourScenes && monument.tourScenes.length > 0
                    ? `
                  <a href="/tour/${monument.slug}" style="
                    flex: 1;
                    background: #B18A55;
                    color: #282522;
                    text-decoration: none;
                    padding: 7px 10px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 800;
                    text-align: center;
                    display: block;
                  ">360° Tour</a>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({
          offset: [0, -28],
          closeButton: false,
          maxWidth: "280px",
          className: "heritage-maplibre-popup",
        }).setHTML(popupContent);

        const marker = new maplibregl.Marker({
          element: el,
          anchor: "bottom",
        })
          .setLngLat([monument.coordinates.lng, monument.coordinates.lat])
          .setPopup(popup)
          .addTo(map);

        el.addEventListener("click", () => {
          if (onSelectMonument) onSelectMonument(monument);

          // Google Maps-like smooth flyTo on marker click
          map.flyTo({
            center: [monument.coordinates.lng, monument.coordinates.lat],
            zoom: 11,
            pitch: is3D ? 45 : 20,
            duration: 1200,
            curve: 1.42,
            speed: 1.2,
            essential: true,
          });
        });

        markersRef.current[monument.id] = marker;
      });

      // Fit bounds smoothly to all filtered monuments if active
      if (filteredMonuments.length > 0 && activeRegion !== "All") {
        const bounds = new maplibregl.LngLatBounds();
        filteredMonuments.forEach((m) =>
          bounds.extend([m.coordinates.lng, m.coordinates.lat])
        );
        map.fitBounds(bounds, {
          padding: { top: 100, bottom: 60, left: 60, right: 60 },
          maxZoom: 9,
          duration: 1400,
          essential: true,
        });
      }
    });
  }, [filteredMonuments, mapLoaded, selectedMonumentId, onSelectMonument, is3D, activeRegion]);

  // Reset to full Republic of India overview
  const handleResetPanIndia = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [79.5, 22.5],
      zoom: 4.8,
      pitch: 0,
      bearing: 0,
      duration: 1600,
      essential: true,
    });
    setActiveRegion("All");
    setActiveCategory("All");
  }, []);

  // Toggle 3D Perspective Tilt
  const handleToggle3D = useCallback(() => {
    if (!mapInstanceRef.current) return;
    const next3D = !is3D;
    setIs3D(next3D);
    mapInstanceRef.current.easeTo({
      pitch: next3D ? 50 : 0,
      duration: 1000,
    });
  }, [is3D]);

  // Cycle through vector map styles
  const handleCycleStyle = useCallback(() => {
    const nextIndex = (currentStyleIndex + 1) % MAP_STYLES.length;
    setCurrentStyleIndex(nextIndex);
  }, [currentStyleIndex]);

  return (
    <div 
      className={`relative w-full rounded-3xl overflow-hidden border border-[#E4DDD0] bg-[#F5F1E8] shadow-xl transition-all ${
        isFullscreen ? "fixed inset-0 z-[9999] rounded-none h-screen" : ""
      }`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* WebGL Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Control HUD */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-2 pointer-events-none">
        
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          {/* Region Filter Bar */}
          <div className="flex items-center gap-1 bg-[#F5F1E8]/95 backdrop-blur-md border border-[#E4DDD0] p-1.5 rounded-2xl shadow-md pointer-events-auto overflow-x-auto max-w-full">
            <div className="px-2 text-xs font-bold text-[#713C3C] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <Compass className="w-3.5 h-3.5 text-[#B18A55]" />
              <span className="hidden sm:inline">Region:</span>
            </div>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setActiveRegion(reg)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  activeRegion === reg
                    ? "bg-[#282522] text-[#F5F1E8] shadow-xs"
                    : "bg-white/80 text-[#6B635D] hover:bg-white hover:text-[#282522] border border-[#E4DDD0]"
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Quick Map Interaction Utilities (Style, Archetypes, 3D, Reset) */}
          <div className="flex items-center gap-1.5 bg-[#F5F1E8]/95 backdrop-blur-md border border-[#E4DDD0] p-1.5 rounded-2xl shadow-md pointer-events-auto">
            
            {/* Archetype Toggle Button */}
            <button
              onClick={() => setShowArchetypeFilter(!showArchetypeFilter)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                showArchetypeFilter || activeCategory !== "All"
                  ? "bg-[#713C3C] text-white border-[#713C3C]"
                  : "bg-white text-[#282522] border-[#E4DDD0] hover:bg-[#E4DDD0]"
              }`}
              title="Filter by architectural archetype"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">
                {activeCategory === "All" ? "Archetype" : activeCategory}
              </span>
            </button>

            {/* Style Switcher Pill */}
            <button
              onClick={handleCycleStyle}
              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-[#282522] hover:bg-[#E4DDD0] border border-[#E4DDD0] flex items-center gap-1.5 transition-colors"
              title="Switch vector map style"
            >
              <Layers className="w-3.5 h-3.5 text-[#B18A55]" />
              <span className="text-[11px] hidden md:inline">{MAP_STYLES[currentStyleIndex].label}</span>
              <span className="text-[11px] md:hidden">Style</span>
            </button>

            {/* 3D Tilt Button */}
            <button
              onClick={handleToggle3D}
              className={`p-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
                is3D 
                  ? "bg-[#713C3C] text-white border-[#713C3C]" 
                  : "bg-white text-[#282522] border-[#E4DDD0] hover:bg-[#E4DDD0]"
              }`}
              title="Toggle 3D perspective"
            >
              <Box className="w-4 h-4" />
              <span className="text-[11px] font-bold hidden sm:inline">{is3D ? "3D" : "2D"}</span>
            </button>

            {/* Reset Pan-India View */}
            <button
              onClick={handleResetPanIndia}
              className="p-1.5 rounded-xl bg-white text-[#282522] hover:bg-[#E4DDD0] border border-[#E4DDD0] transition-colors"
              title="Reset view to whole India"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-white text-[#282522] hover:bg-[#E4DDD0] border border-[#E4DDD0] transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Collapsible Secondary Archetype Filter Bar */}
        {showArchetypeFilter && (
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F5F1E8]/95 backdrop-blur-md border border-[#E4DDD0] p-2 rounded-2xl shadow-md pointer-events-auto animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="px-1 text-xs font-bold text-[#6B635D] uppercase tracking-wider flex items-center gap-1.5">
              <span>Filter:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#713C3C] text-[#F5F1E8] font-bold shadow-xs"
                    : "bg-white/70 text-[#6B635D] hover:bg-white hover:text-[#282522] border border-[#E4DDD0]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Bottom Status Badge */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <div className="bg-[#282522]/90 backdrop-blur-md text-[#F5F1E8] px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-2 shadow-lg border border-[#B18A55]/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Showing {filteredMonuments.length} of {monuments.length} Geocoded Monuments</span>
          <span className="text-[#B18A55] font-semibold hidden md:inline">• Drag & scroll with 60 FPS WebGL</span>
        </div>
      </div>

    </div>
  );
}
