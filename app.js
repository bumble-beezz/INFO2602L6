if (typeof server === 'undefined') {
  var server = "http://localhost:8000";
  console.log("Server fallback set to:", server);
}

if (typeof toast === 'undefined') {
  function toast(message) {
    if (window.M && M.toast) {
      M.toast({html: message});
    } else {
      alert(message);
    }
  }
  console.log("Toast fallback set");
}

document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelector('.tabs');
  if (tabs) {
    M.Tabs.init(tabs);
  }
});

async function displayTodos(data) {
  let result = document.querySelector('#result');
  result.innerHTML = '';
  let html = '';

  if (data.error || data.detail || !Array.isArray(data)) {
    html += `
      <li class="card collection-item col s12 m4">
        <div class="card-content">
          <span class="card-title red-text">
            Error: ${data.detail || data.error || 'Not Logged In'}
          </span>
        </div>
      </li>
    `;
  } else if (data.length === 0) {
    html += `
      <li class="card collection-item col s12 m4">
        <div class="card-content">
          <span class="card-title">No Todos Yet</span>
          <p>Create your first todo above!</p>
        </div>
      </li>
    `;
  } else {
    for (let todo of data) {
      html += `
        <li class="card collection-item col s12 m4">
          <div class="card-content">
            <span class="card-title">${escapeHtml(todo.text)}
              <label class="right">
                <input type="checkbox" data-id="${todo.id}" onclick="toggleDone(event)" ${todo.done ? 'checked' : ''} />
                <span>Done</span>
              </label>
            </span>
          </div>
          <div class="card-action">
            <a href="#" onclick="deleteTodo('${todo.id}')">DELETE</a>
          </div>
        </li>
      `;
    }
  }
  
  result.innerHTML = html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function loadView() {
  let todos = await sendRequest(`${server}/todos`, 'GET');

  if (todos.detail || todos.error) {
    todos = await sendRequest(`${server}/todo`, 'GET');
  }
  
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

  let result = await sendRequest(`${server}/todos`, 'POST', data);
  if (result.detail || result.error) {
    result = await sendRequest(`${server}/todo`, 'POST', data);
  }

  if (result.detail || result.error) {
    toast('Error: ' + (result.detail || result.error || 'Not Logged In'));
  } else if (result.id) {
    toast('Todo Created!');
    loadView();
  } else {
    toast('Todo Created!');
    loadView();
  }
}

async function toggleDone(event) {
  let checkbox = event.target;
  let id = checkbox.dataset['id'];
  let done = checkbox.checked;
  
  let result = await sendRequest(`${server}/todo/${id}`, 'PUT', { done: done });

  if (result.detail || result.error) {
    toast('Error: ' + (result.detail || result.error));
  } else {
    toast(done ? 'Marked as done!' : 'Marked as not done!');
    loadView();
  }
}

async function deleteTodo(id) {
  let result = await sendRequest(`${server}/todo/${id}`, 'DELETE');
  
  if (result.detail || result.error) {
    toast('Error: ' + (result.detail || result.error));
  } else {
    toast('Deleted!');
    loadView();
  }
}

function logout() {
  window.localStorage.removeItem('access_token');
  window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.forms['addForm'];
  if (form) {
    form.addEventListener('submit', createTodo);
  }
  
  loadView();
});