import { NextRequest, NextResponse } from "next/server";
import { handleGetApprovedAdvisorsByDepartmentId } from "@/controllers/institutionController";

type RouteParams = {
  params: Promise<{ departmentId: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { departmentId } = await params;
  const departmentIdNum = parseInt(departmentId, 10);

  if (isNaN(departmentIdNum)) {
    return NextResponse.json(
      { message: "Invalid department ID" },
      { status: 400 },
    );
  }

  const result = await handleGetApprovedAdvisorsByDepartmentId(
    departmentIdNum,
  );
  return NextResponse.json(result.body, { status: result.status });
}

