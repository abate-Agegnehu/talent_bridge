import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { createMessage, MessagePayload } from "@/services/messageService";

let io: SocketIOServer | null = null;

export function initializeSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Configure this properly for production
      methods: ["GET", "POST"],
    },
    path: "/api/socket.io",
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user's personal room based on userId
    socket.on("join", (userId: number) => {
      if (typeof userId === "number" && userId > 0) {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined room: user_${userId}`);
      }
    });

    // Handle sending a message
    socket.on("send_message", async (data: MessagePayload) => {
      try {
        // Create message in database
        const message = await createMessage(data);

        // Emit to sender's room
        io?.to(`user_${data.senderId}`).emit("message_sent", message);

        // Emit to receiver's room
        io?.to(`user_${data.receiverId}`).emit("new_message", message);

        // Emit confirmation back to sender
        socket.emit("message_delivered", {
          messageId: message.id,
          status: "delivered",
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", {
          error: (error as Error).message || "Failed to send message",
        });
      }
    });

    // Handle typing indicator
    socket.on("typing_start", (data: { senderId: number; receiverId: number }) => {
      io?.to(`user_${data.receiverId}`).emit("user_typing", {
        senderId: data.senderId,
        isTyping: true,
      });
    });

    socket.on("typing_stop", (data: { senderId: number; receiverId: number }) => {
      io?.to(`user_${data.receiverId}`).emit("user_typing", {
        senderId: data.senderId,
        isTyping: false,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}
