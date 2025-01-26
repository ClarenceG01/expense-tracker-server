const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      req.user = user.loggingUser;
      next();
    });
  } catch (error) {
    console.log(error)
  }
};

module.exports = { authenticateToken };
