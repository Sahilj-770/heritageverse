"use client";

import { useState, useEffect } from "react";
import { Monument, ConservationReport } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Camera, 
  HelpCircle,
  Wind,
  Droplets,
  Building2,
  TreeDeciduous,
  Send,
  Eye
} from "lucide-react";

export default function ConservationHubPage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [reports, setReports] = useState<ConservationReport[]>([]);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [monumentId, setMonumentId] = useState("");
  const [category, setCategory] = useState<ConservationReport["category"]>("weathering");
  const [severity, setSeverity] = useState<ConservationReport["severity"]>("medium");
  const [areaLocation, setAreaLocation] = useState("");
  const [description, setDescription] = useState("");
  const [dateObserved, setDateObserved] = useState("2026-11-13");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    const mons = HeritageStore.getMonuments();
    setMonuments(mons);
    if (mons.length > 0) setMonumentId(mons[0].id);
    setReports(HeritageStore.getReports());
    try {
      setDateObserved(new Date().toISOString().split("T")[0]);
    } catch {
      // fallback
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !areaLocation.trim()) return;

    const selectedMon = monuments.find((m) => m.id === monumentId);
    const user = HeritageStore.getUser();

    HeritageStore.addReport({
      userId: user.id,
      userName: user.name,
      monumentId: monumentId,
      monumentName: selectedMon?.name || "Historic Site",
      category,
      severity,
      areaLocation,
      description,
      dateObserved,
      photoUrl: photoUrl || undefined,
    });

    setReports(HeritageStore.getReports());
    setSubmittedSuccess(true);
    setDescription("");
    setAreaLocation("");
    setPhotoUrl("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. HEADER & SDG 11.4 MISSION */}
      <div className="max-w-3xl space-y-3">
        <div className="text-xs uppercase tracking-widest text-[#713C3C] font-semibold flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-[#713C3C]" />
          SDG Target 11.4 Safeguard Protocol
        </div>
        <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#282522] tracking-tight">
          Conservation Hub & Concern Reporting
        </h1>
        <p className="text-[#6B635D] text-base leading-relaxed">
          Cultural heritage sites are delicate architectural records vulnerable to environmental weathering, urbanization pressure, and tourist wear. This hub educates visitors on common deterioration threats and provides a civil channel to report observed physical concerns across India.
        </p>
      </div>

      {/* 2. COMMON THREATS EDUCATION TILES */}
      <section className="space-y-6">
        <div className="border-b border-[#E4DDD0] pb-3">
          <h2 className="font-serif-editorial text-2xl font-bold text-[#282522]">
            Primary Threats to Indian Cultural Heritage
          </h2>
          <p className="text-xs text-[#6B635D] mt-0.5">
            Key physical, atmospheric, and biological decay mechanisms active across India&apos;s rock-cut sanctuaries, medieval fortresses, and sacred temple complexes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-[#E4DDD0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#713C3C]/10 text-[#713C3C] flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#282522]">
              Monsoon Water Percolation
            </h3>
            <p className="text-xs text-[#6B635D] leading-relaxed">
              Excessive torrential rainwater saturates porous sandstone, basalt rock, and historic lime mortar, promoting internal salt crystallization and structural spalling.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E4DDD0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#B18A55]/15 text-[#B18A55] flex items-center justify-center">
              <TreeDeciduous className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#282522]">
              Root Wedging & Bio-Fouling
            </h3>
            <p className="text-xs text-[#6B635D] leading-relaxed">
              Ficus religiosa (peepal) and banyan seeds germinate inside stone masonry joints. As roots thicken, they exert mechanical wedging force capable of dislodging ashlar blocks.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E4DDD0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#282522]/10 text-[#282522] flex items-center justify-center">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#282522]">
              Urban Atmospheric Pollution
            </h3>
            <p className="text-xs text-[#6B635D] leading-relaxed">
              Sulfur dioxide, ozone, and suspended particulate matter from urban transport react with surface humidity to deposit greasy gypsum crusts and yellow pristine white marble.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E4DDD0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#713C3C]/10 text-[#713C3C] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-[#282522]">
              Vandalism & Footfall Friction
            </h3>
            <p className="text-xs text-[#6B635D] leading-relaxed">
              Incised graffiti, surface abrasion on delicate bas-reliefs, and uncollected plastic litter degrade the historic sanctity and archaeological integrity of heritage precincts.
            </p>
          </div>

        </div>
      </section>

      {/* 3. REPORTING FORM & RECENT INCIDENTS GRID */}
      <div id="report" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#E4DDD0] shadow-sm space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#713C3C] font-semibold flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-4 h-4" />
              Community Field Observation Form
            </div>
            <h2 className="font-serif-editorial text-3xl font-bold text-[#282522]">
              Report a Heritage Site Concern
            </h2>
            <p className="text-xs text-[#6B635D] mt-1 leading-relaxed">
              Notice fresh structural cracking, invasive saplings, or vandalism during your visit? Submit an objective observation for review by platform curators and heritage volunteers.
            </p>
          </div>

          {/* Academic / Non-government Disclaimer Notice */}
          <div className="p-4 rounded-xl bg-[#F5F1E8] border border-[#B18A55]/40 text-xs text-[#6B635D] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#282522]">
              <Info className="w-4 h-4 text-[#B18A55]" />
              Civic Documentation Notice
            </div>
            <p>
              Submissions are community observations to aid public conservation awareness. HeritageVerse reports are <strong>not official government inspections</strong> or state damage certificates.
            </p>
          </div>

          {submittedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Thank you! Your conservation report has been logged and queued for curator triage.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                  Affected Monument *
                </label>
                <select
                  value={monumentId}
                  onChange={(e) => setMonumentId(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
                  required
                >
                  {monuments.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                  Concern Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
                  required
                >
                  <option value="weathering">Weathering / Surface Erosion</option>
                  <option value="vegetation_overgrowth">Vegetation / Root Penetration</option>
                  <option value="structural_crack">Structural Cracking / Displacement</option>
                  <option value="vandalism">Vandalism / Graffiti / Carving</option>
                  <option value="pollution">Litter / Waste / Water Pollution</option>
                  <option value="neglect">Unsecured Gate / General Neglect</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                  Perceived Severity *
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
                  required
                >
                  <option value="low">Low (Cosmetic wear / Minor litter)</option>
                  <option value="medium">Medium (Early sapling roots / Flaking plaster)</option>
                  <option value="high">High (Active mortar separation / Deep graffiti)</option>
                  <option value="urgent">Urgent (Imminent collapse hazard / Structural dislodgement)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                  Date Observed *
                </label>
                <input
                  type="date"
                  value={dateObserved}
                  onChange={(e) => setDateObserved(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                Specific Area / Location within Monument *
              </label>
              <input
                type="text"
                value={areaLocation}
                onChange={(e) => setAreaLocation(e.target.value)}
                placeholder="e.g. North-Eastern Bastion, third tier near Main Gateway"
                className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                Detailed Observation *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe what you observed, approximate dimensions of the crack or vegetation, and whether recent weather has worsened it..."
                className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                Photo URL (Optional)
              </label>
              <div className="relative">
                <Camera className="w-4 h-4 text-[#6B635D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg or image hosting link"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#282522] hover:bg-[#713C3C] text-[#F5F1E8] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit Conservation Report
            </button>

          </form>
        </div>

        {/* Recent Community Reports Queue */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#713C3C] font-semibold">
              Live Field Logs
            </span>
            <h3 className="font-serif-editorial text-2xl font-bold text-[#282522] mt-1">
              Recent Community Observations
            </h3>
          </div>

          <div className="space-y-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-2xl p-5 border border-[#E4DDD0] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#282522]">
                    {rep.monumentName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      rep.severity === "high" || rep.severity === "urgent"
                        ? "bg-red-100 text-red-800"
                        : rep.severity === "medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {rep.severity} Severity
                  </span>
                </div>

                <div className="text-[11px] font-medium text-[#713C3C]">
                  Loc: {rep.areaLocation}
                </div>

                <p className="text-xs text-[#6B635D] leading-relaxed">
                  {rep.description}
                </p>

                <div className="pt-2 border-t border-[#E4DDD0] flex items-center justify-between text-[11px] text-[#6B635D]/80">
                  <span>Observed: {rep.dateObserved}</span>
                  <span className="capitalize font-medium text-[#282522]">
                    Status: {rep.status}
                  </span>
                </div>

                {rep.adminNotes && (
                  <div className="p-2.5 rounded-lg bg-[#F5F1E8] text-[11px] text-[#6B635D] border border-[#E4DDD0]">
                    <strong className="text-[#282522] block mb-0.5">Curator Note:</strong>
                    {rep.adminNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
