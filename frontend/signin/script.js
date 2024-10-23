const signupButton = document.getElementById("signup-button");
const signinButton = document.getElementById("signin-button");

signupButton.addEventListener("click", function () {
  window.location.href = "http://localhost:3000/";
});

signinButton.addEventListener("click", async function () {
  const username = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  console.log(username, password);

  const response = await fetch("http://localhost:3000/user/signin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: username,
      password: password,
    }),
  });

  const data = await response.json();

  localStorage.setItem("token", data.token);

  window.location.href = "http://localhost:3000/me";
});

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (token) window.location.href = "http://localhost:3000/me";
});
