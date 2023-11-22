
function logoutFunction(){
    const email = document.getElementById('loggedemail').innerHTML;
    const obj = {email: email};
    fetch('/api/sessions/logout', {
        method: 'DELETE',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result=>{
        window.location = "/login";
    });
}