import { NextRequest, NextResponse } from "next/server";
import { handleGetUniversityById } from "@/controllers/institutionController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const idNum = parseInt(id, 10);

  if (isNaN(idNum)) {
    return NextResponse.json(
      { message: "Invalid university ID" },
      { status: 400 },
    );
  }

  const result = await handleGetUniversityById(idNum);
  return NextResponse.json(result.body, { status: result.status });
}
