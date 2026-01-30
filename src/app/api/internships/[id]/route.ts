import { NextRequest, NextResponse } from "next/server";
import {
  handleDeleteInternship,
  handleUpdateInternship,
} from "@/controllers/internshipController";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const internshipId = parseInt(id, 10);

  if (isNaN(internshipId)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        company: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        applications: {
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            }
                        }
                    }
                }
            }
        }
      },
    });

    if (!internship) {
      return NextResponse.json(
        { message: "Internship not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(internship);
  } catch (error) {
    console.error("Error fetching internship:", error);
    return NextResponse.json(
      { message: "Failed to fetch internship" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const internshipId = parseInt(id, 10);

  if (isNaN(internshipId)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const result = await handleUpdateInternship(internshipId, body);
  return NextResponse.json(result.body, { status: result.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const internshipId = parseInt(id, 10);

  if (isNaN(internshipId)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const result = await handleDeleteInternship(internshipId);
  return NextResponse.json(result.body, { status: result.status });
}
