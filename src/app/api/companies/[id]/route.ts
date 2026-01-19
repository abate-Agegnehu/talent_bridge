import { NextRequest, NextResponse } from "next/server";
import {
  handleDeleteCompany,
  handleGetCompanyById,
  handleUpdateCompany,
} from "@/controllers/companyController";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const companyId = parseInt(id, 10);

  if (isNaN(companyId)) {
    return NextResponse.json(
      { message: "Invalid company ID" },
      { status: 400 },
    );
  }

  const result = await handleGetCompanyById(companyId);
  return NextResponse.json(result.body, { status: result.status });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const companyId = parseInt(id, 10);

  if (isNaN(companyId)) {
    return NextResponse.json(
      { message: "Invalid company ID" },
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

  const result = await handleUpdateCompany(companyId, body);
  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const companyId = parseInt(id, 10);

  if (isNaN(companyId)) {
    return NextResponse.json(
      { message: "Invalid company ID" },
      { status: 400 },
    );
  }

  const result = await handleDeleteCompany(companyId);
  return NextResponse.json(result.body, { status: result.status });
}
