const teacherMiddleware = (req, res, next) => {
  if (req.user.role !== "TEACHER") {
    return res.status(403).json({
      message: "Teacher access required",
    });
  }

  next();
};

module.exports = teacherMiddleware;