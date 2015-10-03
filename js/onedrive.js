var onedrive_token

initializeOneDrive()



function initializeOneDrive() {
  if(window.location.hash.substr(1).split('=')[1] && window.location.hash.substr(1).indexOf('dropboxLogin') == -1) {
    onedrive_token = window.location.hash.substr(1).split('=')[1].split('&')[0]
    history.pushState("", document.title, window.location.pathname + window.location.search);
    document.getElementById('onedriveButton').innerHTML += " ✓";
  }

  if(onedrive_token) {
    window.localStorage.setItem("onedrive_token", onedrive_token);
  } else {
    onedrive_token = window.localStorage.getItem("onedrive_token");
  }
  console.log("[DEBUG] OneDrive Token: " + onedrive_token)
}


