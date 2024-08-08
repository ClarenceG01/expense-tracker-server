const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { userRoute } = require("./src/routes/User");
const { expenseRoute } = require("./src/routes/Expense");

const app = express();

const port = process.env.PORT || 9000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://66b4c180a013ae0738193424--dynamic-marigold-630e73.netlify.app/",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

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
