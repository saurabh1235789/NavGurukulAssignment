import { useState, useEffect } from "react";
import socket from "../services/socket";
import { jwtDecode } from "jwt-decode";

function PollSection() {
  const sessionId =localStorage.getItem("sessionId");


  const [question, setQuestion] = useState("");

  const [hasVoted,setHasVoted] = useState(false);

  const [poll, setPoll] = useState(null);

  const [options, setOptions] =
    useState([
      "",
      "",
      "",
      "",
    ]);

    useEffect(() => {

  const onLoaded = (poll) => {

    console.log(
      "POLL LOADED",
      poll
    );

    setPoll(poll);
  };

  const onCreated = (poll) => {

    console.log(
      "POLL CREATED",
      poll
    );

    setPoll(poll);

    setHasVoted(false);
  };

  const onUpdated = (poll) => {

    console.log(
      "POLL UPDATED",
      poll
    );

    setPoll(poll);
  };

  socket.on(
    "poll:loaded",
    onLoaded
  );

  socket.on(
    "poll:created",
    onCreated
  );

  socket.on(
    "poll:updated",
    onUpdated
  );

  return () => {

    socket.off(
      "poll:loaded",
      onLoaded
    );

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

    socket.emit("poll:create",
      {
        sessionId,
        question,
        options,
      }
    );
  };

return (
  <div className="poll-card">

    <h2 className="section-title">
      Live Polls
    </h2>

    {role === "TEACHER" && (
      <div className="poll-create-form">

        <input
          className="poll-input"
          placeholder="Poll Question"
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
        />

        {options.map(
          (option, index) => (

            <input
              key={index}
              className="poll-input"
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
        )}

        <button
          className="primary-btn" onClick={() => {createPoll()}}>Create Poll
        </button>
        
      </div>
    )}

    <div className = "poll-card">

    <button style={{"width": "100%", "marginTop": "10px"}}className="primary-btn" 
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
        </div>


    {poll && (
      <div
        style={{
          marginTop: "30px",
        }}
      >

        <div className="poll-question">
          {poll.question}
        </div>

        {poll.options.map(
          (option) => {

            const totalVotes =
              poll.options.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  (item.votes || 0),
                0
              );

            const percent =
              totalVotes === 0
                ? 0
                : (
                    option.votes *
                    100
                  ) /
                  totalVotes;

            return (

              <div
                key={option.id}
                className="poll-option"
              >

                {role === "STUDENT" &&
                  !hasVoted && (

                  <button
                    className="vote-btn"
                    onClick={() => {

                      socket.emit(
                        "poll:vote",
                        {
                          pollId:
                            poll.id,

                          optionId:
                            option.id,
                        }
                      );

                      setHasVoted(
                        true
                      );
                    }}
                  >
                    {option.text}
                  </button>

                )}

                {(role === "TEACHER" ||
                  hasVoted) && (

                  <>
                    <div>
                      {option.text}
                    </div>

                    <div
                      className="poll-progress-container"
                    >
                      <div
                        className="poll-progress-fill"
                        style={{
                          width:
                            `${percent}%`,
                        }}
                      />
                    </div>

                    <div
                      className="vote-count"
                    >
                      {
                        option.votes
                      }{" "}
                      votes
                      {" • "}
                      {percent.toFixed(
                        0
                      )}
                      %
                    </div>
                  </>
                )}

              </div>
            );
          }
        )}

      </div>
    )}
    

  </div>
);
}
export default PollSection;