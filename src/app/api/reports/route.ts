import { NextResponse } from "next/server";
import { SAMPLE_CONSERVATION_REPORTS } from "@/data/sampleData";
import { ConservationReport } from "@/types/heritage";

// In-memory runtime persistence fallback
let runtimeReports: ConservationReport[] = [...SAMPLE_CONSERVATION_REPORTS];

export async function GET() {
  return NextResponse.json({
    total: runtimeReports.length,
    data: runtimeReports,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.description || !body.monumentName || !body.category) {
      return NextResponse.json(
        { error: "Description, monument name, and category are required." },
        { status: 400 }
      );
    }

    const newReport: ConservationReport = {
      id: "rep-" + Date.now(),
      userId: body.userId || "usr-anon",
      userName: body.userName || "Citizen Observer",
      monumentId: body.monumentId || "m-general",
      monumentName: body.monumentName,
      category: body.category,
      severity: body.severity || "medium",
      description: body.description,
      areaLocation: body.areaLocation || "Site Perimeter",
      photoUrl: body.photoUrl,
      dateObserved: body.dateObserved || new Date().toISOString().split("T")[0],
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    runtimeReports.unshift(newReport);

    return NextResponse.json({
      success: true,
      data: newReport,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON report payload." },
      { status: 400 }
    );
  }
}
