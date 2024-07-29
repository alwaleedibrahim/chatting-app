const express = require("express")
const cors = require("cors")
require("dotenv").config()
const {auth, socketAuth} = require("./middlewares/auth")

require("./models/db/dbConnection")
const userRouter = require("./routes/users")

const app = express()

app.use(cors())
app.use(express.json())

app.use('/static', express.static('static'));
app.use("/", userRouter)

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

io.engine.use((req, res, next) => {
  const isHandshake = req._query.sid === undefined;
  if (!isHandshake) {
    return next();
  }
  socketAuth(req, res, next)
});

io.on("connection", (socket) => {
  const email= socket.request.user.email
  console.log(email ," connected");

  socket.on("private message", async ({ sender, recipient, message }) => {
    io.to(recipient).emit("private message", {
      sender,
      recipient,
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