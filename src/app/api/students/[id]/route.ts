import { NextRequest, NextResponse } from "next/server";
import {
  handleDeleteStudent,
  handleGetStudentById,
  handleUpdateStudent,
} from "@/controllers/studentController";

function parseId(id: string): number | null {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (id === null) {
    return NextResponse.json(
      { message: "Invalid student id" },
      { status: 400 },
    );
  }

  const result = await handleGetStudentById(id);
  return NextResponse.json(result.body, { status: result.status });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (id === null) {
    return NextResponse.json(
      { message: "Invalid student id" },
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

  const result = await handleUpdateStudent(id, body);
  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (id === null) {
    return NextResponse.json(
      { message: "Invalid student id" },
      { status: 400 },
    );
  }

  const result = await handleDeleteStudent(id);
  return NextResponse.json(result.body, { status: result.status });
}
