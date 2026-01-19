import { NextRequest, NextResponse } from "next/server";
import { handleGetDepartmentById } from "@/controllers/institutionController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const idNum = parseInt(id, 10);

  if (isNaN(idNum)) {
    return NextResponse.json(
      { message: "Invalid department ID" },
      { status: 400 },
    );
  }

  const result = await handleGetDepartmentById(idNum);
  return NextResponse.json(result.body, { status: result.status });
}
