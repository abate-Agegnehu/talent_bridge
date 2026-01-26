import { NextRequest, NextResponse } from "next/server";
import {
  handleCreateStudent,
  handleGetAllStudents,
} from "@/controllers/studentController";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const universityId = searchParams.get("universityId");
  const collegeId = searchParams.get("collegeId");
  const departmentId = searchParams.get("departmentId");

  // Parse query parameters
  const universityIdNum =
    universityId !== null ? parseInt(universityId, 10) : undefined;
  const collegeIdNum =
    collegeId !== null ? parseInt(collegeId, 10) : undefined;
  const departmentIdNum =
    departmentId !== null ? parseInt(departmentId, 10) : undefined;

  // Validate that parsed values are valid numbers if provided
  if (
    (universityId !== null && isNaN(universityIdNum!)) ||
    (collegeId !== null && isNaN(collegeIdNum!)) ||
    (departmentId !== null && isNaN(departmentIdNum!))
  ) {
    return NextResponse.json(
      { message: "Invalid query parameters. IDs must be numbers." },
      { status: 400 },
    );
  }

  const result = await handleGetAllStudents(
    universityIdNum,
    collegeIdNum,
    departmentIdNum,
  );
  return NextResponse.json(result.body, { status: result.status });
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const result = await handleCreateStudent(body);
  return NextResponse.json(result.body, { status: result.status });
}

