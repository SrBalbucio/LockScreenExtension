var days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Março', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
var now = new Date();

function setTime() {
    document.getElementById("currentTime").innerHTML = new Date().toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    document.getElementById("current").innerHTML = months[now.getMonth()]+", dia "+now.getDate();

}
setInterval(setTime, 999);