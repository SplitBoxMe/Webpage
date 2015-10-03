var onedrive_token

function initializeOneDrive() {
  if(window.location.hash.substr(1).split('=')[1] && window.location.hash.substr(1).indexOf('dropboxLogin') == -1) {
    onedrive_token = decodeURIComponent(window.location.hash.substr(1).split('=')[1].split('&')[0])
    history.pushState("", document.title, window.location.pathname + window.location.search);
    cloudStorageConnected("onedrive")
  }

  if(onedrive_token) {
    window.localStorage.setItem("onedrive_token", onedrive_token);
  } else {
    onedrive_token = window.localStorage.getItem("onedrive_token");
  }
  console.log("[DEBUG] OneDrive Token: " + onedrive_token)
}


