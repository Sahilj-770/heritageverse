"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CommunitySubmission } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { ArrowLeft, Users, Clock, CheckCircle2, XCircle, AlertCircle, Plus } from "lucide-react";

export default function ContributionsHistoryPage() {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);

  useEffect(() => {
    setSubmissions(HeritageStore.getSubmissions());
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Return Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-xs text-[#68615A] hover:text-[#181615] flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard Overview
        </Link>

        <Link
          href="/community#submit"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#181615] text-[#FAF4E5] hover:bg-[#262220] transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
          Submit New Story
        </Link>
      </div>

      <div>
        <h1 className="font-serif-editorial text-3xl font-bold text-[#181615]">
          Your Contributions & Moderation History
        </h1>
        <p className="text-sm text-[#68615A] mt-1">
          Review the status of your oral histories, photographs, and historical corrections submitted for academic verification.
        </p>
      </div>

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl p-6 border border-[#E6DED4] shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6DED4] pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9B783E]">
                  {sub.monumentName}
                </span>
                <h3 className="font-serif-editorial text-lg font-bold text-[#181615]">
                  {sub.title}
                </h3>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase ${
                  sub.status === "approved"
                    ? "bg-emerald-100 text-emerald-800"
                    : sub.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {sub.status === "approved" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {sub.status === "rejected" && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                {sub.status === "pending" && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                Status: {sub.status}
              </span>
            </div>

            <p className="text-xs text-[#68615A] leading-relaxed">
              {sub.content}
            </p>

            {sub.adminFeedback && (
              <div className="p-3 rounded-xl bg-[#FAF4E5] border border-[#C5A059]/30 text-xs text-[#68615A]">
                <strong className="text-[#181615] block mb-0.5">Curator Feedback:</strong>
                {sub.adminFeedback}
              </div>
            )}

            <div className="text-[11px] text-[#938A82]">
              Submitted on: {new Date(sub.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
