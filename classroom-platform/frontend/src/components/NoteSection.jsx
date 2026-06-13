import { useState, useEffect, useMemo } from "react";
import socket from "../services/socket";
import { debounce } from "lodash";


function NoteSection() {

  const [content, setContent] = useState("");
  const [version, setVersion] = useState(1);
  const sessionId = localStorage.getItem("sessionId");

  const debouncedSave = useMemo(
    () =>
        debounce(
        (content, version) => {

            socket.emit(
            "notes:updated",
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
      <textarea
        className="textarea"
        value={content}
        onChange={(e) => {

        const newContent =
        e.target.value;

        setContent(
        newContent
        );

        debouncedSave(
        newContent,
        version
        );

    }}
        />
    {/* <button
        className="primary-btn"
        onClick={saveNote}
        >
        Save Notes
    </button> */}

    <button className="primary-btn" onClick={loadNote}>
        Load Note
    </button>
    </div>
  );
}

export default NoteSection;