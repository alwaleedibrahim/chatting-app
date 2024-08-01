const myToken = sessionStorage.getItem("token");
const contactList = document.querySelector(".contact-list");

const url = "http://localhost:3000/contacts";

fetch(url, {
  method: "GET",
  headers: {
    Authorization: myToken,
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    // const json = JSON.parse(response)
    response.json().then((value) => {
       const  contacts = value.data
      if (contacts) console.log(contacts);
        for (let element of contacts) {
          if(element.username) {
            const li = document.createElement("li");
            li.innerHTML = `<span>${element.username[0].toUpperCase()}</span><a href=chat.html?to=${element.username}>${element.username}</a>`;
            contactList.appendChild(li);
          }
        }
    });
  })
  .catch((error) => {
    console.error(error.message);
  });
