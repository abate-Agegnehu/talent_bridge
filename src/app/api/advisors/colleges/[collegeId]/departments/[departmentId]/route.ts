import { NextRequest, NextResponse } from "next/server";
import { handleGetAdvisorsByCollegeAndDepartmentId } from "@/controllers/institutionController";

type RouteParams = {
  params: Promise<{ collegeId: string; departmentId: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { collegeId, departmentId } = await params;

  const collegeIdNum = parseInt(collegeId, 10);
  const departmentIdNum = parseInt(departmentId, 10);

  if (isNaN(collegeIdNum) || isNaN(departmentIdNum)) {
    return NextResponse.json(
      { message: "Invalid collegeId or departmentId" },
      { status: 400 },
    );
  }

  const result = await handleGetAdvisorsByCollegeAndDepartmentId(
    collegeIdNum,
    departmentIdNum,
  );

  return NextResponse.json(result.body, { status: result.status });
}
