import { NextRequest, NextResponse } from "next/server";
import { handleGetFinalEvaluationsByStudentId } from "@/controllers/finalEvaluationController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const studentId = parseInt(id, 10);

  if (isNaN(studentId)) {
    return NextResponse.json(
      { message: "Invalid student ID" },
      { status: 400 },
    );
  }

  const result = await handleGetFinalEvaluationsByStudentId(studentId);
  return NextResponse.json(result.body, { status: result.status });
}
