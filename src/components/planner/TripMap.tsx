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
  const maplibreRef = useRef<any>(null);
  const isMapLoadedRef = useRef<boolean>(false);

  // Live state refs to prevent stale closure race conditions
  const routeGeometryRef = useRef<[number, number][]>(routeGeometry);
  const stopsRef = useRef<TripStop[]>(stops);
  const transportModeRef = useRef<TransportMode>(transportMode);

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
  const isPlayingRef = useRef(false);
  const activeSpeedRef = useRef(1);
  const followTravelerRef = useRef(true);

  // Synchronize refs with state & props
  useEffect(() => {
    routeGeometryRef.current = routeGeometry;
  }, [routeGeometry]);

  useEffect(() => {
    stopsRef.current = stops;
  }, [stops]);

  useEffect(() => {
    transportModeRef.current = transportMode;
  }, [transportMode]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    activeSpeedRef.current = activeSpeed;
  }, [activeSpeed]);

  useEffect(() => {
    followTravelerRef.current = followTraveler;
  }, [followTraveler]);

  // Fit bounds around complete route with generous padding
  const fitRouteBounds = useCallback((map: any, coords: [number, number][]) => {
    if (!coords || coords.length === 0) return;
    const mLib = maplibreRef.current || (typeof window !== "undefined" && (window as any).maplibregl);
    if (!mLib || !mLib.LngLatBounds) return;

    try {
      const bounds = coords.reduce(
        (b: any, c: [number, number]) => b.extend(c),
        new mLib.LngLatBounds(coords[0], coords[0])
      );
      map.fitBounds(bounds, {
        padding: { top: 70, bottom: 90, left: 60, right: 60 },
        maxZoom: 14,
        duration: 1200,
      });
    } catch (err) {
      console.warn("fitRouteBounds failed gracefully:", err);
    }
  }, []);

  // Add / Update GeoJSON Route Line
  const addRouteLayer = useCallback((map: any, coords: [number, number][]) => {
    if (!coords || coords.length < 2) return;

    const geojsonData: any = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
    };

    try {
      if (map.getSource("trip-route")) {
        map.getSource("trip-route").setData(geojsonData);
      } else {
        map.addSource("trip-route", {
          type: "geojson",
          data: geojsonData,
        });

        // Route Casing (Deep Burgundy shadow)
        if (!map.getLayer("trip-route-casing")) {
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
              "line-opacity": 0.85,
            },
          });
        }

        // Route Core (Antique Gold stroke)
        if (!map.getLayer("trip-route-core")) {
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
      }
    } catch (err) {
      console.warn("addRouteLayer failed gracefully:", err);
    }
  }, []);

  // Render Numbered Stop Markers on Map
  const renderStopMarkers = useCallback((map: any, tripStops: TripStop[]) => {
    // Clear old markers
    stopMarkersRef.current.forEach((m) => {
      try {
        m.remove();
      } catch {}
    });
    stopMarkersRef.current = [];

    const mLib = maplibreRef.current || (typeof window !== "undefined" && (window as any).maplibregl);
    if (!mLib || !mLib.Marker) return;

    tripStops.forEach((stop, index) => {
      if (!stop.coordinates || typeof stop.coordinates.lat !== "number" || typeof stop.coordinates.lng !== "number") {
        return;
      }

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

      try {
        const popup = new mLib.Popup({ offset: 18, closeButton: false }).setHTML(`
          <div class="p-2.5 font-sans text-xs space-y-1">
            <div class="font-bold text-[#282522]">${stop.name}</div>
            <div class="text-[11px] text-[#6B635D]">${stop.locationName}</div>
            <div class="text-[10px] text-[#713C3C] font-semibold">Stop ${index + 1} of ${tripStops.length}</div>
          </div>
        `);

        const marker = new mLib.Marker({ element: el })
          .setLngLat([stop.coordinates.lng, stop.coordinates.lat])
          .setPopup(popup)
          .addTo(map);

        stopMarkersRef.current.push(marker);
      } catch (err) {
        console.warn("Failed to attach stop marker:", err);
      }
    });
  }, []);

  // Create or Update Traveler Marker (Car, Bike, etc.)
  const createTravelerMarker = useCallback((map: any, coords: [number, number][], mode: TransportMode) => {
    if (travelerMarkerRef.current) {
      try {
        travelerMarkerRef.current.remove();
      } catch {}
      travelerMarkerRef.current = null;
    }

    if (!coords || coords.length === 0) return;

    const mLib = maplibreRef.current || (typeof window !== "undefined" && (window as any).maplibregl);
    if (!mLib || !mLib.Marker) return;

    const el = document.createElement("div");
    el.className = "traveler-vehicle-marker relative flex items-center justify-center w-12 h-12 rounded-full shadow-2xl transition-transform";
    el.style.background = "radial-gradient(circle, #8A3D3D 0%, #551919 100%)";
    el.style.border = "2.5px solid #FFFFFF";
    el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(113,60,60,0.5)";

    // True Top-Down Bird's-Eye Vehicle SVGs (oriented facing North / 0° by default)
    let iconSvg = "";
    if (mode === "walking") {
      iconSvg = `
        <svg viewBox="0 0 32 32" class="w-6 h-6 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2 L24 24 L16 19 L8 24 Z" fill="#FAF4E5" stroke="#C5A059" stroke-width="1.6" stroke-linejoin="round"/>
          <circle cx="16" cy="14" r="2.2" fill="#713C3C"/>
        </svg>
      `;
    } else if (mode === "bicycle") {
      iconSvg = `
        <svg viewBox="0 0 32 32" class="w-6 h-6 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="14.8" y="3" width="2.4" height="6.5" rx="1.2" fill="#282522" stroke="#FAF4E5" stroke-width="0.7"/>
          <path d="M10 9 H22" stroke="#FAF4E5" stroke-width="2" stroke-linecap="round"/>
          <circle cx="10" cy="9" r="1.2" fill="#C5A059"/>
          <circle cx="22" cy="9" r="1.2" fill="#C5A059"/>
          <line x1="16" y1="9" x2="16" y2="20" stroke="#C5A059" stroke-width="2" stroke-linecap="round"/>
          <line x1="12.5" y1="16.5" x2="19.5" y2="16.5" stroke="#FAF4E5" stroke-width="1.8" stroke-linecap="round"/>
          <ellipse cx="16" cy="20.5" rx="2.5" ry="1.8" fill="#FAF4E5" stroke="#4A2525" stroke-width="0.8"/>
          <rect x="14.8" y="22" width="2.4" height="6.5" rx="1.2" fill="#282522" stroke="#FAF4E5" stroke-width="0.7"/>
        </svg>
      `;
    } else if (mode === "motorcycle") {
      iconSvg = `
        <svg viewBox="0 0 32 32" class="w-6 h-6 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2.5 L16 0" stroke="#FDE047" stroke-width="2" stroke-linecap="round"/>
          <rect x="14.5" y="3" width="3" height="6.5" rx="1.5" fill="#282522" stroke="#FAF4E5" stroke-width="0.8"/>
          <path d="M9 9.5 H23" stroke="#FAF4E5" stroke-width="2" stroke-linecap="round"/>
          <circle cx="9" cy="9.5" r="1.3" fill="#C5A059"/>
          <circle cx="23" cy="9.5" r="1.3" fill="#C5A059"/>
          <ellipse cx="16" cy="13" rx="2.8" ry="3.2" fill="#C5A059" stroke="#4A2525" stroke-width="0.8"/>
          <circle cx="16" cy="18" r="3.4" fill="#FAF4E5" stroke="#4A2525" stroke-width="1"/>
          <path d="M13.5 16.5 C14.5 15.5 17.5 15.5 18.5 16.5" stroke="#282522" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M14 21.5 H18 L17.5 25 H14.5 Z" fill="#713C3C"/>
          <rect x="14.8" y="24.5" width="2.4" height="5" rx="1.2" fill="#282522"/>
          <rect x="14.8" y="28.5" width="2.4" height="1" rx="0.5" fill="#EF4444"/>
        </svg>
      `;
    } else if (mode === "transit") {
      iconSvg = `
        <svg viewBox="0 0 32 32" class="w-6 h-6 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3 L8 0 M20 3 L24 0" stroke="#FAF4E5" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
          <rect x="10" y="3.5" width="12" height="24" rx="3" fill="#FAF4E5" stroke="#4A2525" stroke-width="1.2"/>
          <path d="M11.5 6 H20.5 V8.5 H11.5 Z" fill="#3D2828"/>
          <rect x="11.5" y="10.5" width="9" height="2" rx="0.5" fill="#C5A059"/>
          <rect x="11.5" y="14" width="9" height="2" rx="0.5" fill="#C5A059"/>
          <rect x="11.5" y="17.5" width="9" height="2" rx="0.5" fill="#C5A059"/>
          <rect x="11.5" y="21" width="9" height="2" rx="0.5" fill="#C5A059"/>
          <rect x="11.5" y="24" width="9" height="1.8" rx="0.5" fill="#3D2828"/>
          <rect x="11" y="4" width="2.2" height="1" fill="#FDE047"/>
          <rect x="18.8" y="4" width="2.2" height="1" fill="#FDE047"/>
          <rect x="11" y="26.5" width="2.2" height="1" fill="#EF4444"/>
          <rect x="18.8" y="26.5" width="2.2" height="1" fill="#EF4444"/>
        </svg>
      `;
    } else {
      // Default: Car / Driving
      iconSvg = `
        <svg viewBox="0 0 32 32" class="w-7 h-7 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4 L7 0 M20 4 L25 0" stroke="#FAF4E5" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
          <rect x="6.8" y="10" width="3.2" height="1.8" rx="0.8" fill="#FAF4E5"/>
          <rect x="22" y="10" width="3.2" height="1.8" rx="0.8" fill="#FAF4E5"/>
          <path d="M11 5.5 C11 4 12.2 3 13.8 3 H18.2 C19.8 3 21 4 21 5.5 L22.5 11 C22.8 12 23 13.5 23 15 L22.8 23 C22.8 25 21.5 26.5 19.8 26.5 H12.2 C10.5 26.5 9.2 25 9.2 23 L9 15 C9 13.5 9.2 12 9.5 11 Z" fill="#FAF4E5" stroke="#4A2525" stroke-width="1.2" stroke-linejoin="round"/>
          <path d="M11.5 11.5 C12.5 10.8 14.2 10.5 16 10.5 C17.8 10.5 19.5 10.8 20.5 11.5 L19.8 14 H12.2 Z" fill="#3D2828"/>
          <rect x="12" y="14.5" width="8" height="6.5" rx="1.5" fill="#C5A059"/>
          <path d="M12.5 21.8 H19.5 L19 23.5 H13 Z" fill="#3D2828"/>
          <rect x="11.8" y="3.8" width="2.4" height="1.5" rx="0.6" fill="#FDE047"/>
          <rect x="17.8" y="3.8" width="2.4" height="1.5" rx="0.6" fill="#FDE047"/>
          <rect x="11.2" y="25.5" width="2.8" height="1" rx="0.5" fill="#EF4444"/>
          <rect x="18" y="25.5" width="2.8" height="1" rx="0.5" fill="#EF4444"/>
        </svg>
      `;
    }

    // Directional Heading Indicator Triangle + Top-Down Rotating Vehicle
    el.innerHTML = `
      <div class="relative flex items-center justify-center w-full h-full">
        <span class="absolute -inset-1 rounded-full bg-[#C5A059] opacity-35 animate-ping"></span>
        <div id="vehicle-icon-rotator" class="w-full h-full flex items-center justify-center transition-transform duration-100 ease-linear">
          <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-[#C5A059] drop-shadow-sm"></div>
          ${iconSvg}
        </div>
      </div>
    `;

    travelerElRef.current = el;

    try {
      const initialPoint = coords[0];
      const marker = new mLib.Marker({ element: el })
        .setLngLat(initialPoint)
        .addTo(map);

      // Pre-orient the vehicle icon along the road tangent before animation starts
      if (coords.length >= 2) {
        const initialBearing = calculateBearing(coords[0], coords[1]);
        const rotator = el.querySelector("#vehicle-icon-rotator") as HTMLElement;
        if (rotator) {
          rotator.style.transform = `rotate(${initialBearing}deg)`;
        }
      }

      travelerMarkerRef.current = marker;
    } catch (err) {
      console.warn("Failed to create traveler marker:", err);
    }
  }, []);

  // Unified function to refresh route line, bounds, pins, and traveler vehicle
  const refreshMapLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current || !map.isStyleLoaded()) return;

    const currentCoords = routeGeometryRef.current;
    const currentStops = stopsRef.current;
    const currentMode = transportModeRef.current;

    if (currentCoords.length >= 2) {
      addRouteLayer(map, currentCoords);
      fitRouteBounds(map, currentCoords);
    }

    renderStopMarkers(map, currentStops);
    createTravelerMarker(map, currentCoords, currentMode);
  }, [addRouteLayer, fitRouteBounds, renderStopMarkers, createTravelerMarker]);

  // 1. Initialize MapLibre Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      
      try {
        const maplibregl = await import("maplibre-gl");
        if (typeof window !== "undefined") {
          (window as any).maplibregl = maplibregl;
        }
        maplibreRef.current = maplibregl;

        if (maplibregl.setWorkerUrl) {
          maplibregl.setWorkerUrl("/maplibre-gl-worker.js");
        }

        if (!isMounted || !mapContainerRef.current) return;

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        // Initial center: Geographic center of India
        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: "https://tiles.openfreemap.org/styles/bright",
          center: [78.9629, 20.5937],
          zoom: 4.8,
          pitch: 20,
          attributionControl: false,
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

        map.on("error", (e) => {
          console.warn("MapLibre tile/style error notice:", e);
        });

        map.on("load", () => {
          if (!isMounted) return;
          mapRef.current = map;
          isMapLoadedRef.current = true;
          map.resize();
          refreshMapLayers();
        });

        map.on("styledata", () => {
          if (!isMounted || !isMapLoadedRef.current) return;
          refreshMapLayers();
        });
      } catch (err) {
        console.error("Failed to initialize MapLibre GL in TripMap:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      isMapLoadedRef.current = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {}
        mapRef.current = null;
      }
    };
  }, [refreshMapLayers]);

  // 2. Update Route Geometry & Markers whenever props change
  useEffect(() => {
    refreshMapLayers();
    setProgress(0);
    setIsPlaying(false);
  }, [routeGeometry, stops, transportMode, refreshMapLayers]);

  // 3. Keep Map Canvas Perfectly Sized on container layout changes
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (mapRef.current) {
        try {
          mapRef.current.resize();
        } catch {}
      }
    });
    ro.observe(mapContainerRef.current);
    return () => ro.disconnect();
  }, []);

  // Re-size when toggling fullscreen
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        try {
          mapRef.current.resize();
        } catch {}
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const animateStepRef = useRef<() => void>(() => {});

  // 4. Animation Loop: Glides along polyline using sub-pixel interpolation
  const animateStep = useCallback(() => {
    const currentRoute = routeGeometryRef.current;
    if (!isPlayingRef.current || currentRoute.length < 2) return;

    // Advance progress based on active speed multiplier
    const stepIncrement = 0.0008 * activeSpeedRef.current;
    const newProgress = Math.min(1, progressRef.current + stepIncrement);
    progressRef.current = newProgress;
    setProgress(newProgress);

    // Compute coordinate and bearing on polyline
    const totalPoints = currentRoute.length;
    const floatIndex = newProgress * (totalPoints - 1);
    const indexLow = Math.floor(floatIndex);
    const indexHigh = Math.min(totalPoints - 1, indexLow + 1);
    const fraction = floatIndex - indexLow;

    const pLow = currentRoute[indexLow];
    const pHigh = currentRoute[indexHigh];

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
    if (followTravelerRef.current && mapRef.current) {
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

    animFrameRef.current = requestAnimationFrame(() => {
      animateStepRef.current();
    });
  }, [legs.length]);

  useEffect(() => {
    animateStepRef.current = animateStep;
  }, [animateStep]);

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
      if (routeGeometry.length >= 2 && travelerElRef.current) {
        const initialBearing = calculateBearing(routeGeometry[0], routeGeometry[1]);
        const rotator = travelerElRef.current.querySelector("#vehicle-icon-rotator") as HTMLElement;
        if (rotator) rotator.style.transform = `rotate(${initialBearing}deg)`;
      }
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
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />

      {/* Top Floating Route Badge */}
      <div className="absolute top-4 left-4 z-10 bg-[#FAF4E5]/95 backdrop-blur-md border border-[#E4DDD0] rounded-2xl p-3 shadow-md flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#713C3C] text-[#FAF4E5] flex items-center justify-center shadow-sm">
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
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
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
