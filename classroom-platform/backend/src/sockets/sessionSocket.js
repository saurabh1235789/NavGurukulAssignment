function registerSessionSocket(io,socket) {
    socket.on("session:join", ({ sessionId }) => {
    console.log(
        `${socket.user.email} joined ${sessionId}`
    );

    socket.join(sessionId);

    const room =
        io.sockets.adapter.rooms.get(sessionId);

    console.log(
      `Room ${sessionId} members:`,
      room ? [...room] : []
    );


    socket.to(sessionId).emit(
        "session:userJoined",
        {
        email: socket.user.email,
        }
    );
});

  socket.on(
    "session:leave",
    ({ sessionId }) => {

      socket.leave(sessionId);

      io.to(sessionId).emit(
        "session:userLeft",
        {
          userId: socket.user.userId,
          email: socket.user.email,
        }
      );
    }
  );
}

module.exports = registerSessionSocket;