function loadUserDataMain() {
    data = null;

    try {
        var fetchStr = window.location.hostname + ":" + window.location.port + "/getuserdata";
        alert(fetchStr);
        fetch(fetchStr)
            .then(res => res.json())
            .then((dat) => {
                data=dat;
              })
    }
    catch {
    }

    profileTextPara = document.getElementById('profileText');
    alert(data)
    
    if (data != null && data !== "") {
        profileTextPara.innerHTML = "Welcome " + data + "!";
    }
}