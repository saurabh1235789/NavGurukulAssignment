const registerSessionSocket = require("./sessionSocket");
const registerNoteSocket = require("./noteSocket");
const registerPollSocket = require("./pollSocket");
const registerChatSocket = require("./chatSocket");

function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(
      `User Connected: ${socket.user.email}`
    );

    registerSessionSocket(io, socket);
    registerNoteSocket(io, socket);
    registerPollSocket(io, socket);
    registerChatSocket(io,socket);
    
    socket.on("disconnect", () => {
      console.log(
        `User Disconnected: ${socket.user.email}`
      );
    });
  });
}

module.exports = registerSocketHandlers;