import { io } from "socket.io-client";

const socket = io(
  "http://localhost:8000",
  {
    autoConnect: false,
  }
);

socket.on(
  "connect",
  () => {

    const sessionId =
      localStorage.getItem(
        "sessionId"
      );

    if (sessionId) {

      socket.emit(
        "session:join",
        {
          sessionId,
        }
      );

      console.log(
        "Rejoined room:",
        sessionId
      );
    }
  }
);

socket.on(
  "disconnect",
  (reason) => {
    console.log(
      "Socket Disconnected:",
      reason
    );
  }
);

socket.on(
  "connect_error",
  (err) => {
    console.log(
      "Socket Error:",
      err.message
    );
  }
);

export const connectSocket =
  () => {

    const token =
      localStorage.getItem(
        "token"
      );

    socket.auth = {
      token,
    };

    if (
      !socket.connected
    ) {
      socket.connect();
    }
  };

export default socket;