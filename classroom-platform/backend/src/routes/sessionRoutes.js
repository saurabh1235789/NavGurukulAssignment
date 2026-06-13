const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middlewares/authMiddleware");

const teacherMiddleware =
  require("../middlewares/teacherMiddleware");

const {
  createSession,
  getSessions,
  joinSession,
} = require("../controllers/sessionController");

router.get(
  "/",
  authMiddleware,
  getSessions
);

router.post(
  "/",
  authMiddleware,
  teacherMiddleware,
  createSession
);

router.post(
  "/join",
  authMiddleware,
  joinSession
);

module.exports = router;