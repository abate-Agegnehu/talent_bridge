import { NextRequest, NextResponse } from "next/server";
import { handleGetAdvisorsByStudentId } from "@/controllers/institutionController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const studentIdNum = parseInt(id, 10);

  if (isNaN(studentIdNum)) {
    return NextResponse.json(
      { message: "Invalid student ID" },
      { status: 400 },
    );
  }

  const result = await handleGetAdvisorsByStudentId(studentIdNum);
  return NextResponse.json(result.body, { status: result.status });
}

