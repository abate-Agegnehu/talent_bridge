import { NextRequest, NextResponse } from "next/server";
import { handleUpdateTestProjectSubmission } from "@/controllers/testProjectController";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  if (isNaN(projectId)) {
    return NextResponse.json(
      { message: "Invalid project ID" },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const result = await handleUpdateTestProjectSubmission(projectId, body);
  return NextResponse.json(result.body, { status: result.status });
}
