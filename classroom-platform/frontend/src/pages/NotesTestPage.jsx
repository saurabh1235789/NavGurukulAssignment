import { useState, useEffect, useMemo } from "react";
import socket from "../services/socket";
import { debounce } from "lodash";


function NotesTestPage() {

  const [sessionId, setSessionId] = useState("");

  const [content, setContent] = useState("");

  const [version, setVersion] = useState(1);

  const debouncedSave = useMemo(
    () =>
        debounce(
        (content, version) => {

            socket.emit(
            "notes:update",
            {
                sessionId,
                content,
                version,
            }
            );

        },
        500
        ),
    [sessionId]
    );


  const loadNote = () => {
    socket.emit("session:join", {
        sessionId,
    });

    socket.emit("notes:get", {
        sessionId,
    });
    };

    useEffect(() => {

    socket.onAny((event, ...args) => {
        console.log(
        "FRONTEND EVENT:",
        event,
        args
        );
    });

    }, []);

  useEffect(() => {

  const onLoaded = (data) => {
    setContent(data.content);
    setVersion(data.version);
  };

  const onUpdated = (data) => {
    console.log("Note updated RECEIVED:", data);
    setContent(data.content);
    setVersion(data.version);
  };

  const onConflict = (data) => {
    alert("Conflict detected");

    setContent(data.content);
    setVersion(data.version);
  };

  socket.on("notes:loaded", onLoaded);
  socket.on("notes:updated", onUpdated);
  socket.on("notes:conflict", onConflict);

  return () => {
    socket.off("notes:loaded", onLoaded);
    socket.off("notes:updated", onUpdated);
    socket.off("notes:conflict", onConflict);
  };

}, []);

  return (
    <div>
      <input
        placeholder="Session ID"
        value={sessionId}
        onChange={(e) =>
          setSessionId(e.target.value)
        }
      />
      <textarea
        rows={20}
        cols={80}
        value={content}
        onChange={(e) => {

            const value = e.target.value;

            setContent(value);

            debouncedSave(
                value,
                version
            );
        }}
    />
    <button
        onClick={() => {
            console.log("SAVE CLICKED");
            console.log("Socket connected:", socket.connected);
            console.log({
            sessionId,
            content,
            version
            });

            socket.emit("notes:updated", {
            sessionId,
            content,
            version,
            });
        }}
        >Save
    </button>

      <button onClick={loadNote}>
        Load Note
      </button>
    </div>
  );
}

export default NotesTestPage;