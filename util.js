const server = "http://localhost:8000";

function toast(message){
  M.toast({html: message});
}

async function sendRequest(url, method, data){
  try{
    let token = window.localStorage.getItem('access_token');

    let headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let options = {
        method: method,
        headers: headers,
    };

    if(data){
      options.body = JSON.stringify(data);
    }

    let response = await fetch(url, options);
    let result;
    try {
      result = await response.json();
    } catch(e) {
      return { status: response.status, ok: response.ok };
    }
    
    return result;

  }catch(error){
    console.error("Fetch error:", error);
    return { detail: error.message };
  }
}