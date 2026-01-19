import { NextRequest, NextResponse } from "next/server";
import { handleMarkMessageAsRead } from "@/controllers/messageController";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
) {
  const { id } = await params;
  
  // Try to get userId from query parameter first
  const searchParams = request.nextUrl.searchParams;
  const userIdFromQuery = searchParams.get("userId");
  
  let userId: number | undefined;
  
  if (userIdFromQuery) {
    const parsed = parseInt(userIdFromQuery, 10);
    if (!isNaN(parsed) && parsed > 0) {
      userId = parsed;
    }
  }
  
  // If not in query, try request body
  if (!userId) {
    let body: unknown;
    try {
      body = await request.json();
      const { userId: userIdFromBody } = body as { userId?: number | string };
      
      if (userIdFromBody !== undefined) {
        // Handle both number and string
        const parsed = typeof userIdFromBody === "string" 
          ? parseInt(userIdFromBody, 10) 
          : userIdFromBody;
        
        if (typeof parsed === "number" && !isNaN(parsed) && parsed > 0) {
          userId = parsed;
        }
      }
    } catch {
      // If JSON parsing fails and no query param, that's okay - we'll return error below
    }
  }

  if (!userId || typeof userId !== "number" || !Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json(
      { 
        message: "userId is required. Provide it as a query parameter (?userId=1) or in the request body ({ \"userId\": 1 })",
        example: {
          query: "/api/messages/2/read?userId=1",
          body: { userId: 1 }
        }
      },
      { status: 400 },
    );
  }

  const result = await handleMarkMessageAsRead(id, userId);
  return NextResponse.json(result.body, { status: result.status });
}
