async function loadUserDataMain() {
    var data = null;
    var username = "";

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
                    username = dat.username
                }
            })
    }
    catch {
        alert("Profile Fetch Error!");
    }

    var profileTextPara = document.getElementById('profileText');
    // alert(username);
    
    if (username !== "") {
        profileTextPara.innerHTML = "Welcome " + username + "!";
    }
}