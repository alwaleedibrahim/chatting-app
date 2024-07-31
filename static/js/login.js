const info = document.querySelector("#info")
const form = document.querySelector("form")
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const login = "http://localhost:3000/login";

  fetch(login, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: form.identifier.value,
      password: form.password.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "failed") {
        info.textContent = `${data.message}`
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("user_id", data.user.id);
        sessionStorage.setItem("email", data.user.email);
        window.open(
          "chat.html", "_self"
        ); 
      }
    })
    .catch((err) => {
      info.textContent = `${err}`
    });
});
