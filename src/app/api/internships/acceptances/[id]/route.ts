import { NextRequest, NextResponse } from "next/server";
import { handleUpdateInternshipAcceptanceDepartment } from "@/controllers/internshipAcceptanceController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const idNum = parseInt(id, 10);

  if (isNaN(idNum)) {
    return NextResponse.json(
      { message: "Invalid acceptance ID" },
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

  const result = await handleUpdateInternshipAcceptanceDepartment(idNum, body);
  return NextResponse.json(result.body, { status: result.status });
}
