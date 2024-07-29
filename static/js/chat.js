const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const recipient = document.getElementById("recipient");
const sender = document.getElementById("sender");

// Join the room with the user's username
sender.addEventListener("blur", () => {
  if (sender.value) {
    socket.emit("join", sender.value);
  }
});

// Receive private messages
socket.on("private message", (msg) => {
  console.log(msg);
  addMessage(`${msg.sender}: ${msg.message}`);
});

// Add message to list
function addMessage(msg) {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

// Send message on form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value && recipient.value && sender.value) {
    const msg = {
      sender: sender.value,
      recipient: recipient.value,
      message: input.value,
    };
    socket.emit("private message", msg);
    addMessage(`You: ${input.value}`);
    input.value = "";
  }
});
