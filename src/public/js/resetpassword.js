const form = document.getElementById('resetPassword');
form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    console.log('congrats')

    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/submitpassword',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>result.json()).then(json=>{
        console.log(json);
        // to redirect customer to main page
        if(json.status == 200 || json.status == 'success'){
            window.location = "/";
        };
    });
})