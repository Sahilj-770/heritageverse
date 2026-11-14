"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Monument } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Landmark,
  Compass
} from "lucide-react";

export default function AdminMonumentsPage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Monument Form State
  const [name, setName] = useState("");
  const [vernacularName, setVernacularName] = useState("");
  const [region, setRegion] = useState<Monument["region"]>("Northern India");
  const [stateName, setStateName] = useState("Uttar Pradesh");
  const [category, setCategory] = useState<Monument["category"]>("Forts & Citadels");
  const [period, setPeriod] = useState<Monument["period"]>("Mughal & Maratha Empires (16th - 18th Century)");
  const [yearBuilt, setYearBuilt] = useState("1632 CE");
  const [location, setLocation] = useState("Agra");
  const [lat, setLat] = useState("27.1751");
  const [lng, setLng] = useState("78.0421");
  const [shortDescription, setShortDescription] = useState("");
  const [coverImage, setCoverImage] = useState("/images/monuments/taj-mahal.jpg");
  const [panoramaUrl, setPanoramaUrl] = useState("/images/panoramas/taj-mahal-360.jpg");

  useEffect(() => {
    setMonuments(HeritageStore.getMonuments());
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from the active monument repository?`)) {
      HeritageStore.deleteMonument(id);
      setMonuments(HeritageStore.getMonuments());
    }
  };

  const handleAddMonument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortDescription.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newMonument: Monument = {
      id: "m-" + Date.now(),
      slug,
      name,
      vernacularName: vernacularName || undefined,
      shortDescription,
      historicalBackground: shortDescription + " Detailed archival research ongoing.",
      architecturalStyle: "Regional Deccan Vernacular Architecture.",
      culturalSignificance: "Significant historical landmark in Maharashtra.",
      conservationStatus: "Requires Monitoring",
      sdgRelevance: "SDG 11.4 — Protection against weather and urban expansion.",
      location,
      district: location,
      state: stateName,
      region,
      coordinates: {
        lat: parseFloat(lat) || 27.1751,
        lng: parseFloat(lng) || 78.0421,
      },
      category,
      period,
      yearBuilt,
      visitorInformation: {
        timings: "09:00 AM - 05:30 PM",
        entryFee: "Standard ASI fees apply",
        bestTimeToVisit: "October to March",
        nearestTransit: "Pune Railway Station",
        verified: false,
      },
      featured: false,
      coverImage,
      images: [
        {
          id: "img-new-1",
          url: coverImage,
          caption: "Primary exterior facade",
          attribution: "HeritageVerse Archive",
          license: "CC-BY-SA 4.0",
        },
      ],
      tourScenes: [
        {
          id: "scene-" + Date.now(),
          name: "Main Gateway & Courtyard",
          panoramaUrl,
          initialYaw: 0,
          initialPitch: 0,
          historicalNotes: "Initial virtual scan of the main compound entrance.",
          hotspots: [],
        },
      ],
      sources: [
        {
          title: "District Archaeological Gazetteers",
          publisher: "Archaeological Survey of India",
        },
      ],
    };

    HeritageStore.saveMonument(newMonument);
    setMonuments(HeritageStore.getMonuments());
    setShowAddModal(false);
    setName("");
    setVernacularName("");
    setShortDescription("");
  };

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

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#181615] text-[#FAF4E5] hover:bg-[#262220] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          Add New Monument Record
        </button>
      </div>

      <div>
        <h1 className="font-serif-editorial text-3xl font-bold text-[#181615]">
          Monument Records & Panorama Assets
        </h1>
        <p className="text-sm text-[#68615A] mt-1">
          Add, configure, and inspect monuments and their associated 360° equirectangular virtual tour scenes.
        </p>
      </div>

      {/* Monuments Table / List */}
      <div className="bg-white rounded-3xl border border-[#E6DED4] overflow-hidden shadow-sm">
        <div className="divide-y divide-[#E6DED4]">
          {monuments.map((m) => (
            <div
              key={m.id}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#FBF9F5] transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={m.coverImage}
                  alt={m.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E6DED4]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-editorial text-lg font-bold text-[#181615]">
                      {m.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF4E5] text-[#9B783E] border border-[#C5A059]/30">
                      {m.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#68615A] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{m.location}</span>
                    <span>•</span>
                    <span>{m.period}</span>
                  </div>
                  <div className="text-[11px] text-[#938A82] mt-1">
                    {m.tourScenes?.length || 0} Virtual Tour Scenes Configured
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/heritage/${m.slug}`}
                  className="p-2 rounded-lg bg-[#F4EFE6] text-[#181615] hover:bg-[#EADFCF] text-xs font-semibold flex items-center gap-1"
                  title="View Public Page"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </Link>

                <Link
                  href={`/tour/${m.slug}`}
                  className="p-2 rounded-lg bg-[#FAF4E5] text-[#9B783E] hover:bg-[#C5A059] hover:text-[#181615] text-xs font-semibold flex items-center gap-1"
                  title="Test 360 Tour"
                >
                  <Compass className="w-3.5 h-3.5" />
                  360°
                </Link>

                <button
                  onClick={() => handleDelete(m.id, m.name)}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Monument Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 border border-[#E6DED4] shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6DED4] pb-4">
              <div>
                <h2 className="font-serif-editorial text-2xl font-bold text-[#181615]">
                  Add New Heritage Site
                </h2>
                <p className="text-xs text-[#68615A]">
                  Register monument details and assign an equirectangular 360° panorama asset.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-lg text-[#938A82] hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMonument} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#181615] mb-1">
                    Monument Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lohagad Fort"
                    className="w-full py-2 px-3 rounded-xl border border-[#E6DED4] text-xs text-[#181615]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#181615] mb-1">
                    Vernacular Title
                  </label>
                  <input
                    type="text"
                    value={vernacularName}
                    onChange={(e) => setVernacularName(e.target.value)}
                    placeholder="e.g. लोहगड किल्ला"
                    className="w-full py-2 px-3 rounded-xl border border-[#E6DED4] text-xs text-[#181615]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#181615] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-xl border border-[#E6DED4] text-xs text-[#181615]"
                  >
                    <option value="Forts & Citadels">Forts & Citadels</option>
                    <option value="Palaces & Mansions">Palaces & Mansions</option>
                    <option value="Rock-Cut Caves & Temples">Rock-Cut Caves & Temples</option>
                    <option value="Sacred Temples & Shrines">Sacred Temples & Shrines</option>
                    <option value="Museums & Archives">Museums & Archives</option>
                    <option value="Colonial & Civic Heritage">Colonial & Civic Heritage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#181615] mb-1">
                    Historical Period *
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-xl border border-[#E6DED4] text-xs text-[#181615]"
                  >
                    <option value="Ancient (Prior to 6th Century CE)">Ancient (Prior to 6th Century CE)</option>
                    <option value="Classical & Early Medieval (6th - 12th Century)">Classical & Early Medieval</option>
                    <option value="Medieval & Sultanate (12th - 16th Century)">Medieval & Sultanate</option>
                    <option value="Mughal & Maratha Empires (16th - 18th Century)">Mughal & Maratha Empires</option>
                    <option value="Colonial & Modern Era (18th - 20th Century)">Colonial & Modern Era</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#181615] mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-[#E6DED4] text-xs text-[#181615]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#181615] mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-[#E6DED4] text-xs text-[#181615]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#181615] mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-[#E6DED4] text-xs text-[#181615]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181615] mb-1">
                  Short Description *
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  rows={3}
                  className="w-full py-2 px-3 rounded-xl border border-[#E6DED4] text-xs text-[#181615]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181615] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-[#E6DED4] text-xs text-[#181615]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181615] mb-1">
                  Initial 360° Equirectangular Panorama URL
                </label>
                <input
                  type="url"
                  value={panoramaUrl}
                  onChange={(e) => setPanoramaUrl(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-[#E6DED4] text-xs text-[#181615]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6DED4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#68615A] hover:bg-[#F4EFE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#181615] text-[#FAF4E5] hover:bg-[#262220]"
                >
                  Save Monument Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
