import { NextRequest, NextResponse } from "next/server";
import { handleCreateCompany } from "@/controllers/companyController";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const result = await handleCreateCompany(body);
  return NextResponse.json(result.body, { status: result.status });
}
