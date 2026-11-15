"use client";

import { Camera, ShieldAlert, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Monument3DManifestEntry } from "@/lib/3d/types";

interface ModelErrorStateProps {
  entry: Monument3DManifestEntry;
  onSwitchToPhoto: () => void;
}

export function ModelErrorState({ entry, onSwitchToPhoto }: ModelErrorStateProps) {
  return (
    <div className="relative w-full aspect-[16/9] min-h-[500px] rounded-3xl overflow-hidden bg-[#151312] border border-[#3D3835] flex items-center justify-center p-6 text-[#FAF4E5] shadow-2xl">
      {/* Background Dimmed Photographic Plate */}
      {entry.fallbackPhotoUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-xs"
          style={{ backgroundImage: `url(${entry.fallbackPhotoUrl})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#151312] via-[#151312]/80 to-[#151312]/60" />

      <div className="relative z-10 max-w-lg text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#1E1B18] border border-[#B18A55]/40 flex items-center justify-center mx-auto text-[#B18A55] shadow-xl">
          <Camera className="w-6 h-6" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#282522] text-[#B18A55] border border-[#3D3835] mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>3D Asset Status: {entry.readiness.replace("_", " ")}</span>
          </div>
          <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#FAF4E5]">
            Architectural Survey in Production
          </h3>
          <p className="text-xs text-[#A69E96] mt-2 leading-relaxed">
            {entry.readinessNotice}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1E1B18]/90 border border-[#3D3835] text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[#A69E96]">Scientific Protocol:</span>
            <span className="text-[#FAF4E5] font-semibold">ASI & UNESCO Cadastral Survey</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A69E96]">Authenticity Integrity:</span>
            <span className="text-emerald-400 font-semibold">Zero AI-generated Fictional Geometry</span>
          </div>
          <p className="text-[11px] text-[#A69E96] pt-1 border-t border-[#3D3835] leading-relaxed">
            In adherence to strict museological standards, HeritageVerse displays genuine architectural photogrammetry and measured CAD models only when rigorously verified against state archives.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onSwitchToPhoto}
            className="px-5 py-2.5 rounded-xl bg-[#B18A55] text-[#181615] text-xs font-bold uppercase tracking-wider hover:bg-[#C7A574] transition-colors shadow-xl flex items-center gap-2"
          >
            <span>Explore High-Resolution Photographic Dossier</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
