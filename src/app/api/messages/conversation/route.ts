import { NextRequest, NextResponse } from "next/server";
import { handleGetMessagesBySenderAndReceiver } from "@/controllers/messageController";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const senderId = searchParams.get("senderId");
  const receiverId = searchParams.get("receiverId");

  if (!senderId || !receiverId) {
    return NextResponse.json(
      { message: "Both senderId and receiverId query parameters are required" },
      { status: 400 },
    );
  }

  const senderIdNum = parseInt(senderId, 10);
  const receiverIdNum = parseInt(receiverId, 10);

  if (isNaN(senderIdNum) || isNaN(receiverIdNum)) {
    return NextResponse.json(
      { message: "senderId and receiverId must be valid numbers" },
      { status: 400 },
    );
  }

  const result = await handleGetMessagesBySenderAndReceiver(
    senderIdNum,
    receiverIdNum,
  );
  return NextResponse.json(result.body, { status: result.status });
}
