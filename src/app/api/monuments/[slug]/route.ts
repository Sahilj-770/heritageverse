import { NextResponse } from "next/server";
import { SAMPLE_MONUMENTS } from "@/data/sampleData";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const monument = SAMPLE_MONUMENTS.find((m) => m.slug === slug);

  if (!monument) {
    return NextResponse.json(
      { error: "Monument not found in national archive", slug },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: monument,
  });
}
