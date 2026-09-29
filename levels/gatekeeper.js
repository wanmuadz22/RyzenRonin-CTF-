// ===============================================================
//  Dojo Gatekeeper v0.1
//  TODO(sensei): move this login check to a real server someday...
// ===============================================================

const SENSEI_USER = "sensei";

// Stored "encrypted" so nobody can read the password. Totally secure. ;)
const SENSEI_PASS = "YnVzaGlkb18wbmx5";

// The sealed scroll. It can only be unrolled with the correct password.
const SEALED_SCROLL = [48, 12, 9, 13, 7, 54, 0, 49, 89, 0, 23, 23, 81, 3, 64, 26, 54, 16, 29, 42,
  67, 26, 51, 26, 14, 68, 64, 6, 29, 59, 28, 110, 84, 93, 51, 77, 23, 1, 27, 21];

function unrollScroll(key) {
  return SEALED_SCROLL.map((b, i) => String.fromCharCode(b ^ key.charCodeAt(i % key.length))).join("");
}

function checkLogin(event) {
  event.preventDefault();
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value;
  const out = document.getElementById("result");

  if (user === SENSEI_USER && btoa(pass) === SENSEI_PASS) {
    out.className = "flagbox";
    out.textContent = "Welcome back, Sensei. Scroll #4: " + unrollScroll(pass);
  } else {
    out.className = "denied";
    out.textContent = "ACCESS DENIED. The gatekeeper does not recognize you.";
  }
  out.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login").addEventListener("submit", checkLogin);
});
