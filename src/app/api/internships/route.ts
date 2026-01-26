import { NextRequest, NextResponse } from "next/server";
import {
  handleCreateInternship,
  handleGetAllInternships,
} from "@/controllers/internshipController";

export async function GET() {
  const result = await handleGetAllInternships();
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

  const result = await handleCreateInternship(body);
  return NextResponse.json(result.body, { status: result.status });
}
