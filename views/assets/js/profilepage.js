async function loadProfileData() {

    var data = null;
    var username = "";
    var id ="";
    var bios = ""

    var fetchURL = "";
    var profilebiosfetchurl = "";

    if (window.location.hostname === "localhost") {
        fetchURL = "http://";
        profilebiosfetchurl = "http://";
    }
    else {
        fetchURL = "https://";
        profilebiosfetchurl = "https://";
    }

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

    profilebiosfetchurl += window.location.hostname + ":" + window.location.port + "/getprofilebios";
    alert(profilebiosfetchurl)
    try {
        await fetch(profilebiosfetchurl)
            .then(res => res.json())
            .then(dat => {
                if(dat != null) {
                    bios = dat.biostxt;
                }
            })
    }
    catch {
        alert("Profile Bios Fetch Error!");
    }


    var profilePageNameText = document.getElementById('profilePageNameText');
    var profilePageIDText = document.getElementById('profilePageIDText');
    var profilePicture = document.getElementById('profilePicture');
    var profileBIOSText = document.getElementById('profileBIOSText');
    
    if (username !== "") profilePageNameText.innerHTML = username;
    if (id !== "") profilePageIDText.innerHTML = "ID: " + id;
    profileBIOSText.innerText = bios;
    profilePicture.style.backgroundImage = "url(" + fetchURL.split('/')[0] + "/getprofilepicture)";
}