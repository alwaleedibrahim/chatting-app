const myToken = sessionStorage.getItem("token");
const user_id = sessionStorage.getItem("user_id");
const email = sessionStorage.getItem("email");
const socket = io({
  extraHeaders: {
    authorization: `${myToken}`,
  },
});

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const recipient = document.getElementById("recipient");

if (email) {
  socket.emit("join", email);
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
    item.classList.add("from-you")
  }
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

// Send message on form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value && recipient.value && user_id) {
    const msg = {
      sender: email,
      recipient: recipient.value,
      message: input.value,
    };
    if (recipient.value != email) {
      socket.emit("private message", msg);
    }
    addMessage(input.value, "You");
    input.value = "";
  }
});
