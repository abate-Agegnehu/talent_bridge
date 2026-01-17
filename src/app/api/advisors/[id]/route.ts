import { NextRequest, NextResponse } from "next/server";
import {
  handleDeleteAdvisor,
  handleGetAdvisorById,
  handleUpdateAdvisor,
} from "@/controllers/institutionController";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const advisorId = parseInt(id, 10);

  if (isNaN(advisorId)) {
    return NextResponse.json(
      { message: "Invalid advisor ID" },
      { status: 400 },
    );
  }

  const result = await handleGetAdvisorById(advisorId);
  return NextResponse.json(result.body, { status: result.status });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const advisorId = parseInt(id, 10);

  if (isNaN(advisorId)) {
    return NextResponse.json(
      { message: "Invalid advisor ID" },
      { status: 400 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const result = await handleUpdateAdvisor(advisorId, body);
  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const advisorId = parseInt(id, 10);

  if (isNaN(advisorId)) {
    return NextResponse.json(
      { message: "Invalid advisor ID" },
      { status: 400 },
    );
  }

  const result = await handleDeleteAdvisor(advisorId);
  return NextResponse.json(result.body, { status: result.status });
}
