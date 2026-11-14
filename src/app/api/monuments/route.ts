import { NextResponse } from "next/server";
import { SAMPLE_MONUMENTS } from "@/data/sampleData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const state = searchParams.get("state");
  const category = searchParams.get("category");
  const q = searchParams.get("q") || searchParams.get("search");
  const featured = searchParams.get("featured");

  let results = [...SAMPLE_MONUMENTS];

  if (region && region !== "All") {
    results = results.filter((m) => m.region === region);
  }

  if (state && state !== "All") {
    results = results.filter((m) => m.state.toLowerCase() === state.toLowerCase());
  }

  if (category && category !== "All") {
    results = results.filter((m) => m.category === category);
  }

  if (featured === "true") {
    results = results.filter((m) => m.featured);
  }

  if (q) {
    const term = q.toLowerCase();
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        (m.vernacularName && m.vernacularName.toLowerCase().includes(term)) ||
        m.location.toLowerCase().includes(term) ||
        m.district.toLowerCase().includes(term) ||
        m.state.toLowerCase().includes(term) ||
        m.architecturalStyle.toLowerCase().includes(term) ||
        m.shortDescription.toLowerCase().includes(term)
    );
  }

  return NextResponse.json({
    total: results.length,
    data: results,
  });
}
