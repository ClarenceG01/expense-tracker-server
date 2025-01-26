const { registerUser, login, checkAuth } = require("../controller/User");

const userRoute = require("express").Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", login);
userRoute.get("/check-auth", checkAuth);

module.exports = { userRoute };
