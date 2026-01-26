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
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON body", details: (error as Error).message },
      { status: 400 },
    );
  }

  const result = await handleAssignAdvisorToStudent(advisorIdNum, body);
  return NextResponse.json(result.body, { status: result.status });
}

