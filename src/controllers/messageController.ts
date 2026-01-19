import {
  createMessage,
  getMessagesBySenderAndReceiver,
  markMessageAsRead,
  markAllMessagesAsReadByReceiverId,
  countUnreadMessagesByReceiverId,
  MessagePayload,
} from "@/services/messageService";
import { MessageType } from "@/generated/prisma/enums";

type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

type ValidationResult = {
  valid: boolean;
  message?: string;
};

function validateMessagePayload(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const value = payload as Record<string, unknown>;
  const senderId = value.senderId;
  const receiverId = value.receiverId;
  const messageType = value.messageType;
  const text = value.text;
  const fileUrl = value.fileUrl;

  if (
    typeof senderId !== "number" ||
    !Number.isInteger(senderId) ||
    senderId <= 0
  ) {
    return { valid: false, message: "senderId must be a positive integer" };
  }

  if (
    typeof receiverId !== "number" ||
    !Number.isInteger(receiverId) ||
    receiverId <= 0
  ) {
    return { valid: false, message: "receiverId must be a positive integer" };
  }

  if (senderId === receiverId) {
    return {
      valid: false,
      message: "senderId and receiverId cannot be the same",
    };
  }

  // Validate messageType if provided
  if (
    messageType !== undefined &&
    !Object.values(MessageType).includes(messageType as MessageType)
  ) {
    return {
      valid: false,
      message: `messageType must be one of: ${Object.values(MessageType).join(", ")}`,
    };
  }

  // At least text or fileUrl must be provided
  if (
    (text === undefined || text === null || (typeof text === "string" && text.trim().length === 0)) &&
    (fileUrl === undefined || fileUrl === null || (typeof fileUrl === "string" && fileUrl.trim().length === 0))
  ) {
    return {
      valid: false,
      message: "Either text or fileUrl must be provided",
    };
  }

  return { valid: true };
}

export async function handleCreateMessage(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateMessagePayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const message = await createMessage(payload as MessagePayload);
    return { status: 201, body: message };
  } catch (error) {
    console.error("Error creating message:", error);

    const errorMessage = (error as Error).message;
    const errorCode = (error as { code?: string }).code;
    const errorName = (error as Error).name;
    
    // Handle database connection errors
    if (
      errorName === "PrismaClientInitializationError" ||
      errorMessage?.includes("Can't reach database server") ||
      errorMessage?.includes("connection") ||
      errorCode === "P1001"
    ) {
      return {
        status: 503,
        body: { 
          message: "Database connection error. Please check your database connection and try again.",
          error: "Database unavailable"
        },
      };
    }

    if (errorMessage?.includes("does not exist")) {
      return {
        status: 404,
        body: { message: errorMessage },
      };
    }

    // Handle Prisma errors
    if (errorCode === "P2002") {
      return {
        status: 409,
        body: { message: "Message already exists" },
      };
    }

    if (errorCode === "P2003") {
      return {
        status: 400,
        body: { message: "Invalid senderId or receiverId reference" },
      };
    }

    // Return more detailed error message
    return {
      status: 500,
      body: { 
        message: errorMessage || "Failed to create message",
        error: errorCode || errorName || "Unknown error",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
    };
  }
}

export async function handleGetMessagesBySenderAndReceiver(
  senderId: number,
  receiverId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const messages = await getMessagesBySenderAndReceiver(senderId, receiverId);
    return { status: 200, body: messages };
  } catch (error) {
    console.error("Error fetching messages:", error);

    const errorMessage = (error as Error).message;
    if (errorMessage?.includes("does not exist")) {
      return {
        status: 404,
        body: { message: errorMessage },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to fetch messages" },
    };
  }
}

export async function handleMarkMessageAsRead(
  messageId: string,
  userId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const message = await markMessageAsRead(messageId, userId);
    return { status: 200, body: message };
  } catch (error) {
    console.error("Error marking message as read:", error);

    const errorMessage = (error as Error).message;
    if (errorMessage?.includes("does not exist")) {
      return {
        status: 404,
        body: { message: errorMessage },
      };
    }

    if (errorMessage?.includes("can only mark")) {
      return {
        status: 403,
        body: { message: errorMessage },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to mark message as read" },
    };
  }
}

export async function handleMarkAllMessagesAsReadByReceiverId(
  receiverId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const result = await markAllMessagesAsReadByReceiverId(receiverId);
    return { status: 200, body: result };
  } catch (error) {
    console.error("Error marking all messages as read:", error);

    const errorMessage = (error as Error).message;
    if (errorMessage?.includes("does not exist")) {
      return {
        status: 404,
        body: { message: errorMessage },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to mark all messages as read" },
    };
  }
}

export async function handleCountUnreadMessagesByReceiverId(
  receiverId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const result = await countUnreadMessagesByReceiverId(receiverId);
    return { status: 200, body: result };
  } catch (error) {
    console.error("Error counting unread messages:", error);

    const errorMessage = (error as Error).message;
    if (errorMessage?.includes("does not exist")) {
      return {
        status: 404,
        body: { message: errorMessage },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to count unread messages" },
    };
  }
}
