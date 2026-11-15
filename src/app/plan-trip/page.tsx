"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { TripStop, RouteLeg, TransportMode, Trip, Monument } from "@/types/heritage";
import { HeritageStore } from "@/lib/heritageStore";
import { SAMPLE_MONUMENTS } from "@/data/sampleData";
import { TripMap } from "@/components/planner/TripMap";
import { 
  Car, 
  Bike, 
  Footprints, 
  Navigation, 
  Compass, 
  Plus, 
  Trash2, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  MapPin, 
  Clock, 
  Bookmark, 
  Share2, 
  Download, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  LocateFixed, 
  Info,
  ChevronRight,
  Landmark
} from "lucide-react";

let stopIdCounter = 0;
function createStopId(prefix: string): string {
  stopIdCounter += 1;
  return `${prefix}-${stopIdCounter}`;
}

const TRANSPORT_MODES: {
  id: TransportMode;
  name: string;
  icon: any;
  speed: string;
  description: string;
  routingNotice?: string;
}[] = [
  {
    id: "driving",
    name: "Car / Taxi",
    icon: Car,
    speed: "55 km/h avg",
    description: "Fastest highway transit between distant monuments across state borders.",
  },
  {
    id: "motorcycle",
    name: "Two-Wheeler",
    icon: Navigation,
    speed: "45 km/h avg",
    description: "Agile exploration through dense historic city quarters and fort ascents.",
  },
  {
    id: "bicycle",
    name: "Cycle Tour",
    icon: Bike,
    speed: "16 km/h avg",
    description: "Low-impact heritage cycling through temple towns and archaeological parks.",
  },
  {
    id: "walking",
    name: "Heritage Walk",
    icon: Footprints,
    speed: "4.5 km/h avg",
    description: "Pedestrian surveys within contiguous monument complexes and bastions.",
  },
  {
    id: "transit",
    name: "Public Transit",
    icon: Compass,
    speed: "Train & Metro",
    description: "Indian Railways (IRCTC) and regional transit networks connecting circuits.",
    routingNotice:
      "Transit routes display inter-city rail and road corridors. For live reserved train bookings, verify directly on IRCTC / State RTC portals.",
  },
];

export default function PlanTripPage() {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [transportMode, setTransportMode] = useState<TransportMode>("driving");

  // Multi-stop route list
  const [stops, setStops] = useState<TripStop[]>([
    {
      id: "stop-taj",
      monumentId: "m-taj-mahal",
      monumentSlug: "taj-mahal",
      name: "Taj Mahal",
      locationName: "Agra, Uttar Pradesh",
      coordinates: { lat: 27.175144, lng: 78.042142 },
      order: 0,
    },
    {
      id: "stop-qutub",
      monumentId: "m-qutub-minar",
      monumentSlug: "qutub-minar",
      name: "Qutub Minar",
      locationName: "New Delhi, Delhi",
      coordinates: { lat: 28.524428, lng: 77.185456 },
      order: 1,
    },
    {
      id: "stop-redfort",
      monumentId: "m-red-fort",
      monumentSlug: "red-fort",
      name: "Red Fort (Lal Qila)",
      locationName: "Old Delhi, Delhi",
      coordinates: { lat: 28.656159, lng: 77.24102 },
      order: 2,
    },
  ]);

  // Route calculation results
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [routeLegs, setRouteLegs] = useState<RouteLeg[]>([]);
  const [totalDistanceKm, setTotalDistanceKm] = useState("0");
  const [totalDurationHours, setTotalDurationHours] = useState("0");
  const [dataSource, setDataSource] = useState("");
  const [transitNotice, setTransitNotice] = useState<string | undefined>();
  const [routeError, setRouteError] = useState<string | null>(null);

  // Search & Add location state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Saved itineraries state
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [tripTitle, setTripTitle] = useState("Northern Heritage Triangle");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  // 1. Load monuments and saved trips
  useEffect(() => {
    const mons = HeritageStore.getMonuments();
    setMonuments(mons);
    setSavedTrips(HeritageStore.getTrips());
  }, []);

  // 2. Calculate Directions via Server-side Endpoint
  const calculateRoute = useCallback(async (currentStops: TripStop[], mode: TransportMode) => {
    if (currentStops.length < 2) {
      setRouteGeometry([]);
      setRouteLegs([]);
      setTotalDistanceKm("0");
      setTotalDurationHours("0");
      return;
    }

    setIsLoadingRoute(true);
    setRouteError(null);

    try {
      const payload = {
        coordinates: currentStops.map((s) => s.coordinates),
        mode,
        stopNames: currentStops.map((s) => s.name),
      };

      const res = await fetch("/api/directions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Routing service returned status ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        const { geometry, legs, totalDistanceKm, totalDurationHours, dataSource, transitNotice } =
          json.data;
        setRouteGeometry(geometry);
        setRouteLegs(legs);
        setTotalDistanceKm(totalDistanceKm);
        setTotalDurationHours(totalDurationHours);
        setDataSource(dataSource);
        setTransitNotice(transitNotice);
      } else {
        throw new Error(json.error || "Failed to calculate valid route geometry");
      }
    } catch (err: any) {
      console.error("Directions calculation error:", err);
      setRouteError("Unable to reach live road network. Falling back to highway projection.");
    } finally {
      setIsLoadingRoute(false);
    }
  }, []);

  // Trigger route recalculation when stops or mode change
  useEffect(() => {
    calculateRoute(stops, transportMode);
  }, [stops, transportMode, calculateRoute]);

  // Handle Stop Reordering
  const moveStop = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === stops.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Re-index order property
    const reordered = updated.map((s, idx) => ({ ...s, order: idx }));
    setStops(reordered);
  };

  // Remove Stop
  const removeStop = (index: number) => {
    if (stops.length <= 2) {
      alert("A trip must have at least an origin and a destination stop.");
      return;
    }
    const updated = stops.filter((_, idx) => idx !== index).map((s, idx) => ({ ...s, order: idx }));
    setStops(updated);
  };

  // Add Monument as Stop
  const handleAddMonument = (monument: Monument) => {
    const newStop: TripStop = {
      id: createStopId(`stop-${monument.slug}`),
      monumentId: monument.id,
      monumentSlug: monument.slug,
      name: monument.name,
      locationName: `${monument.location}, ${monument.state}`,
      coordinates: {
        lat: monument.coordinates.lat,
        lng: monument.coordinates.lng,
      },
      order: stops.length,
    };
    setStops([...stops, newStop]);
    setShowAddModal(false);
  };

  // Search places via Geocoding API
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const json = await res.json();
          setSearchResults(json.results || []);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Add search result as stop
  const handleAddSearchResult = (result: any) => {
    const newStop: TripStop = {
      id: createStopId("stop-custom"),
      monumentId: result.monumentId,
      monumentSlug: result.monumentSlug,
      name: result.name,
      locationName: result.locationName,
      coordinates: { lat: result.lat, lng: result.lng },
      order: stops.length,
      isCustomLocation: !result.isMonument,
    };
    setStops([...stops, newStop]);
    setSearchQuery("");
    setSearchResults([]);
    setShowAddModal(false);
  };

  // Detect Current Location with HTML5 Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocateError("Geolocation is not supported by your current browser.");
      return;
    }

    setIsLocating(true);
    setLocateError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userStop: TripStop = {
          id: `stop-user-gps-${Date.now()}`,
          name: "My Current Location",
          locationName: `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`,
          coordinates: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          order: 0,
          isCustomLocation: true,
        };

        // Place user location as the origin (first stop)
        const updated = [userStop, ...stops.filter((s) => !s.id.startsWith("stop-user-gps"))].map(
          (s, idx) => ({ ...s, order: idx })
        );
        setStops(updated);
      },
      (err) => {
        setIsLocating(false);
        setLocateError(`Unable to retrieve GPS coordinates (${err.message}).`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Save Trip Itinerary
  const handleSaveTrip = () => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title: tripTitle.trim() || `Heritage Journey (${stops.length} stops)`,
      transportMode,
      stops,
      totalDistanceMeters: Math.round(parseFloat(totalDistanceKm) * 1000),
      totalDurationSeconds: Math.round(parseFloat(totalDurationHours) * 3600),
      routeGeometry,
      legs: routeLegs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSaved: true,
    };

    HeritageStore.saveTrip(newTrip);
    setSavedTrips(HeritageStore.getTrips());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Load Saved Trip
  const handleLoadTrip = (trip: Trip) => {
    setTripTitle(trip.title);
    setTransportMode(trip.transportMode);
    setStops(trip.stops);
  };

  // Delete Saved Trip
  const handleDeleteTrip = (id: string) => {
    HeritageStore.deleteTrip(id);
    setSavedTrips(HeritageStore.getTrips());
  };

  return (
    <div className="bg-[#F5F1E8] min-h-screen text-[#282522] pb-24">
      
      {/* Editorial Header */}
      <div className="border-b border-[#E4DDD0] bg-[#FAF8F5]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4DDD0] text-[#713C3C] text-[11px] font-bold uppercase tracking-wider">
                <Landmark className="w-3.5 h-3.5" />
                <span>SDG 11.4 • Intelligent Cultural Expedition Planner</span>
              </div>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-black text-[#282522] tracking-tight">
                Heritage Trip Planner
              </h1>
              <p className="text-sm sm:text-base text-[#6B635D] max-w-2xl leading-relaxed">
                Design custom cultural itineraries across India. Experience animated road journeys, authentic distance calculations, and seamless transitions into 360° virtual tours.
              </p>
            </div>

            {/* Quick Saved Trips Counter */}
            {savedTrips.length > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E4DDD0] shadow-sm text-xs">
                <Bookmark className="w-4 h-4 text-[#B18A55]" />
                <div>
                  <span className="font-bold text-[#282522]">{savedTrips.length} Saved Circuits</span>
                  <p className="text-[10px] text-[#6B635D]">Saved to your browser journal</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Step A: Transport Mode Selector */}
        <section className="bg-white border border-[#E4DDD0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#713C3C] uppercase tracking-wider">
                Step 1 of 3
              </span>
              <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#282522]">
                Select Mode of Transportation
              </h2>
            </div>
            <span className="text-xs text-[#6B635D] hidden sm:inline">
              Adjusts speed profile and highway physics
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TRANSPORT_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = transportMode === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => setTransportMode(mode.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? "bg-[#713C3C] text-[#FAF4E5] border-[#713C3C] shadow-md scale-[1.02]"
                      : "bg-[#FAF8F5] text-[#282522] border-[#E4DDD0] hover:border-[#B18A55] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-[#FAF4E5]/15 text-[#C5A059]"
                          : "bg-[#E4DDD0]/60 text-[#713C3C] group-hover:bg-[#E4DDD0]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                    )}
                  </div>

                  <div className="font-bold text-sm leading-tight">{mode.name}</div>
                  <div
                    className={`text-[11px] font-medium mt-0.5 ${
                      isSelected ? "text-[#C5A059]" : "text-[#6B635D]"
                    }`}
                  >
                    {mode.speed}
                  </div>
                  <p
                    className={`text-[10px] mt-2 line-clamp-2 leading-relaxed ${
                      isSelected ? "text-[#FAF4E5]/80" : "text-[#6B635D]"
                    }`}
                  >
                    {mode.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Transit Notice Disclosure */}
          {transportMode === "transit" && (
            <div className="p-4 rounded-2xl bg-[#F5F1E8] border border-[#B18A55]/40 text-xs text-[#282522] flex items-start gap-3">
              <Info className="w-4 h-4 text-[#B18A55] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[#713C3C]">Indian Railways & Public Transport Guidance</span>
                <p className="text-[11px] text-[#6B635D] leading-relaxed">
                  Heritage circuits are linked by Indian Railways (Vande Bharat, Shatabdi & Rajdhani express trains) and state transport RTC coaches. For live PNR status, seat reservations, and official schedules, verify directly with the Ministry of Railways (IRCTC).
                </p>
                <div className="pt-1">
                  <a
                    href="https://www.irctc.co.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#713C3C] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Visit Official IRCTC Portal</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Step B & C: Multi-stop Route Builder & Live Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Itinerary Stops Manager (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border border-[#E4DDD0] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD0]">
                <div>
                  <span className="text-[10px] font-bold text-[#713C3C] uppercase tracking-wider">
                    Step 2 of 3
                  </span>
                  <h3 className="font-serif-editorial text-lg font-bold text-[#282522]">
                    Itinerary Stops ({stops.length})
                  </h3>
                </div>

                <button
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E4DDD0] text-xs font-semibold text-[#713C3C] hover:bg-[#F5F1E8] transition-colors flex items-center gap-1.5"
                  title="Set starting point to GPS location"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>{isLocating ? "Detecting GPS..." : "My Location"}</span>
                </button>
              </div>

              {locateError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{locateError}</span>
                </div>
              )}

              {/* Stops List */}
              <div className="space-y-3">
                {stops.map((stop, index) => {
                  const isFirst = index === 0;
                  const isLast = index === stops.length - 1;

                  return (
                    <div
                      key={stop.id}
                      className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E4DDD0] flex items-center justify-between gap-3 group hover:border-[#B18A55] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Number / Position Badge */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 text-white shadow-sm ${
                            isFirst ? "bg-[#2E7D32]" : isLast ? "bg-[#713C3C]" : "bg-[#B18A55]"
                          }`}
                        >
                          {isFirst ? "A" : isLast ? "B" : `${index + 1}`}
                        </div>

                        <div className="min-w-0">
                          <div className="font-bold text-sm text-[#282522] truncate flex items-center gap-1.5">
                            <span>{stop.name}</span>
                            {stop.monumentSlug && (
                              <Link
                                href={`/tour/${stop.monumentSlug}`}
                                className="text-[10px] text-[#713C3C] font-semibold hover:underline shrink-0"
                                title="Open 360 virtual tour"
                              >
                                [360°]
                              </Link>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6B635D] truncate">
                            {stop.locationName}
                          </div>
                        </div>
                      </div>

                      {/* Reorder and Delete Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => moveStop(index, "up")}
                          disabled={isFirst}
                          className="p-1 rounded-lg hover:bg-white text-[#6B635D] disabled:opacity-30 transition-colors"
                          title="Move stop up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveStop(index, "down")}
                          disabled={isLast}
                          className="p-1 rounded-lg hover:bg-white text-[#6B635D] disabled:opacity-30 transition-colors"
                          title="Move stop down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeStop(index)}
                          className="p-1 rounded-lg hover:bg-red-50 text-[#6B635D] hover:text-red-700 transition-colors ml-1"
                          title="Remove stop"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Stop Button & Quick Selector */}
              <div className="pt-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#B18A55]/60 hover:border-[#713C3C] text-xs font-bold text-[#713C3C] hover:bg-[#FAF8F5] transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Monument or Location to Itinerary</span>
                </button>
              </div>

              {/* Trip Title & Save Action */}
              <div className="pt-4 border-t border-[#E4DDD0] space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#6B635D] uppercase tracking-wider">
                    Itinerary Title
                  </label>
                  <input
                    type="text"
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DDD0] bg-[#FAF8F5] text-xs font-semibold text-[#282522] focus:outline-none focus:border-[#713C3C]"
                    placeholder="e.g. Mughal Architecture Circuit"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveTrip}
                    className="flex-1 py-2.5 rounded-xl bg-[#713C3C] text-[#FAF4E5] text-xs font-bold hover:bg-[#592F2F] transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Save Circuit to Journal</span>
                  </button>
                </div>

                {saveSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Itinerary saved to your personal trip collection!</span>
                  </div>
                )}
              </div>

            </div>

            {/* Saved Trips Accordion / Manager */}
            {savedTrips.length > 0 && (
              <div className="bg-white border border-[#E4DDD0] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-editorial text-base font-bold text-[#282522]">
                    Saved Circuits ({savedTrips.length})
                  </h4>
                  <span className="text-[11px] text-[#6B635D]">Saved in Local Journal</span>
                </div>

                <div className="space-y-2">
                  {savedTrips.map((st) => (
                    <div
                      key={st.id}
                      className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E4DDD0] flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#282522]">{st.title}</div>
                        <div className="text-[10px] text-[#6B635D]">
                          {st.stops.length} stops • {(st.totalDistanceMeters / 1000).toFixed(0)} km • {st.transportMode}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLoadTrip(st)}
                          className="px-2.5 py-1 rounded-lg bg-[#E4DDD0] hover:bg-[#B18A55] hover:text-white font-bold text-[10px] transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(st.id)}
                          className="p-1 text-[#6B635D] hover:text-red-700"
                          title="Delete saved trip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leg-by-Leg Route Breakdown */}
            {routeLegs.length > 0 && (
              <div className="bg-white border border-[#E4DDD0] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-editorial text-base font-bold text-[#282522]">
                    Route Leg Breakdown
                  </h4>
                  <span className="text-[11px] text-[#713C3C] font-bold">
                    {routeLegs.length} Segments
                  </span>
                </div>

                <div className="space-y-3">
                  {routeLegs.map((leg, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E4DDD0] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-[#282522]">
                        <span>Leg {idx + 1}: {leg.fromName} → {leg.toName}</span>
                        <span className="text-[#713C3C]">
                          {(leg.distanceMeters / 1000).toFixed(1)} km
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6B635D] flex items-center justify-between">
                        <span>Est. Driving Duration</span>
                        <span>{(leg.durationSeconds / 3600).toFixed(1)} hrs</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-[#6B635D] flex items-center gap-1.5 pt-2 border-t border-[#E4DDD0]">
                  <Sparkles className="w-3.5 h-3.5 text-[#B18A55]" />
                  <span>Engine: {dataSource}</span>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Live MapLibre Map & Journey Animator (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            <TripMap
              stops={stops}
              routeGeometry={routeGeometry}
              legs={routeLegs}
              transportMode={transportMode}
              totalDistanceKm={totalDistanceKm}
              totalDurationHours={totalDurationHours}
            />

            {/* Trip Context Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#E4DDD0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#B18A55]" />
                <span className="text-[#6B635D]">
                  Click on any numbered monument pin on the map to inspect its cultural overview or jump into its 360° virtual tour.
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Link
                  href="/map"
                  className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E4DDD0] text-[#713C3C] font-bold text-xs hover:bg-[#F5F1E8] transition-colors"
                >
                  Explore Pan-India Map
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Add Location & Monument Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF8F5] border border-[#E4DDD0] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD0]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#713C3C] uppercase tracking-wider">
                  Itinerary Stop Selection
                </span>
                <h3 className="font-serif-editorial text-xl font-bold text-[#282522]">
                  Add Monument or City to Route
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#E4DDD0] flex items-center justify-center text-[#282522] hover:bg-[#D4C8B5] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B635D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monument, city, or landmark across India..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4DDD0] bg-white text-xs font-semibold text-[#282522] focus:outline-none focus:border-[#713C3C]"
                autoFocus
              />
            </div>

            {/* Search Results */}
            {isSearching && (
              <div className="text-center py-4 text-xs text-[#6B635D]">
                Searching Indian geospatial database...
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#713C3C] uppercase tracking-wider">
                  Search Results
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {searchResults.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => handleAddSearchResult(res)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E4DDD0] hover:border-[#713C3C] text-left text-xs transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#282522]">{res.name}</div>
                        <div className="text-[11px] text-[#6B635D]">{res.locationName}</div>
                      </div>
                      <Plus className="w-4 h-4 text-[#713C3C]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Monument Catalog Selector */}
            <div className="space-y-2 pt-2 border-t border-[#E4DDD0]">
              <span className="text-[10px] font-bold text-[#713C3C] uppercase tracking-wider">
                Or Select from 17 Verified National Heritage Sites
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {monuments.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleAddMonument(m)}
                    className="p-2.5 rounded-xl bg-white border border-[#E4DDD0] hover:border-[#713C3C] hover:bg-[#FAF4E5] text-left text-xs transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-[#282522] truncate">{m.name}</div>
                      <div className="text-[10px] text-[#6B635D] truncate">
                        {m.location}, {m.state}
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-[#B18A55] group-hover:text-[#713C3C] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-[#E4DDD0] text-xs font-bold text-[#282522] hover:bg-[#D4C8B5] transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
