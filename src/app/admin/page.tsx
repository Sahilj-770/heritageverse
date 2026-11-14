"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Monument, CommunitySubmission, ConservationReport, UserProfile } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { 
  ShieldCheck, 
  Landmark, 
  FileCheck, 
  AlertTriangle, 
  Users, 
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  RefreshCw
} from "lucide-react";

export default function AdminDashboardPage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [reports, setReports] = useState<ConservationReport[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(HeritageStore.getUser());
    setMonuments(HeritageStore.getMonuments());
    setSubmissions(HeritageStore.getSubmissions());
    setReports(HeritageStore.getReports());
  }, []);

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const pendingReports = reports.filter((r) => r.status === "pending" || r.status === "investigating");

  const handleResetData = () => {
    if (confirm("Reset demo data to initial factory state?")) {
      HeritageStore.resetToDefault();
      setMonuments(HeritageStore.getMonuments());
      setSubmissions(HeritageStore.getSubmissions());
      setReports(HeritageStore.getReports());
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. ADMIN HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E6DED4]">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#9B783E] font-semibold flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            Heritage Curator Console
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#181615]">
            Administrative Operations & Triage
          </h1>
          <p className="text-xs text-[#68615A] mt-1">
            Managing {monuments.length} heritage sites, {submissions.length} community records, and {reports.length} conservation field logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetData}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#68615A] bg-[#F4EFE6] hover:bg-[#EADFCF] transition-colors flex items-center gap-1.5 border border-[#E6DED4]"
            title="Reset test data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Factory Data
          </button>

          <Link
            href="/admin/monuments"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#181615] text-[#FAF4E5] hover:bg-[#262220] transition-colors shadow-sm flex items-center gap-2"
          >
            <Landmark className="w-3.5 h-3.5 text-[#C5A059]" />
            Manage Monuments
          </Link>
        </div>
      </div>

      {/* 2. STATS KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-[#E6DED4] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#938A82]">
            <span className="font-semibold uppercase tracking-wider">Catalogued Sites</span>
            <Landmark className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="font-serif-editorial text-3xl font-bold text-[#181615]">
            {monuments.length}
          </div>
          <div className="text-[11px] text-[#68615A]">
            All with 360° virtual tours & coordinates
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E6DED4] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#938A82]">
            <span className="font-semibold uppercase tracking-wider">Pending Submissions</span>
            <FileCheck className="w-4 h-4 text-[#9B783E]" />
          </div>
          <div className="font-serif-editorial text-3xl font-bold text-[#181615]">
            {pendingSubmissions.length}
          </div>
          <div className="text-[11px] text-[#C85A32] font-semibold">
            Requires curator verification
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E6DED4] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#938A82]">
            <span className="font-semibold uppercase tracking-wider">Conservation Alerts</span>
            <AlertTriangle className="w-4 h-4 text-[#C85A32]" />
          </div>
          <div className="font-serif-editorial text-3xl font-bold text-[#181615]">
            {pendingReports.length}
          </div>
          <div className="text-[11px] text-[#68615A]">
            Active community observations
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E6DED4] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#938A82]">
            <span className="font-semibold uppercase tracking-wider">SDG Target 11.4</span>
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="font-serif-editorial text-3xl font-bold text-[#181615]">
            100%
          </div>
          <div className="text-[11px] text-[#68615A]">
            Open access cultural digital twins
          </div>
        </div>

      </div>

      {/* 3. WORKFLOW HUBS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Monument Management Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6DED4] space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF4E5] text-[#C5A059] flex items-center justify-center mb-3">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-xl font-bold text-[#181615]">
              Monument Management
            </h3>
            <p className="text-xs text-[#68615A] leading-relaxed mt-1">
              Add new heritage sites, edit historical dossiers, update visiting hours, and link high-resolution 360° equirectangular panoramas.
            </p>
          </div>
          <Link
            href="/admin/monuments"
            className="w-full py-2.5 rounded-xl bg-[#181615] text-[#FAF4E5] hover:bg-[#262220] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Manage Monuments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Community Moderation Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6DED4] space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] text-[#9B783E] flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-xl font-bold text-[#181615]">
              Community Submissions
            </h3>
            <p className="text-xs text-[#68615A] leading-relaxed mt-1">
              Review, approve, or reject user-submitted folklore, oral histories, and photographs before they are published to the public directory.
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="w-full py-2.5 rounded-xl bg-[#C5A059] text-[#181615] hover:bg-[#D8B775] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Moderate Submissions ({pendingSubmissions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Conservation Reports Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6DED4] space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F9EDE8] text-[#C85A32] flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-serif-editorial text-xl font-bold text-[#181615]">
              Conservation Reports
            </h3>
            <p className="text-xs text-[#68615A] leading-relaxed mt-1">
              Triage crowd-sourced damage observations, assign severity ratings, log curator notes, and archive investigated incidents.
            </p>
          </div>
          <Link
            href="/admin/reports"
            className="w-full py-2.5 rounded-xl bg-[#C85A32] text-white hover:bg-[#B84E27] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Review Reports ({pendingReports.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
