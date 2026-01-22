import { NextRequest, NextResponse } from "next/server";
import { handleGetStudentsByAdvisorId } from "@/controllers/institutionController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const advisorIdNum = parseInt(id, 10);

  if (isNaN(advisorIdNum)) {
    return NextResponse.json(
      { message: "Invalid advisor ID" },
      { status: 400 },
    );
  }

  const result = await handleGetStudentsByAdvisorId(advisorIdNum);
  return NextResponse.json(result.body, { status: result.status });
}

