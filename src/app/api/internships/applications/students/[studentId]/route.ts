import { NextRequest, NextResponse } from "next/server";
import { handleGetInternshipApplicationsByStudentId } from "@/controllers/internshipController";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> },
) {
  const { studentId } = await params;
  const studentIdNum = parseInt(studentId, 10);

  if (isNaN(studentIdNum)) {
    return NextResponse.json(
      { message: "Invalid student ID" },
      { status: 400 },
    );
  }

  const result = await handleGetInternshipApplicationsByStudentId(studentIdNum);
  return NextResponse.json(result.body, { status: result.status });
}
