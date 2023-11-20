const form = document.getElementById('registrationForm');
form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/register',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>result.json()).then(result=>result.json()).then(json=>{
        console.log(json);
        // to redirect customer to main page
        if(json.status == 200){
            window.location = "/";
        };
    });
})