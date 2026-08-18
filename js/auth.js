function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}
document.addEventListener("DOMContentLoaded", () => {
  const r = document.getElementById("registerForm"),
    l = document.getElementById("loginForm");
  if (r) r.addEventListener("submit", registerUser);
  if (l) l.addEventListener("submit", loginUser);
});
function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById("registerName").value,
    email = document.getElementById("registerEmail").value,
    password = document.getElementById("registerPassword").value,
    confirm = document.getElementById("confirmPassword").value;
  if (password !== confirm) return alert("Passwords do not match.");
  let u = getUsers();
  if (u.some((x) => x.email === email)) return alert("Email already exists.");
  u.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(u));
  alert("Account created successfully!");
  location.href = "login.html";
}
function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value,
    password = document.getElementById("loginPassword").value,
    u = getUsers().find((x) => x.email === email && x.password === password);
  if (!u) return alert("Invalid email or password.");
  localStorage.setItem("currentUser", JSON.stringify(u));
  alert(`Welcome ${u.name}!`);
  location.href = "index.html";
}
function logout() {
  localStorage.removeItem("currentUser");
  location.href = "login.html";
}
function loadProfile() {
  const u = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!u) {
    location.href = "login.html";
    return;
  }
  document.getElementById("profileName").textContent = u.name;
  document.getElementById("profileEmail").textContent = u.email;
}
