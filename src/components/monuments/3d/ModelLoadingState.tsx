"use client";

import { Loader2, Landmark } from "lucide-react";

interface ModelLoadingStateProps {
  progress?: number;
  monumentName: string;
}

export function ModelLoadingState({ progress, monumentName }: ModelLoadingStateProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#151312]/90 backdrop-blur-sm p-6 text-center text-[#FAF4E5]">
      <div className="w-16 h-16 rounded-full bg-[#1E1B18] border border-[#B18A55]/40 flex items-center justify-center mb-4 shadow-2xl relative">
        <Landmark className="w-7 h-7 text-[#B18A55]" />
        <Loader2 className="w-16 h-16 text-[#B18A55] animate-spin absolute inset-0 opacity-80" />
      </div>

      <h3 className="font-serif-editorial text-2xl font-bold mb-1 text-[#FAF4E5]">
        Initializing 3D Architectural Museum
      </h3>
      <p className="text-xs text-[#A69E96] max-w-sm mb-4">
        Synthesizing Archaeological Survey of India measured CAD drawings, stone masonry shaders, and historical PBR textures for {monumentName}.
      </p>

      {progress !== undefined && progress > 0 && (
        <div className="w-56 bg-[#282522] h-1.5 rounded-full overflow-hidden border border-[#3D3835]">
          <div
            className="h-full bg-[#B18A55] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
