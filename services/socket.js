const app = require("../server");
const http = require("http");
const socket = require("socket.io");
const UserController = require("./../controllers/user")
const MessageController = require("./../controllers/messages")

const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("private message", async ({ sender, recipient, message }) => {
    const senderUser = await UserController.findOne({ email: sender });
    const recipientUser = await UserController.findOne({ email: recipient });
    if (!senderUser || !recipientUser) {
      return socket.emit("error", "User not found");
    }

    MessageController.newMessage({
          sender: senderUser.email,
          recipient: recipientUser.email,
          message,
        })

    io.to(recipientUser.email).emit("private message", {
      sender,
      message,
    });
  });

  // Join user to a room with their username
  socket.on("join", ()=> {
    console.log("JOIN")
  }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});