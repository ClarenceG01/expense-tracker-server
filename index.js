const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const { authenticateSession } = require("./src/middleware/authenticate");
const MongoStore = require("connect-mongo");

const { userRoute } = require("./src/routes/User");
const { expenseRoute } = require("./src/routes/Expense");

const app = express();

const port = process.env.PORT || 9000;
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(userRoute, expenseRoute);

app.get("/", authenticateSession, (req, res) => {
  res.send("Home");
});
async function main() {
  await mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then(() => console.log("connected to database"))
    .catch((err) => {
      console.log(err);
      console.log("could not connect to database");
    });
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
main();
