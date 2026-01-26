import { NextRequest, NextResponse } from "next/server";
import { handleUpdateTestProject } from "@/controllers/testProjectController";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idNum = parseInt(id, 10);

  if (isNaN(idNum)) {
    return NextResponse.json(
      { message: "Invalid test project ID" },
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

  const result = await handleUpdateTestProject(idNum, body);
  return NextResponse.json(result.body, { status: result.status });
}
