"use client";

import { useState, useEffect } from "react";
import { Monument, CommunitySubmission } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { 
  Users, 
  BookOpen, 
  Camera, 
  Send, 
  CheckCircle2, 
  Info, 
  MessageSquare, 
  Heart,
  Share2,
  Sparkles
} from "lucide-react";

export default function CommunityPage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "oral_history" | "photograph" | "story">("all");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [monumentId, setMonumentId] = useState("");
  const [submissionType, setSubmissionType] = useState<CommunitySubmission["type"]>("story");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAttribution, setMediaAttribution] = useState("");

  useEffect(() => {
    const mons = HeritageStore.getMonuments();
    setMonuments(mons);
    if (mons.length > 0) setMonumentId(mons[0].id);
    setSubmissions(HeritageStore.getApprovedSubmissions());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const selectedMon = monuments.find((m) => m.id === monumentId);
    const user = HeritageStore.getUser();

    HeritageStore.addSubmission({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      monumentId: monumentId,
      monumentName: selectedMon?.name || "Historic Monument",
      type: submissionType,
      title,
      content,
      mediaUrl: mediaUrl || undefined,
      mediaAttribution: mediaAttribution || undefined,
    });

    setSubmittedSuccess(true);
    setTitle("");
    setContent("");
    setMediaUrl("");
    setMediaAttribution("");
  };

  const filtered =
    activeTab === "all"
      ? submissions
      : submissions.filter((s) => s.type === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. HEADER */}
      <div className="max-w-3xl space-y-3">
        <div className="text-xs uppercase tracking-widest text-[#713C3C] font-semibold flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#B18A55]" />
          Participatory Folklore & Photographic Archive
        </div>
        <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#282522] tracking-tight">
          Community Heritage Archive
        </h1>
        <p className="text-[#6B635D] text-base leading-relaxed">
          Preserving history is not solely the task of institutions. Local families, scholars, travelers, and residents safeguard irreplaceable memories, oral histories, and archival photographs. Explore peer-moderated stories or contribute your own.
        </p>
      </div>

      {/* 2. SUBMIT CONTRIBUTION FORM */}
      <div id="submit" className="bg-white rounded-3xl p-8 border border-[#E4DDD0] shadow-sm space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#713C3C] font-semibold">
            Contribute to the Digital Archive
          </span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#282522] mt-1">
            Share a Story, Photograph, or Correction
          </h2>
          <p className="text-xs text-[#6B635D] mt-1 leading-relaxed max-w-2xl">
            All submissions enter a curator moderation workflow. Once verified for authenticity, your narrative will become permanently visible in the public heritage directory.
          </p>
        </div>

        {submittedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Your contribution was submitted successfully! It is now pending review by our curator team. You can track it under your User Dashboard.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                Related Monument *
              </label>
              <select
                value={monumentId}
                onChange={(e) => setMonumentId(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
                required
              >
                {monuments.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                Contribution Type *
              </label>
              <select
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
                required
              >
                <option value="story">Historical Memoir / Story</option>
                <option value="oral_history">Oral History / Elder Account</option>
                <option value="photograph">Archival / Field Photograph</option>
                <option value="correction">Factual Correction to Monument Record</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#282522] mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My grandmother's memory of the 1961 Panshet flood near the Wada"
              className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#282522] mb-1.5">
              Content / Narrative *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Provide clear details, dates where known, and the context of the story or correction..."
              className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                Image Link (Optional)
              </label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or hosting URL"
                className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282522] mb-1.5">
                Image Attribution / Copyright
              </label>
              <input
                type="text"
                value={mediaAttribution}
                onChange={(e) => setMediaAttribution(e.target.value)}
                placeholder="e.g. Self-photographed (CC-BY) or Family Archive"
                className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-[#F5F1E8]/50 text-xs text-[#282522] focus:outline-none focus:border-[#B18A55]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-[#282522] hover:bg-[#713C3C] text-[#F5F1E8] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Send className="w-4 h-4 text-[#B18A55]" />
            Submit for Curator Moderation
          </button>
        </form>
      </div>

      {/* 3. PUBLIC ARCHIVE FEED */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4DDD0] pb-4">
          <div>
            <h2 className="font-serif-editorial text-2xl font-bold text-[#282522]">
              Approved Community Contributions
            </h2>
            <p className="text-xs text-[#6B635D] mt-0.5">
              Verified oral histories, photo archives, and local insights from verified contributors.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Items" },
              { id: "oral_history", label: "Oral Histories" },
              { id: "photograph", label: "Photographs" },
              { id: "story", label: "Memoirs" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#282522] text-[#F5F1E8] font-semibold"
                    : "bg-[#F5F1E8] text-[#6B635D] hover:bg-[#E4DDD0]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sub) => (
            <article
              key={sub.id}
              className="bg-white rounded-2xl border border-[#E4DDD0] p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5F1E8] text-[#713C3C] border border-[#B18A55]/30">
                    {sub.monumentName}
                  </span>
                  <span className="text-[10px] text-[#6B635D] capitalize">
                    {sub.type.replace("_", " ")}
                  </span>
                </div>

                {sub.mediaUrl && (
                  <div className="rounded-xl overflow-hidden aspect-[16/10] bg-[#282522]">
                    <img
                      src={sub.mediaUrl}
                      alt={sub.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <h3 className="font-serif-editorial text-lg font-bold text-[#282522] leading-snug">
                  {sub.title}
                </h3>

                <p className="text-xs text-[#6B635D] leading-relaxed">
                  {sub.content}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E4DDD0] flex items-center justify-between text-[11px] text-[#6B635D]">
                <div>
                  Contributed by <strong className="text-[#282522]">{sub.userName}</strong>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
                  Curator Verified
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
