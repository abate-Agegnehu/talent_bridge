import { NextRequest, NextResponse } from "next/server";
import {
  handleCreateFinalEvaluation,
  handleGetFinalEvaluationsByCompanyId,
  handleGetFinalEvaluationsByStudentId,
} from "@/controllers/finalEvaluationController";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON body", details: (error as Error).message },
      { status: 400 },
    );
  }

  const result = await handleCreateFinalEvaluation(body);
  return NextResponse.json(result.body, { status: result.status });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const studentId = searchParams.get("studentId");
  const companyId = searchParams.get("companyId");

  if (studentId) {
    const studentIdNum = parseInt(studentId, 10);
    if (isNaN(studentIdNum)) {
      return NextResponse.json(
        { message: "Invalid student ID" },
        { status: 400 },
      );
    }
    const result = await handleGetFinalEvaluationsByStudentId(studentIdNum);
    return NextResponse.json(result.body, { status: result.status });
  }

  if (companyId) {
    const companyIdNum = parseInt(companyId, 10);
    if (isNaN(companyIdNum)) {
      return NextResponse.json(
        { message: "Invalid company ID" },
        { status: 400 },
      );
    }
    const result = await handleGetFinalEvaluationsByCompanyId(companyIdNum);
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(
    { message: "Missing studentId or companyId query parameter" },
    { status: 400 },
  );
}
