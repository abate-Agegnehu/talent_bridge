import { NextRequest, NextResponse } from "next/server";
import {
  handleCreateAdvisor,
  handleGetAllAdvisors,
} from "@/controllers/institutionController";

export async function GET() {
  const result = await handleGetAllAdvisors();
  return NextResponse.json(result.body, { status: result.status });
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid JSON body", details: (error as Error).message },
      { status: 400 },
    );
  }

  const result = await handleCreateAdvisor(body);
  return NextResponse.json(result.body, { status: result.status });
}
