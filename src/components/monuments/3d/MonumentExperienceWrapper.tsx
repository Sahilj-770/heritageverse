"use client";

import dynamic from "next/dynamic";
import { ExperienceMode } from "@/lib/3d/types";

const DynamicMonumentExperience = dynamic(
  () =>
    import("./MonumentExperience").then((m) => m.MonumentExperience),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 w-full h-full min-h-[480px] flex items-center justify-center bg-[#100E0D] text-[#FAF4E5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#B18A55] border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#B18A55] font-semibold">
            Loading 3D Digital Museum...
          </p>
        </div>
      </div>
    ),
  }
);

interface MonumentExperienceWrapperProps {
  monumentSlug: string;
  initialMode?: ExperienceMode;
  className?: string;
  onClose?: () => void;
  onSwitchToPhotoDossier?: () => void;
}

export function MonumentExperienceWrapper(props: MonumentExperienceWrapperProps) {
  return <DynamicMonumentExperience {...props} />;
}
