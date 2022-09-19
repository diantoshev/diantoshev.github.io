// (function () {
let registerForm = document.getElementById("registration-form");
let confirmPassword = document.getElementById("confirmPassword");

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let {
    registerUsername: { value: username },
    registerPassword: { value: password },
  } = this.elements;

  if (userManager.addUser(username, password)) {
    location.hash = "login";
  } else {
    document.getElementById("username-exists").style.display = "block";
  }
  this.reset();
  confirmPassword.removeAttribute("class");
  registerPassword.removeAttribute("class");
});

registerPassword.addEventListener("input", validatePasswords);

confirmPassword.addEventListener("input", validatePasswords);

// registerForm.addEventListener("input", validatePasswords);

function validatePasswords() {
  const passwordValue = registerPassword.value;
  const confirmPassValue = confirmPassword.value;
  const usernameValue = registerUsername.value;

  if (passwordValue && confirmPassValue && passwordValue !== confirmPassValue) {
    document.getElementById("password-mismatch").style.display = "block";
  } else {
    document.getElementById("password-mismatch").style.display = "none";
  }

  if (
    (passwordValue.length <= 8 || confirmPassValue.length <= 8) &&
    passwordValue &&
    confirmPassValue
  ) {
    document.getElementById("short-password").style.display = "block";
  } else {
    document.getElementById("short-password").style.display = "none";
  }

  let button = document.getElementById("register-btn");
  registerPassword.classList.remove("valid-entry");
  confirmPassword.classList.remove("valid-entry");
  if (
    passwordValue &&
    confirmPassValue &&
    usernameValue &&
    passwordValue === confirmPassValue
  ) {
    button.classList.remove("disabled-btn");
    button.removeAttribute("disabled");
    registerPassword.classList.add("valid-entry");
    confirmPassword.classList.add("valid-entry");
    registerPassword.classList.remove("invalid-entry");
    confirmPassword.classList.remove("invalid-entry");
  } else {
    button.classList.add("disabled-btn");
    button.setAttribute("disabled", true);
    registerPassword.classList.remove("valid-entry");
    confirmPassword.classList.remove("valid-entry");
    registerPassword.classList.add("invalid-entry");
    confirmPassword.classList.add("invalid-entry");
  }
}
// })();
