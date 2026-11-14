"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CommunitySubmission } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  ExternalLink,
  MessageSquare
} from "lucide-react";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    setSubmissions(HeritageStore.getSubmissions());
  }, []);

  const handleUpdateStatus = (id: string, status: "approved" | "rejected") => {
    const feedback = prompt(
      status === "approved"
        ? "Add optional curator approval note:"
        : "Provide reason for rejection (e.g. unverified dates, requires sources):"
    );
    HeritageStore.updateSubmissionStatus(id, status, feedback || undefined);
    setSubmissions(HeritageStore.getSubmissions());
  };

  const filtered =
    filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Return Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="text-xs text-[#68615A] hover:text-[#181615] flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Curator Console
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-editorial text-3xl font-bold text-[#181615]">
            Community Story & Photo Moderation
          </h1>
          <p className="text-sm text-[#68615A] mt-1">
            Review user-submitted folklore, personal photographs, and historical corrections before public cataloguing.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {["pending", "approved", "rejected", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-[#181615] text-[#FAF4E5]"
                  : "bg-white border border-[#E6DED4] text-[#68615A] hover:bg-[#F4EFE6]"
              }`}
            >
              {f} ({f === "all" ? submissions.length : submissions.filter((s) => s.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-3xl p-6 border border-[#E6DED4] shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DED4] pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9B783E]">
                  {sub.monumentName} • {sub.type.replace("_", " ")}
                </span>
                <h3 className="font-serif-editorial text-xl font-bold text-[#181615]">
                  {sub.title}
                </h3>
                <div className="text-xs text-[#938A82] mt-0.5">
                  Submitted by <strong className="text-[#181615]">{sub.userName}</strong> on{" "}
                  {new Date(sub.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-semibold uppercase ${
                    sub.status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : sub.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {sub.status}
                </span>

                {sub.status === "pending" && (
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => handleUpdateStatus(sub.id, "approved")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(sub.id, "rejected")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#3D3835] leading-relaxed">
              {sub.content}
            </p>

            {sub.mediaUrl && (
              <div className="rounded-xl overflow-hidden aspect-[16/9] max-w-sm bg-[#262220]">
                <img
                  src={sub.mediaUrl}
                  alt={sub.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {sub.adminFeedback && (
              <div className="p-3 rounded-xl bg-[#FAF4E5] border border-[#C5A059]/30 text-xs text-[#68615A]">
                <strong className="text-[#181615] block mb-0.5">Recorded Curator Feedback:</strong>
                {sub.adminFeedback}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-[#938A82] border border-[#E6DED4]">
            No submissions found in this filter tab.
          </div>
        )}
      </div>

    </div>
  );
}
