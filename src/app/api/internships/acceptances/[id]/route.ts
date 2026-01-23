import { NextRequest, NextResponse } from "next/server";
import { handleUpdateInternshipAcceptanceDepartment } from "@/controllers/internshipAcceptanceController";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const acceptanceId = parseInt(id, 10);

  if (isNaN(acceptanceId)) {
    return NextResponse.json(
      { message: "Invalid acceptance ID" },
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

  const result = await handleUpdateInternshipAcceptanceDepartment(acceptanceId, body);
  return NextResponse.json(result.body, { status: result.status });
}
