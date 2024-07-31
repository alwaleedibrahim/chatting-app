const token = sessionStorage.getItem("token");
const user_id = sessionStorage.getItem("user_id");
const username = sessionStorage.getItem("username");
let params = new URLSearchParams(document.location.search);
let recipient = params.get("to");


const socket = io({
  extraHeaders: {
    authorization: `${token}`,
  },
});

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

if (username) {
  socket.emit("join", username);
}

// Receive private messages
socket.on("private message", (msg) => {
  addMessage(msg.message, msg.sender);
});

// Add message to list
function addMessage(msg, from) {
  const item = document.createElement("li");
  item.textContent = `${from}: ${msg}`;
  if (from == 'You') {
    item.classList.add("sent")
  }
  else {
    item.classList.add("received")
  }
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

// Send message on form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value && recipient && user_id) {
    const msg = {
      sender: username,
      recipient: recipient,
      message: input.value,
    };
    if (recipient != username) {
      socket.emit("private message", msg);
    }
    addMessage(input.value, "You");
    input.value = "";
  }
});
