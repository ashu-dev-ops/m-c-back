require("dotenv").config();
// require("express-async-errors");
const express = require("express");
const app = express();
const auth = require("./middleware/auth");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

const connectDb = require("./db/connect");
const chatRouter = require("./router/chat");
const messageRouter = require("./router/message");
const authRouter = require("./router/auth");
const userRouter = require("./router/user");
// const orderRouter = require("./router/order");
app.set("trust proxy", 1); //for huruko
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes //how long
//     max: 100, // limit each IP to 100 requests per windowMs //how many
//   })
// );
app.use(express.json());
// extra packages

// routes
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.get("/", (req, res) => {
  res.send("<h1>working</a>");
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
