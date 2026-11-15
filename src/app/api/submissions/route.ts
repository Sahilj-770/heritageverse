import { NextResponse } from "next/server";
import { SAMPLE_COMMUNITY_SUBMISSIONS } from "@/data/sampleData";
import { CommunitySubmission } from "@/types/heritage";

// In-memory runtime persistence fallback
const runtimeSubmissions: CommunitySubmission[] = [...SAMPLE_COMMUNITY_SUBMISSIONS];

export async function GET() {
  return NextResponse.json({
    total: runtimeSubmissions.length,
    data: runtimeSubmissions,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.content || !body.monumentName) {
      return NextResponse.json(
        { error: "Title, content, and monument name are required." },
        { status: 400 }
      );
    }

    const newSubmission: CommunitySubmission = {
      id: "sub-" + Date.now(),
      userId: body.userId || "usr-anon",
      userName: body.userName || "Heritage Enthusiast",
      userRole: body.userRole || "visitor",
      monumentId: body.monumentId || "m-general",
      monumentName: body.monumentName,
      type: body.type || "story",
      title: body.title,
      content: body.content,
      mediaUrl: body.mediaUrl,
      mediaAttribution: body.mediaAttribution,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    runtimeSubmissions.unshift(newSubmission);

    return NextResponse.json({
      success: true,
      data: newSubmission,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON submission payload." },
      { status: 400 }
    );
  }
}
