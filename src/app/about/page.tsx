import Link from "next/link";
import { Landmark, Globe2, ShieldCheck, BookOpen, ExternalLink, HeartHandshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* 1. HERO TITLE */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F1E8] border border-[#B18A55]/40 text-xs font-semibold text-[#713C3C] uppercase tracking-wider">
          <Globe2 className="w-3.5 h-3.5" />
          Academic SDG 11 Capstone Initiative
        </div>
        <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-[#282522] tracking-tight">
          About HeritageVerse
        </h1>
        <p className="text-base sm:text-lg text-[#6B635D] leading-relaxed">
          A practical, community-centered digital heritage architecture built to safeguard cultural monuments through interactive technology, authentic archival records, and civic participation across India.
        </p>
      </div>

      {/* 2. SDG 11 & TARGET 11.4 SECTION */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E4DDD0] shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#713C3C] text-white flex items-center justify-center font-bold font-serif-editorial text-xl">
            11
          </div>
          <div>
            <h2 className="font-serif-editorial text-2xl font-bold text-[#282522]">
              UN Sustainable Development Goal 11
            </h2>
            <div className="text-xs uppercase tracking-wider text-[#713C3C] font-semibold">
              Sustainable Cities and Communities
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F5F1E8] border border-[#B18A55]/30 text-sm text-[#282522]/90 space-y-2">
          <strong className="text-[#282522] block font-serif-editorial text-base">
            Target 11.4 Focus:
          </strong>
          <blockquote className="italic border-l-2 border-[#B18A55] pl-3 text-[#6B635D]">
            &quot;Strengthen efforts to protect and safeguard the world’s cultural and natural heritage.&quot;
          </blockquote>
        </div>

        <div className="prose prose-neutral max-w-none text-sm text-[#6B635D] leading-relaxed space-y-4">
          <p>
            Rapid urbanization across historical hubs like Delhi, Agra, Madurai, Jaipur, Kolkata, and Pune places tremendous stress on centuries-old monuments. Unchecked vehicular vibration, atmospheric pollution, invasive vegetation, and unregulated tourism accelerate the decay of stone facades, lime plaster, and timber roofs.
          </p>
          <p>
            HeritageVerse answers this challenge not through unaffordable, speculative promises, but by delivering a practical, open-access digital twin system. By pairing 360-degree virtual surveys with a crowd-sourced conservation concern reporting pipeline, we empower citizens, students, and conservation enthusiasts to become active stewards of their urban historical fabric.
          </p>
        </div>
      </section>

      {/* 3. ETHICAL CHARTER & NON-FABRICATION COMMITMENT */}
      <section className="bg-[#282522] text-[#F5F1E8] rounded-3xl p-8 sm:p-12 border border-[#E4DDD0]/20 space-y-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B18A55] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          Academic Integrity & Credibility Charter
        </div>

        <h2 className="font-serif-editorial text-3xl font-bold text-white">
          Our Preservation Philosophy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-[#1f1d1b] border border-[#E4DDD0]/15 space-y-2">
            <h3 className="font-serif-editorial text-lg font-bold text-[#F5F1E8]">
              No Fabricated Facts
            </h3>
            <p className="text-xs text-[#E4DDD0]/70 leading-relaxed">
              Every date, architectural style, and historical patron is sourced directly from Archaeological Survey of India (ASI) records, state gazetteers, or peer-reviewed literature.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1f1d1b] border border-[#E4DDD0]/15 space-y-2">
            <h3 className="font-serif-editorial text-lg font-bold text-[#F5F1E8]">
              Genuine 360° Imagery
            </h3>
            <p className="text-xs text-[#E4DDD0]/70 leading-relaxed">
              Virtual tours employ true equirectangular spherical mappings with drag-to-look camera controls rather than misleading static panoramas or AI-hallucinated imagery.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#1f1d1b] border border-[#E4DDD0]/15 space-y-2">
            <h3 className="font-serif-editorial text-lg font-bold text-[#F5F1E8]">
              Curator-in-the-Loop
            </h3>
            <p className="text-xs text-[#E4DDD0]/70 leading-relaxed">
              Community folklore and conservation reports are held in a transparent moderation queue. Only verified facts are graduated into the primary heritage registry.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SOURCES, ARCHIVES & ATTRIBUTION */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E4DDD0] shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#713C3C] font-semibold">
          <BookOpen className="w-4 h-4" />
          Attributions & Primary Datasets
        </div>

        <h2 className="font-serif-editorial text-2xl font-bold text-[#282522]">
          Scholarly References & Open Assets
        </h2>

        <ul className="divide-y divide-[#E4DDD0] text-xs text-[#6B635D]">
          <li className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>
              <strong className="text-[#282522]">Archaeological Survey of India (ASI)</strong> — National Protected Monuments Circles
            </span>
            <span className="text-[#6B635D]/70">Government of India Official Register</span>
          </li>
          <li className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>
              <strong className="text-[#282522]">Gazetteer of India & State Archives</strong> — National Heritage Documentation
            </span>
            <span className="text-[#6B635D]/70">Historical Texts & Demographics Archive</span>
          </li>
          <li className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>
              <strong className="text-[#282522]">OpenStreetMap Foundation</strong> — Geographic Coordinates & Road Basemaps
            </span>
            <span className="text-[#6B635D]/70">ODbL License</span>
          </li>
          <li className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>
              <strong className="text-[#282522]">Wikimedia Commons & Open Heritage Collections</strong> — Architectural Photography
            </span>
            <span className="text-[#6B635D]/70">CC-BY-SA 4.0 / Public Domain</span>
          </li>
        </ul>
      </section>

    </div>
  );
}
