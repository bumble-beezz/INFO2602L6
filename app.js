async function loadView() {
  let todos = await sendRequest(`${server}/todos`, 'GET');  // Changed from /todo
  displayTodos(todos);
}

async function createTodo(event) {
  event.preventDefault();
  let form = event.target.elements;

  let data = {
    text: form['addText'].value,
    done: false,
  }

  event.target.reset();

  let result = await sendRequest(`${server}/todos`, 'POST', data);  // Changed from /todo

  if ('error' in result) {
    toast('Error: Not Logged In');
  } else {
    toast('Todo Created!');
  }

  loadView();
}

async function toggleDone(event) {
  let checkbox = event.target;
  let id = checkbox.dataset['id'];
  let done = checkbox.checked;
  let result = await sendRequest(`${server}/todo/${id}`, 'PUT', { done: done });
  
  let message = done ? 'Marked as done!' : 'Marked as not done!';
  toast(message);
}

async function deleteTodo(id) {
  let result = await sendRequest(`${server}/todo/${id}`, 'DELETE');
  toast('Deleted!');
  loadView();
}

function logout() {
  window.localStorage.removeItem('access_token');
  window.location.href = "index.html";
}