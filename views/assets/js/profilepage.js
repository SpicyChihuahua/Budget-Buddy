async function loadProfileData() {

    var data = null;
    var username = "";
    var id ="";

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
                    username = dat.username;
                    id = dat.id
                }
            })
    }
    catch {
        alert("Profile Fetch Error!");
    }

    var profilePageNameText = document.getElementById('profilePageNameText');
    var profilePageIDText = document.getElementById('profilePageIDText');
    var profilePicture = document.getElementById('profilePicture');
    
    if (username !== "") profilePageNameText.innerHTML = username;
    if (id !== "") profilePageIDText.innerHTML = "ID: " + id;
    profilePicture.style.backgroundImage = "url(" + fetchURL.split('/')[0] + "/getprofilepicture)";
}