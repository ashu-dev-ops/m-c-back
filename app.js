require("dotenv").config();
// require("express-async-errors");
const express = require("express");
const app = express();
const auth = require("./middleware/auth");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const http = require("http");
const connectDb = require("./db/connect");
const chatRouter = require("./router/chat");
const messageRouter = require("./router/message");
const authRouter = require("./router/auth");
const userRouter = require("./router/user");

const message = require("./models/message");
const user = require("./models/user");
const conversation = require("./models/conversation");

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

app.get("/", async (req, res) => {
  conversation.find({}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      user.find({}, function (err, result1) {
        if (err) {
          console.log(err);
        } else {
          message.find({}, function (err, result2) {
            if (err) {
              console.log(err);
            } else {
              res.json({
                conversation: result,
                user: result1,
                message: result2,
              });
            }
          });
        }
      });
    }
  });
});

const port = process.env.PORT || 3000;
// let server = null;
// var server = ;
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    // server = app.listen(port, () =>
    //   console.log(`Server is listening on port ${port}...`)
    // );

    // console.log(server);
  } catch (error) {
    console.log(error);
  }
};
var socket = require("socket.io");

var server = app.listen(3000, function () {
  console.log("listening for requests on port 3000,");
});
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
// let io = socket(server);
let userArr = [];
console.log("here is our user array");
const addUser = (userId, socketId) => {
  console.log(socketId);
  if (userArr.some((u, idx) => u.userId === userId)) {
    userArr.forEach((u, idx) => {
      // console.log("before");
      console.log(userArr);
      if (u.userId === userId) {
        userArr.splice(idx, 1, { userId, socketId });
      }
      console.log("after");
      console.log(userArr);
      return;
    });
    return;
  }

  userArr.push({ userId, socketId });
  // console.log(userArr);
};
const removeUser = (socketId) => {
  userArr = userArr.filter((i) => i !== socketId);
};
const getUser = (id) => {
  let a = userArr.find((user) => user.userId === id);
  // console.log("our guest user >>>");
  // console.log(a);
  return a;
  // const data = await user.find({ _id: id });
};
io.on("connection", function (socket) {
  // console.log(`${socket.id} is connected`);
  try {
    // take user and socket id from client
    socket.on("setup", (userdata) => {
      if (userdata) {
        // socket.join(userdata.userId);
        // console.log(userdata.userId);
        // socket.emit("connected");
        addUser(userdata.userId, socket.id);
        io.emit("getUsers", userArr);
        // console.log("here is our user array");
        // console.log(userArr);
      }
      // console.log("running");
    });
    // socket.emit("getUsers", userArr);
    socket.on("joinChat", (room) => {
      socket.join(room);
      // console.log(`room chat id is ${room}`);
    });

    socket.on("sendMsg", ({ senderId, receiverId, text }) => {
      console.log("check what is comming in>>>>>");
      console.log(senderId, receiverId);
      console.log("check arr >>>");
      console.log(userArr);
      const reciver = getUser(receiverId);
      if (reciver) {
        console.log("receiver data socker >>>>>");
        console.log(reciver);
        console.log(reciver.socketId);
        console.log("we are sending ok ");
        io.to(reciver.socketId).emit("getMsg", {
          senderId: senderId,
          text: text,
        });
      }
      app.use((req, res) => {
        res.status(200).json({
          msg: "receiver not online / found",
        });
      });
    });
    socket.on("disconnect", () => {
      removeUser(socket.id);
      // addUser(userdata.userId, socket.id);
      io.emit("getUsers", userArr);
    });
  } catch (error) {
    app.use((req, res) => {
      res.status(500).json({
        msg: "error occur",
      });
    });
  }
});
// io.emit("getUsers", userArr);
// const io = require("socket.io")(, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:3000",
//     // credentials: true,
//   },
// });
// const io = require("socket.io")(8900, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// io.on("connection", () => {
//   console.log("connected to socket");
// });
start();
