import { NextResponse } from "next/server";
import { SAMPLE_MONUMENTS, SAMPLE_COMMUNITY_SUBMISSIONS, SAMPLE_CONSERVATION_REPORTS } from "@/data/sampleData";

export async function GET() {
  const states = Array.from(new Set(SAMPLE_MONUMENTS.map((m) => m.state)));
  const regions = Array.from(new Set(SAMPLE_MONUMENTS.map((m) => m.region)));
  const categories = Array.from(new Set(SAMPLE_MONUMENTS.map((m) => m.category)));
  const totalTours = SAMPLE_MONUMENTS.filter((m) => m.tourScenes && m.tourScenes.length > 0).length;

  return NextResponse.json({
    monumentsCount: SAMPLE_MONUMENTS.length,
    statesCount: states.length,
    regionsCount: regions.length,
    categoriesCount: categories.length,
    virtualToursCount: totalTours,
    communitySubmissionsCount: SAMPLE_COMMUNITY_SUBMISSIONS.length,
    conservationReportsCount: SAMPLE_CONSERVATION_REPORTS.length,
    statesList: states,
    regionsList: regions,
  });
}
