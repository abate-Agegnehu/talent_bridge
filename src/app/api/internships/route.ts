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
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const result = await handleCreateInternship(body);
  return NextResponse.json(result.body, { status: result.status });
}
