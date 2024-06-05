const { userModel } = require("../models/UserModel");

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      const user = new userModel({
        username,
        email,
        password,
      });
      await user.save();
      res.status(200).json({ message: "User registered successfully" });
    }
  } catch (error) {
    console.log(error);
  }
}
async function login(req, res) {
  try {
    res.send("Login");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { registerUser, login };
