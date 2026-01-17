import { NextRequest, NextResponse } from "next/server";
import { handleCreateCollege } from "@/controllers/institutionController";

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

  const result = await handleCreateCollege(body);
  return NextResponse.json(result.body, { status: result.status });
}

