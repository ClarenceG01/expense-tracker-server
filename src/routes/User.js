const { registerUser, login } = require("../controller/User");

const userRoute = require("express").Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", login);

module.exports = { userRoute };
