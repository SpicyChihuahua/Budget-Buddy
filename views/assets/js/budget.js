const { response } = require("express");

function loadUserData() {
    var unamefield = document.getElementById('userText');
    var uname = "User";
    try {
        uname = document.getElementById('data').innerText;
    }
    catch {
        alert("Error Render User Data!");
    }
    unamefield.innerHTML = "Hello " + uname + "!";
}

function init() {
    loadUserData();
}