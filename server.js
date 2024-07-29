const express = require("express")
const cors = require("cors")
require("dotenv").config()

require("./models/db/dbConnection")

const app = express()

app.use(cors())


app.use('/static', express.static('static'));

///socket

const http = require("http");
const socket = require("socket.io");
const UserController = require("./controllers/user")
const MessageController = require("./controllers/messages")

const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("private message", async ({ sender, recipient, message }) => {
    io.to(recipient).emit("private message", {
      sender,
      message,
    });
  });

  // Join user to a room with their username
  socket.on("join", (email) => {
    socket.join(email);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});


module.exports = server