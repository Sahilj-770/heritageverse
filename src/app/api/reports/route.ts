import { NextResponse } from "next/server";
import { SAMPLE_CONSERVATION_REPORTS } from "@/data/sampleData";
import { ConservationReport } from "@/types/heritage";

// In-memory runtime persistence fallback
const runtimeReports: ConservationReport[] = [...SAMPLE_CONSERVATION_REPORTS];

type ReportCategory = ConservationReport["category"];
type ReportSeverity = ConservationReport["severity"];

const ALLOWED_CATEGORIES: ReportCategory[] = [
  "weathering",
  "vandalism",
  "pollution",
  "structural_crack",
  "vegetation_overgrowth",
  "neglect",
];

const ALLOWED_SEVERITIES: ReportSeverity[] = ["low", "medium", "high", "urgent"];

function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, maxLength);
}

function sanitizeUrl(input: unknown): string | undefined {
  if (typeof input !== "string") return undefined;
  const trimmed = input.trim();
  if (trimmed.length > 2048) return undefined;
  if (/^https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/i.test(trimmed) || /^data:image\/[a-z]+;base64,/i.test(trimmed)) {
    return trimmed;
  }
  return undefined;
}

export async function GET() {
  return NextResponse.json({
    total: runtimeReports.length,
    data: runtimeReports,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const monumentName = sanitizeText(body.monumentName, 150);
    const description = sanitizeText(body.description, 3000);
    const category = body.category as ReportCategory;
    const severity = (body.severity || "medium") as ReportSeverity;
    const areaLocation = sanitizeText(body.areaLocation || "Site Perimeter", 150);
    const userName = sanitizeText(body.userName || "Citizen Observer", 100);
    const userId = sanitizeText(body.userId || "usr-anon", 50);
    const monumentId = sanitizeText(body.monumentId || "m-general", 50);
    const photoUrl = sanitizeUrl(body.photoUrl);

    if (!description || !monumentName || !category) {
      return NextResponse.json(
        { error: "Description, monument name, and category are required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    const safeSeverity: ReportSeverity = ALLOWED_SEVERITIES.includes(severity) ? severity : "medium";

    const newReport: ConservationReport = {
      id: "rep-" + Date.now(),
      userId,
      userName,
      monumentId,
      monumentName,
      category,
      severity: safeSeverity,
      description,
      areaLocation,
      photoUrl,
      dateObserved: new Date().toISOString().split("T")[0],
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    runtimeReports.unshift(newReport);

    return NextResponse.json(
      {
        success: true,
        data: newReport,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON report payload." },
      { status: 400 }
    );
  }
}
