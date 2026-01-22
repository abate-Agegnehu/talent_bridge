import { NextRequest, NextResponse } from "next/server";
import { handleAssignAdvisorToStudent } from "@/controllers/institutionController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const advisorIdNum = parseInt(id, 10);

  if (isNaN(advisorIdNum)) {
    return NextResponse.json(
      { message: "Invalid advisor ID" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const result = await handleAssignAdvisorToStudent(advisorIdNum, body);
  return NextResponse.json(result.body, { status: result.status });
}

