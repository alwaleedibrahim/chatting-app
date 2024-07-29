const myToken = sessionStorage.getItem("token");
const myEmail = sessionStorage.getItem("email");
const socket = io({
  extraHeaders: {
    authorization: `${myToken}`,
  },
});

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const recipient = document.getElementById("recipient");

if (myEmail) {
  socket.emit("join", myEmail);
}

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
  if (input.value && recipient.value && myEmail) {
    console.log("!!!emit");
    const msg = {
      sender: myEmail,
      recipient: recipient.value,
      message: input.value,
    };
    socket.emit("private message", msg);
    addMessage(`You: ${input.value}`);
    input.value = "";
  }
});
