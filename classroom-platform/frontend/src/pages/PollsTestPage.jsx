import { useState, useEffect } from "react";
import socket from "../services/socket";
import { jwtDecode } from "jwt-decode";

function PollTestPage() {


  const [sessionId, setSessionId] =
    useState("");

  const [question, setQuestion] =
    useState("");

  const [poll, setPoll] =
    useState(null);

  const [options, setOptions] =
    useState([
      "",
      "",
      "",
      "",
    ]);

    useEffect(() => {
        socket.on(
            "poll:loaded",
            (poll) => {

            console.log(
            "Poll Loaded",
            poll
            );

            setPoll(poll);
        }
        );

  socket.on(
    "poll:created",
    (poll) => {

        console.log(
        "NEW POLL RECEIVED",
        poll
        );

        setPoll(poll);
    }
    );

  const onUpdated = (results) => {

    console.log(
      "Poll Updated",
      results
    );

    setPoll(results);
  };

  socket.on("poll:created", (poll) => {
    console.log("POLL CREATED RECEIVED", poll);
    setPoll(poll);
    });

  socket.on(
    "poll:updated",
    onUpdated
  );

  return () => {

    socket.off(
      "poll:created",
      onCreated
    );

    socket.off(
      "poll:updated",
      onUpdated
    );
  };

}, []);

    const token =
    localStorage.getItem("token");

    const role =
    token
        ? jwtDecode(token).role
        : null;

  const createPoll = () => {
    socket.emit("session:join", {
        sessionId,
    });

    socket.emit(
      "poll:create",
      {
        sessionId,
        question,
        options,
      }
    );
  };


 return (
  <div>

    <input
      placeholder="Session ID"
      value={sessionId}
      onChange={(e) =>
        setSessionId(e.target.value)
      }
    />

    <br />

    <button
        onClick={() =>{
            socket.emit("session:join", {
                sessionId,
            });

            socket.emit(
                "poll:getActive",
            {
                sessionId,
            }
            )
        }}
        >
        Load Active Poll
        </button>
    <br />

    {
      role === "TEACHER" && (
        <>
          <input
            placeholder="Question"
            value={question}
            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }
          />

          <br />

          {
            options.map(
              (option, index) => (
                <input
                  key={index}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {

                    const copy =
                      [...options];

                    copy[index] =
                      e.target.value;

                    setOptions(copy);
                  }}
                />
              )
            )
          }

          <br />

          <button
            onClick={createPoll}
          >
            Create Poll
          </button>

          <hr />
        </>
      )
    }

    {
      poll && (

        <div>

          <h2>
            {poll.question}
          </h2>

          {
            poll.options.map(
              (option) => (

                <div
                  key={option.id}
                  style={{
                    marginBottom: "10px",
                  }}
                >

                  <button
                    onClick={() => {

                      console.log(
                        "Voting",
                        {
                          pollId:
                            poll.id,

                          optionId:
                            option.id,
                        }
                      );

                      socket.emit(
                        "poll:vote",
                        {
                          pollId:
                            poll.id,

                          optionId:
                            option.id,
                        }
                      );
                    }}
                  >
                    {option.text}
                  </button>

                  {"  "}

                  {
                    option.votes || 0
                  }

                </div>
              )
            )
          }

        </div>
      )
    }

  </div>
);}
export default PollTestPage;