import { NextRequest, NextResponse } from "next/server";
import { handleUpdateInternshipApplicationStatus } from "@/controllers/internshipController";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ studentId: string; internshipId: string }> },
) {
  const { studentId, internshipId } = await params;

  const studentIdNum = parseInt(studentId, 10);
  if (isNaN(studentIdNum)) {
    return NextResponse.json(
      { message: "Invalid student ID" },
      { status: 400 },
    );
  }

  const internshipIdNum = parseInt(internshipId, 10);
  if (isNaN(internshipIdNum)) {
    return NextResponse.json(
      { message: "Invalid internship ID" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const result = await handleUpdateInternshipApplicationStatus(
      studentIdNum,
      internshipIdNum,
      body,
    );
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }
}
