const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get(
  "/api/protected",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "Protected Route",
      user: req.user,
    });
  }
);


app.use(
  "/api/sessions",
  sessionRoutes
);


app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString()
  });
});



module.exports = app;

