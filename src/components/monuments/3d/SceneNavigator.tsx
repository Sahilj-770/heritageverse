"use client";

import { MapPin, ChevronRight, Navigation } from "lucide-react";
import { WalkthroughArea } from "@/lib/3d/types";

interface SceneNavigatorProps {
  areas: WalkthroughArea[];
  currentAreaId: string;
  onSelectArea: (areaId: string) => void;
}

export function SceneNavigator({
  areas,
  currentAreaId,
  onSelectArea,
}: SceneNavigatorProps) {
  return (
    <div className="absolute bottom-6 left-6 z-30 pointer-events-auto bg-[#181615]/95 backdrop-blur-md border border-[#3D3835] rounded-3xl p-3 shadow-2xl flex items-center gap-2">
      <div className="flex items-center gap-2 pl-2 pr-1 border-r border-[#3D3835]">
        <Navigation className="w-4 h-4 text-[#B18A55]" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#FAF4E5] hidden sm:inline">
          Connected Chambers
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md py-0.5">
        {areas.map((area) => {
          const isActive = area.id === currentAreaId;
          return (
            <button
              key={area.id}
              onClick={() => onSelectArea(area.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#713C3C] text-white shadow-md"
                  : "bg-[#282522] text-[#A69E96] hover:text-[#FAF4E5] hover:bg-[#3D3835]"
              }`}
            >
              {area.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
