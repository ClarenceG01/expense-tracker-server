const { userModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username: username });
    if (user) {
      res.status(400).json({ message: "Username already in use" });
    } else {
      const hashedPwd = await bcrypt.hash(password, 8);
      const newUser = new userModel({
        username,
        password: hashedPwd,
      });
      await newUser.save();
      console.log(newUser._id);
      res.status(200).json({ message: "User registered successfully" });
    }
  } catch (error) {
    console.log(error);
  }
}
async function login(req, res) {
  const { username, password } = req.body;
  try {
    const loggingUser = await userModel.findOne({ username });
    const isMatch = await bcrypt.compare(password, loggingUser.password);
    if (!loggingUser || !isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    req.session.user = {
      id: loggingUser._id,
      username: loggingUser.username,
    };

    res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
}
async function checkAuth(req, res) {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}
module.exports = { registerUser, login, checkAuth };
