const signupButton = document.getElementById("signup-button");

signupButton.addEventListener("click", async function () {
  const inputEmail = document.getElementById("signup-email").value;
  const inputPassword = document.getElementById("signup-password").value;
  const inputFullname = document.getElementById("fullname").value;
  const userDetails = {
    email: inputEmail,
    password: inputPassword,
    fullName: inputFullname,
  };

  const response = await fetch("http://localhost:3000/user/signup", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  });

  const data = await response.json();

  localStorage.setItem("token", data.token);

  window.location.href = "http://localhost:3000/me";
});

const signinButton = document.getElementById("signin-button");
signinButton.addEventListener("click", function () {
  window.location.href = "http://localhost:3000/signin";
});

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (token) window.location.href = "http://localhost:3000/me";
});
