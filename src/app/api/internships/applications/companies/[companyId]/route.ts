import { NextRequest, NextResponse } from "next/server";
import { handleGetInternshipApplicationsByCompanyId } from "@/controllers/internshipController";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  const { companyId } = await params;
  const companyIdNum = parseInt(companyId, 10);

  if (isNaN(companyIdNum)) {
    return NextResponse.json(
      { message: "Invalid company ID" },
      { status: 400 },
    );
  }

  const result = await handleGetInternshipApplicationsByCompanyId(companyIdNum);
  return NextResponse.json(result.body, { status: result.status });
}
