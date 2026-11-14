"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConservationReport } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Archive, 
  Eye, 
  ShieldAlert
} from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ConservationReport[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setReports(HeritageStore.getReports());
  }, []);

  const handleUpdateStatus = (
    id: string,
    status: ConservationReport["status"]
  ) => {
    const notes = prompt("Enter curator action notes or referral details:");
    HeritageStore.updateReportStatus(id, status, notes || undefined);
    setReports(HeritageStore.getReports());
  };

  const filtered =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

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
            Conservation Concern Reports & Triage
          </h1>
          <p className="text-sm text-[#68615A] mt-1">
            Examine citizen-reported erosion, biological root damage, weathering, and vandalism across pilot sites.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {["pending", "investigating", "acknowledged", "archived", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-[#181615] text-[#FAF4E5]"
                  : "bg-white border border-[#E6DED4] text-[#68615A] hover:bg-[#F4EFE6]"
              }`}
            >
              {f} ({f === "all" ? reports.length : reports.filter((r) => r.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filtered.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-3xl p-6 border border-[#E6DED4] shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DED4] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-editorial text-xl font-bold text-[#181615]">
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
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#F4EFE6] text-[#68615A] font-medium capitalize">
                    {rep.category.replace("_", " ")}
                  </span>
                </div>
                <div className="text-xs text-[#9B783E] font-medium mt-1">
                  Specific Area: {rep.areaLocation}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(rep.id, "investigating")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  Mark Investigating
                </button>
                <button
                  onClick={() => handleUpdateStatus(rep.id, "acknowledged")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  Acknowledge & Notify
                </button>
                <button
                  onClick={() => handleUpdateStatus(rep.id, "archived")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#262220] text-[#FAF4E5] hover:bg-black transition-colors"
                >
                  Archive
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#3D3835] leading-relaxed">
              {rep.description}
            </p>

            {rep.photoUrl && (
              <div className="rounded-xl overflow-hidden aspect-[16/9] max-w-sm bg-[#262220]">
                <img
                  src={rep.photoUrl}
                  alt="Report evidence"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="pt-2 border-t border-[#E6DED4] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#938A82] gap-2">
              <div>
                Reported by <strong className="text-[#181615]">{rep.userName}</strong> on {rep.dateObserved}
              </div>
              <div>
                Current Workflow State: <strong className="uppercase text-[#181615]">{rep.status}</strong>
              </div>
            </div>

            {rep.adminNotes && (
              <div className="p-3 rounded-xl bg-[#FAF4E5] border border-[#C5A059]/30 text-xs text-[#68615A]">
                <strong className="text-[#181615] block mb-0.5">Recorded Curator Log:</strong>
                {rep.adminNotes}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-[#938A82] border border-[#E6DED4]">
            No reports in this status queue.
          </div>
        )}
      </div>

    </div>
  );
}
