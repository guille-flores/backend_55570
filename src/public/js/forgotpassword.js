const formpasswrd = document.getElementById('forgotPassword');
formpasswrd.addEventListener('submit', e => {
    e.preventDefault();
    const datapswd = new FormData(formpasswrd);
    const obj = {};
    datapswd.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/forgotPassword',{
        method:'GET', 
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