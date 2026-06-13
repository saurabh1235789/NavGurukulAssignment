import { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import { jwtDecode } from "jwt-decode";

function ChatSection() {

const [messages, setMessages] = useState([]);
const [message, setMessage] = useState("");

const token = localStorage.getItem("token");
const user = jwtDecode(token);

const messagesEndRef = useRef(null);

useEffect(() => {

  const sessionId =
    localStorage.getItem(
      "sessionId"
    );

  socket.emit(
    "chat:getMessages",
    {
      sessionId,
    }
  );

}, []);
useEffect(() => {

  socket.on(
    "chat:history",
    (data) => {

      setMessages(
        data
      );
    }
  );

  socket.on(
    "chat:newMessage",
    (message) => {

      setMessages(
        (prev) => [
          ...prev,
          message,
        ]
      );
    }
  );

}, []);

const sendMessage =
  () => {

    const sessionId =
      localStorage.getItem(
        "sessionId"
      );

    socket.emit(
      "chat:send",
      {
        sessionId,
        message,
      }
    );

    setMessage("");
  };

return (
  <div>

    <h2 className="section-title">
      Classroom Chat
    </h2>

    <div className="chat-container">

      {
        messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No messages yet
          </div>
        )
      }

      {
        messages.map(
          (msg) => {

            const isSelf =
              msg.userId ===
              user.userId;

            return (

              <div
                key={msg.id}
                className={
                  isSelf
                    ? "chat-message self"
                    : "chat-message"
                }
              >

                <div
                  className="chat-sender"
                >
                  {msg.email}
                </div>

                <div
                  className="chat-bubble"
                >
                  {msg.message}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginTop: "4px",
                  }}
                >
                  {
                    msg.createdAt
                      ? new Date(
                          msg.createdAt
                        ).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : ""
                  }
                </div>

              </div>
            );
          }
        )
      }

      <div ref={messagesEndRef} />

    </div>

    <div className="chat-input-row">

      <input
        className="chat-input"
        value={message}
        placeholder="Type a message..."
        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }
        onKeyDown={(e) => {

          if (
            e.key === "Enter" &&
            message.trim()
          ) {

            sendMessage();
          }
        }}
      />

      <button
        className="primary-btn"
        onClick={sendMessage}
        disabled={
          !message.trim()
        }
      >
        Send
      </button>

    </div>

  </div>
);

}

export default ChatSection;
