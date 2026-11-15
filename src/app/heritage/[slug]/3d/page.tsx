import { notFound } from "next/navigation";
import Link from "next/link";
import { SAMPLE_MONUMENTS } from "@/data/sampleData";
import { MonumentExperienceWrapper } from "@/components/monuments/3d/MonumentExperienceWrapper";
import { ChevronLeft, Compass, Info, ShieldCheck, Navigation } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SAMPLE_MONUMENTS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const monument = SAMPLE_MONUMENTS.find((m) => m.slug === slug);
  if (!monument) return { title: "3D Monument Explorer | HeritageVerse" };

  return {
    title: `${monument.name} — 3D Digital Heritage Museum | HeritageVerse`,
    description: `Explore ${monument.name} in interactive 3D: exterior architectural model, first-person walkthrough, and historical reconstruction.`,
  };
}

export default async function Monument3DPage({ params }: Props) {
  const { slug } = await params;
  const monument = SAMPLE_MONUMENTS.find((m) => m.slug === slug);

  if (!monument) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#100E0D] text-[#FAF4E5] flex flex-col">
      {/* ── Editorial Top Navigation Bar ─────────────────────────────── */}
      <header className="h-16 px-6 border-b border-[#3D3835] bg-[#181615] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/heritage/${monument.slug}`}
            className="p-2 rounded-xl bg-[#282522] hover:bg-[#3D3835] text-[#A69E96] hover:text-[#FAF4E5] transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dossier</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B18A55]">
                3D Digital Heritage Museum
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#282522] text-[#A69E96] border border-[#3D3835]">
                {monument.period}
              </span>
            </div>
            <h1 className="font-serif-editorial text-lg font-bold text-[#FAF4E5] leading-tight">
              {monument.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/tour/${monument.slug}`}
            className="px-3.5 py-1.5 rounded-xl bg-[#282522] hover:bg-[#3D3835] border border-[#3D3835] text-xs text-[#E4DDD0] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#B18A55]" />
            <span className="hidden sm:inline">Visual Survey Tour</span>
          </Link>

          <Link
            href="/plan-trip"
            className="px-3.5 py-1.5 rounded-xl bg-[#B18A55] text-[#181615] hover:bg-[#C7A574] text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plan Trip</span>
          </Link>
        </div>
      </header>

      {/* ── Main Full-Screen 3D Interactive Museum Container ─────────── */}
      <main className="flex-1 relative w-full h-[calc(100vh-64px)] overflow-hidden">
        <MonumentExperienceWrapper
          monumentSlug={monument.slug}
          className="h-full w-full rounded-none border-none"
        />
      </main>
    </div>
  );
}
