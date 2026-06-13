const prisma = require("../config/db");

function generateJoinCode(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return code;
}

const createSession = async (req, res) => {
    try {

      const joinCode =
        generateJoinCode();

      const session =
        await prisma.session.create({
          data: {
            title:
              req.body.title,

            teacherId:
              req.user.userId,

            joinCode,
          },
        });

      res.status(201).json(
        session
      );

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to create session",
      });
    };
  }

const getSessions = async (req, res) => {
  try {
    const sessions =
      await prisma.session.findMany({
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(sessions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch sessions",
    });
  }
};

const joinSession = async (req, res) => {
  try {
    const { joinCode } = req.body;

    const session =
      await prisma.session.findUnique({
        where: { joinCode },
      });

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    await prisma.sessionMember.create({
      data: {
        sessionId: session.id,
        userId: req.user.userId,
      },
    });

    res.json({
      message: "Joined successfully",
      sessionId: session.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to join session",
    });
  }
};

module.exports = {
  createSession,
  getSessions,
  joinSession,
};