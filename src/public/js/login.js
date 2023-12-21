const form = document.getElementById('loginForm');
form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result=>result.json()).then(json=>{
        console.log(json);
        console.log('logged in successfully')
        // to redirect customer to main page
        if(json.status == 200 || json.status == 'success'){
            window.location = "/";
        };
    });
})