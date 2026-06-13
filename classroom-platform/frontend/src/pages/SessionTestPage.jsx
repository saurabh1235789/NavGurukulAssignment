import { useEffect, useState } from "react";
import socket from "../services/socket";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../styles/session.css";

const token =
  localStorage.getItem("token");

const role =
  token
    ? jwtDecode(token).role
    : null;

function SessionTestPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [createdSession,setCreatedSession] =useState(null);
  const [sessionId, setSessionId] = useState("");
  const [events, setEvents] = useState([]);
  const [participants,setParticipants] = useState([]);

  useEffect(() => {
    socket.on("session:userJoined", (data) => {
      console.log("User Joined", data);

      setEvents((prev) => [
        ...prev,
        `JOINED: ${data.email}`,
      ]);
    });

    socket.on("session:userLeft", (data) => {
      console.log("User Left", data);

      setEvents((prev) => [
        ...prev,
        `LEFT: ${data.email}`,
      ]);
    });

    return () => {
      socket.off("session:userJoined");
      socket.off("session:userLeft");
    };
  }, []);

  const joinSession = () => {

  socket.emit(
    "session:join",
    {
      sessionId,
    }
  );

  localStorage.setItem(
    "sessionId",
    sessionId
  );

  navigate("/classroom");
};

  const leaveSession = () => {
    socket.emit("session:leave", {
      sessionId,
    });
  };

  const createSession =
  async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.post(
          "http://localhost:8000/api/sessions",
          {
            title,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setCreatedSession(
  response.data
);

setSessionId(
  response.data.id
);

localStorage.setItem(
  "sessionId",
  response.data.id
);

socket.emit(
  "session:join",
  {
    sessionId:
      response.data.id,
  }
);

navigate("/classroom");

setSessionId(
  response.data.id
);

    } catch (error) {

      console.error(error);
    }
  };

  return (
  <div className="session-page">

    <div className="session-container">

      <div className="session-header">

        <div className="session-title">
          Session Management
        </div>

        <div className="session-subtitle">
          Create and join live classroom sessions
        </div>

      </div>

      <div className="session-grid">

        {role === "TEACHER" && (
          <div className="session-card">

            <h3>Create Session</h3>

            <input
              className="session-input"
              placeholder="Session Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <button
              className="session-button"
              onClick={createSession}
            >
              Create Session
            </button>

            {createdSession && (
              <div
                style={{
                  marginTop: "20px",
                }}
              >
                <h4>
                  Session Created
                </h4>

                <p>
                  <strong>
                    Session ID:
                  </strong>{" "}
                  {createdSession.id}
                </p>

                <p>
                  <strong>
                    Join Code:
                  </strong>{" "}
                  {createdSession.joinCode}
                </p>

              </div>
            )}

          </div>
        )}

        <div className="session-card">

          <h3>
            {role === "TEACHER"
              ? "Manage Session"
              : "Join Session"}
          </h3>

          <input
            className="session-input"
            value={sessionId}
            onChange={(e) =>
              setSessionId(
                e.target.value
              )
            }
            placeholder="Session ID"
          />

          <button
            className="session-button"
            onClick={joinSession}
          >
            Join
          </button>

          <button
            className="session-button"
            onClick={leaveSession}
          >
            Leave
          </button>

        </div>

        <div className="session-card">

          <h3>
            Room Events
          </h3>

          {events.length === 0 && (
            <p>
              No events yet
            </p>
          )}

          {events.map(
            (event, index) => (
              <div
                key={index}
                className="event-item"
              >
                {event}
              </div>
            )
          )}

        </div>

      </div>

    </div>

  </div>
);
}

export default SessionTestPage;