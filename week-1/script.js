function validateLogin() {
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;

  if (email === "" || password === "") {
    alert("Please fill all fields");
    return false;
  }
  return true;
}

function validateRegister() {
  var name = document.getElementById("regName").value;
  var email = document.getElementById("regEmail").value;
  var password = document.getElementById("regPassword").value;

  if (name === "" || email === "" || password === "") {
    alert("All fields are required");
    return false;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return false;
  }
  return true;
}
