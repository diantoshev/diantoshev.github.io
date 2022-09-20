let loginForm = document.getElementById("login-form");
let password = document.getElementById("loginPassword");
let username = document.getElementById("loginUsername");
let loginButton = document.getElementById("login-btn");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (userManager.validateCredentials(username.value, password.value)) {
    userManager.users.map((user) => {
      if (user.username === username.value) {
        user.isLoggedIn = true;
        activeUser = Object.assign(user);
      }
    });
    location.hash = "home";
  } else {
    document.getElementById("wrongCredentials").style.display = "block";
  }
});
