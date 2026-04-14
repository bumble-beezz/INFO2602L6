function toastFallback(message) {
  if (typeof M !== 'undefined' && M.toast) {
    M.toast({html: message});
  } else {
    alert(message);
  }
}

const serverFallback = "http://localhost:8000";

async function login(event) {
  event.preventDefault();

  const form = event.target;
  let fields = form.elements;

  const username = fields['username'].value;
  const password = fields['password'].value;
  const apiServer = (typeof server !== 'undefined') ? server : serverFallback;
  const toastFunc = (typeof toast !== 'undefined') ? toast : toastFallback;

  form.reset();

  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${apiServer}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const result = await response.json();
    console.log("Login response:", result);

    if (response.ok && result.access_token) {
      toastFunc("Login Successful");
      localStorage.setItem('access_token', result.access_token);
      console.log("Token saved:", result.access_token.substring(0, 20) + "...");
      window.location.href = 'app.html';
    } else {
      toastFunc("Login Failed: " + (result.detail || "Unknown error"));
    }
  } catch (error) {
    console.error("Login error:", error);
    toastFunc("Login Failed: " + error.message);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', login);
    console.log("Login form listener attached");
  } else {
    console.error("Login form not found!");
  }
});