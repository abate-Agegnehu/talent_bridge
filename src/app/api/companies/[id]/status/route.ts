import { NextRequest, NextResponse } from "next/server";
import { handleUpdateCompanyStatus } from "@/controllers/companyController";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const companyId = parseInt(id, 10);

  if (isNaN(companyId)) {
    return NextResponse.json(
      { message: "Invalid company ID" },
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

  const result = await handleUpdateCompanyStatus(companyId, body);
  return NextResponse.json(result.body, { status: result.status });
}
