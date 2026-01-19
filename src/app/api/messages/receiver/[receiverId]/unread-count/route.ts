import { NextRequest, NextResponse } from "next/server";
import { handleCountUnreadMessagesByReceiverId } from "@/controllers/messageController";

type RouteParams = {
  params: Promise<{ receiverId: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { receiverId } = await params;
  const receiverIdNum = parseInt(receiverId, 10);

  if (isNaN(receiverIdNum) || receiverIdNum <= 0) {
    return NextResponse.json(
      { message: "Invalid receiver ID" },
      { status: 400 },
    );
  }

  const result = await handleCountUnreadMessagesByReceiverId(receiverIdNum);
  return NextResponse.json(result.body, { status: result.status });
}
