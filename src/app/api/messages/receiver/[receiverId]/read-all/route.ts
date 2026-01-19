import { NextRequest, NextResponse } from "next/server";
import { handleMarkAllMessagesAsReadByReceiverId } from "@/controllers/messageController";

type RouteParams = {
  params: Promise<{ receiverId: string }>;
};

export async function PUT(_request: NextRequest, { params }: RouteParams) {
  const { receiverId } = await params;
  const receiverIdNum = parseInt(receiverId, 10);

  if (isNaN(receiverIdNum) || receiverIdNum <= 0) {
    return NextResponse.json(
      { message: "Invalid receiver ID" },
      { status: 400 },
    );
  }

  const result = await handleMarkAllMessagesAsReadByReceiverId(receiverIdNum);
  return NextResponse.json(result.body, { status: result.status });
}
