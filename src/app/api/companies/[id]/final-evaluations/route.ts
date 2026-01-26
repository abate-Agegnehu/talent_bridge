import { NextRequest, NextResponse } from "next/server";
import { handleGetFinalEvaluationsByCompanyId } from "@/controllers/finalEvaluationController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const companyId = parseInt(id, 10);

  if (isNaN(companyId)) {
    return NextResponse.json(
      { message: "Invalid company ID" },
      { status: 400 },
    );
  }

  const result = await handleGetFinalEvaluationsByCompanyId(companyId);
  return NextResponse.json(result.body, { status: result.status });
}
