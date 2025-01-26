const { userModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    if (loggingUser) {
      const pwdFromDb = loggingUser.password;
      const isMatch = await bcrypt.compare(password, pwdFromDb);
      if (isMatch) {
        const token = jwt.sign({ loggingUser }, process.env.JWT_SECRET);
        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
          })
          .status(200)
          .json({ message: "Login Successful" });
      } else {
        // wrong password
        res.status(400).json({ message: "invalid password" });
      }
    } else {
      console.log("user not found");
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
}
async function checkAuth(req, res) {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token)
      return res.status(401).json({
        authenticated: false,
        message: "Unauthorized",
      });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified);
    if (verified) {
      return res.status(200).json({
        authenticated: true,
        message: "Authorized",
        user: verified.loggingUser,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      authenticated: false,
      message: "Unauthorized",
    });
  }
}
module.exports = { registerUser, login, checkAuth };
