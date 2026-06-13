const prisma = require("../config/db");

function registerNoteSocket(io, socket) {

    socket.onAny((event, ...args) => {
        console.log("EVENT RECEIVED:", event);
    });

  // Load Note
  socket.on("notes:get", async ({ sessionId }) => {
    try {

      console.log(
        `notes:get requested for session ${sessionId}`
      );

      const session =
        await prisma.session.findUnique({
          where: {
            id: sessionId,
          },
        });

      if (!session) {

        console.log(
          `Session not found: ${sessionId}`
        );

        socket.emit("notes:error", {
          message: "Session not found",
        });

        return;
      }

      let note =
        await prisma.sharedNote.findUnique({
          where: {
            sessionId,
          },
        });

      if (!note) {

        console.log(
          `Creating new note for session ${sessionId}`
        );

        note =
          await prisma.sharedNote.create({
            data: {
              sessionId,
              content: "",
            },
          });
      }

     

      socket.emit("notes:loaded", {
        content: note.content,
        version: note.version,
      });

      console.log(
        `Loaded note version ${note.version}`
      );

    } catch (error) {

      console.error(
        "notes:get error",
        error
      );

      socket.emit("notes:error", {
        message: "Failed to load notes",
      });
    }
  });

  // Update Note
  socket.on(
  "notes:updated",
  async ({
    sessionId,
    content,
    version,
  }) => {

    try {

      console.log(
        "STEP 1: Entered notes:update"
      );

      console.log({
        sessionId,
        content,
        version,
      });

      const session =
        await prisma.session.findUnique({
          where: {
            id: sessionId,
          },
        });

      console.log(
        "STEP 2: Session lookup complete",
        session?.id
      );

      let note =
        await prisma.sharedNote.findUnique({
          where: {
            sessionId,
          },
        });

      console.log(
        "STEP 3: Note lookup complete",
        note
      );

      if (!note) {

        console.log(
          "STEP 4: Creating note"
        );

        note =
          await prisma.sharedNote.create({
            data: {
              sessionId,
              content: "",
            },
          });
      }

      console.log(
        "STEP 5: Version Check",
        {
          dbVersion: note.version,
          clientVersion: version,
        }
      );

      if (
        note.version !== version
      ) {

        console.log(
          "STEP 6: CONFLICT"
        );

        socket.emit(
          "notes:conflict",
          {
            content:
              note.content,

            version:
              note.version,
          }
        );

        return;
      }

      console.log(
        "STEP 7: Updating DB"
      );

      const updatedNote =
        await prisma.sharedNote.update({
          where: {
            sessionId,
          },

          data: {
            content,

            version:
              note.version + 1,
          },
        });

      console.log(
        "STEP 8: Updated",
        updatedNote.version
      );
      const room =
        io.sockets.adapter.rooms.get(sessionId);

        console.log(
        room?.size
        );
     
      io.to(sessionId).emit(
        "notes:updated",
        {
            content: updatedNote.content,
            version: updatedNote.version,
        }
    );

      console.log(
        "STEP 9: Broadcasted"
      );

    } catch (error) {

      console.error(
        "notes:update error",
        error
      );

        socket.emit("notes:error", {
          message: "Failed to save note",
        });
      }
    }
  );
}

module.exports = registerNoteSocket;