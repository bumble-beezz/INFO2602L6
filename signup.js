async function signup(event){
  event.preventDefault();

  let form = event.target;
  let fields = form.elements;
  
  let data = {
    username: fields['username'].value.trim(),
    email: fields['email'].value.trim(),
    password: fields['password'].value
  };

  if (!data.username || !data.email || !data.password) {
    toast("Please fill all fields");
    return;
  }
  
  if (data.password.length < 8) {
    toast("Password must be at least 8 characters long");
    return;
  }

  if (!data.email.includes('@')) {
    toast("Please enter a valid email address");
    return;
  }

  form.reset();

  let result = await sendRequest(`${server}/signup`, 'POST', data);
  
  console.log("Signup response:", result); 

  if (result.detail) {
    toast("Register Failed: " + result.detail);
  } 
  else if (result.id || result.username) {
    toast("Register Successful!!");
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  } 
  else {
    toast("Register Failed: Unknown error");
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signUpForm') || document.forms['signUpForm'];
  if (form) {
    form.addEventListener('submit', signup);
  }
});