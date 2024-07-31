const form = document.querySelector("form")
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const signup = "http://localhost:3000/signup";

  fetch(signup, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: form.email.value,
      username: form.username.value,
      password: form.password.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Error Password or Username");
      } else {
        window.open(
          "login.html", "_self"
        ); 
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
