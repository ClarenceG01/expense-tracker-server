const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { userRoute } = require("./src/routes/User");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(userRoute);
async function main() {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.MONGOOSE_USERNAME}:${process.env.MONGOOSE_PASSWORD}@cluster0.cwzfsum.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
main();
