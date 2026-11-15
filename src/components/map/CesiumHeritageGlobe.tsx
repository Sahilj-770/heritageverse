"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Monument } from "@/types/heritage";
import { 
  Globe2, 
  Compass, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Box, 
  Eye, 
  MapPin, 
  SlidersHorizontal,
  Navigation,
  Info
} from "lucide-react";

interface CesiumHeritageGlobeProps {
  monuments: Monument[];
  selectedMonumentId?: string;
  onSelectMonument?: (monument: Monument) => void;
  onOpenModelViewer?: (monument: Monument) => void;
}

// Generate pin canvas image for Cesium Billboards
function createPinImage(color: string, label: string, isSelected: boolean): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Outer halo if selected
  if (isSelected) {
    ctx.beginPath();
    ctx.arc(32, 28, 26, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(177, 138, 85, 0.4)";
    ctx.fill();
  }

  // Pin body
  ctx.beginPath();
  ctx.arc(32, 28, 18, 0, Math.PI * 2);
  ctx.fillStyle = isSelected ? "#713C3C" : color;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#B18A55";
  ctx.stroke();

  // Pin point triangle
  ctx.beginPath();
  ctx.moveTo(22, 38);
  ctx.lineTo(32, 60);
  ctx.lineTo(42, 38);
  ctx.fillStyle = isSelected ? "#713C3C" : color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#B18A55";
  ctx.stroke();

  // Center dot
  ctx.beginPath();
  ctx.arc(32, 28, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#FAF4E5";
  ctx.fill();

  return canvas.toDataURL();
}

export function CesiumHeritageGlobe({
  monuments,
  selectedMonumentId,
  onSelectMonument,
  onOpenModelViewer,
}: CesiumHeritageGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const entitiesMapRef = useRef<{ [id: string]: any }>({});
  const isInitialLoadRef = useRef(true);

  const [globeReady, setGlobeReady] = useState(false);
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [imageryMode, setImageryMode] = useState<"osm" | "positron">("osm");

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

  // 1. Initialize Cesium Viewer
  useEffect(() => {
    let isMounted = true;

    async function initCesium() {
      if (typeof window === "undefined" || !containerRef.current) return;

      try {
        (window as any).CESIUM_BASE_URL = "/cesium/";

        // Load Cesium widgets CSS dynamically
        if (!document.getElementById("cesium-widgets-css")) {
          const link = document.createElement("link");
          link.id = "cesium-widgets-css";
          link.rel = "stylesheet";
          link.href = "/cesium/Widgets/widgets.css";
          document.head.appendChild(link);
        }

        const Cesium = await import("cesium");

        if (!isMounted || !containerRef.current) return;

        // Clean up any existing viewer
        if (viewerRef.current) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }

        // Set optional Cesium ion token if present in environment
        if (process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN) {
          Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
        }

        // OpenStreetMap Tile Provider
        const osmProvider = new Cesium.UrlTemplateImageryProvider({
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          credit: "© OpenStreetMap contributors",
          maximumLevel: 19,
        });

        // Initialize Cesium Viewer without bulky default widgets
        const viewer = new Cesium.Viewer(containerRef.current, {
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          vrButton: false,
          infoBox: false,
          selectionIndicator: false,
          baseLayer: new Cesium.ImageryLayer(osmProvider),
          shadows: false,
          requestRenderMode: true,
          maximumRenderTimeChange: Infinity,
        });

        // Atmosphere & Lighting
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#1a1816");
        viewer.scene.globe.depthTestAgainstTerrain = false;

        // Initial Camera: Pan-India Subcontinental Overview
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(79.5, 21.0, 3200000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-85),
            roll: 0.0,
          },
        });

        // Click handler to pick monument entities
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click: any) => {
          const picked = viewer.scene.pick(click.position);
          if (Cesium.defined(picked) && picked.id && picked.id.monumentData) {
            const mon = picked.id.monumentData as Monument;
            if (onSelectMonument) onSelectMonument(mon);

            // Fly camera smoothly to monument
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                mon.coordinates.lng,
                mon.coordinates.lat - 0.015,
                2400
              ),
              orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-35),
                roll: 0.0,
              },
              duration: 1.8,
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        viewerRef.current = viewer;
        setGlobeReady(true);
      } catch (err) {
        console.error("CesiumJS 3D Globe initialization error:", err);
      }
    }

    initCesium();

    return () => {
      isMounted = false;
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch {}
        viewerRef.current = null;
      }
    };
  }, []);

  // 2. Add / Update Monument Billboard Entities on 3D Globe
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!globeReady || !viewer) return;

    import("cesium").then((Cesium) => {
      // Clear old entities
      Object.values(entitiesMapRef.current).forEach((entity: any) => {
        viewer.entities.remove(entity);
      });
      entitiesMapRef.current = {};

      filteredMonuments.forEach((monument) => {
        const isSelected = selectedMonumentId === monument.id;
        const pinImg = createPinImage(
          isSelected ? "#713C3C" : "#282522",
          monument.name,
          isSelected
        );

        const entity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            monument.coordinates.lng,
            monument.coordinates.lat,
            0
          ),
          billboard: {
            image: pinImg,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            scale: isSelected ? 1.15 : 0.9,
            disableDepthTestDistance: Number.POSITIVE_INFINITY, // Ensure pin is always visible above surface
          },
          label: {
            text: monument.name,
            font: isSelected ? "bold 13px serif" : "11px sans-serif",
            fillColor: isSelected
              ? Cesium.Color.fromCssColorString("#FAF4E5")
              : Cesium.Color.fromCssColorString("#E4DDD0"),
            outlineColor: Cesium.Color.fromCssColorString("#181615"),
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, 4),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500000),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });

        // Attach custom monument reference
        (entity as any).monumentData = monument;
        entitiesMapRef.current[monument.id] = entity;
      });

      viewer.scene.requestRender();
    });
  }, [filteredMonuments, globeReady, selectedMonumentId]);

  // 3. Fly to Selected Monument
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!globeReady || !viewer || !selectedMonumentId) return;

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    const target = monuments.find((m) => m.id === selectedMonumentId);
    if (!target) return;

    import("cesium").then((Cesium) => {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          target.coordinates.lng,
          target.coordinates.lat - 0.012,
          2200
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-38),
          roll: 0.0,
        },
        duration: 1.8,
      });
      viewer.scene.requestRender();
    });
  }, [selectedMonumentId, globeReady, monuments]);

  // Reset to Pan-India Overview
  const handleResetPanIndia = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    import("cesium").then((Cesium) => {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(79.5, 21.0, 3200000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-85),
          roll: 0.0,
        },
        duration: 2.0,
      });
      setActiveRegion("All");
      setActiveCategory("All");
    });
  }, []);

  // Orbit camera around current center
  const handleToggleOrbit = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    if (isOrbiting) {
      setIsOrbiting(false);
    } else {
      setIsOrbiting(true);
      viewer.camera.rotate(new (window as any).Cesium.Cartesian3(0, 0, 1), 0.01);
    }
  };

  const selectedMonument = monuments.find((m) => m.id === selectedMonumentId);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-[#E4DDD0] shadow-sm bg-[#181615] select-none ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-[640px]"
      }`}
    >
      {/* Cesium WebGL Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: 3D Heritage Globe Header Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <div className="bg-[#FAF4E5]/95 backdrop-blur-md border border-[#E4DDD0] rounded-2xl px-3.5 py-2 shadow-md flex items-center gap-2.5 text-xs">
          <Globe2 className="w-4 h-4 text-[#713C3C] animate-spin-slow" />
          <div>
            <div className="font-bold text-[#282522] uppercase tracking-wider text-[10px]">
              CesiumJS 3D Heritage Globe
            </div>
            <div className="text-[#6B635D] text-[11px]">
              WGS84 Ellipsoid • OpenStreetMap Imagery
            </div>
          </div>
        </div>

        {/* Region Filter Button */}
        <div className="relative">
          <select
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF4E5]/95 backdrop-blur-md border border-[#E4DDD0] text-xs font-semibold text-[#282522] focus:outline-none shadow-sm cursor-pointer"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                Region: {r}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter Button */}
        <div className="relative hidden sm:block">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF4E5]/95 backdrop-blur-md border border-[#E4DDD0] text-xs font-semibold text-[#282522] focus:outline-none shadow-sm cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Right: Camera Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={handleResetPanIndia}
          className="px-3 py-2 rounded-xl bg-[#FAF4E5]/95 backdrop-blur-md border border-[#E4DDD0] text-xs font-bold text-[#713C3C] hover:bg-white shadow-sm transition-all flex items-center gap-1.5"
          title="Reset to full India overview"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset India View</span>
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-[#FAF4E5]/95 backdrop-blur-md border border-[#E4DDD0] text-[#6B635D] hover:text-[#282522] shadow-sm transition-all"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Floating Quick Actions for Selected Monument */}
      {selectedMonument && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-10 bg-[#282522]/95 backdrop-blur-md border border-[#3D3835] rounded-2xl p-4 shadow-2xl text-[#FAF4E5] space-y-3 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B18A55]">
                {selectedMonument.category} • {selectedMonument.state}
              </span>
              <h3 className="font-serif-editorial text-lg font-bold text-white leading-tight">
                {selectedMonument.name}
              </h3>
            </div>
            {selectedMonument.model3d && onOpenModelViewer && (
              <button
                onClick={() => onOpenModelViewer(selectedMonument)}
                className="px-2.5 py-1 rounded-lg bg-[#FAF4E5]/15 hover:bg-[#FAF4E5]/25 border border-[#B18A55]/40 text-[#C5A059] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                title="Inspect 3D Reconstruction"
              >
                <Box className="w-3 h-3" />
                <span>3D Model</span>
              </button>
            )}
          </div>

          <p className="text-xs text-[#A69E96] line-clamp-2 leading-relaxed">
            {selectedMonument.shortDescription}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/heritage/${selectedMonument.slug}`}
              className="flex-1 py-2 rounded-xl bg-[#FAF4E5] text-[#282522] hover:bg-white text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-sm"
            >
              Explore Monument
            </Link>

            <Link
              href="/plan-trip"
              className="flex-1 py-2 rounded-xl bg-[#713C3C] text-[#FAF4E5] hover:bg-[#8D4A4A] text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3 h-3 text-[#C5A059]" />
              <span>Plan a Trip</span>
            </Link>

            {selectedMonument.tourScenes && selectedMonument.tourScenes.length > 0 && (
              <Link
                href={`/tour/${selectedMonument.slug}`}
                className="px-3 py-2 rounded-xl bg-[#B18A55] text-[#181615] hover:bg-[#C7A574] text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-sm"
                title="Launch Visual Survey"
              >
                {selectedMonument.tourScenes[0]?.sceneType === "equirectangular_360" ? "360°" : "Tour"}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Cartographic Disclosure Pill */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181615]/80 backdrop-blur-sm border border-[#3D3835] text-[10px] text-[#A69E96]">
        <Info className="w-3.5 h-3.5 text-[#B18A55]" />
        <span>Drag to rotate globe • Right-click or scroll to tilt & zoom</span>
      </div>
    </div>
  );
}
