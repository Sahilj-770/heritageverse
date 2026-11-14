import { NextResponse } from "next/server";
import { SAMPLE_MONUMENTS } from "@/data/sampleData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const queryLower = q.toLowerCase();

  // 1. First, search verified HeritageVerse monuments
  const monumentMatches = SAMPLE_MONUMENTS.filter(
    (m) =>
      m.name.toLowerCase().includes(queryLower) ||
      m.location.toLowerCase().includes(queryLower) ||
      m.state.toLowerCase().includes(queryLower) ||
      m.district.toLowerCase().includes(queryLower)
  ).slice(0, 5).map((m) => ({
    id: `mv-${m.id}`,
    monumentId: m.id,
    monumentSlug: m.slug,
    name: m.name,
    locationName: `${m.location}, ${m.state}`,
    lat: m.coordinates.lat,
    lng: m.coordinates.lng,
    isMonument: true,
    category: m.category,
  }));

  // 2. Query Nominatim OpenStreetMap for Indian places/cities
  let osmMatches: any[] = [];
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      q
    )}&countrycodes=in&format=json&limit=5&addressdetails=1`;

    const res = await fetch(osmUrl, {
      headers: {
        "User-Agent": "HeritageVerse-App/1.0 (academic-heritage-initiative)",
      },
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      const data = await res.json();
      osmMatches = data.map((item: any) => ({
        id: `osm-${item.place_id}`,
        name: item.display_name.split(",")[0],
        locationName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        isMonument: false,
      }));
    }
  } catch {
    // Non-blocking fallback to monument matches only
  }

  // Combine and deduplicate
  const results = [...monumentMatches, ...osmMatches];

  return NextResponse.json({
    query: q,
    results,
  });
}
