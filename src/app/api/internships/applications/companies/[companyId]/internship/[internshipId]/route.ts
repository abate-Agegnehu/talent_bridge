import { NextRequest, NextResponse } from "next/server";
import { handleGetInternshipApplicationsByCompanyIdAndInternshipId } from "@/controllers/internshipController";

export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ companyId: string; internshipId: string }> },
) {
  const { companyId, internshipId } = await params;

  const companyIdNum = parseInt(companyId, 10);
  if (isNaN(companyIdNum)) {
    return NextResponse.json({ message: "Invalid company ID" }, { status: 400 });
  }

  const internshipIdNum = parseInt(internshipId, 10);
  if (isNaN(internshipIdNum)) {
    return NextResponse.json(
      { message: "Invalid internship ID" },
      { status: 400 },
    );
  }

  const result = await handleGetInternshipApplicationsByCompanyIdAndInternshipId(
    companyIdNum,
    internshipIdNum,
  );
  return NextResponse.json(result.body, { status: result.status });
}

