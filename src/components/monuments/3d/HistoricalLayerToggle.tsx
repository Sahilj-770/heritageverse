"use client";

import { History, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { HistoricalVariant } from "@/lib/3d/types";

interface HistoricalLayerToggleProps {
  variants: HistoricalVariant[];
  activeVariantId: string;
  onSelectVariant: (variantId: string) => void;
}

export function HistoricalLayerToggle({
  variants,
  activeVariantId,
  onSelectVariant,
}: HistoricalLayerToggleProps) {
  const activeVariant = variants.find((v) => v.id === activeVariantId) || variants[0];

  return (
    <div className="absolute bottom-6 left-6 z-30 pointer-events-auto max-w-sm sm:max-w-md bg-[#181615]/95 backdrop-blur-md border border-[#3D3835] rounded-3xl p-4 text-[#FAF4E5] shadow-2xl space-y-3">
      <div className="flex items-center justify-between border-b border-[#3D3835] pb-2">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#B18A55]" />
          <span className="text-xs uppercase tracking-wider font-bold text-[#B18A55]">
            Chronological State Comparison
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#282522] text-[#A69E96] border border-[#3D3835]">
          {activeVariant?.yearLabel}
        </span>
      </div>

      {/* Variant Selection Switcher */}
      <div className="grid grid-cols-2 gap-2 bg-[#100E0D] p-1 rounded-2xl border border-[#3D3835]">
        {variants.map((v) => {
          const isActive = v.id === activeVariantId;
          return (
            <button
              key={v.id}
              onClick={() => onSelectVariant(v.id)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center ${
                isActive
                  ? "bg-[#B18A55] text-[#181615] shadow-lg"
                  : "text-[#A69E96] hover:text-[#FAF4E5] hover:bg-[#1E1B18]"
              }`}
            >
              {v.name}
            </button>
          );
        })}
      </div>

      {/* Description & Historical Changes */}
      {activeVariant && (
        <div className="space-y-2 text-xs">
          <p className="text-[#E4DDD0] text-[11px] leading-relaxed">
            {activeVariant.description}
          </p>

          <div className="bg-[#282522] rounded-xl p-2.5 border border-[#3D3835] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#FAF4E5] block">
              Architectural Chronology Evidence:
            </span>
            <ul className="space-y-1">
              {activeVariant.historicalChanges.map((change, idx) => (
                <li key={idx} className="text-[11px] text-[#A69E96] flex items-start gap-1.5">
                  <span className="text-[#B18A55]">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
