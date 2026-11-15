"use client";

import { Monument } from "@/types/heritage";
import { MonumentExperienceWrapper } from "./3d/MonumentExperienceWrapper";
import { X, ExternalLink } from "lucide-react";
import Link from "next/link";

interface MonumentModelViewerProps {
  monument: Monument;
  onClose?: () => void;
}

export function MonumentModelViewer({ monument, onClose }: MonumentModelViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#141211] rounded-3xl border border-[#3D3835] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3D3835] bg-[#181615]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B18A55]">
                3D Digital Heritage Museum
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#282522] text-[#A69E96] border border-[#3D3835]">
                {monument.category}
              </span>
            </div>
            <h2 className="font-serif-editorial text-xl font-bold text-[#FAF4E5] mt-0.5">
              {monument.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/heritage/${monument.slug}/3d`}
              className="text-xs text-[#B18A55] hover:text-[#C7A574] flex items-center gap-1 font-semibold"
            >
              <span>Full Museum View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#282522] hover:bg-[#3D3835] text-[#A69E96] hover:text-white transition-colors"
                title="Close Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 3D Museum Experience Component */}
        <div className="w-full aspect-[16/9] min-h-[500px]">
          <MonumentExperienceWrapper monumentSlug={monument.slug} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
