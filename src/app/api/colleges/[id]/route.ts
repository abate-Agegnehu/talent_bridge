import { NextRequest, NextResponse } from "next/server";
import { handleGetCollegeById } from "@/controllers/institutionController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const idNum = parseInt(id, 10);

  if (isNaN(idNum)) {
    return NextResponse.json(
      { message: "Invalid college ID" },
      { status: 400 },
    );
  }

  const result = await handleGetCollegeById(idNum);
  return NextResponse.json(result.body, { status: result.status });
}
