const form = document.getElementById("login-form")
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
      email: form.email.value,
      password: form.password.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.error) {
        alert("Error Password or Username");
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("email", data.user.email);
        window.open(
          "chat.html", "_self"
        ); 
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
