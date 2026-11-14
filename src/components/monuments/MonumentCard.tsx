"use client";

import Link from "next/link";
import { Monument } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { useState, useEffect } from "react";
import { MapPin, Compass, Bookmark, Clock, Navigation } from "lucide-react";

interface MonumentCardProps {
  monument: Monument;
}

export function MonumentCard({ monument }: MonumentCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(HeritageStore.isMonumentSaved(monument.id));
  }, [monument.id]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedStatus = HeritageStore.toggleSavedMonument(monument.id);
    setIsSaved(updatedStatus);
    window.dispatchEvent(new Event("heritageverse_role_changed"));
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-[#E4DDD0] hover:border-[#B18A55] transition-all duration-300 hover:shadow-lg flex flex-col justify-between">
      {/* Visual Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#282522]">
        <img
          src={monument.coverImage}
          alt={monument.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#282522]/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#282522]/80 text-[#B18A55] backdrop-blur-xs">
            {monument.category}
          </span>
          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-full transition-colors ${
              isSaved
                ? "bg-[#B18A55] text-[#282522]"
                : "bg-[#282522]/70 text-white hover:text-[#B18A55]"
            }`}
            title={isSaved ? "Remove from saved sites" : "Bookmark monument"}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-[11px] text-[#E4DDD0] mb-0.5 truncate">
            <MapPin className="w-3 h-3 text-[#B18A55] shrink-0" />
            <span className="truncate">{monument.location}, {monument.state}</span>
          </div>
          <h3 className="font-serif-editorial text-lg font-bold leading-tight text-white">
            {monument.name}
          </h3>
          {monument.vernacularName && (
            <div className="text-[11px] text-[#B18A55] font-medium">
              {monument.vernacularName}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[11px] text-[#713C3C] font-semibold mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{monument.period}</span>
          </div>
          <p className="text-xs text-[#6B635D] line-clamp-3 leading-relaxed">
            {monument.shortDescription}
          </p>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-[#E4DDD0] flex items-center justify-between gap-2">
          <Link
            href={`/heritage/${monument.slug}`}
            className="text-xs font-bold uppercase tracking-wider text-[#282522] hover:text-[#713C3C] transition-colors"
          >
            Dossier →
          </Link>

          <div className="flex items-center gap-1.5">
            <Link
              href="/plan-trip"
              className="p-1.5 rounded-lg border border-[#E4DDD0] text-[#6B635D] hover:text-[#713C3C] hover:bg-[#FAF8F5] transition-colors"
              title="Plan trip to this monument"
            >
              <Navigation className="w-3.5 h-3.5" />
            </Link>

            {monument.tourScenes && monument.tourScenes.length > 0 && (
              <Link
                href={`/tour/${monument.slug}`}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#282522] text-[#F5F1E8] hover:bg-[#713C3C] transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3 h-3 text-[#B18A55]" />
                <span>360°</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
