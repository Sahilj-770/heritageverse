"use client";

import { 
  Compass, 
  Footprints, 
  History, 
  Sun, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Box, 
  ShieldCheck,
  Eye,
  Camera
} from "lucide-react";
import { ExperienceMode, LightingPreset } from "@/lib/3d/types";

interface ModelControlsProps {
  currentMode: ExperienceMode;
  onModeChange: (mode: ExperienceMode) => void;
  hasWalkthrough: boolean;
  hasHistorical: boolean;
  lightingPreset: LightingPreset;
  onLightingChange: (preset: LightingPreset) => void;
  isWireframe: boolean;
  onToggleWireframe: () => void;
  onResetView: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenAttribution: () => void;
  onCameraPreset?: (preset: "front" | "top" | "fountain") => void;
}

export function ModelControls({
  currentMode,
  onModeChange,
  hasWalkthrough,
  hasHistorical,
  lightingPreset,
  onLightingChange,
  isWireframe,
  onToggleWireframe,
  onResetView,
  isFullscreen,
  onToggleFullscreen,
  onOpenAttribution,
  onCameraPreset,
}: ModelControlsProps) {
  return (
    <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-30">
      
      {/* ── Mode Selection Pills ───────────────────────────────────── */}
      <div className="bg-[#181615]/90 backdrop-blur-md border border-[#3D3835] rounded-2xl p-1.5 flex items-center gap-1.5 shadow-2xl pointer-events-auto">
        <button
          onClick={() => onModeChange("explorer")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            currentMode === "explorer"
              ? "bg-[#B18A55] text-[#181615] shadow-lg"
              : "text-[#E4DDD0] hover:bg-[#282522] hover:text-white"
          }`}
          title="Inspect 3D Exterior Architecture"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Monument Explorer</span>
        </button>

        {hasWalkthrough && (
          <button
            onClick={() => onModeChange("walkthrough")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              currentMode === "walkthrough"
                ? "bg-[#713C3C] text-[#FAF4E5] shadow-lg"
                : "text-[#E4DDD0] hover:bg-[#282522] hover:text-white"
            }`}
            title="First-Person Walkthrough Inside Monument"
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Walk Inside</span>
          </button>
        )}

        {hasHistorical && (
          <button
            onClick={() => onModeChange("historical")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              currentMode === "historical"
                ? "bg-[#B57842] text-[#FAF4E5] shadow-lg"
                : "text-[#E4DDD0] hover:bg-[#282522] hover:text-white"
            }`}
            title="Compare Surviving vs 1732 CE Reconstruction"
          >
            <History className="w-3.5 h-3.5" />
            <span>1732 CE Reconstruction</span>
          </button>
        )}
      </div>

      {/* ── Right-Side Utility Actions ─────────────────────────────── */}
      <div className="bg-[#181615]/90 backdrop-blur-md border border-[#3D3835] rounded-2xl p-1.5 flex items-center gap-1.5 shadow-2xl pointer-events-auto">
        
        {/* Camera Quick-Presets (in Explorer Mode) */}
        {currentMode === "explorer" && onCameraPreset && (
          <div className="hidden sm:flex items-center gap-1 border-r border-[#3D3835] pr-2 mr-1">
            <button
              onClick={() => onCameraPreset("front")}
              className="px-2.5 py-1.5 rounded-lg text-[11px] text-[#E4DDD0] hover:bg-[#282522] font-medium"
              title="Dilli Darwaza Frontal View"
            >
              Gate
            </button>
            <button
              onClick={() => onCameraPreset("top")}
              className="px-2.5 py-1.5 rounded-lg text-[11px] text-[#E4DDD0] hover:bg-[#282522] font-medium"
              title="Aerial Fortification View"
            >
              Citadel
            </button>
            <button
              onClick={() => onCameraPreset("fountain")}
              className="px-2.5 py-1.5 rounded-lg text-[11px] text-[#E4DDD0] hover:bg-[#282522] font-medium"
              title="Hazari Karanje Courtyard View"
            >
              Fountain
            </button>
          </div>
        )}

        {/* Lighting Atmosphere Toggle */}
        <button
          onClick={() => {
            const presets: LightingPreset[] = ["studio", "golden_hour", "midday_sun", "monsoon_diffuse"];
            const nextIdx = (presets.indexOf(lightingPreset) + 1) % presets.length;
            onLightingChange(presets[nextIdx]);
          }}
          className="p-2 rounded-xl text-[#E4DDD0] hover:bg-[#282522] hover:text-[#FAF4E5] transition-colors"
          title={`Lighting Atmosphere: ${lightingPreset.replace("_", " ")}`}
        >
          <Sun className="w-4 h-4 text-[#B18A55]" />
        </button>

        {/* Wireframe Topology Toggle (in Explorer Mode) */}
        {currentMode !== "walkthrough" && (
          <button
            onClick={onToggleWireframe}
            className={`p-2 rounded-xl transition-colors ${
              isWireframe ? "bg-[#B18A55] text-[#181615]" : "text-[#E4DDD0] hover:bg-[#282522]"
            }`}
            title="Toggle Architectural Wireframe Mesh"
          >
            <Box className="w-4 h-4" />
          </button>
        )}

        {/* Reset Camera View */}
        <button
          onClick={onResetView}
          className="p-2 rounded-xl text-[#E4DDD0] hover:bg-[#282522] transition-colors"
          title="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Scholarly Provenance & License Trigger */}
        <button
          onClick={onOpenAttribution}
          className="p-2 rounded-xl text-[#B18A55] hover:bg-[#282522] transition-colors"
          title="Archaeological Provenance & Methodology"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl text-[#E4DDD0] hover:bg-[#282522] transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
}
