let psstime = document.getElementById("psstime");
let min = document.getElementById("minutes");
let current = document.getElementById("currentpass");
let newpass = document.getElementById("newpass");
let senhatext = document.getElementById("senhatext");
let mintext = document.getElementById("mintext");
let username = document.getElementById("username");
let usernametext = document.getElementById("usernametext");
let bloquear = document.getElementById("bloquearSite");
let bloqueartext = document.getElementById("bloqueartext");

chrome.storage.sync.get(["bloquearSite"]).then((result) => {
    if (result.bloquearSite !== undefined && result.bloquearSite === true) {
        bloquear.checked = true;
    }
})

function setTime(){
    chrome.storage.sync.get(["password"]).then((result) => {
        if(result.password !== undefined && min.value > 0){
            if(result.password === psstime.value){
                chrome.storage.sync.set({ "min": min.value });
                mintext.innerText = "Tempo alterado, entrara em vigor apartir do proximo bloqueio!"
            } else{
                mintext.innerText = "Senha incorreta!"
            }
        } else{
            mintext.innerText = "Senha incorreta ou valor menor que 1!"
        }
        psstime.value = ""
    });
}

document.getElementById("timebutton").addEventListener("click", setTime)

function setPassword() {
    chrome.storage.sync.get(["password"]).then((result) => {
        if (result.password !== undefined) {
            if (result.password === current.value) {
                chrome.storage.sync.set({"password": newpass.value});
                senhatext.innerText = "Senha alterada!"
            } else{
                senhatext.innerText = "Senha incorreta, nao alterado!"
            }
        } else {
            chrome.storage.sync.set({"password": newpass.value});
            senhatext.innerText = "Senha alterada!"
        }
        current.value = "";
        newpass.value = "";
    });
}

document.getElementById("changepassword").addEventListener("click", setPassword);

function setUsername() {
    chrome.storage.sync.set({"username": username.value});
    usernametext.innerText = "Username alterado!"
}

document.getElementById("changeusername").addEventListener("click", setUsername);

function setGeral() {
    chrome.storage.sync.set({"bloquearSite": bloquear.checked});
    bloqueartext.innerText = "Tudo alterado!"
}

document.getElementById("bloquearSite").addEventListener("click", setGeral);