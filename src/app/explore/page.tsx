"use client";

import { useEffect, useState, useMemo } from "react";
import { Monument } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { MonumentCard } from "@/components/monuments/MonumentCard";
import { 
  Search, 
  Compass, 
  RotateCcw,
  Layers,
  MapPin,
  Globe2,
  Navigation,
  Eye
} from "lucide-react";
import Link from "next/link";

export default function ExplorePage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [only360Tour, setOnly360Tour] = useState(false);
  const [selectedConservation, setSelectedConservation] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "name" | "period">("featured");

  useEffect(() => {
    setMonuments(HeritageStore.getMonuments());
  }, []);

  const regions: string[] = [
    "All",
    "Northern India",
    "Western India",
    "Southern India",
    "Eastern India",
    "Central India",
  ];

  const categories: string[] = [
    "All",
    "Forts & Citadels",
    "Palaces & Mansions",
    "Rock-Cut Caves & Temples",
    "Sacred Temples & Shrines",
    "Museums & Archives",
    "Colonial & Civic Heritage",
  ];

  const periods: string[] = [
    "All",
    "Ancient (Prior to 6th Century CE)",
    "Classical & Early Medieval (6th - 12th Century)",
    "Medieval & Sultanate (12th - 16th Century)",
    "Mughal & Maratha Empires (16th - 18th Century)",
    "Colonial & Modern Era (18th - 20th Century)",
  ];

  const states = useMemo(() => {
    const list = Array.from(new Set(monuments.map((m) => m.state))).sort();
    return ["All", ...list];
  }, [monuments]);

  const filteredMonuments = useMemo(() => {
    return monuments
      .filter((m) => {
        const matchesSearch =
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.vernacularName && m.vernacularName.includes(searchQuery)) ||
          m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.architecturalStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRegion =
          selectedRegion === "All" || m.region === selectedRegion;

        const matchesCat =
          selectedCategory === "All" || m.category === selectedCategory;

        const matchesPeriod =
          selectedPeriod === "All" || m.period === selectedPeriod;

        const matchesState =
          selectedState === "All" || m.state === selectedState;

        const matchesConservation =
          selectedConservation === "All" || m.conservationStatus === selectedConservation;

        const matches360 =
          !only360Tour || (m.tourScenes && m.tourScenes.length > 0);

        return matchesSearch && matchesRegion && matchesCat && matchesPeriod && matchesState && matchesConservation && matches360;
      })
      .sort((a, b) => {
        if (sortBy === "featured") {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "period") {
          return a.yearBuilt.localeCompare(b.yearBuilt);
        }
        return 0;
      });
  }, [monuments, searchQuery, selectedRegion, selectedCategory, selectedPeriod, selectedState, selectedConservation, only360Tour, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRegion("All");
    setSelectedCategory("All");
    setSelectedPeriod("All");
    setSelectedState("All");
    setSelectedConservation("All");
    setOnly360Tour(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedRegion !== "All" ||
    selectedCategory !== "All" ||
    selectedPeriod !== "All" ||
    selectedState !== "All" ||
    selectedConservation !== "All" ||
    only360Tour;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="max-w-3xl space-y-3">
          <div className="text-xs uppercase tracking-widest text-[#B18A55] font-bold flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#713C3C]" />
            SDG 11.4 National Heritage Directory
          </div>
          <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#282522] tracking-tight">
            Cultural Heritage Monuments of India
          </h1>
          <p className="text-[#6B635D] text-base leading-relaxed">
            Search and examine peer-verified dossiers of ancient rock-cut cave sanctuaries, Mughal and Rajput citadels, Dravidian temple towers, and colonial civic monuments across the subcontinent.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Link
            href="/plan-trip"
            className="px-5 py-3 rounded-2xl bg-[#713C3C] text-[#FAF4E5] text-xs font-bold hover:bg-[#592F2F] transition-all shadow-md flex items-center gap-2"
          >
            <Navigation className="w-4 h-4 text-[#C5A059]" />
            <span>Launch Trip Planner</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#F5F1E8] rounded-2xl p-6 border border-[#E4DDD0] shadow-sm space-y-5">
        
        {/* Search input + Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="relative md:col-span-8">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#968D85]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by monument name, vernacular script, dynasty, city, or architecture..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E4DDD0] bg-white focus:outline-none focus:border-[#713C3C] text-sm text-[#282522] placeholder:text-[#968D85] transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#968D85] hover:text-[#282522]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs font-bold text-[#6B635D] whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-3 px-3 rounded-xl border border-[#E4DDD0] bg-white text-xs font-semibold text-[#282522] focus:outline-none focus:border-[#713C3C] shadow-xs"
            >
              <option value="featured">Featured First</option>
              <option value="name">Alphabetical (A-Z)</option>
              <option value="period">Chronological (Era)</option>
            </select>
          </div>
        </div>

        {/* Region Pills */}
        <div className="space-y-2 pt-2 border-t border-[#E4DDD0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#713C3C] flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#B18A55]" />
              Geographic Region
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#713C3C] font-bold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                  selectedRegion === region
                    ? "bg-[#282522] text-[#F5F1E8]"
                    : "bg-white text-[#6B635D] hover:bg-[#E4DDD0] hover:text-[#282522] border border-[#E4DDD0]"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="space-y-2 pt-2 border-t border-[#E4DDD0]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#282522] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#B18A55]" />
            Architectural Archetype
          </span>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shadow-xs ${
                  selectedCategory === category
                    ? "bg-[#713C3C] text-white font-bold"
                    : "bg-white text-[#6B635D] hover:bg-[#E4DDD0] hover:text-[#282522] border border-[#E4DDD0]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Dropdown Filters (Period, State, Conservation & 360 Toggle) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E4DDD0]">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B635D] mb-1.5">
              Historical Era
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-white text-xs font-medium text-[#282522] focus:outline-none focus:border-[#713C3C] shadow-xs"
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B635D] mb-1.5">
              State / Union Territory
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#E4DDD0] bg-white text-xs font-medium text-[#282522] focus:outline-none focus:border-[#713C3C] shadow-xs"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B635D] mb-1.5">
              Digital Twin & 360° Filter
            </label>
            <button
              onClick={() => setOnly360Tour(!only360Tour)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                only360Tour
                  ? "bg-[#713C3C] text-[#FAF4E5] border-[#713C3C]"
                  : "bg-white text-[#6B635D] border-[#E4DDD0] hover:text-[#282522]"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{only360Tour ? "Showing 360° Tours Only" : "Filter: Has 360° Spherical Tour"}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-[#6B635D]">
            Showing <strong className="text-[#282522] font-bold">{filteredMonuments.length}</strong> of {monuments.length} national monuments
          </p>
        </div>

        {filteredMonuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMonuments.map((monument) => (
              <MonumentCard key={monument.id} monument={monument} />
            ))}
          </div>
        ) : (
          <div className="bg-[#F5F1E8] rounded-2xl border border-[#E4DDD0] p-12 text-center max-w-md mx-auto space-y-4">
            <Compass className="w-10 h-10 text-[#B18A55] mx-auto" />
            <h3 className="font-serif-editorial text-xl font-bold text-[#282522]">
              No monuments found
            </h3>
            <p className="text-xs text-[#6B635D] leading-relaxed">
              No historical monuments matched your current filter combinations. Try clearing some filters or searching with alternative keywords.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#282522] text-[#F5F1E8] hover:bg-[#713C3C] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
