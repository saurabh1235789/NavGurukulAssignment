const dotenv = require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const jwt = require("jsonwebtoken");
const registerSocketHandlers = require("./sockets");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(
        new Error("Authentication required")
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.user = decoded;

    next();
  } catch (error) {
    next(
      new Error("Invalid token")
    );
  }
});

registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
