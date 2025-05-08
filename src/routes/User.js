const userRoute = require("express").Router();
const {
  registerUser,
  login,
  checkAuth,
  logout,
} = require("../controller/User");
const { authenticateSession } = require("../middleware/authenticate");

userRoute.post("/register", registerUser);
userRoute.post("/login", login);
userRoute.get("/check-auth", authenticateSession, checkAuth);
userRoute.post("/logout", logout);
module.exports = { userRoute };
