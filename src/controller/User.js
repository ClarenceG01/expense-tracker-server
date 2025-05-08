const { userModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { username, password } = req.body;
    // check if user already exists
    const existingUser = await userModel.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already in use" });
    }
    // create new user
    const hashedPwd = await bcrypt.hash(password, 8);
    const newUser = new userModel({
      username,
      password: hashedPwd,
    });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
  }
}
async function login(req, res) {
  try {
    const { username, password } = req.body;
    // find user
    const user = await userModel.findOne({ username });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    req.user = user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    // set token in cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function checkAuth(req, res) {
  try {
    return res.status(200).json({ authenticated: true });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ authenticated: false });
  }
}
async function logout(req, res) {
  res.clearCookie("token"); 
  res.status(200).json({ message: "Logout successful" });
}
module.exports = { registerUser, login, checkAuth, logout };
