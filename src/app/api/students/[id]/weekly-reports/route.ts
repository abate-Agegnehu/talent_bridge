import { NextRequest, NextResponse } from "next/server";
import { handleGetWeeklyReportsByStudentId } from "@/controllers/weeklyReportController";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const studentId = parseInt(id, 10);

  if (isNaN(studentId)) {
    return NextResponse.json(
      { message: "Invalid student ID" },
      { status: 400 },
    );
  }

  const result = await handleGetWeeklyReportsByStudentId(studentId);
  return NextResponse.json(result.body, { status: result.status });
}
