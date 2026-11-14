"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Monument, CommunitySubmission, ConservationReport, UserProfile } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { MonumentCard } from "@/components/monuments/MonumentCard";
import { 
  Bookmark, 
  Clock, 
  ShieldAlert, 
  Users, 
  Compass, 
  Send, 
  ArrowRight,
  UserCheck,
  Sparkles
} from "lucide-react";

export default function UserDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedMonuments, setSavedMonuments] = useState<Monument[]>([]);
  const [mySubmissions, setMySubmissions] = useState<CommunitySubmission[]>([]);
  const [myReports, setMyReports] = useState<ConservationReport[]>([]);

  useEffect(() => {
    const activeUser = HeritageStore.getUser();
    setUser(activeUser);

    const allMons = HeritageStore.getMonuments();
    const savedIds = HeritageStore.getSavedMonumentIds();
    setSavedMonuments(allMons.filter((m) => savedIds.includes(m.id)));

    const allSubs = HeritageStore.getSubmissions();
    setMySubmissions(allSubs.filter((s) => s.userId === activeUser.id || s.userRole === activeUser.role));

    const allReps = HeritageStore.getReports();
    setMyReports(allReps.filter((r) => r.userId === activeUser.id));
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. USER PROFILE HEADER */}
      <div className="bg-white rounded-3xl p-8 border border-[#E6DED4] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#181615] text-[#C5A059] flex items-center justify-center font-serif-editorial text-2xl font-bold border border-[#C5A059]/40">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#181615]">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-[#FAF4E5] text-[#9B783E] border border-[#C5A059]/40">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-[#68615A] mt-1">
              {user.email} • Active Member of Pune Heritage Circle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/community#submit"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#181615] text-[#FAF4E5] hover:bg-[#262220] transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-[#C5A059]" />
            New Submission
          </Link>
          <Link
            href="/conservation#report"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#F4EFE6] text-[#C85A32] hover:bg-[#EADFCF] transition-colors flex items-center gap-2 border border-[#E6DED4]"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Report Issue
          </Link>
        </div>
      </div>

      {/* 2. SAVED MONUMENTS ARCHIVE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6DED4] pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif-editorial text-2xl font-bold text-[#181615]">
              Saved Monuments Dossiers ({savedMonuments.length})
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-[#9B783E] hover:text-[#181615] flex items-center gap-1"
          >
            Explore more sites
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {savedMonuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedMonuments.map((m) => (
              <MonumentCard key={m.id} monument={m} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E6DED4] p-8 text-center text-xs text-[#938A82]">
            You have not bookmarked any heritage monuments yet. Browse the directory to save sites for offline study.
          </div>
        )}
      </section>

      {/* 3. CONTRIBUTIONS & SUBMISSION STATUS TRACKER */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6DED4] pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif-editorial text-2xl font-bold text-[#181615]">
              Your Community Submissions ({mySubmissions.length})
            </h2>
          </div>
          <Link
            href="/dashboard/contributions"
            className="text-xs font-semibold text-[#9B783E] hover:text-[#181615]"
          >
            Full Contribution Logs
          </Link>
        </div>

        {mySubmissions.length > 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6DED4] overflow-hidden shadow-sm">
            <div className="divide-y divide-[#E6DED4]">
              {mySubmissions.map((sub) => (
                <div key={sub.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9B783E]">
                        {sub.monumentName}
                      </span>
                      <span className="text-xs text-[#938A82]">•</span>
                      <span className="text-xs text-[#68615A] capitalize">{sub.type.replace("_", " ")}</span>
                    </div>
                    <h3 className="font-serif-editorial text-base font-bold text-[#181615] mt-1">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-[#68615A] line-clamp-1 mt-0.5">
                      {sub.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${
                        sub.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : sub.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E6DED4] p-8 text-center text-xs text-[#938A82]">
            No community contributions submitted yet. Have a story or photo? Share it via the Community Portal.
          </div>
        )}
      </section>

    </div>
  );
}
