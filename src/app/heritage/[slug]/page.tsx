"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Monument } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Compass, 
  ShieldCheck, 
  Bookmark, 
  Share2, 
  ChevronRight, 
  BookOpen, 
  Landmark, 
  ExternalLink,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";

export default function MonumentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [monument, setMonument] = useState<Monument | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      const data = HeritageStore.getMonumentBySlug(slug);
      if (data) {
        setMonument(data);
        setIsSaved(HeritageStore.isMonumentSaved(data.id));
      }
    }
  }, [slug]);

  if (!monument) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif-editorial text-2xl font-bold mb-4">Loading Monument Dossier...</h2>
        <p className="text-sm text-[#68615A]">Searching regional archival databases.</p>
      </div>
    );
  }

  const handleToggleSave = () => {
    const updated = HeritageStore.toggleSavedMonument(monument.id);
    setIsSaved(updated);
    window.dispatchEvent(new Event("heritageverse_role_changed"));
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="pb-24">
      
      {/* 1. HERO COVER HEADER */}
      <div className="relative min-h-[50vh] bg-[#282522] flex items-end">
        <img
          src={monument.coverImage}
          alt={monument.name}
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#282522] via-[#282522]/70 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-white">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs text-[#E4DDD0] hover:text-[#B18A55] mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Monument Directory
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-[#B18A55] text-[#282522]">
              {monument.category}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-medium bg-[#282522]/80 text-[#F5F1E8] border border-[#E4DDD0]/20">
              {monument.period}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-medium bg-[#282522]/80 text-[#F5F1E8] border border-[#E4DDD0]/20">
              Built: {monument.yearBuilt}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                {monument.name}
              </h1>
              {monument.vernacularName && (
                <div className="text-xl sm:text-2xl text-[#B18A55] font-medium mt-1">
                  {monument.vernacularName}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[#E4DDD0] mt-3">
                <MapPin className="w-4 h-4 text-[#B18A55]" />
                <span>{monument.location.includes(monument.district) ? `${monument.location}, ${monument.state}` : `${monument.location}, ${monument.district}, ${monument.state}`}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSave}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isSaved
                    ? "bg-[#B18A55] text-[#282522]"
                    : "bg-[#282522]/90 text-white border border-[#E4DDD0]/20 hover:bg-[#3D3835]"
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
                {isSaved ? "Saved in Dossiers" : "Save Site"}
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-[#282522]/90 border border-[#E4DDD0]/20 text-white hover:bg-[#3D3835] transition-colors text-xs font-medium flex items-center gap-1.5"
                title="Copy share link"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? "Link Copied!" : "Share"}</span>
              </button>

              {monument.tourScenes && monument.tourScenes.length > 0 && (
                <Link
                  href={`/tour/${monument.slug}`}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#713C3C] text-white hover:bg-[#8D4A4A] shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Compass className="w-4 h-4" />
                  Launch 360° Tour
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN DOSSIER BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Historical & Architectural Narrative */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Executive Summary */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F5F1E8] border border-[#E4DDD0] space-y-3">
              <h2 className="text-xs uppercase tracking-widest text-[#713C3C] font-semibold">
                Archival Executive Summary
              </h2>
              <p className="text-base sm:text-lg text-[#282522] font-serif-editorial leading-relaxed">
                {monument.shortDescription}
              </p>
            </div>

            {/* Historical Background */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#B18A55]" />
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#282522]">
                  Historical Background & Chronology
                </h2>
              </div>
              <div className="prose prose-neutral max-w-none text-[#282522]/90 leading-relaxed text-sm sm:text-base space-y-4">
                <p>{monument.historicalBackground}</p>
                {monument.builder && (
                  <p className="text-xs text-[#6B635D] italic bg-white p-3 rounded-lg border border-[#E4DDD0]">
                    Patronage / Builder: <strong className="text-[#282522]">{monument.builder}</strong> ({monument.yearBuilt})
                  </p>
                )}
              </div>
            </section>

            {/* Architectural Anatomy */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#B18A55]" />
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#282522]">
                  Architectural Typology & Structural Materiality
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[#282522]/90 leading-relaxed">
                {monument.architecturalStyle}
              </p>
            </section>

            {/* Cultural Significance & Intangible Memory */}
            <section className="space-y-4">
              <h2 className="font-serif-editorial text-2xl font-bold text-[#282522]">
                Cultural Significance
              </h2>
              <p className="text-sm sm:text-base text-[#282522]/90 leading-relaxed">
                {monument.culturalSignificance}
              </p>
            </section>

            {/* SDG 11.4 & Conservation Context */}
            <section className="p-6 rounded-2xl bg-white border border-[#E4DDD0] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#713C3C] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#B18A55]" />
                  SDG Target 11.4 Conservation Matrix
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  monument.conservationStatus === "Good" 
                    ? "bg-green-100 text-green-800" 
                    : monument.conservationStatus === "Requires Monitoring"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  Status: {monument.conservationStatus}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B635D] leading-relaxed">
                {monument.sdgRelevance}
              </p>
              <div className="pt-2">
                <Link
                  href={`/conservation#report`}
                  className="text-xs font-semibold text-[#713C3C] hover:underline flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Notice signs of deterioration or weathering? Submit a community field report
                </Link>
              </div>
            </section>

            {/* Photographic Archive Gallery */}
            {monument.images && monument.images.length > 0 && (
              <section className="space-y-4">
                <h2 className="font-serif-editorial text-2xl font-bold text-[#282522]">
                  Photographic Records & Archival Plates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {monument.images.map((img) => (
                    <figure key={img.id} className="bg-white rounded-xl overflow-hidden border border-[#E4DDD0] p-3 space-y-2">
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full aspect-[4/3] object-cover rounded-lg"
                        loading="lazy"
                      />
                      <figcaption className="text-xs text-[#6B635D]">
                        <div className="font-medium text-[#282522]">{img.caption}</div>
                        <div className="text-[10px] text-[#6B635D]/80 mt-0.5">
                          Attribution: {img.attribution} ({img.license})
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Academic Sources and Attributions */}
            <section className="pt-6 border-t border-[#E4DDD0] space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-[#6B635D] font-semibold">
                Sources & Scholarly References
              </h3>
              <ul className="space-y-2">
                {monument.sources.map((src, index) => (
                  <li key={index} className="text-xs text-[#6B635D] flex items-center justify-between">
                    <span>
                      <strong className="text-[#282522]">{src.title}</strong> — {src.publisher}
                    </span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#713C3C] hover:underline flex items-center gap-1 text-[11px]"
                      >
                        Source Link
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* Right Column: Visitor Logistics & Interactive Map Callout */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Verified Visitor Information Box */}
            <div className="bg-white rounded-2xl p-6 border border-[#E4DDD0] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-editorial text-lg font-bold text-[#282522]">
                  Visitor Information
                </h3>
                {monument.visitorInformation.verified ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                    Pending Verification
                  </span>
                )}
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="block text-[#6B635D] font-medium uppercase tracking-wider mb-1">
                    Opening Hours
                  </span>
                  <p className="font-semibold text-[#282522]">
                    {monument.visitorInformation.timings}
                  </p>
                </div>

                <div>
                  <span className="block text-[#6B635D] font-medium uppercase tracking-wider mb-1">
                    Entry Tariff
                  </span>
                  <p className="font-semibold text-[#282522]">
                    {monument.visitorInformation.entryFee}
                  </p>
                </div>

                <div>
                  <span className="block text-[#6B635D] font-medium uppercase tracking-wider mb-1">
                    Recommended Season
                  </span>
                  <p className="text-[#6B635D] leading-relaxed">
                    {monument.visitorInformation.bestTimeToVisit}
                  </p>
                </div>

                <div>
                  <span className="block text-[#6B635D] font-medium uppercase tracking-wider mb-1">
                    Transit & Access
                  </span>
                  <p className="text-[#6B635D] leading-relaxed">
                    {monument.visitorInformation.nearestTransit}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E4DDD0]">
                <Link
                  href={`/map`}
                  className="w-full py-2.5 rounded-xl bg-[#F5F1E8] hover:bg-[#E4DDD0] text-xs font-semibold text-[#282522] flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#B18A55]" />
                  View on Regional Map
                </Link>
              </div>
            </div>

            {/* Virtual Tour Banner Callout */}
            {monument.tourScenes && monument.tourScenes.length > 0 && (
              <div className="bg-[#282522] text-[#F5F1E8] rounded-2xl p-6 border border-[#E4DDD0]/20 shadow-lg space-y-4">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#B18A55] text-[#282522]">
                  360° Digital Twin
                </span>
                <h3 className="font-serif-editorial text-xl font-bold">
                  Walk Through {monument.name}
                </h3>
                <p className="text-xs text-[#E4DDD0]/80 leading-relaxed">
                  Experience {monument.tourScenes.length} interactive chambers with curated hotspots explaining hidden structural details.
                </p>
                <Link
                  href={`/tour/${monument.slug}`}
                  className="w-full py-3 rounded-xl bg-[#B18A55] hover:bg-[#C7A574] text-[#282522] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  Launch 360° Tour
                </Link>
              </div>
            )}

            {/* Community Story Prompt */}
            <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#E4DDD0] space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-[#713C3C] font-semibold">
                Oral Histories & Lore
              </h4>
              <p className="text-xs text-[#6B635D] leading-relaxed">
                Do you possess archival photos, family diaries, or local folklore about {monument.name}?
              </p>
              <Link
                href="/community#submit"
                className="text-xs font-semibold text-[#282522] hover:text-[#713C3C] flex items-center gap-1"
              >
                Share your contribution
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </div>

    </article>
  );
}
