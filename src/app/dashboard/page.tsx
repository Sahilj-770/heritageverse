"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Monument, 
  CommunitySubmission, 
  ConservationReport, 
  UserProfile, 
  HeritagePassport, 
  Trip, 
  FieldJournalNote 
} from "@/types/heritage";
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
  Sparkles, 
  Award, 
  Navigation, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Landmark,
  ChevronRight
} from "lucide-react";

export default function UserDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedMonuments, setSavedMonuments] = useState<Monument[]>([]);
  const [mySubmissions, setMySubmissions] = useState<CommunitySubmission[]>([]);
  const [myReports, setMyReports] = useState<ConservationReport[]>([]);
  const [passport, setPassport] = useState<HeritagePassport | null>(null);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);

  // Field Note modal / inline form
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [selectedMonumentId, setSelectedMonumentId] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const allMonuments = HeritageStore.getMonuments();

  const loadAllData = () => {
    const activeUser = HeritageStore.getUser();
    setUser(activeUser);

    const savedIds = HeritageStore.getSavedMonumentIds();
    setSavedMonuments(allMonuments.filter((m) => savedIds.includes(m.id)));

    const allSubs = HeritageStore.getSubmissions();
    setMySubmissions(allSubs.filter((s) => s.userId === activeUser.id || s.userRole === activeUser.role));

    const allReps = HeritageStore.getReports();
    setMyReports(allReps.filter((r) => r.userId === activeUser.id));

    setPassport(HeritageStore.getPassport());
    setSavedTrips(HeritageStore.getTrips());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMonumentId || !noteTitle.trim() || !noteContent.trim()) return;

    const mon = allMonuments.find((m) => m.id === selectedMonumentId);
    if (!mon) return;

    HeritageStore.saveFieldNote(
      mon.id,
      mon.slug,
      mon.name,
      noteTitle.trim(),
      noteContent.trim()
    );

    setNoteTitle("");
    setNoteContent("");
    setShowNoteForm(false);
    loadAllData();
  };

  const handleDeleteNote = (id: string) => {
    HeritageStore.deleteFieldNote(id);
    loadAllData();
  };

  const handleDeleteTrip = (id: string) => {
    HeritageStore.deleteTrip(id);
    loadAllData();
  };

  if (!user) return null;

  const totalVisited = passport?.visited.length || 0;
  const toursCompleted = passport?.completedToursCount || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. USER PROFILE HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4DDD0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#282522] text-[#B18A55] flex items-center justify-center font-serif-editorial text-2xl font-bold border border-[#B18A55]/40 shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#282522]">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-[#FAF4E5] text-[#713C3C] border border-[#B18A55]/40">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-[#6B635D] mt-1">
              {user.email} • Citizen Heritage Researcher & Preservation Steward
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/plan-trip"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#713C3C] text-[#FAF4E5] hover:bg-[#592F2F] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Plan New Circuit</span>
          </Link>
          <Link
            href="/community#submit"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#FAF8F5] text-[#282522] hover:bg-[#F5F1E8] transition-colors flex items-center gap-2 border border-[#E4DDD0]"
          >
            <Send className="w-3.5 h-3.5 text-[#B18A55]" />
            <span>New Submission</span>
          </Link>
        </div>
      </div>

      {/* 2. HERITAGE PASSPORT & CULTURAL LOGBOOK */}
      <section className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1E8] border border-[#E4DDD0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4DDD0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#713C3C] text-[#C5A059] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#713C3C] uppercase tracking-wider">
                SDG 11.4 Cultural Explorer Record
              </div>
              <h2 className="font-serif-editorial text-2xl font-bold text-[#282522]">
                Official Heritage Passport
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="font-black text-xl text-[#713C3C] block leading-none">
                {totalVisited} / 17
              </span>
              <span className="text-[10px] text-[#6B635D] uppercase tracking-wider font-semibold">
                Sites Explored
              </span>
            </div>
            <div className="h-8 w-px bg-[#E4DDD0]" />
            <div className="text-right">
              <span className="font-black text-xl text-[#B18A55] block leading-none">
                {toursCompleted}
              </span>
              <span className="text-[10px] text-[#6B635D] uppercase tracking-wider font-semibold">
                360° Tours Done
              </span>
            </div>
          </div>
        </div>

        {/* Visited Sites Stamps Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#282522] uppercase tracking-wider">
              Documented Site Visits & Survey Stamps
            </span>
            <Link
              href="/explore"
              className="text-xs font-semibold text-[#713C3C] hover:underline flex items-center gap-1"
            >
              <span>Explore More Sites</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {passport?.visited && passport.visited.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {passport.visited.map((v) => (
                <div
                  key={v.monumentId}
                  className="p-4 rounded-2xl bg-white border border-[#E4DDD0] shadow-sm flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span className="text-[10px] font-bold text-[#B18A55] uppercase tracking-wider">
                        Archival Stamp
                      </span>
                    </div>
                    <h3 className="font-serif-editorial text-sm font-bold text-[#282522]">
                      {v.monumentName}
                    </h3>
                    <p className="text-[10px] text-[#6B635D]">
                      Visited {new Date(v.visitedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {v.virtualTourCompleted && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF4E5] border border-[#B18A55] text-[9px] font-bold text-[#713C3C]">
                        360° Completed
                      </span>
                    )}
                    <Link
                      href={`/heritage/${v.monumentSlug}`}
                      className="text-[11px] font-bold text-[#713C3C] hover:underline flex items-center gap-1"
                    >
                      <span>Dossier</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-[#E4DDD0] text-center text-xs text-[#6B635D] space-y-2">
              <Compass className="w-8 h-8 text-[#B18A55] mx-auto opacity-60" />
              <p>Your passport currently has no monument stamps. Visit any monument dossier or launch a 360° virtual tour to stamp your travel record!</p>
              <Link
                href="/explore"
                className="inline-block px-4 py-2 rounded-xl bg-[#282522] text-[#FAF4E5] font-bold text-xs mt-2"
              >
                Browse Monuments Directory
              </Link>
            </div>
          )}
        </div>

        {/* Field Journal & Research Notes */}
        <div className="pt-4 border-t border-[#E4DDD0] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#282522] uppercase tracking-wider block">
                Field Journal & Cultural Notes
              </span>
              <p className="text-[11px] text-[#6B635D]">Personal observations, architectural notes, and study logs</p>
            </div>
            <button
              onClick={() => setShowNoteForm(!showNoteForm)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#E4DDD0] text-xs font-bold text-[#713C3C] hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Field Note</span>
            </button>
          </div>

          {/* Add Field Note Form */}
          {showNoteForm && (
            <form onSubmit={handleAddNote} className="p-4 rounded-2xl bg-white border border-[#E4DDD0] space-y-3 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#6B635D] uppercase tracking-wider block mb-1">
                    Select Monument
                  </label>
                  <select
                    value={selectedMonumentId}
                    onChange={(e) => setSelectedMonumentId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DDD0] bg-[#FAF8F5] text-xs font-semibold text-[#282522]"
                  >
                    <option value="">Select Monument...</option>
                    {allMonuments.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#6B635D] uppercase tracking-wider block mb-1">
                    Note Subject / Feature
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Lime-mortar joinery inspection"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DDD0] bg-[#FAF8F5] text-xs font-semibold text-[#282522]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6B635D] uppercase tracking-wider block mb-1">
                  Field Observations
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record your field observations, architectural details, or visiting notes..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E4DDD0] bg-[#FAF8F5] text-xs font-semibold text-[#282522]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteForm(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#E4DDD0] text-xs font-semibold text-[#6B635D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#713C3C] text-white text-xs font-bold hover:bg-[#592F2F]"
                >
                  Save to Journal
                </button>
              </div>
            </form>
          )}

          {/* Notes List */}
          {passport?.notes && passport.notes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {passport.notes.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl bg-white border border-[#E4DDD0] space-y-2 shadow-sm relative group">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#B18A55] uppercase tracking-wider">
                        {n.monumentName}
                      </span>
                      <h4 className="font-serif-editorial text-sm font-bold text-[#282522]">
                        {n.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(n.id)}
                      className="p-1 text-[#6B635D] hover:text-red-700 opacity-60 group-hover:opacity-100 transition-opacity"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#6B635D] leading-relaxed">
                    {n.content}
                  </p>
                  <div className="text-[10px] text-[#A69E96] pt-1 border-t border-[#E4DDD0]">
                    Logged on {new Date(n.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#6B635D] italic">
              No field notes recorded yet. Use the button above to log personal observations while studying monuments.
            </div>
          )}
        </div>
      </section>

      {/* 3. SAVED TRIP ITINERARIES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E4DDD0] pb-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#713C3C]" />
            <h2 className="font-serif-editorial text-2xl font-bold text-[#282522]">
              Planned Travel Circuits ({savedTrips.length})
            </h2>
          </div>
          <Link
            href="/plan-trip"
            className="text-xs font-semibold text-[#713C3C] hover:underline flex items-center gap-1"
          >
            <span>Create New Route</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {savedTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((st) => (
              <div
                key={st.id}
                className="p-5 rounded-3xl bg-white border border-[#E4DDD0] shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF4E5] border border-[#B18A55]/40 text-[10px] font-bold text-[#713C3C] uppercase">
                      {st.transportMode}
                    </span>
                    <button
                      onClick={() => handleDeleteTrip(st.id)}
                      className="text-[#6B635D] hover:text-red-700"
                      title="Delete trip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-serif-editorial text-lg font-bold text-[#282522]">
                    {st.title}
                  </h3>

                  <div className="text-xs text-[#6B635D] space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Total Distance:</span>
                      <strong className="text-[#282522]">
                        {(st.totalDistanceMeters / 1000).toFixed(1)} km
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Stops:</span>
                      <strong className="text-[#282522]">{st.stops.length} locations</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4DDD0] flex items-center justify-between">
                  <span className="text-[10px] text-[#A69E96]">
                    Created {new Date(st.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href="/plan-trip"
                    className="px-3 py-1.5 rounded-xl bg-[#282522] text-[#FAF4E5] text-xs font-bold hover:bg-[#713C3C] transition-colors"
                  >
                    Open in Planner
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E4DDD0] p-8 text-center text-xs text-[#6B635D] space-y-2">
            <Navigation className="w-8 h-8 text-[#713C3C] mx-auto opacity-50" />
            <p>You have not saved any trip circuits yet. Open the Heritage Trip Planner to build an animated itinerary.</p>
            <Link
              href="/plan-trip"
              className="inline-block px-4 py-2 rounded-xl bg-[#713C3C] text-white font-bold text-xs mt-2"
            >
              Open Heritage Trip Planner
            </Link>
          </div>
        )}
      </section>

      {/* 4. SAVED MONUMENTS ARCHIVE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E4DDD0] pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#B18A55]" />
            <h2 className="font-serif-editorial text-2xl font-bold text-[#282522]">
              Bookmarked Monuments Archive ({savedMonuments.length})
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-[#713C3C] hover:underline flex items-center gap-1"
          >
            Explore all 17 sites
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
          <div className="bg-white rounded-2xl border border-[#E4DDD0] p-8 text-center text-xs text-[#6B635D]">
            You have not bookmarked any heritage monuments yet. Browse the directory to save sites for offline study.
          </div>
        )}
      </section>

      {/* 5. CONTRIBUTIONS & SUBMISSION STATUS TRACKER */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E4DDD0] pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#B18A55]" />
            <h2 className="font-serif-editorial text-2xl font-bold text-[#282522]">
              Your Community Submissions ({mySubmissions.length})
            </h2>
          </div>
          <Link
            href="/dashboard/contributions"
            className="text-xs font-semibold text-[#713C3C] hover:underline"
          >
            Full Contribution Logs
          </Link>
        </div>

        {mySubmissions.length > 0 ? (
          <div className="bg-white rounded-2xl border border-[#E4DDD0] overflow-hidden shadow-sm">
            <div className="divide-y divide-[#E4DDD0]">
              {mySubmissions.map((sub) => (
                <div key={sub.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B18A55]">
                        {sub.monumentName}
                      </span>
                      <span className="text-xs text-[#6B635D]">•</span>
                      <span className="text-xs text-[#6B635D] capitalize">{sub.type.replace("_", " ")}</span>
                    </div>
                    <h3 className="font-serif-editorial text-base font-bold text-[#282522] mt-1">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-[#6B635D] line-clamp-1 mt-0.5">
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
          <div className="bg-white rounded-2xl border border-[#E4DDD0] p-8 text-center text-xs text-[#6B635D]">
            No community contributions submitted yet. Have a story or photo? Share it via the Community Portal.
          </div>
        )}
      </section>

    </div>
  );
}
