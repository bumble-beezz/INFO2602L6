async function login(event) {
  event.preventDefault();

  const form = event.target;
  let fields = form.elements;
  let formData = new URLSearchParams();
  formData.append('username', fields['username'].value);
  formData.append('password', fields['password'].value);

  form.reset();

  try {
    let response = await fetch(`${server}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });
    
    let result = await response.json();
    
    if (response.ok) {
      toast("Login Successful");
      window.localStorage.setItem('access_token', result.access_token);
      window.location.href = 'app.html';
    } else {
      toast("Login Failed: " + (result.detail || "Unknown error"));
    }
  } catch(error) {
    toast("Login Failed: " + error.message);
  }
}

document.forms['loginForm'].addEventListener('submit', login);