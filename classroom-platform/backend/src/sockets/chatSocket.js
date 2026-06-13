const prisma =
  require("../config/db");

function registerChatSocket(
  io,
  socket
) {
    socket.on(
  "chat:getMessages",
  async ({
    sessionId,
  }) => {

    try {

      const messages =
        await prisma.chatMessage.findMany({
          where: {
            sessionId,
          },

          orderBy: {
            createdAt:
              "asc",
          },
        });

      socket.emit(
        "chat:history",
        messages
      );

    } catch (error) {

      console.error(error);
    }
  }
);
socket.on(
  "chat:send",
  async ({
    sessionId,
    message,
  }) => {

    try {

      const chatMessage =
        await prisma.chatMessage.create({
          data: {

            sessionId,

            userId:
              socket.user.userId,

            email:
              socket.user.email,

            message,
          },
        });

      io.to(
        sessionId
      ).emit(
        "chat:newMessage",
        chatMessage
      );

    } catch (error) {

      console.error(error);
    }
  }
);
}

module.exports =
  registerChatSocket;