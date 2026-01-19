const { Server: SocketIOServer } = require("socket.io");

let io = null;

function initializeSocket(server) {
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
    socket.on("join", (userId) => {
      if (typeof userId === "number" && userId > 0) {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined room: user_${userId}`);
      }
    });

    // Handle sending a message
    socket.on("send_message", async (data) => {
      try {
        // Dynamically import the message service (ES module)
        const { createMessage } = await import("../services/messageService.js");
        
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
          error: error?.message || "Failed to send message",
        });
      }
    });

    // Handle typing indicator
    socket.on("typing_start", (data) => {
      io?.to(`user_${data.receiverId}`).emit("user_typing", {
        senderId: data.senderId,
        isTyping: true,
      });
    });

    socket.on("typing_stop", (data) => {
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

function getIO() {
  return io;
}

module.exports = { initializeSocket, getIO };
