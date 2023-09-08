
chrome.storage.sync.get(["username"]).then((result) => {
    if(result.username !== undefined){
        document.getElementById("lockscreen-name").innerText = result.username;
    }
});
function lockscreen_button_click() {
    var lockscreen = document.getElementById('Lockscreen');
    lockscreen.classList.add('lockscreen-active');
    lockscreen.classList.remove('lockscreen-deactive');
}
document.getElementById("Lockscreen").addEventListener('click', (event) => active());

document.getElementById("lockscreen-form").addEventListener('submit', (event) => lockscreen_form_submit(event));

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.keyCode === 13) {
        active()
    }
});


function active(){
    document.body.style.position = "fixed";
    var lockscreen = document.getElementById('Lockscreen-Login');
    lockscreen.classList.add('active_lockscreen');

    var lockscreen = document.getElementById('lockscreen-time');
    lockscreen.classList.add('active_lockscreen');

    var lockscreen = document.getElementById('lockscreen-login-form');
    lockscreen.classList.add('active_lockscreen');

    var lockscreen = document.getElementById('lockscreen-toolip');
    lockscreen.classList.add('active_lockscreen');

    document.getElementById('lockscreen-password').focus();
}

function lockscreen_form_submit(event) {
    event.preventDefault()
    chrome.storage.sync.get(["password"]).then((password) => {
        if(password.password !== undefined){
            var time = 3000;
            var lockscreen_password_value = document.getElementById('lockscreen-password').value;
            if (lockscreen_password_value === password.password) {
                window.location.href = window.location.href.replace("lockscreen.html", "unlocked") + "?pass="+lockscreen_password_value;
                var lockscreen = document.getElementById('Lockscreen');
                lockscreen.classList.remove('lockscreen-active');
                lockscreen.classList.add('lockscreen-deactive');
                flag_on_key = false;
                document.body.style.position = "relative";
            }
            else {
                var lockscreen = document.getElementById('lockscreen-password');
                lockscreen.classList.add('lockscreen-login-form-incorrect');
                setInterval(() => {
                    lockscreen.classList.remove('lockscreen-login-form-incorrect')
                }, time)
            }
        }
    });
}