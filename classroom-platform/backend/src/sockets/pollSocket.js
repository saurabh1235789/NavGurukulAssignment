const prisma = require("../config/db");


async function getPollResults(pollId) {
  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      options: {
        include: {
          votes: true,
        },
      },
    },
  });

  if (!poll) {
    return null;
  }

  return {
    id: poll.id,
    sessionId: poll.sessionId,
    question: poll.question,
    options: poll.options.map((option) => ({
      id: option.id,
      text: option.text,
      votes: option.votes.length,
    })),
  };
}

function registerPollSocket(io, socket) {


  socket.on(
    "poll:create",
    async ({
      sessionId,
      question,
      options,
    }) => {

      try {

        if (
          socket.user.role !==
          "TEACHER"
        ) {

          socket.emit(
            "poll:error",
            {
              message:
                "Only teachers can create polls",
            }
          );

          return;
        }

    
        await prisma.poll.updateMany({
          where: {
            sessionId,
            isActive: true,
          },
          data: {
            isActive: false,
          },
        });

        const poll =
          await prisma.poll.create({
            data: {

              sessionId,

              question,

              options: {
                create:
                  options.map(
                    (option) => ({
                      text: option,
                    })
                  ),
              },
            },

            include: {
              options: true,
            },
          });

        const payload = {
          id: poll.id,
          sessionId,
          question: poll.question,
          options:
            poll.options.map(
              (option) => ({
                id: option.id,
                text: option.text,
                votes: 0,
              })
            ),
        };

        io.to(sessionId).emit(
          "poll:created",
          payload
        );

        console.log(
          `Poll created for session ${sessionId}`
        );

      } catch (error) {

        console.error(error);

        socket.emit(
          "poll:error",
          {
            message:
              "Failed to create poll",
          }
        );
      }
    }
  );

  /*
   * Student loads active poll
   */
  socket.on(
    "poll:getActive",
    async ({ sessionId }) => {

      try {

        const poll =
          await prisma.poll.findFirst({
            where: {
              sessionId,
              isActive: true,
            },

            include: {
              options: {
                include: {
                  votes: true,
                },
              },
            },
          });

        if (!poll) {
          return;
        }

        socket.emit(
          "poll:loaded",
          {
            id: poll.id,
            sessionId,
            question:
              poll.question,

            options:
              poll.options.map(
                (option) => ({
                  id: option.id,
                  text:
                    option.text,
                  votes:
                    option.votes.length,
                })
              ),
          }
        );

      } catch (error) {

        console.error(error);

        socket.emit(
          "poll:error",
          {
            message:
              "Failed to load poll",
          }
        );
      }
    }
  );

  /*
   * Student votes
   */
  socket.on(
    "poll:vote",
    async ({
      pollId,
      optionId,
    }) => {

      try {

        console.log(
          "POLL VOTE PAYLOAD",
          {
            pollId,
            optionId,
          }
        );

        if (
          !pollId ||
          !optionId
        ) {

          socket.emit(
            "poll:error",
            {
              message:
                "Invalid vote payload",
            }
          );

          return;
        }

        const existingVote =
          await prisma.pollVote.findFirst({
            where: {
              pollId,
              userId:
                socket.user.userId,
            },
          });

        if (existingVote) {

          socket.emit(
            "poll:error",
            {
              message:
                "You have already voted",
            }
          );

          return;
        }

        await prisma.pollVote.create({
          data: {

            pollId,

            optionId,

            userId:
              socket.user.userId,
          },
        });

        const poll =
          await prisma.poll.findUnique({
            where: {
              id: pollId,
            },
          });

        if (!poll) {
          return;
        }

        const results =
          await getPollResults(
            pollId
          );

        io.to(
          poll.sessionId
        ).emit(
          "poll:updated",
          results
        );

      } catch (error) {

        console.error(error);

        socket.emit(
          "poll:error",
          {
            message:
              "Vote failed",
          }
        );
      }
    }
  );
}

module.exports =
  registerPollSocket;