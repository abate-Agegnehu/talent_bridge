import { NextRequest, NextResponse } from "next/server";
import { handleUpdateUniversityStatus } from "@/controllers/institutionController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const idNum = parseInt(id, 10);

  if (isNaN(idNum)) {
    return NextResponse.json(
      { message: "Invalid university ID" },
      { status: 400 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON body", details: (error as Error).message },
      { status: 400 },
    );
  }

  const result = await handleUpdateUniversityStatus(idNum, body);
  return NextResponse.json(result.body, { status: result.status });
}
