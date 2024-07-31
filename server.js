const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { auth, socketAuth } = require("./middlewares/auth");

require("./models/db/dbConnection");
const userRouter = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/static", express.static("static"));
app.use("/", userRouter);

///socket

const http = require("http");
const socket = require("socket.io");
const messages = require("./controllers/messages");

const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

io.engine.use((req, res, next) => {
  const isHandshake = req._query.sid === undefined;
  if (!isHandshake) {
    return next();
  }
  socketAuth(req, res, next);
});

io.on("connection", (socket) => {
  const { username, id } = socket.request.user;
  console.log(username, " connected");

  socket.on("private message", async ({ sender, recipient, message }) => {
    await messages.newMessage({ sender, recipient, message });
    io.to(recipient).emit("private message", {
      sender,
      recipient,
      message,
    });
  });

  socket.on("join", (username) => {
    socket.join(username);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

module.exports = server;
