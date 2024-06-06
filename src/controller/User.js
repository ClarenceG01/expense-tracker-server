const { userModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      const hashedPwd = await bcrypt.hash(password, 8);
      console.log(hashedPwd);
      const user = new userModel({
        username,
        email,
        password: hashedPwd,
      });
      await user.save();
      res.status(200).json({ message: "User registered successfully" });
    }
  } catch (error) {
    console.log(error);
  }
}
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      const pwdFromDb = userExists.password;
      const isMatch = await bcrypt.compare(password, pwdFromDb);
      if (isMatch) {
        const token = jwt.sign({ userExists }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res
          .cookie("token", token, {
            httpOnly: true,
          })
          .status(200)
          .json({ message: "Login Successful" });
      } else {
        res.status(400).json({ message: "invalid password" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { registerUser, login };
