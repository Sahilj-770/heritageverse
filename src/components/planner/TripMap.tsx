"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TripStop, RouteLeg, TransportMode } from "@/types/heritage";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Car, 
  Bike, 
  Footprints, 
  Compass, 
  Layers, 
  Sparkles,
  MapPin,
  Clock,
  Navigation
} from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

interface TripMapProps {
  stops: TripStop[];
  routeGeometry: [number, number][]; // [lng, lat] coordinates
  legs: RouteLeg[];
  transportMode: TransportMode;
  totalDistanceKm: string;
  totalDurationHours: string;
}

// Calculate bearing between two [lng, lat] points in degrees (0 = North, 90 = East)
function calculateBearing(p1: [number, number], p2: [number, number]): number {
  const [lng1, lat1] = p1;
  const [lng2, lat2] = p2;
  const y = Math.sin(((lng2 - lng1) * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(((lng2 - lng1) * Math.PI) / 180);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

export function TripMap({
  stops,
  routeGeometry,
  legs,
  transportMode,
  totalDistanceKm,
  totalDurationHours,
}: TripMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const stopMarkersRef = useRef<any[]>([]);
  const travelerMarkerRef = useRef<any>(null);
  const travelerElRef = useRef<HTMLDivElement | null>(null);

  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [activeSpeed, setActiveSpeed] = useState<number>(1);
  const [followTraveler, setFollowTraveler] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  progressRef.current = progress;
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  // 1. Initialize MapLibre Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      const maplibregl = await import("maplibre-gl");
      maplibregl.setWorkerUrl("/maplibre-gl-worker.js");

      if (!isMounted || !mapContainerRef.current) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Initial center fallback: Central India
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://tiles.openfreemap.org/styles/bright",
        center: [79.5, 22.5],
        zoom: 4.8,
        pitch: 20,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

      map.on("load", () => {
        if (!isMounted) return;
        mapRef.current = map;

        // Add Route Polyline Source and Layers
        if (routeGeometry.length > 0) {
          addRouteLayer(map, routeGeometry);
          fitRouteBounds(map, routeGeometry);
        }

        renderStopMarkers(map, stops);
        createTravelerMarker(map, routeGeometry, transportMode);
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Update Route Geometry & Markers when data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (routeGeometry.length > 0) {
      addRouteLayer(map, routeGeometry);
      fitRouteBounds(map, routeGeometry);
    }
    renderStopMarkers(map, stops);
    createTravelerMarker(map, routeGeometry, transportMode);
    setProgress(0);
    setIsPlaying(false);
  }, [routeGeometry, stops, transportMode]);

  // Add / Update GeoJSON Route Line
  const addRouteLayer = (map: any, coords: [number, number][]) => {
    const geojsonData: any = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
    };

    if (map.getSource("trip-route")) {
      map.getSource("trip-route").setData(geojsonData);
    } else {
      map.addSource("trip-route", {
        type: "geojson",
        data: geojsonData,
      });

      // Route Casing (Deep Burgundy shadow)
      map.addLayer({
        id: "trip-route-casing",
        type: "line",
        source: "trip-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#4A2525",
          "line-width": 8,
          "line-opacity": 0.8,
        },
      });

      // Route Core (Antique Gold stroke)
      map.addLayer({
        id: "trip-route-core",
        type: "line",
        source: "trip-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#C5A059",
          "line-width": 4.5,
          "line-dasharray": [1, 0],
        },
      });
    }
  };

  // Fit bounds around complete route with generous padding
  const fitRouteBounds = (map: any, coords: [number, number][]) => {
    if (!coords || coords.length === 0) return;
    const bounds = coords.reduce(
      (b: any, c: [number, number]) => b.extend(c),
      new (window as any).maplibregl.LngLatBounds(coords[0], coords[0])
    );
    map.fitBounds(bounds, {
      padding: { top: 70, bottom: 90, left: 60, right: 60 },
      maxZoom: 14,
      duration: 1200,
    });
  };

  // Render Numbered Stop Markers on Map
  const renderStopMarkers = (map: any, tripStops: TripStop[]) => {
    // Clear old markers
    stopMarkersRef.current.forEach((m) => m.remove());
    stopMarkersRef.current = [];

    const maplibregl = (window as any).maplibregl;
    if (!maplibregl) return;

    tripStops.forEach((stop, index) => {
      const el = document.createElement("div");
      el.className = "group relative cursor-pointer";

      const isFirst = index === 0;
      const isLast = index === tripStops.length - 1;

      const bgColor = isFirst ? "#2E7D32" : isLast ? "#713C3C" : "#B18A55";
      const badgeText = isFirst ? "START" : isLast ? "END" : `${index + 1}`;

      el.innerHTML = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full shadow-xl border-2 border-white text-white font-black text-xs transition-transform group-hover:scale-115" style="background-color: ${bgColor}">
          ${badgeText}
        </div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style="background-color: ${bgColor}"></div>
      `;

      const popup = new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(`
        <div class="p-2.5 font-sans text-xs space-y-1">
          <div class="font-bold text-[#282522]">${stop.name}</div>
          <div class="text-[11px] text-[#6B635D]">${stop.locationName}</div>
          <div class="text-[10px] text-[#713C3C] font-semibold">Stop ${index + 1} of ${tripStops.length}</div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([stop.coordinates.lng, stop.coordinates.lat])
        .setPopup(popup)
        .addTo(map);

      stopMarkersRef.current.push(marker);
    });
  };

  // Create or Update Traveler Marker (Car, Bike, etc.)
  const createTravelerMarker = (map: any, coords: [number, number][], mode: TransportMode) => {
    if (travelerMarkerRef.current) {
      travelerMarkerRef.current.remove();
      travelerMarkerRef.current = null;
    }

    if (!coords || coords.length === 0) return;

    const maplibregl = (window as any).maplibregl;
    if (!maplibregl) return;

    const el = document.createElement("div");
    el.className = "traveler-vehicle-marker flex items-center justify-center w-11 h-11 rounded-full shadow-2xl border-2 border-white transition-transform";
    el.style.backgroundColor = "#713C3C";
    el.style.color = "#FAF4E5";

    // Dynamic vehicle SVG icon
    let iconSvg = "";
    if (mode === "walking") {
      iconSvg = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="5" r="2"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>`;
    } else if (mode === "bicycle") {
      iconSvg = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`;
    } else if (mode === "motorcycle") {
      iconSvg = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="m9 9 2 4h4l2-4"/><path d="M13 6h2"/></svg>`;
    } else {
      // Car / Driving
      iconSvg = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`;
    }

    el.innerHTML = `
      <div class="relative flex items-center justify-center w-full h-full">
        <span class="absolute w-full h-full rounded-full bg-[#B18A55] opacity-40 animate-ping"></span>
        <div id="vehicle-icon-rotator" class="transition-transform duration-75">
          ${iconSvg}
        </div>
      </div>
    `;

    travelerElRef.current = el;

    const initialPoint = coords[0];
    const marker = new maplibregl.Marker({ element: el })
      .setLngLat(initialPoint)
      .addTo(map);

    travelerMarkerRef.current = marker;
  };

  // 3. Animation Loop: Glides along polyline using sub-pixel interpolation
  const animateStep = useCallback(() => {
    if (!isPlayingRef.current || routeGeometry.length < 2) return;

    // Advance progress based on speed
    const stepIncrement = 0.0008 * activeSpeed;
    const newProgress = Math.min(1, progressRef.current + stepIncrement);
    progressRef.current = newProgress;
    setProgress(newProgress);

    // Compute coordinate and bearing on polyline
    const totalPoints = routeGeometry.length;
    const floatIndex = newProgress * (totalPoints - 1);
    const indexLow = Math.floor(floatIndex);
    const indexHigh = Math.min(totalPoints - 1, indexLow + 1);
    const fraction = floatIndex - indexLow;

    const pLow = routeGeometry[indexLow];
    const pHigh = routeGeometry[indexHigh];

    const currentLng = pLow[0] + (pHigh[0] - pLow[0]) * fraction;
    const currentLat = pLow[1] + (pHigh[1] - pLow[1]) * fraction;

    // Calculate heading/bearing
    const bearing = calculateBearing(pLow, pHigh);

    // Update vehicle marker position and orientation
    if (travelerMarkerRef.current) {
      travelerMarkerRef.current.setLngLat([currentLng, currentLat]);
    }

    if (travelerElRef.current) {
      const rotator = travelerElRef.current.querySelector("#vehicle-icon-rotator") as HTMLElement;
      if (rotator) {
        rotator.style.transform = `rotate(${bearing}deg)`;
      }
    }

    // Camera follow if enabled
    if (followTraveler && mapRef.current) {
      mapRef.current.easeTo({
        center: [currentLng, currentLat],
        duration: 100,
        easing: (t: number) => t,
      });
    }

    // Determine current active leg
    if (legs.length > 0) {
      const legIndex = Math.min(legs.length - 1, Math.floor(newProgress * legs.length));
      setCurrentLegIndex(legIndex);
    }

    if (newProgress >= 1) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    animFrameRef.current = requestAnimationFrame(animateStep);
  }, [routeGeometry, activeSpeed, followTraveler, legs.length]);

  // Handle Play / Pause
  const handleTogglePlay = () => {
    if (routeGeometry.length < 2) return;

    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      if (progress >= 1) {
        setProgress(0);
        progressRef.current = 0;
      }
      setIsPlaying(true);
      isPlayingRef.current = true;
      animFrameRef.current = requestAnimationFrame(animateStep);
    }
  };

  // Handle Reset
  const handleReset = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setProgress(0);
    progressRef.current = 0;
    setCurrentLegIndex(0);

    if (routeGeometry.length > 0 && travelerMarkerRef.current) {
      travelerMarkerRef.current.setLngLat(routeGeometry[0]);
    }
    if (mapRef.current && routeGeometry.length > 0) {
      fitRouteBounds(mapRef.current, routeGeometry);
    }
  };

  // Handle Scrubber Change
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    progressRef.current = val;

    if (routeGeometry.length > 1) {
      const totalPoints = routeGeometry.length;
      const floatIndex = val * (totalPoints - 1);
      const indexLow = Math.floor(floatIndex);
      const indexHigh = Math.min(totalPoints - 1, indexLow + 1);
      const fraction = floatIndex - indexLow;

      const pLow = routeGeometry[indexLow];
      const pHigh = routeGeometry[indexHigh];

      const currentLng = pLow[0] + (pHigh[0] - pLow[0]) * fraction;
      const currentLat = pLow[1] + (pHigh[1] - pLow[1]) * fraction;
      const bearing = calculateBearing(pLow, pHigh);

      if (travelerMarkerRef.current) {
        travelerMarkerRef.current.setLngLat([currentLng, currentLat]);
      }
      if (travelerElRef.current) {
        const rotator = travelerElRef.current.querySelector("#vehicle-icon-rotator") as HTMLElement;
        if (rotator) rotator.style.transform = `rotate(${bearing}deg)`;
      }
    }
  };

  const activeLeg = legs[currentLegIndex];

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-[#E4DDD0] shadow-sm bg-[#FAF8F5] ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-[620px]"}`}>
      
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Floating Route Badge */}
      <div className="absolute top-4 left-4 z-10 bg-[#FAF4E5]/95 backdrop-blur-md border border-[#E4DDD0] rounded-2xl p-3 shadow-md flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#713C3C] text-[#FAF4E5] flex items-center justify-center">
            {transportMode === "walking" && <Footprints className="w-4 h-4" />}
            {transportMode === "bicycle" && <Bike className="w-4 h-4" />}
            {transportMode === "motorcycle" && <Navigation className="w-4 h-4" />}
            {transportMode === "driving" && <Car className="w-4 h-4" />}
            {transportMode === "transit" && <Compass className="w-4 h-4" />}
          </div>
          <div>
            <div className="font-bold text-[#282522] uppercase tracking-wider text-[10px]">
              {transportMode} ROUTE
            </div>
            <div className="text-[#6B635D] font-medium">
              {totalDistanceKm} km • {totalDurationHours} hrs
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-[#E4DDD0]" />

        <div className="text-[11px] text-[#6B635D]">
          <span className="font-bold text-[#713C3C]">{stops.length} Stops</span>
        </div>
      </div>

      {/* Top Right Controls: Follow Mode + Fullscreen */}
      <div className="absolute top-4 right-14 z-10 flex items-center gap-2">
        <button
          onClick={() => setFollowTraveler(!followTraveler)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md shadow-md transition-all flex items-center gap-1.5 ${
            followTraveler
              ? "bg-[#713C3C] text-[#FAF4E5] border-[#713C3C]"
              : "bg-[#FAF4E5]/90 text-[#6B635D] border-[#E4DDD0] hover:text-[#282522]"
          }`}
          title="Toggle camera follow mode"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Follow Traveler</span>
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-[#FAF4E5]/90 text-[#6B635D] hover:text-[#282522] border border-[#E4DDD0] backdrop-blur-md shadow-md transition-all"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Floating Journey Animator Console */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-[#282522]/95 backdrop-blur-md border border-[#3D3835] rounded-2xl p-4 shadow-2xl text-[#FAF4E5]">
        
        {/* Active Leg Announcement */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[#B18A55] font-semibold uppercase tracking-wider text-[10px]">
              {isPlaying ? "JOURNEY IN PROGRESS" : progress >= 1 ? "JOURNEY COMPLETED" : "READY TO TRAVEL"}
            </span>
            {activeLeg && (
              <span className="text-white font-serif-editorial text-sm font-bold truncate max-w-[260px] sm:max-w-md">
                Leg {currentLegIndex + 1}: {activeLeg.fromName} → {activeLeg.toName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#B18A55]">
            <span>{Math.round(progress * 100)}% Traveled</span>
            <span className="text-[#6B635D]">•</span>
            <span>Speed:</span>
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setActiveSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  activeSpeed === spd
                    ? "bg-[#C5A059] text-[#282522]"
                    : "bg-[#3D3835] text-[#FAF4E5] hover:bg-[#4A4440]"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Scrubber Progress Bar */}
        <div className="relative w-full mb-3">
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={handleScrubberChange}
            className="w-full h-1.5 bg-[#4A4440] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
          />
        </div>

        {/* Playback Controls & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A059] text-[#282522] font-bold text-xs hover:bg-[#D4AF37] transition-all shadow-md active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{progress >= 1 ? "Replay Journey" : "Start Journey Animation"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-[#3D3835] text-[#FAF4E5] hover:bg-[#4A4440] transition-colors"
              title="Reset to departure point"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-[#A69E96] hidden md:block">
            Vehicle icon automatically rotates with actual highway curves and tangent bearings.
          </div>
        </div>

      </div>

    </div>
  );
}
