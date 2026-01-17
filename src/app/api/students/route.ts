import { NextRequest, NextResponse } from "next/server";
import {
  handleCreateStudent,
  handleGetAllStudents,
} from "@/controllers/studentController";

export async function GET() {
  const result = await handleGetAllStudents();
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

  const result = await handleCreateStudent(body);
  return NextResponse.json(result.body, { status: result.status });
}

