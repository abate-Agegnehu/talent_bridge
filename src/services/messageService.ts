import prisma from "@/lib/prisma";
import { MessageType } from "@/generated/prisma/enums";

export type MessagePayload = {
  senderId: number;
  receiverId: number;
  messageType?: MessageType;
  text?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  fileSize?: number | null;
};

export async function createMessage(payload: MessagePayload) {
  // Verify sender exists
  const sender = await prisma.user.findUnique({
    where: { id: payload.senderId },
    select: { id: true },
  });

  if (!sender) {
    throw new Error(`Sender with id ${payload.senderId} does not exist`);
  }

  // Verify receiver exists
  const receiver = await prisma.user.findUnique({
    where: { id: payload.receiverId },
    select: { id: true },
  });

  if (!receiver) {
    throw new Error(`Receiver with id ${payload.receiverId} does not exist`);
  }

  // Determine message type if not provided
  let messageType = payload.messageType;
  if (!messageType) {
    const hasText = payload.text && payload.text.trim().length > 0;
    const hasFile = payload.fileUrl && payload.fileUrl.trim().length > 0;
    
    if (hasText && hasFile) {
      messageType = MessageType.TEXT_AND_FILE;
    } else if (hasFile) {
      messageType = MessageType.FILE;
    } else if (hasText) {
      messageType = MessageType.TEXT;
    } else {
      // Default to TEXT if neither is provided (shouldn't happen due to validation)
      messageType = MessageType.TEXT;
    }
  }

  return prisma.message.create({
    data: {
      senderId: payload.senderId,
      receiverId: payload.receiverId,
      messageType: messageType,
      text: payload.text ?? null,
      fileUrl: payload.fileUrl ?? null,
      fileName: payload.fileName ?? null,
      fileType: payload.fileType ?? null,
      fileSize: payload.fileSize ?? null,
      isRead: false,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function getMessagesBySenderAndReceiver(
  senderId: number,
  receiverId: number,
) {
  // Verify both users exist
  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: { id: true },
  });

  if (!sender) {
    throw new Error(`Sender with id ${senderId} does not exist`);
  }

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: { id: true },
  });

  if (!receiver) {
    throw new Error(`Receiver with id ${receiverId} does not exist`);
  }

  // Get messages in both directions (conversation)
  return prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: senderId,
          receiverId: receiverId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function markMessageAsRead(messageId: string, userId: number) {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: { receiverId: true, isRead: true },
  });

  if (!message) {
    throw new Error(`Message with id ${messageId} does not exist`);
  }

  if (message.receiverId !== userId) {
    throw new Error("You can only mark messages sent to you as read");
  }

  if (message.isRead) {
    return prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  return prisma.message.update({
    where: { id: messageId },
    data: {
      isRead: true,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function markAllMessagesAsReadByReceiverId(receiverId: number) {
  // Verify receiver exists
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: { id: true },
  });

  if (!receiver) {
    throw new Error(`Receiver with id ${receiverId} does not exist`);
  }

  // Update all unread messages for this receiver
  const result = await prisma.message.updateMany({
    where: {
      receiverId: receiverId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  // Return the count of updated messages
  return {
    receiverId: receiverId,
    updatedCount: result.count,
    messages: await prisma.message.findMany({
      where: {
        receiverId: receiverId,
        isRead: true,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to last 50 messages
    }),
  };
}

export async function countUnreadMessagesByReceiverId(receiverId: number) {
  // Verify receiver exists
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: { id: true },
  });

  if (!receiver) {
    throw new Error(`Receiver with id ${receiverId} does not exist`);
  }

  // Count unread messages
  const count = await prisma.message.count({
    where: {
      receiverId: receiverId,
      isRead: false,
    },
  });

  // Optionally get unread messages grouped by sender
  const unreadBySender = await prisma.message.groupBy({
    by: ["senderId"],
    where: {
      receiverId: receiverId,
      isRead: false,
    },
    _count: {
      id: true,
    },
  });

  // Get sender details for each group
  const unreadBySenderWithDetails = await Promise.all(
    unreadBySender.map(async (group) => {
      const sender = await prisma.user.findUnique({
        where: { id: group.senderId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return {
        sender: sender,
        unreadCount: group._count.id,
      };
    }),
  );

  return {
    receiverId: receiverId,
    totalUnread: count,
    unreadBySender: unreadBySenderWithDetails,
  };
}
