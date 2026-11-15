"use client";

import { Info, X, ShieldAlert, CheckCircle2, Landmark } from "lucide-react";
import { ArchitecturalHotspot3D } from "@/lib/3d/types";

interface ArchitecturalHotspotsProps {
  hotspots: ArchitecturalHotspot3D[];
  projectedPositions: Record<string, { x: number; y: number; visible: boolean }>;
  activeHotspot: ArchitecturalHotspot3D | null;
  onSelectHotspot: (hotspot: ArchitecturalHotspot3D) => void;
  onCloseHotspot: () => void;
}

export function ArchitecturalHotspots({
  hotspots,
  projectedPositions,
  activeHotspot,
  onSelectHotspot,
  onCloseHotspot,
}: ArchitecturalHotspotsProps) {
  return (
    <>
      {/* ── 3D Projected Screen Hotspot Pins ─────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {hotspots.map((h) => {
          const pos = projectedPositions[h.id];
          if (!pos || !pos.visible) return null;

          const isSelected = activeHotspot?.id === h.id;

          return (
            <div
              key={h.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onSelectHotspot(h)}
            >
              <button
                className={`relative flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-125 shadow-2xl ${
                  isSelected
                    ? "w-9 h-9 bg-[#B18A55] text-[#181615] border-2 border-white ring-4 ring-[#B18A55]/50 scale-125"
                    : "w-7 h-7 bg-[#181615]/90 text-[#B18A55] border-2 border-[#B18A55] ring-2 ring-black/40 hover:bg-[#B18A55] hover:text-[#181615]"
                }`}
                title={h.name}
                aria-label={`Hotspot: ${h.name}`}
              >
                <Info className="w-3.5 h-3.5 font-bold" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </button>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-[#181615]/95 backdrop-blur-md text-[#FAF4E5] text-xs px-3 py-1.5 rounded-xl border border-[#B18A55]/40 shadow-2xl z-30 pointer-events-none">
                <div className="font-semibold text-[#B18A55]">{h.name}</div>
                <div className="text-[10px] text-[#A69E96]">Click to inspect architectural detail</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Active Hotspot Architectural Information Drawer ────────── */}
      {activeHotspot && (
        <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 bg-[#181615]/95 backdrop-blur-md border border-[#3D3835] rounded-3xl p-5 shadow-2xl z-40 text-[#FAF4E5] pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-3 mb-3 border-b border-[#3D3835] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#282522] text-[#B18A55] border border-[#3D3835]">
                  {activeHotspot.category}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                  activeHotspot.evidenceLevel === "verified_surviving"
                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                    : activeHotspot.evidenceLevel === "archaeological_ruin"
                    ? "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                    : "bg-blue-950/60 text-blue-400 border border-blue-800/40"
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {activeHotspot.evidenceLevel.replace("_", " ")}
                </span>
              </div>
              <h3 className="font-serif-editorial text-xl font-bold mt-1 text-[#FAF4E5]">
                {activeHotspot.title}
              </h3>
            </div>
            <button
              onClick={onCloseHotspot}
              className="p-1.5 rounded-full hover:bg-[#282522] text-[#A69E96] hover:text-[#FAF4E5] transition-colors"
              aria-label="Close hotspot details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#E4DDD0] leading-relaxed mb-4">
            {activeHotspot.description}
          </p>

          {activeHotspot.architecturalDetails && activeHotspot.architecturalDetails.length > 0 && (
            <div className="space-y-2 bg-[#282522]/80 border border-[#3D3835] rounded-2xl p-3.5 mb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#B18A55] font-bold block">
                Architectural & Engineering Specifications
              </span>
              <ul className="space-y-1.5">
                {activeHotspot.architecturalDetails.map((detail, idx) => (
                  <li key={idx} className="text-[11px] text-[#A69E96] flex items-start gap-2">
                    <span className="text-[#B18A55] font-bold">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeHotspot.historicalDate && (
            <div className="text-[10px] text-[#A69E96] flex items-center justify-between pt-2 border-t border-[#3D3835]">
              <span>Historical Period:</span>
              <span className="text-[#FAF4E5] font-medium">{activeHotspot.historicalDate}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
