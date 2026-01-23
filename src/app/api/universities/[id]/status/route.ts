import { NextRequest, NextResponse } from "next/server";
import { handleUpdateUniversityStatus } from "@/controllers/institutionController";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const universityId = parseInt(id, 10);

  if (isNaN(universityId)) {
    return NextResponse.json(
      { message: "Invalid university ID" },
      { status: 400 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const result = await handleUpdateUniversityStatus(universityId, body);
  return NextResponse.json(result.body, { status: result.status });
}
