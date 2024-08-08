const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { userRoute } = require("./src/routes/User");
const { expenseRoute } = require("./src/routes/Expense");

const app = express();

const port = process.env.PORT || 9000;

app.use(express.json());
const allowedOrigins = [
  "https://expensifvg.netlify.app",
  "https://expensify-lac.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // If you are sending cookies or authorization headers
  })
);

app.options("*", cors());

app.use(cookieParser());
app.use(userRoute, expenseRoute);
app.get("/", (req, res) => {
  res.send("Hello from express");
});
async function main() {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.MONGOOSE_USERNAME}:${process.env.MONGOOSE_PASSWORD}@cluster0.cwzfsum.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    )
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
