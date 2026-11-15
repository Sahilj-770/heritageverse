"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Monument, TourScene } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { VirtualTourViewer } from "@/components/tour/VirtualTourViewer";
import { 
  ArrowLeft, 
  Compass, 
  Layers, 
  Info, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  ChevronRight,
  Navigation
} from "lucide-react";
import { HeritageCompanion } from "@/components/companion/HeritageCompanion";

export default function VirtualTourPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [monument, setMonument] = useState<Monument | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string>("");

  useEffect(() => {
    if (slug) {
      const data = HeritageStore.getMonumentBySlug(slug);
      if (data) {
        setMonument(data);
        HeritageStore.recordTourCompletion(data.id);
        if (data.tourScenes && data.tourScenes.length > 0) {
          setActiveSceneId(data.tourScenes[0].id);
        }
      }
    }
  }, [slug]);

  if (!monument) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif-editorial text-2xl font-bold mb-2">Preparing 360° Spherical Environment...</h2>
        <p className="text-sm text-[#68615A]">Calibrating camera orientations and spatial waypoints.</p>
      </div>
    );
  }

  const activeScene =
    monument.tourScenes?.find((s) => s.id === activeSceneId) ||
    monument.tourScenes?.[0];

  return (
    <div className="bg-[#181615] text-[#FAF4E5] min-h-screen pb-16">
      
      {/* Top Breadcrumb & Return Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-[#3D3835]">
        <Link
          href={`/heritage/${monument.slug}`}
          className="text-xs text-[#EADFCF] hover:text-white flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Tour & Return to {monument.name} Dossier</span>
        </Link>

        <div className="flex items-center gap-3 text-xs text-[#938A82]">
          <Link
            href="/plan-trip"
            className="px-2.5 py-1 rounded-lg bg-[#262220] hover:bg-[#3D3835] border border-[#3D3835] text-[#FAF4E5] font-medium flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3 h-3 text-[#C5A059]" />
            <span>Plan Trip</span>
          </Link>
          <span className="hidden sm:inline font-medium text-[#EADFCF]">{monument.location}, {monument.state}</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#262220] border border-[#3D3835] text-[#C5A059] font-medium text-[11px]">
            {activeScene?.sceneType === "equirectangular_360"
              ? "Three.js / WebGL 360° Spherical Survey"
              : "Verified Archival Photography • High-Res Inspection"}
          </span>
        </div>
      </div>

      {/* Main Tour Viewer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {monument.tourScenes && monument.tourScenes.length > 0 ? (
          <VirtualTourViewer
            scenes={monument.tourScenes}
            monumentName={monument.name}
            onSceneChange={(id) => setActiveSceneId(id)}
          />
        ) : (
          <div className="bg-[#262220] border border-[#3D3835] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
            <Compass className="w-12 h-12 text-[#C5A059] mx-auto animate-pulse" />
            <h3 className="font-serif-editorial text-2xl font-bold">Panorama In Development</h3>
            <p className="text-sm text-[#938A82]">
              A certified 360° LiDAR equirectangular survey has been scheduled for {monument.name}. Browse the architectural photo archive while field capture concludes.
            </p>
            <Link
              href={`/heritage/${monument.slug}`}
              className="inline-block px-5 py-2.5 rounded-xl bg-[#C5A059] text-[#181615] text-xs font-bold"
            >
              Browse Photo Archive
            </Link>
          </div>
        )}

        {/* Historical Context for Active Scene */}
        {activeScene && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 bg-[#262220] border border-[#3D3835] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A059] font-semibold">
                <BookOpen className="w-4 h-4" />
                Active Chamber Chronology
              </div>

              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#FAF4E5]">
                {activeScene.name}
              </h2>

              <p className="text-sm text-[#EADFCF] leading-relaxed">
                {activeScene.historicalNotes}
              </p>

              <div className="pt-4 border-t border-[#3D3835]">
                <h4 className="text-xs uppercase tracking-wider text-[#938A82] font-semibold mb-3">
                  Curated Hotspots in this Scene ({activeScene.hotspots?.length || 0})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeScene.hotspots?.map((hs) => (
                    <div
                      key={hs.id}
                      className="p-3 rounded-xl bg-[#181615] border border-[#3D3835] text-xs space-y-1"
                    >
                      <div className="font-semibold text-[#C5A059] flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        {hs.title}
                      </div>
                      <p className="text-[11px] text-[#938A82] line-clamp-2">
                        {hs.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* In-Tour Contextual Heritage Companion */}
              <div className="pt-4 border-t border-[#3D3835]">
                <HeritageCompanion monument={monument} activeScene={activeScene} />
              </div>
            </div>

            {/* Tour Scenes Navigator Sidebar */}
            <div className="lg:col-span-4 bg-[#262220] border border-[#3D3835] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A059] font-semibold">
                <Layers className="w-4 h-4" />
                Available Waypoints
              </div>

              <div className="space-y-2">
                {monument.tourScenes?.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setActiveSceneId(scene.id)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      scene.id === activeScene.id
                        ? "bg-[#181615] border-[#C5A059] text-white"
                        : "bg-[#181615]/50 border-[#3D3835] text-[#938A82] hover:text-[#FAF4E5] hover:border-[#68615A]"
                    }`}
                  >
                    <div>
                      <div className="font-serif-editorial text-sm font-semibold">{scene.name}</div>
                      <div className="text-[10px] text-[#938A82]">
                        {scene.hotspots.length} interactive points
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                ))}
              </div>

              {/* Practicality / Educational Disclosure */}
              <div className="p-3 rounded-xl bg-[#181615] border border-[#3D3835] text-[11px] text-[#938A82] leading-relaxed">
                <strong className="text-[#FAF4E5] block mb-1">Methodology Note:</strong>
                Equirectangular virtual panoramas are calibrated for desktop and mobile touch. Hotspot spatial angles (yaw/pitch) replicate actual physical orientations within the monument grounds.
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
