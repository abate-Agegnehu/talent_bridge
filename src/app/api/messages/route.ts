import { NextRequest, NextResponse } from "next/server";
import { handleCreateMessage } from "@/controllers/messageController";

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

  const result = await handleCreateMessage(body);
  return NextResponse.json(result.body, { status: result.status });
}
