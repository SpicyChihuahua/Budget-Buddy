const { response } = require("express");

async function loadUserData() {

    var unamefield = document.getElementById('userText');
    var uname = "User";

    var fetchURL = "";

    if (window.location.hostname === "localhost") {
        fetchURL = "http://"
    }
    else fetchURL = "https://"

    fetchURL += window.location.hostname + ":" + window.location.port + "/getuserdata";

    try {
        // alert(fetchURL);
        await fetch(fetchURL)
            .then(res => res.json())
            .then(dat => {
                if(dat != null) {
                    uname = dat.username
                }
            })
    }
    catch {
        alert("Profile Fetch Error!");
    }

    unamefield.innerHTML = `Hello ${uname}!`;

}

function init() {
    loadUserData();
}