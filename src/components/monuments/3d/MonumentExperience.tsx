"use client";

import { useState, useRef, useEffect } from "react";
import { MONUMENT_3D_MANIFEST } from "@/data/monument3dManifest";
import { MonumentModelViewer } from "./MonumentModelViewer";
import { MonumentWalkthrough } from "./MonumentWalkthrough";
import { ModelControls } from "./ModelControls";
import { HistoricalLayerToggle } from "./HistoricalLayerToggle";
import { ModelErrorState } from "./ModelErrorState";
import { ExperienceMode, LightingPreset } from "@/lib/3d/types";
import { ShieldCheck, ExternalLink, X, Landmark, Compass, Award } from "lucide-react";

interface MonumentExperienceProps {
  monumentSlug: string;
  initialMode?: ExperienceMode;
  onClose?: () => void;
  className?: string;
  onSwitchToPhotoDossier?: () => void;
}

export function MonumentExperience({
  monumentSlug,
  initialMode = "explorer",
  onClose,
  className = "",
  onSwitchToPhotoDossier,
}: MonumentExperienceProps) {
  const entry = MONUMENT_3D_MANIFEST[monumentSlug] || MONUMENT_3D_MANIFEST["shaniwar-wada"];

  const [mode, setMode] = useState<ExperienceMode>(
    entry.readiness === "available" ? initialMode : "explorer"
  );
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>("studio");
  const [isWireframe, setIsWireframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAttributionModal, setShowAttributionModal] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<"front" | "top" | "fountain" | null>(null);

  // Historical variants state
  const [activeHistoricalVariantId, setActiveHistoricalVariantId] = useState(
    entry.historicalVariants?.[0]?.id || "surviving-present"
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  // When a model is in production or unavailable, show the honest ModelErrorState
  if (entry.readiness !== "available") {
    return (
      <ModelErrorState
        entry={entry}
        onSwitchToPhoto={() => {
          if (onSwitchToPhotoDossier) {
            onSwitchToPhotoDossier();
          } else {
            window.location.href = `/tour/${monumentSlug}`;
          }
        }}
      />
    );
  }

  // Active Model URL depending on Mode
  const currentModelUrl =
    mode === "historical"
      ? entry.historicalVariants?.find((v) => v.id === activeHistoricalVariantId)?.modelUrl ||
        entry.exteriorModelUrl!
      : entry.exteriorModelUrl!;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden bg-[#141211] border border-[#3D3835] shadow-2xl ${
        isFullscreen
          ? "fixed inset-0 z-[9999] rounded-none h-screen w-screen"
          : "aspect-[16/9] min-h-[540px]"
      } ${className}`}
    >
      {/* ── TOP CONTROL STRIP ────────────────────────────────────────── */}
      <ModelControls
        currentMode={mode}
        onModeChange={(m) => setMode(m)}
        hasWalkthrough={entry.hasWalkthrough}
        hasHistorical={entry.hasHistoricalReconstruction}
        lightingPreset={lightingPreset}
        onLightingChange={setLightingPreset}
        isWireframe={isWireframe}
        onToggleWireframe={() => setIsWireframe(!isWireframe)}
        onResetView={() => setCameraPreset("front")}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenAttribution={() => setShowAttributionModal(true)}
        onCameraPreset={(preset) => {
          setCameraPreset(preset);
          setTimeout(() => setCameraPreset(null), 100);
        }}
      />

      {/* ── EXPERIENCE A & HISTORICAL: SHARED 3D MODEL VIEWER ────────── */}
      {mode !== "walkthrough" && (
        <MonumentModelViewer
          entry={entry}
          modelUrl={currentModelUrl}
          lightingPreset={lightingPreset}
          isWireframe={isWireframe}
          cameraPresetTarget={cameraPreset}
        />
      )}

      {/* ── EXPERIENCE B: FIRST-PERSON WALKTHROUGH ───────────────────── */}
      {mode === "walkthrough" && entry.walkthroughAreas && (
        <MonumentWalkthrough
          areas={entry.walkthroughAreas}
          lightingPreset={lightingPreset}
          monumentName={entry.name}
        />
      )}

      {/* ── PHASE 6: HISTORICAL RECONSTRUCTION COMPARISON LAYER ──────── */}
      {mode === "historical" && entry.historicalVariants && (
        <HistoricalLayerToggle
          variants={entry.historicalVariants}
          activeVariantId={activeHistoricalVariantId}
          onSelectVariant={setActiveHistoricalVariantId}
        />
      )}

      {/* ── BOTTOM SCIENTIFIC INTEGRITY PILL ─────────────────────────── */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2">
        <div className="bg-[#181615]/85 backdrop-blur-md border border-[#3D3835] px-3.5 py-1.5 rounded-xl text-[11px] text-[#A69E96] flex items-center gap-2 shadow-xl">
          <Award className="w-3.5 h-3.5 text-[#B18A55]" />
          <span>
            {entry.metadata.sourceType} • {entry.metadata.confidenceLevel}% Confidence
          </span>
        </div>
      </div>

      {/* ── PROVENANCE & METHODOLOGY MODAL ───────────────────────────── */}
      {showAttributionModal && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#181615] border border-[#B18A55]/40 rounded-3xl p-6 max-w-lg w-full text-[#FAF4E5] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D3835] mb-4">
              <div className="flex items-center gap-2 text-[#B18A55]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-serif-editorial text-lg font-bold">
                  3D Architectural Provenance & Methodology
                </h3>
              </div>
              <button
                onClick={() => setShowAttributionModal(false)}
                className="text-[#A69E96] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed max-h-[65vh] overflow-y-auto pr-1">
              <div className="bg-[#282522] p-3.5 rounded-2xl border border-[#3D3835] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#A69E96]">Monument:</span>
                  <span className="font-bold text-[#FAF4E5]">{entry.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69E96]">Reconstruction Method:</span>
                  <span className="font-semibold text-[#B18A55]">
                    {entry.metadata.reconstructionMethod.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69E96]">Scientific Confidence:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {entry.metadata.confidenceLevel}% Archival Grounding
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69E96]">License:</span>
                  <span className="text-[#FAF4E5]">{entry.metadata.license}</span>
                </div>
              </div>

              <div>
                <strong className="text-[#B18A55] uppercase text-[10px] tracking-wider block mb-1">
                  Primary Source Citations:
                </strong>
                <ul className="space-y-1">
                  {entry.metadata.sourceReferences.map((ref, i) => (
                    <li key={i} className="text-[#A69E96] flex items-start gap-1.5">
                      <span className="text-[#B18A55]">•</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-[#FAF4E5] uppercase text-[10px] tracking-wider block mb-1">
                  Archaeological Integrity & Known Limitations:
                </strong>
                <ul className="space-y-1">
                  {entry.metadata.knownLimitations.map((lim, i) => (
                    <li key={i} className="text-[#A69E96] flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-[#282522]/60 border border-[#3D3835] text-[11px] text-[#A69E96]">
                <strong className="text-[#FAF4E5]">Museological Declaration:</strong> This digital model represents an academic architectural reconstruction. Surviving masonry elements are differentiated from historically inferred structures. No AI-hallucinated geometry is presented as factual history.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
