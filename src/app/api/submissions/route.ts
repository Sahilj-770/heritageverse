import { NextResponse } from "next/server";
import { SAMPLE_COMMUNITY_SUBMISSIONS } from "@/data/sampleData";
import { CommunitySubmission, UserRole } from "@/types/heritage";

// In-memory runtime persistence fallback
const runtimeSubmissions: CommunitySubmission[] = [...SAMPLE_COMMUNITY_SUBMISSIONS];

type SubmissionType = CommunitySubmission["type"];

const ALLOWED_TYPES: SubmissionType[] = [
  "story",
  "photograph",
  "oral_history",
  "correction",
];

const ALLOWED_ROLES: UserRole[] = ["visitor", "contributor", "admin"];

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
    total: runtimeSubmissions.length,
    data: runtimeSubmissions,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = sanitizeText(body.title, 200);
    const content = sanitizeText(body.content, 10000);
    const monumentName = sanitizeText(body.monumentName, 150);
    const type = body.type as SubmissionType;
    const userRole = (body.userRole || "visitor") as UserRole;
    const userName = sanitizeText(body.userName || "Heritage Enthusiast", 100);
    const userId = sanitizeText(body.userId || "usr-anon", 50);
    const monumentId = sanitizeText(body.monumentId || "m-general", 50);
    const mediaAttribution = sanitizeText(body.mediaAttribution, 200);
    const mediaUrl = sanitizeUrl(body.mediaUrl);

    if (!title || !content || !monumentName) {
      return NextResponse.json(
        { error: "Title, content, and monument name are required." },
        { status: 400 }
      );
    }

    const safeType: SubmissionType = ALLOWED_TYPES.includes(type) ? type : "story";
    const safeRole: UserRole = ALLOWED_ROLES.includes(userRole) ? userRole : "visitor";

    const newSubmission: CommunitySubmission = {
      id: "sub-" + Date.now(),
      userId,
      userName,
      userRole: safeRole,
      monumentId,
      monumentName,
      type: safeType,
      title,
      content,
      mediaUrl,
      mediaAttribution: mediaAttribution || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    runtimeSubmissions.unshift(newSubmission);

    return NextResponse.json(
      {
        success: true,
        data: newSubmission,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON submission payload." },
      { status: 400 }
    );
  }
}
